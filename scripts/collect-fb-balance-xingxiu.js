"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const net = require("net");
const { spawn, execFileSync } = require("child_process");
const { buildBalanceMatrix } = require("./fb-balance-matrix");
const {
    parseJsonLines,
    summarizeBalanceResults,
    validateBalanceResults
} = require("./fb-balance-results");

const root = path.resolve(__dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wsmud2-fb-balance-xingxiu-"));
const outputFile = path.resolve(readOption("--output") || path.join(root, "reports", "fb-balance-actual.jsonl"));
const tier = readOption("--tier") || "under";
const archetype = readOption("--archetype") || "output";
const requestedRuns = Number(readOption("--runs") || 20);
const sessionKey = "balance-testkey1";
const md5Prefix = "balance-test-md5";
const desIv = "1234123412341234";
const accountPassword = crypto.randomBytes(24).toString("hex");
const accountName = "balancevalidator";
const roleId = "balancefb01";
const matrix = buildBalanceMatrix();
const plannedCase = matrix.caseMap.get(["xingxiu", "normal", "default", tier, archetype].join("/"));
const sourceFingerprint = fingerprintSource();
const archetypeDefinitions = {
    output: {
        id: "xingxiu-output-default-unarmed-v1",
        equipment: [],
        consumablePolicy: "none",
        expectedStats: { maxHp: 100100, fy: 4, diffShPer: 0 }
    },
    defense: {
        id: "xingxiu-defense-two-piece-v1",
        equipment: ["eq/fb/taohuadao/ruanweijia", "eq/lv3/panshi_hufu"],
        consumablePolicy: "none",
        expectedStats: { maxHp: 102100, fy: 504, diffShPer: 11 }
    },
    sustain: {
        id: "xingxiu-sustain-yulu-v1",
        equipment: [],
        consumablePolicy: "drug/yulu-after-shihouzi",
        expectedStats: { maxHp: 100100, fy: 4, diffShPer: 0 }
    }
};
const archetypeDefinition = archetypeDefinitions[archetype];
const loadoutDefinition = {
    id: archetypeDefinition && archetypeDefinition.id,
    archetype,
    attackIntervalMs: 1000,
    baseStats: { str: 20, con: 20, dex: 20, int: 20, maxMp: 1000000 },
    skills: "engine-default-unarmed",
    equipment: archetypeDefinition && archetypeDefinition.equipment,
    consumablePolicy: archetypeDefinition && archetypeDefinition.consumablePolicy,
    sampleIsolation: archetype === "sustain" ? "reset-consumable-cooldown-between-runs" : "full-health-between-runs",
    expectedStats: archetypeDefinition && archetypeDefinition.expectedStats,
    targetStats: plannedCase && plannedCase.stats
};
const loadoutFingerprint = sha256(JSON.stringify(loadoutDefinition));

let port = 0;
let accountId = 0;
let child = null;
let childOutput = "";

function readOption(name) {
    const index = process.argv.indexOf(name);
    return index >= 0 ? process.argv[index + 1] : null;
}

function sha256(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

function listFiles(target, files) {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
        for (const name of fs.readdirSync(target).sort()) listFiles(path.join(target, name), files);
    } else {
        files.push(target);
    }
}

function fingerprintSource() {
    const targets = [
        "main.js",
        "config.js",
        "env.js",
        "package.json",
        "package-lock.json",
        "data/db.js",
        "data/sql.js",
        "os",
        "world"
    ];
    const files = [];
    for (const target of targets) listFiles(path.join(root, target), files);
    const hash = crypto.createHash("sha256");
    for (const file of files.sort()) {
        hash.update(path.relative(root, file));
        hash.update("\0");
        hash.update(fs.readFileSync(file));
        hash.update("\0");
    }
    return hash.digest("hex");
}

function validateArguments() {
    if (matrix.errors.length) throw new Error(matrix.errors.join("\n"));
    if (!archetypeDefinition) throw new Error("--archetype 必须是 output、defense 或 sustain");
    if (!plannedCase) throw new Error("不存在星宿海普通/" + tier + "/" + archetype + " 样本格");
    if (!Number.isSafeInteger(requestedRuns) || requestedRuns < 1 || requestedRuns > plannedCase.plannedRuns) {
        throw new Error("--runs 必须是 1-" + plannedCase.plannedRuns + " 的整数");
    }
}

function existingResults() {
    if (!fs.existsSync(outputFile)) return [];
    const parsed = parseJsonLines(fs.readFileSync(outputFile, "utf8"), outputFile);
    if (parsed.errors.length) throw new Error(parsed.errors.join("\n"));
    const validation = validateBalanceResults(parsed.records, matrix);
    if (validation.errors.length) throw new Error(validation.errors.join("\n"));
    return validation.accepted.map(entry => entry.value);
}

function selectRunIndexes(records) {
    const used = new Set(records
        .filter(record => record.cell && [
            record.cell.area,
            record.cell.mode,
            record.cell.route,
            record.cell.tier,
            record.cell.archetype
        ].join("/") === plannedCase.key)
        .map(record => record.runIndex));
    return Array.from({ length: plannedCase.plannedRuns }, (_, index) => index + 1)
        .filter(runIndex => !used.has(runIndex))
        .slice(0, requestedRuns);
}

function copySourceTree() {
    fs.cpSync(root, tempRoot, {
        recursive: true,
        filter(source) {
            for (const name of [".git", "node_modules", "data", "reports", "logs", "backups"]) {
                const target = path.join(root, name);
                if (source === target || source.startsWith(target + path.sep)) return false;
            }
            return source !== path.join(root, ".env");
        }
    });
    fs.mkdirSync(path.join(tempRoot, "data", "def"), { recursive: true });
    fs.copyFileSync(path.join(root, "data", "def", "data.js"), path.join(tempRoot, "data", "def", "data.js"));
    for (const name of ["db.js", "sql.js"]) {
        fs.copyFileSync(path.join(root, "data", name), path.join(tempRoot, "data", name));
    }
    fs.symlinkSync(path.join(root, "node_modules"), path.join(tempRoot, "node_modules"), "dir");
}

function roleData() {
    return [
        "{prop:[20,20,20,20,1,1000000,0,0,0,20,20,1000000,1000000,100,0,0,100,0,0,0]",
        ',quit_room:"yz/wumiao",items:[],stores:[],books:[],skills:{},',
        'temp:{fb:38,fb_record_index_v2:1,fb_unlock_order_v3:1,ad_jl:10000},settings:{auto_get:0},eq:[],titles:[],',
        'eq_groups:[],sk_groups:[],auto_pfm_groups:[]}'
    ].join("");
}

function testEnv() {
    return {
        ...process.env,
        WEB_PORT: String(port + 1),
        WS_PORT: String(port),
        MD5_PREFIX: md5Prefix,
        SESSION_SECRET: "balance-test-session",
        DESIV: desIv,
        ADMIN_SOCKET_PATH: path.join(tempRoot, "data", "admin.sock")
    };
}

function prepareDatabase() {
    const script = [
        "require('./env').config();",
        "global.__CONFIG=require('./config');",
        "(async()=>{",
        "await __CONFIG.DB.connect('database.db');",
        "const crypto=require('crypto');",
        "const password=crypto.createHash('md5').update(process.env.BALANCE_RAW_PASSWORD+process.env.MD5_PREFIX).digest('hex').toUpperCase();",
        "const account={name:'" + accountName + "',pwd:password,phone:null};",
        "await __CONFIG.DB.createUser(account);",
        "await require('./data/db').query('update users set level=? where id=?',[6,account.id]);",
        "const role={userid:account.id,id:'" + roleId + "',name:'星宿海平衡样本',title:'武神',level:6,server:100,data:"
            + JSON.stringify(roleData()) + "};",
        "console.log('BALANCE_ACCOUNT_ID:'+account.id);",
        "await __CONFIG.DB.addRole(role);",
        "await __CONFIG.DB.close();",
        "})().catch(error=>{console.error(error.stack);process.exit(1);});"
    ].join("");
    const output = execFileSync(process.execPath, ["-e", script], {
        cwd: tempRoot,
        env: { ...testEnv(), BALANCE_RAW_PASSWORD: accountPassword },
        stdio: "pipe"
    }).toString();
    const match = output.match(/BALANCE_ACCOUNT_ID:(\d+)/);
    accountId = match ? Number(match[1]) : 0;
    if (!(accountId > 0)) throw new Error("隔离平衡账号创建失败\n" + output);
}

function awaitFreePort() {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => {
            const assigned = server.address().port;
            server.close(error => error ? reject(error) : resolve(assigned));
        });
    });
}

