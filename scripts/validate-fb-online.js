"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const net = require("net");
const { spawn, execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wsmud2-fb-online-"));
let port = 0;
const sessionKey = "online-test-key1";
const md5Prefix = "online-test-md5";
const desIv = "1234123412341234";
const accountPassword = crypto.randomBytes(24).toString("hex");
const accountName = "onlinevalidator";
const roleId = "onlinefb01";
const roleId2 = "onlinefb02";
let accountId = 0;

let child = null;
let childOutput = "";

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

function copySourceTree() {
    fs.cpSync(root, tempRoot, {
        recursive: true,
        filter(source) {
            if (source === path.join(root, ".env")) return false;
            if (source.startsWith(path.join(root, ".git") + path.sep)) return false;
            if (source.startsWith(path.join(root, "node_modules") + path.sep)) return false;
            if (source === path.join(root, "node_modules")) return false;
            if (source.startsWith(path.join(root, "data") + path.sep)) return false;
            if (source === path.join(root, "data")) return false;
            return true;
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
        "{prop:[100000,100000,100000,100000,1,1000000,0,0,0,20,20,1000000,1000000,100,0,0,100,0,0,0]",
        ',quit_room:"yz/wumiao",items:[["cash/saodang","online-token",10]],stores:[],books:[],skills:{},',
        'temp:{fb:38,fb_sao20:1,fb_record_index_v2:1,fb_unlock_order_v3:1,ad_jl:120},settings:{auto_get:0},eq:[],titles:[],',
        'eq_groups:[],sk_groups:[],auto_pfm_groups:[]}'
    ].join("");
}

function prepareDatabase() {
    const script = [
        "require('./env').config();",
        "global.__CONFIG=require('./config');",
        "(async()=>{",
        "await __CONFIG.DB.connect('database.db');",
        "const crypto=require('crypto');",
        "const password=crypto.createHash('md5').update(process.env.ONLINE_RAW_PASSWORD+process.env.MD5_PREFIX).digest('hex').toUpperCase();",
        "const account={name:'" + accountName + "',pwd:password,phone:null};",
        "await __CONFIG.DB.createUser(account);",
        "await require('./data/db').query('update users set level=? where id=?',[6,account.id]);",
        "const role={userid:account.id,id:'" + roleId + "',name:'在线校验角色',title:'武神',level:6,server:100,data:" + JSON.stringify(roleData()) + "};",
        "console.log('ONLINE_ACCOUNT_ID:'+account.id);",
        "await __CONFIG.DB.addRole(role);",
        "const role2={userid:account.id,id:'" + roleId2 + "',name:'在线组队角色',title:'武神',level:6,server:100,data:" + JSON.stringify(roleData()) + "};",
        "await __CONFIG.DB.addRole(role2);",
        "await __CONFIG.DB.close();",
        "})().catch(error=>{console.error(error.stack);process.exit(1);});"
    ].join("");
    const prepOutput = execFileSync(process.execPath, ["-e", script], {
        cwd: tempRoot,
        env: { ...testEnv(), ONLINE_RAW_PASSWORD: accountPassword },
        stdio: "pipe"
    }).toString();
    const marker = prepOutput.match(/ONLINE_ACCOUNT_ID:(\d+)/);
    accountId = marker ? Number(marker[1]) : 0;
    if (!(accountId > 0)) throw new Error("隔离测试账号创建失败\n" + prepOutput);
}

function testEnv() {
    return {
        ...process.env,
        WEB_PORT: String(port + 1),
        WS_PORT: String(port),
        MD5_PREFIX: md5Prefix,
        SESSION_SECRET: "online-test-session",
        DESIV: desIv,
        ADMIN_SOCKET_PATH: path.join(tempRoot, "data", "admin.sock")
    };
}

function passwordHash() {
    return crypto.createHash("md5").update(accountPassword + md5Prefix).digest("hex").toUpperCase();
}

function makeCertificate() {
    const plain = [accountId, accountName, passwordHash(), Date.now(), 6].join("%");
    const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(sessionKey), Buffer.from(desIv));
    return cipher.update(plain, "utf8", "base64") + cipher.final("base64");
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
    return waitForServer();
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

function waitForServer() {
    return new Promise((resolve, reject) => {
        const deadline = setTimeout(() => reject(new Error("隔离游戏服务启动超时\n" + childOutput)), 30000);
        const check = () => {
            if (childOutput.includes("服务") && childOutput.includes("ws://")) {
                clearTimeout(deadline);
                resolve();
            }
        };
        const interval = setInterval(check, 50);
        child.once("exit", code => {
            clearInterval(interval);
            clearTimeout(deadline);
            if (code !== null && code !== 0) reject(new Error("隔离游戏服务异常退出: " + code + "\n" + childOutput));
        });
    });
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
                reject,
                timer: setTimeout(() => {
                    this.waiters.splice(this.waiters.indexOf(waiter), 1);
                    reject(new Error("等待在线消息超时\n" + this.messages.slice(-12).join("\n")));
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

function extractNpcId(message, name) {
    const matches = message.matchAll(/id:"([^"]+)",name:"([^"]*)"/g);
    for (const match of matches) {
        if (match[2].includes(name)) return match[1];
    }
    return null;
}

async function waitPath(socket, path, marker) {
    return socket.waitFor(value => value.includes('"path":"' + path + '"'), 15000, marker);
}

async function killAndLoot(socket, name, expectedPercent, minIndex = 0) {
    let roomMessage = null;
    for (let i = socket.messages.length - 1; i >= minIndex; i--) {
        if (socket.messages[i].includes('"type":"items"') && socket.messages[i].includes(name)) {
            roomMessage = socket.messages[i];
            break;
        }
    }
    if (!roomMessage) {
        roomMessage = await socket.waitFor(value => value.includes('"type":"items"') && value.includes(name), 10000, minIndex);
    }
    const npcId = extractNpcId(roomMessage, name);
    if (!npcId) throw new Error("未找到在线 NPC 实例: " + name + "\n" + roomMessage);
    const combatMarker = socket.messages.length;
    socket.send("kill " + npcId);
    await socket.waitFor(value => value.includes('"type":"itemremove"') && value.includes('id:\"' + npcId + '\"'), 30000, combatMarker);
    const corpseMarker = combatMarker;
    const corpseMessage = await socket.waitFor(value => value.includes('"type":"itemadd"') && value.includes(name + "的尸体"), 10000, corpseMarker);
    const corpseMatch = /id:"([^"]+)",name:"([^"]*的尸体[^"]*)"/.exec(corpseMessage);
    if (!corpseMatch) throw new Error("未找到在线尸体实例: " + name + "\n" + corpseMessage);
    const lootMarker = socket.messages.length;
    socket.send("get all from " + corpseMatch[1]);
    await socket.waitFor(value => value.includes("捡起") || value.includes("拿出来"), 10000, lootMarker);
    if (expectedPercent) {
        const progressMarker = socket.messages.length;
        socket.send("cr");
        await socket.waitFor(value => value.includes("完成度：") && value.includes(expectedPercent), 10000, progressMarker);
    }
    return { npcId, corpseId: corpseMatch[1] };
}

async function moveParty(first, second, direction, path) {
    const firstMarker = first.messages.length;
    const secondMarker = second.messages.length;
    first.send("go " + direction);
    second.send("go " + direction);
    await waitPath(first, path, firstMarker);
    await waitPath(second, path, secondMarker);
    return { firstMarker, secondMarker };
}

function extractDiceItemId(message) {
    const match = /dice 0 (\w+)/.exec(message);
    return match ? match[1] : null;
}

async function login(socket, certificate, loginRoleId = roleId) {
    await socket.connect();
    socket.send(sessionKey + " " + certificate);
    await socket.waitFor(value => value.includes("roles"));
    socket.send("login " + loginRoleId);
    await socket.waitFor(value => value.includes('type:"login"'));
    await socket.waitFor(value => value.includes("在线校验角色") || value.includes("yz/wumiao"));
}

async function run() {
    port = await awaitFreePort();
    copySourceTree();
    prepareDatabase();
    await startServer();

    const certificate = makeCertificate();
    const first = new OnlineSocket();
    await login(first, certificate);
    let marker = first.messages.length;
    first.send("cr taohuadao 0 0");
    await first.waitFor(value => value.includes('"path":"fb/taohuadao/entry"'), 10000, marker);
    marker = first.messages.length;
    first.send("map here");
    const taohuaMap = await first.waitFor(value => value.includes('"type":"map"') && value.includes("fb/taohuadao/maze1") && value.includes("fb/taohuadao/maze9"), 10000, marker);
    const visibleMazeRooms = (taohuaMap.match(/fb\/taohuadao\/maze[1-9]/g) || []).length;
    if (visibleMazeRooms !== 9) throw new Error("桃花岛在线地图未显示完整九宫房间\n" + taohuaMap);
    marker = first.messages.length;
    first.send("enter_maze");
    const mazeRoom = await first.waitFor(value => value.includes('"path":"fb/taohuadao/maze'), 10000, marker);
    if (!mazeRoom.includes('"cmd":"maze_north"') || !mazeRoom.includes('"cmd":"maze_northwest"')) {
        throw new Error("桃花阵在线房间未提供八方向点击动作\n" + mazeRoom);
    }
    marker = first.messages.length;
    first.send("cr over");
    await first.waitFor(value => value.includes('"path":"yz/wumiao"'), 10000, marker);
    marker = first.messages.length;
    first.send("cr taohuadao 0 1");
    await first.waitFor(value => value.includes("19000点经验") || value.includes("online-token") && value.includes("remove"), 10000, marker);
    marker = first.messages.length;
    first.send("pack none");
    const pack = await first.waitFor(value => value.includes("dialog") && value.includes("money"), 10000, marker);
    marker = first.messages.length;
    first.send("pack");
    const packItems = await first.waitFor(value => value.includes("dialog") && value.includes("online-token"), 10000, marker);
    if (!packItems.includes("online-token\",9,")) {
        throw new Error("扫荡后背包未显示剩余9张扫荡符\n" + first.messages.join("\n"));
    }

    marker = first.messages.length;
    first.send("cr xiakedao 0 0");
    await waitPath(first, "fb/xiakedao/entry", marker);
    marker = first.messages.length;
    first.send("choose_fae");
    await first.waitFor(value => value.includes("选择罚恶路线"), 10000, marker);
    marker = first.messages.length;
    first.send("go east");
    await waitPath(first, "fb/xiakedao/fae", marker);
    await killAndLoot(first, "罚恶使者", "25%");
    marker = first.messages.length;
    first.send("go east");
    await waitPath(first, "fb/xiakedao/fae_room", marker);
    await killAndLoot(first, "侠客岛守卫", "50%");
    marker = first.messages.length;
    first.send("go east");
    await waitPath(first, "fb/xiakedao/island1", marker);
    await killAndLoot(first, "龙岛主", "75%");
    marker = first.messages.length;
    first.send("go east");
    await waitPath(first, "fb/xiakedao/island2", marker);
    await killAndLoot(first, "木岛主", "100%");
    marker = first.messages.length;
    first.send("cr over");
    await waitPath(first, "yz/wumiao", marker);
    if (!first.messages.some(value => value.includes("完成度：<hiz>100%"))) {
        throw new Error("在线路线结算未达到100%\n" + first.messages.slice(-20).join("\n"));
    }

    const party = new OnlineSocket();
    await login(party, certificate, roleId2);
    marker = first.messages.length;
    first.send("team add " + roleId2);
    await party.waitFor(value => value.includes("邀请你加入组队"), 10000, party.messages.length);
    party.send("team reply ok");
    await first.waitFor(value => value.includes('dialog":"team"') && value.includes(roleId2), 10000, marker);
    await party.waitFor(value => value.includes('dialog":"team"') && value.includes(roleId), 10000, 0);

    marker = first.messages.length;
    const partyMarker = party.messages.length;
    first.send("cr xiakedao 2 0");
    await waitPath(first, "fb/xiakedao/entry", marker);
    await party.waitFor(value => value.includes("cr xiakedao 2 0"), 10000, partyMarker);
    party.send("cr xiakedao 2 0");
    await waitPath(party, "fb/xiakedao/entry", party.messages.length - 1);
    marker = first.messages.length;
    first.send("choose_fae");
    await first.waitFor(value => value.includes("选择罚恶路线"), 10000, marker);
    const partyFaeMove = await moveParty(first, party, "east", "fb/xiakedao/fae");
    marker = first.messages.length;
    first.send('call this.environment.items.find(item=>item.path==="fb/xiakedao/fae_shizhe").set_drop({obj:"eq/fb/binghuo/tulongdao",odds:10000});');
    await first.waitFor(value => value === "ok", 10000, marker);
    await killAndLoot(first, "罚恶使者", "25%", partyFaeMove.firstMarker);
    const firstLootWarn = await first.waitFor(value => value.includes('type:"warn"') && value.includes("屠龙刀"), 10000, partyFaeMove.firstMarker);
    const partyLootWarn = await party.waitFor(value => value.includes('type:"warn"') && value.includes("屠龙刀"), 10000, partyFaeMove.secondMarker);
    const firstLootId = extractDiceItemId(firstLootWarn);
    const partyLootId = extractDiceItemId(partyLootWarn);
    if (!firstLootId || firstLootId !== partyLootId) {
        throw new Error("组队需求分配未向两名角色发送同一战利品实例\n" + firstLootWarn + "\n" + partyLootWarn);
    }
    marker = first.messages.length;
    const partyLootMarker = party.messages.length;
    first.send("dice 1 " + firstLootId);
    party.send("dice 0 " + partyLootId);
    await first.waitFor(value => value.includes("在线组队角色获得") && value.includes("屠龙刀"), 10000, marker);
    await party.waitFor(value => value.includes("在线组队角色获得") && value.includes("屠龙刀"), 10000, partyLootMarker);
    marker = first.messages.length;
    first.send("pack");
    const firstLootPack = await first.waitFor(value => value.includes("dialog") && value.includes("online-token"), 10000, marker);
    party.send("pack");
    const partyLootPack = await party.waitFor(value => value.includes("dialog") && value.includes("online-token"), 10000, party.messages.length - 1);
    if (firstLootPack.includes("屠龙刀") || !partyLootPack.includes("屠龙刀")) {
        throw new Error("组队需求战利品未唯一进入需求者背包\n队长:" + firstLootPack + "\n队员:" + partyLootPack);
    }
    party.send("cr");
    await party.waitFor(value => value.includes("完成度：") && value.includes("25%"), 10000, party.messages.length - 1);
    const partyGuardMove = await moveParty(first, party, "east", "fb/xiakedao/fae_room");
    await killAndLoot(first, "侠客岛守卫", "50%", partyGuardMove.firstMarker);
    const partyLongMove = await moveParty(first, party, "east", "fb/xiakedao/island1");
    await killAndLoot(first, "龙岛主", "75%", partyLongMove.firstMarker);
    const partyMudaoMove = await moveParty(first, party, "east", "fb/xiakedao/island2");
    await killAndLoot(first, "木岛主", "100%", partyMudaoMove.firstMarker);
    marker = first.messages.length;
    const partyProgressMarker = party.messages.length;
    first.send("cr");
    party.send("cr");
    await first.waitFor(value => value.includes("完成度：") && value.includes("100%"), 10000, marker);
    await party.waitFor(value => value.includes("完成度：") && value.includes("100%"), 10000, partyProgressMarker);
    marker = first.messages.length;
    const partyOverMarker = party.messages.length;
    first.send("cr over");
    party.send("cr over");
    await waitPath(first, "yz/wumiao", marker);
    await waitPath(party, "yz/wumiao", partyOverMarker);
    if (party.messages.some(value => value.includes("扫荡解锁"))) {
        throw new Error("组队模式错误解锁扫荡\n" + party.messages.slice(-20).join("\n"));
    }
    marker = first.messages.length;
    first.send("team dismiss");
    await first.waitFor(value => value.includes("队伍解散"), 10000, marker);
    await party.close();
    await first.close();
    await new Promise(resolve => setTimeout(resolve, 300));
    const second = new OnlineSocket();
    await login(second, certificate);
    marker = second.messages.length;
    second.send("pack");
    const reconnectPack = await second.waitFor(value => value.includes("dialog") && value.includes("online-token"), 10000, marker);
    if (!reconnectPack.includes("online-token\",9,")) {
        throw new Error("断线重连后背包未恢复扫荡符数量\n" + second.messages.join("\n"));
    }
    marker = second.messages.length;
    second.send("cr taohuadao 0 0");
    await waitPath(second, "fb/taohuadao/entry", marker);
    marker = second.messages.length;
    second.send("enter_maze");
    await second.waitFor(value => value.includes('"path":"fb/taohuadao/maze'), 10000, marker);
    await second.close();
    await new Promise(resolve => setTimeout(resolve, 300));
    await stopServer();
    await startServer();
    const restarted = new OnlineSocket();
    await login(restarted, certificate);
    if (!restarted.messages.some(value => value.includes('"path":"yz/wumiao"'))) {
        throw new Error("副本实例内停机重启后未回到安全入口\n" + restarted.messages.join("\n"));
    }
    marker = restarted.messages.length;
    restarted.send("pack");
    const restartedPack = await restarted.waitFor(value => value.includes("dialog") && value.includes("online-token"), 10000, marker);
    if (!restartedPack.includes("online-token\",9,")) {
        throw new Error("进程重启后背包未恢复扫荡符数量\n" + restarted.messages.join("\n"));
    }
    marker = restarted.messages.length;
    restarted.send("cr taohuadao 0 0");
    await waitPath(restarted, "fb/taohuadao/entry", marker);
    marker = restarted.messages.length;
    restarted.send("cr");
    await restarted.waitFor(value => value.includes("完成度：") && value.includes("0%"), 10000, marker);
    marker = restarted.messages.length;
    restarted.send("cr over");
    await waitPath(restarted, "yz/wumiao", marker);
    await restarted.close();
    console.log("FB_ONLINE_JSON:" + JSON.stringify({ login: true, sweep: true, loot: true, reconnect: true, combat: true, milestone: true, settlement: true, party: true, partyShared: true, partyNoSweep: true, partyLoot: true, partyLootUnique: true, restart: true, restartActiveReset: true, pack: pack.length }));
}

async function cleanup() {
    await stopServer();
    fs.rmSync(tempRoot, { recursive: true, force: true });
}

run().then(async () => {
    await cleanup();
    console.log("隔离 WebSocket 登录、扫荡、掉落、战斗、里程碑、结算、背包与断线重连审计通过。");
}).catch(async error => {
    console.error(error.stack || error);
    if (childOutput) console.error(childOutput);
    await cleanup();
    process.exitCode = 1;
});