function startServer() {
    childOutput = "";
    child = spawn(process.execPath, [path.join(tempRoot, "main.js"), "100"], {
        cwd: tempRoot,
        env: testEnv(),
        stdio: ["ignore", "pipe", "pipe"]
    });
    child.stdout.on("data", chunk => { childOutput += chunk.toString(); });
    child.stderr.on("data", chunk => { childOutput += chunk.toString(); });
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => finish(new Error("隔离游戏服务启动超时\n" + childOutput)), 30000);
        const interval = setInterval(() => {
            if (childOutput.includes("服务") && childOutput.includes("ws://")) finish();
        }, 50);
        const onExit = code => finish(new Error("隔离游戏服务异常退出: " + code + "\n" + childOutput));
        child.once("exit", onExit);
        function finish(error) {
            clearTimeout(timeout);
            clearInterval(interval);
            child.removeListener("exit", onExit);
            if (error) reject(error);
            else resolve();
        }
    });
}

async function stopServer() {
    if (!child || child.killed) return;
    child.kill("SIGINT");
    await new Promise(resolve => {
        const timer = setTimeout(() => {
            child.kill("SIGKILL");
            resolve();
        }, 3000);
        child.once("close", () => {
            clearTimeout(timer);
            resolve();
        });
    });
    child = null;
}

function passwordHash() {
    return crypto.createHash("md5").update(accountPassword + md5Prefix).digest("hex").toUpperCase();
}

function makeCertificate() {
    const plain = [accountId, accountName, passwordHash(), Date.now(), 6].join("%");
    const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(sessionKey), Buffer.from(desIv));
    return cipher.update(plain, "utf8", "base64") + cipher.final("base64");
}

class OnlineSocket {
    constructor() {
        this.messages = [];
        this.waiters = [];
    }

    async connect() {
        this.ws = new WebSocket("ws://127.0.0.1:" + port);
        this.ws.addEventListener("message", event => {
            const value = String(event.data);
            this.messages.push(value);
            for (const waiter of this.waiters.slice()) {
                if (this.messages.length - 1 >= waiter.minIndex && waiter.predicate(value)) {
                    this.waiters.splice(this.waiters.indexOf(waiter), 1);
                    clearTimeout(waiter.timer);
                    waiter.resolve(value);
                }
            }
        });
        await new Promise((resolve, reject) => {
            this.ws.addEventListener("open", resolve, { once: true });
            this.ws.addEventListener("error", reject, { once: true });
        });
    }

    send(text) {
        this.ws.send(text);
    }

    waitFor(predicate, timeout = 10000, minIndex = 0) {
        const existing = this.messages.slice(minIndex).find(predicate);
        if (existing) return Promise.resolve(existing);
        return new Promise((resolve, reject) => {
            const waiter = {
                predicate,
                minIndex,
                resolve,
                timer: setTimeout(() => {
                    this.waiters.splice(this.waiters.indexOf(waiter), 1);
                    reject(new Error("等待在线消息超时\n" + this.messages.slice(-16).join("\n")));
                }, timeout)
            };
            this.waiters.push(waiter);
        });
    }

    close() {
        return new Promise(resolve => {
            if (!this.ws || this.ws.readyState >= 2) return resolve();
            this.ws.addEventListener("close", resolve, { once: true });
            this.ws.close();
        });
    }
}

async function login(socket) {
    await socket.connect();
    socket.send(sessionKey + " " + makeCertificate());
    await socket.waitFor(value => value.includes("roles"));
    socket.send("login " + roleId);
    await socket.waitFor(value => value.includes('type:"login"'));
    await socket.waitFor(value => value.includes('"path":"yz/wumiao"'));
}

async function waitPath(socket, roomPath, marker) {
    return socket.waitFor(value => value.includes('"path":"' + roomPath + '"'), 15000, marker);
}

function extractNpcId(message, name) {
    const matches = message.matchAll(/id:"([^"]+)",name:"([^"]*)"/g);
    for (const match of matches) {
        if (match[2].includes(name)) return match[1];
    }
    return null;
}

async function findNpc(socket, name, marker) {
    for (let index = socket.messages.length - 1; index >= marker; index--) {
        if (socket.messages[index].includes('"type":"items"') && socket.messages[index].includes(name)) {
            const id = extractNpcId(socket.messages[index], name);
            if (id) return id;
        }
    }
    const message = await socket.waitFor(value => value.includes('"type":"items"') && value.includes(name), 10000, marker);
    const id = extractNpcId(message, name);
    if (!id) throw new Error("未找到 NPC 实例: " + name + "\n" + message);
    return id;
}

async function killNpc(socket, name, roomMarker) {
    const npcId = await findNpc(socket, name, roomMarker);
    const marker = socket.messages.length;
    const startedAt = Date.now();
    socket.send("kill " + npcId);
    const result = await socket.waitFor(value => value.includes('"type":"itemremove"') && value.includes('id:\"' + npcId + '\"')
        || value.includes('type:"die"'), 180000, marker);
    return {
        completed: !result.includes('type:"die"'),
        durationMs: Date.now() - startedAt
    };
}

async function configureLoadout(socket) {
    const marker = socket.messages.length;
    const targetGj = plannedCase.stats.gj;
    const targetMz = plannedCase.stats.mz;
    const setup = [];
    if (archetype === "defense") {
        setup.push(
            "if(!this._fbBalanceLoadoutSetup){",
            "var armor=this.add_obj('eq/fb/taohuadao/ruanweijia',1);",
            "var charm=this.add_obj('eq/lv3/panshi_hufu',1);",
            "if(!armor||!charm||this.equip(armor)===false||this.equip(charm)===false)throw new Error('防守配装失败');",
            "this._fbBalanceLoadoutSetup=1;}"
        );
    } else if (archetype === "sustain") {
        setup.push(
            "if(!this._fbBalanceLoadoutSetup){",
            "if(!this.add_obj('drug/yulu',20))throw new Error('续航药品创建失败');",
            "this._fbBalanceLoadoutSetup=1;}",
            "var yulu=this.find_obj_bypath('drug/yulu');",
            "if(yulu)this.remove_temp('disobj_'+(yulu.distype||yulu.id));"
        );
    } else {
        setup.push("this._fbBalanceLoadoutSetup=1;");
    }
    const command = [
        ...setup,
        "this.prop=this.prop||{};",
        "this.prop.gj=" + (targetGj - 20) + ";",
        "this.prop.mz=" + (targetMz - 10) + ";",
        "this.prop.gjsd=3000;",
        "this.recount();this.full();",
        "this._fbBalanceCounters={attacks:0,misses:0,damageTaken:0,healing:0,minHp:this.hp};",
        "if(!this._fbBalanceOriginalDoAttack){",
        "this._fbBalanceOriginalDoAttack=this.do_attack;",
        "this.do_attack=function(par){",
        "var result=this._fbBalanceOriginalDoAttack.call(this,par);",
        "this._fbBalanceCounters.attacks++;",
        "if(par.is_dodge||par.is_parry)this._fbBalanceCounters.misses++;",
        "return result;};}",
        "if(!this._fbBalanceOriginalAddHp){",
        "this._fbBalanceOriginalAddHp=this.add_hp;",
        "this.add_hp=function(value){",
        "var before=this.hp;var result=this._fbBalanceOriginalAddHp.call(this,value);var delta=this.hp-before;",
        "if(this._fbBalanceCounters){if(delta<0)this._fbBalanceCounters.damageTaken-=delta;",
        "if(delta>0)this._fbBalanceCounters.healing+=delta;",
        "if(this.hp<this._fbBalanceCounters.minHp)this._fbBalanceCounters.minHp=this.hp;}",
        "return result;};}",
        "this.send('FB_BALANCE_LOADOUT:'+JSON.stringify({gj:this.gj,mz:this.mz,maxHp:this.max_hp,maxMp:this.max_mp,fy:this.fy,ds:this.ds,zj:this.zj,gjsd:this.gjsd,diffShPer:this.diff_sh_per}));"
    ].join("");
    socket.send("call " + command);
    const message = await socket.waitFor(value => value.startsWith("FB_BALANCE_LOADOUT:"), 10000, marker);
    await socket.waitFor(value => value === "ok", 10000, marker);
    const stats = JSON.parse(message.slice("FB_BALANCE_LOADOUT:".length));
    for (const [field, expected] of Object.entries(plannedCase.stats)) {
        if (stats[field] !== expected) throw new Error("有效属性 " + field + " 应为 " + expected + "，实际为 " + stats[field]);
    }
    if (stats.gjsd !== loadoutDefinition.attackIntervalMs) {
        throw new Error("有效攻击间隔应为 " + loadoutDefinition.attackIntervalMs + "ms，实际为 " + stats.gjsd);
    }
    for (const [field, expected] of Object.entries(loadoutDefinition.expectedStats)) {
        if (stats[field] !== expected) throw new Error("配装属性 " + field + " 应为 " + expected + "，实际为 " + stats[field]);
    }
    return stats;
}

async function useSustainConsumable(socket) {
    const queryMarker = socket.messages.length;
    socket.send("call this._fbBalanceConsumable=this.find_obj_bypath('drug/yulu');this.send('FB_BALANCE_CONSUMABLE:'+(this._fbBalanceConsumable?this._fbBalanceConsumable.id:''));");
    const idMessage = await socket.waitFor(value => value.startsWith("FB_BALANCE_CONSUMABLE:"), 10000, queryMarker);
    await socket.waitFor(value => value === "ok", 10000, queryMarker);
    const itemId = idMessage.slice("FB_BALANCE_CONSUMABLE:".length);
    if (!itemId) throw new Error("续航配装缺少九花玉露丸");
    const useMarker = socket.messages.length;
    socket.send("use " + itemId);
    await socket.waitFor(value => value.includes("气色恢复如初"), 10000, useMarker);
    await socket.waitFor(value => value.includes('dialog:"pack"') && value.includes('id:"' + itemId + '"')
        && value.includes("remove:1"), 10000, useMarker);
}

async function readCounters(socket) {
    const marker = socket.messages.length;
    socket.send("call this.send('FB_BALANCE_COUNTERS:'+JSON.stringify(this._fbBalanceCounters));");
    const message = await socket.waitFor(value => value.startsWith("FB_BALANCE_COUNTERS:"), 10000, marker);
    await socket.waitFor(value => value === "ok", 10000, marker);
    return JSON.parse(message.slice("FB_BALANCE_COUNTERS:".length));
}

async function finishFailedRun(socket) {
    const marker = socket.messages.length;
    socket.send("relive");
    await waitPath(socket, "yz/wumiao", marker);
}

async function runSample(socket, runIndex) {
    const effectiveStats = await configureLoadout(socket);
    const startedAt = Date.now();
    let marker = socket.messages.length;
    socket.send("cr xingxiu 0 0");
    await waitPath(socket, "fb/xingxiu/entry", marker);
    marker = socket.messages.length;
    socket.send("go north");
    await waitPath(socket, "fb/xingxiu/fork", marker);
    marker = socket.messages.length;
    socket.send("go north");
    await waitPath(socket, "fb/xingxiu/shihouzi", marker);
    let deathPoint = null;
    let failureReason = null;
    let bossDurationMs = null;
    let consumableCount = 0;
    const firstFight = await killNpc(socket, "狮吼子", marker);
    if (!firstFight.completed) {
        deathPoint = "fb/xingxiu/shihouzi";
        failureReason = "death";
    } else {
        if (archetype === "sustain") {
            await useSustainConsumable(socket);
            consumableCount = 1;
        }
        marker = socket.messages.length;
        socket.send("go north");
        await waitPath(socket, "fb/xingxiu/ridong", marker);
        const bossFight = await killNpc(socket, "丁春秋", marker);
        bossDurationMs = bossFight.durationMs;
        if (!bossFight.completed) {
            deathPoint = "fb/xingxiu/ridong";
            failureReason = "death";
        }
    }

    const counters = await readCounters(socket);
    const completed = !failureReason;
    if (completed) {
        marker = socket.messages.length;
        socket.send("cr");
        await socket.waitFor(value => value.includes("完成度：") && value.includes("100%"), 10000, marker);
    }
    const endedAt = Date.now();
    if (completed) {
        marker = socket.messages.length;
        socket.send("cr over");
        await waitPath(socket, "yz/wumiao", marker);
    } else {
        await finishFailedRun(socket);
    }

    return {
        schemaVersion: 1,
        sampleId: "xingxiu-normal-default-" + tier + "-" + archetype + "-" + runIndex + "-" + sourceFingerprint.slice(0, 12),
        cell: {
            area: "xingxiu",
            mode: "normal",
            route: "default",
            tier,
            archetype
        },
        runIndex,
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date(endedAt).toISOString(),
        provenance: {
            kind: "actual",
            transport: "websocket",
            environment: "isolated",
            clock: "wall",
            timerScale: 1,
            isCombatLogicModified: false,
            instrumentation: "instance-counter-v2",
            sampleReset: loadoutDefinition.sampleIsolation,
            sourceFingerprint
        },
        loadout: {
            id: loadoutDefinition.id,
            fingerprint: loadoutFingerprint,
            requirementsSatisfied: true,
            requirements: { ...plannedCase.requirements },
            stats: {
                ...plannedCase.stats,
                maxHp: effectiveStats.maxHp,
                maxMp: effectiveStats.maxMp,
                fy: effectiveStats.fy,
                ds: effectiveStats.ds,
                zj: effectiveStats.zj,
                gjsd: effectiveStats.gjsd,
                diffShPer: effectiveStats.diffShPer
            }
        },
        metrics: {
            completed,
            bossDurationMs,
            routeDurationMs: endedAt - startedAt,
            deathPoint,
            consumables: consumableCount ? { "drug/yulu": consumableCount } : {},
            revives: completed ? 0 : 1,
            attacks: counters.attacks,
            misses: counters.misses,
            missRate: counters.attacks ? counters.misses / counters.attacks : 0,
            damageTaken: counters.damageTaken,
            healing: counters.healing,
            minHp: counters.minHp,
            failureReason
        }
    };
}

function writeResults(records) {
    const validation = validateBalanceResults(records, matrix);
    if (validation.errors.length) throw new Error(validation.errors.join("\n"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    const tempFile = outputFile + ".tmp-" + process.pid;
    fs.writeFileSync(tempFile, records.map(record => JSON.stringify(record)).join("\n") + "\n");
    fs.renameSync(tempFile, outputFile);
    return summarizeBalanceResults(validation);
}

async function run() {
    validateArguments();
    const records = existingResults();
    const runIndexes = selectRunIndexes(records);
    if (!runIndexes.length) {
        const summary = summarizeBalanceResults(validateBalanceResults(records, matrix));
        console.log("FB_BALANCE_XINGXIU_JSON:" + JSON.stringify({
            outputFile,
            tier,
            archetype,
            addedRuns: 0,
            completedRuns: summary.completedRuns,
            pendingActualRuns: summary.pendingActualRuns
        }));
        return;
    }

    port = await awaitFreePort();
    copySourceTree();
    prepareDatabase();
    await startServer();
    const socket = new OnlineSocket();
    await login(socket);
    const added = [];
    for (const runIndex of runIndexes) {
        const record = await runSample(socket, runIndex);
        added.push(record);
        console.log("FB_BALANCE_XINGXIU_PROGRESS:" + JSON.stringify({
            tier,
            archetype,
            runIndex,
            completed: record.metrics.completed,
            routeDurationMs: record.metrics.routeDurationMs,
            bossDurationMs: record.metrics.bossDurationMs,
            missRate: record.metrics.missRate,
            damageTaken: record.metrics.damageTaken,
            healing: record.metrics.healing,
            minHp: record.metrics.minHp
        }));
    }
    await socket.close();
    const summary = writeResults(records.concat(added));
    const cell = summary.cellResults.find(item => item.key === plannedCase.key);
    console.log("FB_BALANCE_XINGXIU_JSON:" + JSON.stringify({
        outputFile,
        tier,
        archetype,
        addedRuns: added.length,
        recordedRuns: cell.recordedRuns,
        status: cell.status,
        completionRate: cell.completionRate,
        averageBossDurationMs: cell.averageBossDurationMs,
        averageRouteDurationMs: cell.averageRouteDurationMs,
        averageDamageTaken: cell.averageDamageTaken,
        averageHealing: cell.averageHealing,
        averageMinHp: cell.averageMinHp,
        missRate: cell.missRate,
        completedRuns: summary.completedRuns,
        pendingActualRuns: summary.pendingActualRuns,
        sourceFingerprint
    }));
}

async function cleanup() {
    await stopServer();
    fs.rmSync(tempRoot, { recursive: true, force: true });
}

run().then(cleanup).catch(async error => {
    console.error(error.stack || error);
    if (childOutput) console.error(childOutput);
    await cleanup();
    process.exitCode = 1;
});
