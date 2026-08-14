"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const areaDir = path.join(root, "world", "area", "fb1");
const expected = new Map([
    ["taohuadao", 20], ["baituo", 21], ["xingxiu", 22], ["binghuo", 23],
    ["yihuagong", 24], ["yanziwu", 25], ["heimuya", 26], ["piaomiaofeng", 27],
    ["guangmingding", 28], ["tianlongsi", 29], ["xuedaomen", 30], ["gumu", 31],
    ["huashanlunjian", 32], ["xiakedao", 33], ["jingnian", 34], ["cihang", 35],
    ["yinyanggu", 36], ["zhanshendian", 37]
]);

function loadArea(file) {
    const area = {
        AREA: {},
        inherits() {},
        set(value) { Object.assign(this, value); }
    };
    vm.runInNewContext(fs.readFileSync(file, "utf8"), area, { filename: file });
    return area;
}

function loadProgressExtension() {
    function Area() {}
    function Room() {}
    function Character() {}
    Area.FBS = [];
    Room.prototype.destroy = function () { this.wasDestroyed = true; };
    const context = { AREA: Area, ROOM: Room, CHARACTER: Character, NPC: { CLONE() { return null; } }, console: { error() {} } };
    for (const fileName of ["fb_progress.js", "cihang.js", "jingnian.js", "taohuadao.js", "xiakedao.js"]) {
        const file = path.join(root, "world", "extends", "map", fileName);
        vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
    }
    return context;
}

function simulateRoute(areaData, mode, routeId, milestones) {
    const context = loadProgressExtension();
    const area = Object.assign(new context.AREA(), areaData);
    const first = { temp: {} };
    const room = Object.assign(new context.ROOM(), {
        parent: area,
        query_fb_first() { return first; },
        query_temp(me, key, def) {
            const value = first.temp[key];
            return value === undefined ? def : value;
        }
    });
    first.temp.diff = mode === "normal" ? 0 : Number(mode);
    const leader = { query_teamid() { return "team"; }, notify() {} };
    const teammate = { query_teamid() { return "team"; }, notify() {} };
    if (routeId !== "default" && !room.set_fb_route(leader, routeId)) return "无法锁定路线";
    const entries = Object.entries(milestones);
    for (let index = 0; index < entries.length; index++) {
        const [key, amount] = entries[index];
        const actor = index % 2 ? teammate : leader;
        if (!room.grant_fb_milestone(actor, key, amount)) return `里程碑未授予 ${key}`;
        if (room.grant_fb_milestone(actor, key, amount)) return `里程碑可重复授予 ${key}`;
    }
    const state = room.query_fb_state(leader);
    if (state !== room.query_fb_state(teammate)) return "组队成员未共享状态";
    if (state.score !== 100) return `模拟完成度为 ${state.score}`;

    first.temp.fb_progress = null;
    if (!room.fail_fb_route(leader, "模拟失败")) return "无法标记失败";
    if (room.grant_fb_milestone(leader, entries[0][0], entries[0][1])) return "失败后仍可计分";
    if (room.query_fb_state(leader).score !== 0) return "失败后完成度发生变化";
    return null;
}

function validateXiakeScenario(areaData) {
    const context = loadProgressExtension();
    const area = Object.assign(new context.AREA(), areaData);
    const first = { temp: { diff: 0, "fb/xiakedao/route": "赏善", fb_progress: { score: 0, milestones: {}, route: "赏善", failed: false, reason: "" } } };
    const skills = {};
    for (const id of ["force", "dodge", "parry", "unarmed", "sword"]) skills[id] = { level: 100, exp: 0 };
    const room = Object.assign(new context.ROOM(), {
        parent: area,
        actions: {},
        items: [],
        inherits() {},
        add_action(name, command, fn) { this.actions[command] = fn; },
        set_npc() {},
        query_exits(dir) { return Boolean(this.exits && this.exits[dir]); },
        add_exit(dir, target) { if (!this.exits) this.exits = {}; this.exits[dir] = target; },
        query_fb_first() { return first; },
        query_temp(me, key, def) {
            const value = first.temp[key];
            return value === undefined ? def : value;
        },
        set_temp(me, key, value) { first.temp[key] = value; },
        grant_fb_milestone: context.ROOM.prototype.grant_fb_milestone,
        query_fb_state: context.ROOM.prototype.query_fb_state
    });
    const me = {
        id: "leader",
        skills,
        query_teamid() { return "team"; },
        query_skill(id, def) { return this.skills[id] ? this.skills[id].level : (def || 0); },
        notify() {}
    };
    me.environment = room;
    const sandbox = Object.assign(room, { ROOM: context.ROOM, console: { error() {} } });
    const layerFiles = ["shangshan", "shangshan2", "shangshan3", "shangshan4", "shangshan5", "shangshan6"];
    const expectedRooms = layerFiles.map(fileName => "fb/xiakedao/" + fileName);
    const areaRooms = new Set((areaData.map || []).map(item => item.id));
    if (expectedRooms.some(roomId => !areaRooms.has(roomId))) return "赏善六层石室未完整登记到 AREA 地图";
    const loadLayer = index => {
        room.actions = {};
        const file = path.join(root, "world", "map", "fb", "xiakedao", layerFiles[index] + ".js");
        vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
        const expectedSouth = index === 0 ? "fb/xiakedao/entry" : expectedRooms[index - 1];
        const expectedNorth = index === 5 ? "fb/xiakedao/shangshan_boss" : expectedRooms[index + 1];
        if (room.exits.south !== expectedSouth || room.exits.north !== expectedNorth) return null;
        return { answer: room.actions["回答诗句"], understand: room.actions["领悟"] };
    };
    let actions = loadLayer(0);
    if (!actions) return "赏善六层石室出口与计划拓扑不一致";
    let { answer, understand } = actions;
    if (!answer || !understand) return "赏善第一层石室动作未注册";
    if (room.on_leave(me, "north") !== false) return "赏善第一层未领悟仍可进入第二层";
    answer.call(room, me, "轻功");
    if (room.query_temp(me, "fb/xiakedao/shangshan/pending", 0)) return "错误答案推进了赏善层数";
    answer.call(room, me, "内功");
    understand.call(room, me);
    if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== 0 || me.skills.force.exp !== 0) return "赏善石壁在技能未增长时推进或直接修改了技能经验";
    const teammate = {
        id: "teammate",
        skills: { force: { level: 500, exp: 500 } },
        query_teamid() { return "team"; },
        notify() {}
    };
    teammate.environment = room;
    understand.call(room, teammate);
    if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== 0) return "赏善石壁允许高等级队友替代答题者的真实技能增长";
    me.skills.dodge.exp++;
    understand.call(room, me);
    if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== 0) return "赏善石壁错误接受了非当前技能的增长";
    me.skills.force.exp++;
    understand.call(room, me);
    if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== 1 || room.on_leave(me, "north") === false) return "第一层真实技能增长未推进或仍被出口阻断";

    const remaining = [["轻功", "dodge"], ["招架", "parry"], ["拳脚", "unarmed"], ["剑法", "sword"]];
    for (let index = 0; index < remaining.length; index++) {
        const [answerText, skillId] = remaining[index];
        actions = loadLayer(index + 1);
        if (!actions || !actions.answer || !actions.understand) return "赏善第" + (index + 2) + "层石室动作或出口未注册";
        answer = actions.answer;
        understand = actions.understand;
        if (room.on_leave(me, "north") !== false) return "赏善第" + (index + 2) + "层未领悟仍可向北跳层";
        answer.call(room, me, "内功");
        if (room.query_temp(me, "fb/xiakedao/shangshan/pending", 0)) return "赏善第" + (index + 2) + "层接受了错误答案";
        answer.call(room, me, answerText);
        if (index === 0) {
            me.skills[skillId].level++;
            me.skills[skillId].exp = 0;
        } else {
            me.skills[skillId].exp++;
        }
        understand.call(room, me);
        if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== index + 2
            || room.on_leave(me, "north") === false) return "赏善第" + (index + 2) + "层未按真实技能进度开放下一层";
    }
    const state = room.query_fb_state(me);
    if (state.score !== 50 || !state.milestones["问答"]) return "前五层未按50分完成";
    actions = loadLayer(5);
    if (!actions || !actions.answer || !actions.understand) return "赏善第六层石室动作或出口未注册";
    answer = actions.answer;
    understand = actions.understand;
    if (room.on_leave(me, "north") !== false) return "赏善第六层未完成仍可进入岛主房间";
    understand.call(room, me);
    if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== 5 || !room.query_temp(me, "fb/xiakedao/shangshan/sixth_failed", 0)) return "第六层未先进入失败状态";
    answer.call(room, me, "不知道");
    if (room.query_temp(me, "fb/xiakedao/shangshan/layer", 0) !== 6 || state.score !== 65) return "第六层正确回答未计分";
    answer.call(room, me, "不知道");
    if (state.score !== 65 || room.on_leave(me, "north") === false) return "第六层重复计分或完成后仍被岛主房间阻断";
    const boss = loadActionScenario(areaData, "fb/xiakedao/shangshan_boss", { "fb/xiakedao/route": "赏善" });
    boss.first.temp.fb_progress.milestones = { "问答": 1, "第六层": 1 };
    boss.first.temp.fb_progress.score = 65;
    boss.room.actions["比试"].call(boss.room, boss.me);
    if (boss.room.query_temp(boss.me, "fb/xiakedao/shangshan/duel", 0)) return "石破天内息变化前仍可发起比试";
    boss.room.actions["等待内息变化"].call(boss.room, boss.me);
    boss.room.actions["等待内息变化"].call(boss.room, boss.me);
    boss.room.actions["比试"].call(boss.room, boss.me);
    boss.room.actions["比试"].call(boss.room, boss.me);
    if (!boss.room.query_temp(boss.me, "fb/xiakedao/shangshan/inner_change", 0)
        || !boss.room.query_temp(boss.me, "fb/xiakedao/shangshan/duel", 0)) return "石破天内息提示后未能幂等开启比试";
    const shipotian = loadNpcScenario("fb/xiakedao/shipotian");
    shipotian.on_died(boss.me);
    shipotian.on_died(boss.me);
    if (boss.first.temp.fb_progress.score !== 85 || !boss.first.temp.fb_progress.milestones["比试"]) return "石破天比试死亡回调未幂等结算20分";
    boss.room.actions["帮他一把"].call(boss.room, boss.me);
    boss.room.actions["帮他一把"].call(boss.room, boss.me);
    return boss.first.temp.fb_progress.score === 100 ? null : "赏善比试/帮忙未完成100分";
}

function loadActionScenario(areaData, roomRelativePath, tempValues) {
    const context = loadProgressExtension();
    const area = Object.assign(new context.AREA(), areaData);
    const initialTemp = Object.assign({}, tempValues || {});
    const initialRoute = initialTemp["fb/jingnian/route"] || initialTemp["fb/cihang/route"] || initialTemp["fb/yinyanggu/route"] || initialTemp["fb/xiakedao/route"] || null;
    const first = { temp: Object.assign({ fb_progress: { score: 0, milestones: {}, route: initialRoute, failed: false, reason: "" } }, initialTemp) };
    const room = Object.assign(new context.ROOM(), {
        parent: area,
        actions: {},
        inherits() {},
        add_action(name, command, fn) { this.actions[command] = fn; },
        set_npc() {},
        query_exits(dir) { return Boolean(this.exits && this.exits[dir]); },
        add_exit(dir, target) { if (!this.exits) this.exits = {}; this.exits[dir] = target; },
        query_fb_first() { return first; },
        query_temp(me, key, def) { return first.temp[key] === undefined ? def : first.temp[key]; },
        set_temp(me, key, value) { first.temp[key] = value; },
        add_temp(me, key, value) { first.temp[key] = (first.temp[key] || 0) + value; },
        item_changed() {},
        notify() {},
        find_obj_bypath() { return null; },
        grant_fb_milestone: context.ROOM.prototype.grant_fb_milestone,
        query_fb_state: context.ROOM.prototype.query_fb_state,
        fail_fb_route: context.ROOM.prototype.fail_fb_route,
        is_fb() { return true; }
    });
    const me = {
        is_player: true,
        str: 12000,
        hp: 10,
        max_hp: 100,
        query_teamid() { return "team"; },
        query_prop() { return 0; },
        query_skill(id, def) { return id === "dodge" ? 5000 : (def || 0); },
        add_hp(value) { this.hp += value; },
        random(max) { return max > 0 ? 0 : 0; },
        notify() {}
    };
    me.environment = room;
    const sandbox = Object.assign(room, {
        ROOM: context.ROOM,
        NPC: { CLONE() { return null; } },
        SKILL: { get() { return null; } },
        console: { error() {} }
    });
    context.ROOM.Get = function () { return null; };
    vm.runInNewContext(fs.readFileSync(path.join(root, "world", "map", roomRelativePath + ".js"), "utf8"), sandbox, { filename: roomRelativePath });
    return { room, first, me, context };
}

function loadScenarioRoom(scenario, roomRelativePath, preserveItems) {
    scenario.room.actions = {};
    if (!preserveItems) scenario.room.items = [];
    scenario.me.environment = scenario.room;
    vm.runInNewContext(
        fs.readFileSync(path.join(root, "world", "map", roomRelativePath + ".js"), "utf8"),
        scenario.room,
        { filename: roomRelativePath }
    );
    return scenario.room;
}

function attachScenarioSpawns(scenario, failures) {
    const failed = Object.assign({}, failures || {});
    const spawned = [];
    scenario.room.items = [];
    scenario.room.find_obj_bypath = function (target) {
        return this.items.find(item => item.path === target);
    };
    scenario.room.item_changed = function (item, isIn) {
        const index = this.items.indexOf(item);
        if (isIn && index < 0) this.items.push(item);
        if (!isIn && index >= 0) this.items.splice(index, 1);
        item.environment = isIn ? this : null;
    };
    scenario.room.NPC.CLONE = function (target) {
        if ((failed[target] || 0) > 0) {
            failed[target]--;
            return null;
        }
        const npc = {
            path: target,
            hp: 100,
            max_hp: 100,
            mp: 100,
            max_mp: 100,
            str: 100,
            con: 100,
            dex: 100,
            int: 100,
            prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 },
            attacked: [],
            do_kill(targetPlayer) { this.attacked.push(targetPlayer); }
        };
        spawned.push(npc);
        return npc;
    };
    scenario.context.NPC = scenario.room.NPC;
    return spawned;
}

function validateYihuagongScenario(areaData) {
    const scenario = loadActionScenario(areaData, "fb/yihuagong/huajing", { diff: 0 });
    scenario.me.hp = 100;
    scenario.me.max_hp = 100;
    const step = scenario.room.actions["前进"];
    for (let count = 0; count < 11; count++) step.call(scenario.room, scenario.me);
    let state = scenario.room.query_fb_state(scenario.me);
    if (scenario.me.hp !== 45 || state.milestones["花径"] || scenario.room.query_exits("north")) return "花径前十一部失血或门禁异常";
    step.call(scenario.room, scenario.me);
    state = scenario.room.query_fb_state(scenario.me);
    if (scenario.me.hp !== 40 || state.score !== 10 || !state.milestones["花径"] || !scenario.room.query_exits("north")) return "花径第十二步未失血并按10分开启出口";
    step.call(scenario.room, scenario.me);
    if (scenario.me.hp !== 40 || state.score !== 10) return "完成花径后仍可重复失血或计分";
    return null;
}

function validateHeimuyaScenario(areaData) {
    const unqualified = loadActionScenario(areaData, "fb/heimuya/entry", { diff: 1 });
    unqualified.me.temp = {};
    unqualified.me.query_temp = function (key, def) { return this.temp[key] === undefined ? def : this.temp[key]; };
    unqualified.room.on_enter(unqualified.me);
    if (!unqualified.room.query_fb_state(unqualified.me).failed) return "未通关普通路线仍可开启困难路线";

    const qualified = loadActionScenario(areaData, "fb/heimuya/entry", { diff: 1 });
    qualified.me.temp = { fbc_0_26: 1 };
    qualified.me.query_temp = function (key, def) { return this.temp[key] === undefined ? def : this.temp[key]; };
    qualified.room.on_enter(qualified.me);
    if ([1, 2, 3].some(index => !qualified.room.query_temp(qualified.me, "fb/heimuya/token" + index + "_owned", 0))) return "困难资格未注入三枚实例令牌";

    const difficultBasket = loadActionScenario(areaData, "fb/heimuya/diaolan1", { diff: 1 });
    difficultBasket.room.owner = "copy";
    difficultBasket.room.items = [];
    difficultBasket.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
    difficultBasket.room.item_changed = function (item, isIn) {
        const index = this.items.indexOf(item);
        if (isIn && index < 0) this.items.push(item);
        if (!isIn && index >= 0) this.items.splice(index, 1);
        item.environment = isIn ? this : null;
    };
    const elderSources = {};
    for (const [sourceName, elderName] of [["baihutang", "shangguanyun"], ["qinglongtang", "jiabu"], ["fengleitang", "tongbaixiong"]]) {
        const source = {
            items: [],
            find_obj_bypath(target) { return this.items.find(item => item.path === target); },
            item_changed(item, isIn) {
                const index = this.items.indexOf(item);
                if (isIn && index < 0) this.items.push(item);
                if (!isIn && index >= 0) this.items.splice(index, 1);
                item.environment = isIn ? this : null;
            }
        };
        const elderNpc = {
            path: "fb/heimuya/" + elderName,
            hp: 100,
            attacked: [],
            do_kill(target) { this.attacked.push(target); }
        };
        source.items.push(elderNpc);
        elderNpc.environment = source;
        elderSources[sourceName] = source;
    }
    difficultBasket.context.ROOM.Get = function (target) {
        const source = elderSources[target.slice(target.lastIndexOf("/") + 1)];
        return source ? { copy_rooms: { copy: source } } : null;
    };
    difficultBasket.room.on_enter(difficultBasket.me);
    const movedElders = ["shangguanyun", "jiabu", "tongbaixiong"].map(name => difficultBasket.room.find_obj_bypath("fb/heimuya/" + name));
    if (movedElders.some(elderNpc => !elderNpc || elderNpc.attacked.length !== 1 || elderNpc.attacked[0] !== difficultBasket.me)) return "困难三堂长老未同场主动发起1V3战斗";
    if (!difficultBasket.room.query_temp(difficultBasket.me, "fb/heimuya/elders_moved", 0)) return "困难三堂长老搬迁未记录实例状态";

    const basket = loadActionScenario(areaData, "fb/heimuya/diaolan1", { diff: 0 });
    const insert = basket.room.actions["插入白虎令"];
    insert.call(basket.room, basket.me);
    let state = basket.room.query_fb_state(basket.me);
    if (state.score !== 0 || basket.room.query_temp(basket.me, "fb/heimuya/token1", 0)) return "未取得白虎令仍可启动第一段吊篮";
    const elder = loadNpcScenario("fb/heimuya/shangguanyun");
    elder.on_died(basket.me);
    insert.call(basket.room, basket.me);
    if (state.score !== 15 || !state.milestones["上官云"] || !state.milestones["吊篮一"]) return "白虎堂令牌取得与第一段吊篮未按15分完成";
    insert.call(basket.room, basket.me);
    if (state.score !== 15) return "第一段吊篮可以重复计分";

    const tunnel = loadActionScenario(areaData, "fb/heimuya/midao", { diff: 0, "fb/heimuya/bowl": 1, "fb/heimuya/firebrand": 1 });
    tunnel.room.actions["拉动铁环"].call(tunnel.room, tunnel.me);
    state = tunnel.room.query_fb_state(tunnel.me);
    if (state.score !== 0 || tunnel.room.query_temp(tunnel.me, "fb/heimuya/midao", 0)) return "未点火折子仍可拉动密道铁环";
    tunnel.room.actions["点燃火折子"].call(tunnel.room, tunnel.me);
    if (!tunnel.room.query_temp(tunnel.me, "fb/heimuya/lit", 0) || tunnel.room.query_temp(tunnel.me, "fb/heimuya/firebrand", 1)) return "火折子未消耗或密道未照亮";
    tunnel.room.actions["拉动铁环"].call(tunnel.room, tunnel.me);
    if (state.score !== 15 || !state.milestones["密道链"]) return "密道三阶段未按15分完成";

    const frenzy = loadActionScenario(areaData, "fb/heimuya/yang2", { diff: 0 });
    frenzy.room.owner = "copy";
    const dongfangTarget = {
        added: [],
        add_combat_prop(name, value) { this.added.push([name, value]); },
        recount() {},
        clear_combat_prop() {},
        call_out(fn, delay) { this.pending = [fn, delay]; }
    };
    frenzy.context.ROOM.Get = function () {
        return { copy_rooms: { copy: { find_obj_bypath() { return dongfangTarget; } } } };
    };
    const yang = loadNpcScenario("fb/heimuya/yanglianting2", { ROOM: frenzy.context.ROOM });
    yang.on_died(frenzy.me);
    yang.on_died(frenzy.me);
    state = frenzy.room.query_fb_state(frenzy.me);
    if (state.score !== 10 || !state.milestones["杨莲亭二"] || dongfangTarget.added.length !== 2) return "杨莲亭复活死亡后重复计分或重复触发狂暴";
    if (!dongfangTarget.pending || dongfangTarget.pending[1] !== 30000) return "东方不败狂暴未设置三十秒清理";

    const resurrection = loadActionScenario(areaData, "fb/heimuya/dongfang", {
        diff: 2,
        fb_progress: { score: 10, milestones: { "杨莲亭二": 1 }, route: null, failed: false, reason: "" }
    });
    resurrection.room.path = "fb/heimuya/dongfang";
    resurrection.room.items = [];
    resurrection.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
    resurrection.room.item_changed = function (item, isIn) {
        const index = this.items.indexOf(item);
        if (isIn && index < 0) this.items.push(item);
        if (!isIn && index >= 0) this.items.splice(index, 1);
        item.environment = isIn ? this : null;
    };
    const dongfangNpc = { path: "fb/heimuya/dongfangbubai", hp: 100, attacked: [], do_kill(target) { this.attacked.push(target); } };
    resurrection.room.items.push(dongfangNpc);
    dongfangNpc.environment = resurrection.room;
    let cloneCount = 0;
    resurrection.room.NPC.CLONE = function (target) {
        if (target !== "fb/heimuya/yanglianting2") return null;
        cloneCount++;
        return {
            path: target,
            hp: 100,
            max_hp: 100,
            mp: 100,
            max_mp: 100,
            str: 10,
            con: 10,
            dex: 10,
            int: 10,
            prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 },
            attacked: [],
            do_kill(player) { this.attacked.push(player); }
        };
    };
    resurrection.room.on_enter(resurrection.me);
    const revivedYang = resurrection.room.find_obj_bypath("fb/heimuya/yanglianting2");
    if (cloneCount !== 1 || !revivedYang || revivedYang.attacked[0] !== resurrection.me || dongfangNpc.attacked[0] !== resurrection.me) return "未躺尸进入闺房时杨莲亭未复活挡刀并联手攻击";
    if (revivedYang.max_hp !== 200 || revivedYang.max_mp !== 135 || revivedYang.prop.gj !== 135 || revivedYang.str !== 14) return "组队复活杨莲亭未继承动态NPC难度缩放";
    resurrection.room.apply_fb_spawn_difficulty(resurrection.me, revivedYang);
    if (revivedYang.max_hp !== 200 || revivedYang.prop.gj !== 135) return "复活杨莲亭难度缩放可重复叠加";
    resurrection.room.on_enter(resurrection.me);
    if (cloneCount !== 1) return "闺房已有杨莲亭时仍重复克隆";

    const suppressed = loadActionScenario(areaData, "fb/heimuya/dongfang", {
        diff: 0,
        fb_progress: { score: 10, milestones: { "杨莲亭二": 1 }, route: null, failed: false, reason: "" }
    });
    suppressed.room.path = "fb/heimuya/dongfang";
    suppressed.room.items = [{ path: "fb/heimuya/dongfangbubai", hp: 100, do_kill() {} }];
    suppressed.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
    suppressed.me.exp = 100;
    suppressed.me.send_room = function () {};
    suppressed.me.end_fight = function () { this.endedFight = true; };
    suppressed.me.clear_status = function () {};
    suppressed.me.add_status = function () {};
    const tangshi = loadSkillScenario("sword/tangshijianfa");
    tangshi.pfm.wu.use(suppressed.me, { level: 6, exp: 0, name: "强敌" }, 1000);
    if (suppressed.room.query_temp(suppressed.me, "fb/heimuya/yang2_suppressed", 0)) return "躺尸失败仍抑制杨莲亭复活";
    tangshi.pfm.wu.use(suppressed.me, { level: 1, exp: 0, name: "东方不败" }, 1000);
    if (!suppressed.me.endedFight || !suppressed.room.query_temp(suppressed.me, "fb/heimuya/yang2_suppressed", 0)) return "躺尸成功未写入实例复活抑制状态";
    suppressed.room.NPC.CLONE = function () { cloneCount++; return { path: "fb/heimuya/yanglianting2" }; };
    cloneCount = 0;
    suppressed.room.on_enter(suppressed.me);
    if (cloneCount !== 0 || suppressed.room.find_obj_bypath("fb/heimuya/yanglianting2")) return "躺尸成功后杨莲亭仍在闺房复活";

    const dongfangBoss = loadNpcScenario("fb/heimuya/dongfangbubai", {
        OBJ: { CREATE(target) { return { path: target }; } }
    });
    dongfangBoss.environment = resurrection.room;
    if (dongfangBoss.on_die(resurrection.me) !== false) return "存活杨莲亭未替东方不败挡住致命攻击";
    resurrection.room.item_changed(revivedYang, false);
    if (dongfangBoss.on_die(resurrection.me) === false) return "杨莲亭离场后东方不败仍无法被击杀";

    for (const diff of [0, 1]) {
        const solo = loadActionScenario(areaData, "fb/heimuya/dongfang", { diff });
        const corpse = { items: [] };
        dongfangBoss.environment = solo.room;
        dongfangBoss.on_died(solo.me, corpse);
        if (corpse.items.length) return (diff === 0 ? "普通" : "困难") + "模式错误获得组队橙色残页保底";
    }
    const team = loadActionScenario(areaData, "fb/heimuya/dongfang", { diff: 2 });
    dongfangBoss.environment = team.room;
    const firstCorpse = { items: [] };
    const repeatedCorpse = { items: [] };
    dongfangBoss.on_died(team.me, firstCorpse);
    dongfangBoss.on_died(team.me, repeatedCorpse);
    if (firstCorpse.items.filter(item => item.path === "book/bc#xuantiejianfa").length !== 1 || repeatedCorpse.items.length) return "组队东方不败橙色残页保底未按实例仅发一次";
    return null;
}

function attachStatusStub(me) {
    const statuses = {};
    me.query_status = function (id) { return statuses[id] ? 1 : 0; };
    me.add_status = function (status) { statuses[status.id] = status; return true; };
    me.remove_status = function (id) { delete statuses[id]; };
    return statuses;
}

function validatePiaomiaofengScenario(areaData) {
    const guards = loadActionScenario(areaData, "fb/piaomiaofeng/duanhunya", { diff: 0 });
    const firstGuard = loadNpcScenario("fb/piaomiaofeng/wulaoda");
    firstGuard.on_died(guards.me);
    firstGuard.on_died(guards.me);
    loadNpcScenario("fb/piaomiaofeng/bupingdaoren").on_died(guards.me);
    const guardState = guards.room.query_fb_state(guards.me);
    if (guards.room.query_temp(guards.me, "fb/piaomiaofeng/child_guard", 0) !== 2 || guardState.score !== 20 || !guardState.milestones["保护女童"]) return "缥缈峰同一护送敌人重复死亡仍可重复推进";

    const carry = loadActionScenario(areaData, "fb/piaomiaofeng/shizuyan", { diff: 0 });
    carry.room.owner = "copy";
    carry.room.grant_fb_milestone(carry.me, "保护女童", 20);
    attachStatusStub(carry.me);
    const child = { environment: null };
    const source = {
        find_obj_bypath() { return child; },
        item_changed(item, isIn) { item.environment = isIn ? this : null; }
    };
    child.environment = source;
    carry.context.ROOM.Get = function () { return { copy_rooms: { copy: source } }; };
    carry.room.actions["背起女童"].call(carry.room, carry.me);
    let state = carry.room.query_fb_state(carry.me);
    if (state.score !== 30 || !carry.room.query_temp(carry.me, "fb/piaomiaofeng/carry_child", 0) || !carry.me.query_status("fb_piaomiaofeng_carry") || child.environment) return "背起女童未应用实例状态和背负减益";

    const bridge = loadActionScenario(areaData, "fb/piaomiaofeng/tiesuoqiao", { diff: 0, "fb/piaomiaofeng/carry_child": 1 });
    bridge.me.str = 25;
    bridge.me.dex = 45;
    bridge.me.ds = 8999;
    if (bridge.room.on_leave(bridge.me, "north") !== false) return "躲闪低于9000仍可通过铁索桥";
    bridge.me.ds = 9000;
    if (bridge.room.on_leave(bridge.me, "north") === false) return "达到铁索桥门槛仍被阻断";
    state = bridge.room.query_fb_state(bridge.me);
    if (state.score !== 15 || !state.milestones["铁索桥"]) return "铁索桥未按15分完成";

    const failedLiqiu = loadActionScenario(areaData, "fb/piaomiaofeng/xianchoumen", { diff: 1, "fb/piaomiaofeng/carry_child": 1 });
    failedLiqiu.room.grant_fb_milestone(failedLiqiu.me, "背女童", 10);
    failedLiqiu.room.grant_fb_milestone(failedLiqiu.me, "铁索桥", 15);
    failedLiqiu.me.query_status = function () { return 0; };
    const liqiu = loadNpcScenario("fb/piaomiaofeng/liqiu_shui");
    liqiu.on_died(failedLiqiu.me);
    if (!failedLiqiu.room.query_fb_state(failedLiqiu.me).failed) return "困难路线解除背负后击杀李秋水未失败";

    const childRecovery = loadActionScenario(areaData, "fb/piaomiaofeng/xianchoumen", { diff: 0, "fb/piaomiaofeng/carry_child": 1 });
    attachStatusStub(childRecovery.me);
    childRecovery.me.add_status({ id: "fb_piaomiaofeng_carry" });
    childRecovery.room.items = [];
    childRecovery.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
    childRecovery.room.item_changed = function (item, isIn) {
        const index = this.items.indexOf(item);
        if (isIn && index < 0) this.items.push(item);
        if (!isIn && index >= 0) this.items.splice(index, 1);
        item.environment = isIn ? this : null;
    };
    let childCloneAttempts = 0;
    childRecovery.room.NPC.CLONE = function (target) {
        if (target !== "fb/piaomiaofeng/tonglao") return null;
        childCloneAttempts++;
        if (childCloneAttempts === 1) return null;
        return {
            path: target,
            hp: 100,
            max_hp: 100,
            mp: 100,
            max_mp: 100,
            str: 100,
            con: 100,
            dex: 100,
            int: 100,
            prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 }
        };
    };
    childRecovery.room.on_enter(childRecovery.me);
    if (!childRecovery.room.query_temp(childRecovery.me, "fb/piaomiaofeng/carry_child", 0)
        || childRecovery.room.query_temp(childRecovery.me, "fb/piaomiaofeng/child_landed", 0)
        || !childRecovery.me.query_status("fb_piaomiaofeng_carry")) return "仙愁门天山童姥克隆失败后丢失背负状态";
    childRecovery.room.on_enter(childRecovery.me);
    if (childCloneAttempts !== 2
        || childRecovery.room.query_temp(childRecovery.me, "fb/piaomiaofeng/carry_child", 0)
        || !childRecovery.room.query_temp(childRecovery.me, "fb/piaomiaofeng/child_landed", 0)
        || childRecovery.me.query_status("fb_piaomiaofeng_carry")
        || !childRecovery.room.find_obj_bypath("fb/piaomiaofeng/tonglao")) return "仙愁门重进后未恢复天山童姥并清理背负状态";

    const difficult = loadActionScenario(areaData, "fb/piaomiaofeng/biguanshi", { diff: 1, "fb/piaomiaofeng/carry_child": 1 });
    attachStatusStub(difficult.me);
    difficult.me.add_status({ id: "fb_piaomiaofeng_carry" });
    for (const [key, amount] of [["保护女童", 20], ["卓不凡", 10], ["背女童", 10], ["铁索桥", 15], ["李秋水", 30]]) difficult.room.grant_fb_milestone(difficult.me, key, amount);
    difficult.room.actions["送童姥"].call(difficult.room, difficult.me);
    state = difficult.room.query_fb_state(difficult.me);
    if (state.score !== 100 || !state.milestones["送童姥"] || difficult.me.query_status("fb_piaomiaofeng_carry")) return "困难送达未按15分完成或未清理背负减益";
    return null;
}

function loadNpcScenario(npcRelativePath, globals) {
    const npcApi = Object.assign({ CLONE() { return null; } }, globals && globals.NPC);
    const npc = {
        NPC: npcApi,
        inherits() {},
        set(value) { Object.assign(this, value); },
        skill_map() {},
        set_drop() {},
        set_objects() {}
    };
    if (globals) {
        for (const [key, value] of Object.entries(globals)) {
            if (key !== "NPC") npc[key] = value;
        }
    }
    vm.runInNewContext(fs.readFileSync(path.join(root, "world", "npc", npcRelativePath + ".js"), "utf8"), npc, { filename: npcRelativePath });
    return npc;
}

function loadSkillScenario(skillRelativePath) {
    function Skill() {}
    Skill.prototype.update = function () {};
    const skill = { SKILL: Skill, inherits() {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, "world", "skill", skillRelativePath + ".js"), "utf8"), skill, { filename: skillRelativePath });
    const extension = path.join(root, "world", "extends", "skill", "heimuya.js");
    vm.runInNewContext(fs.readFileSync(extension, "utf8"), skill, { filename: extension });
    Skill.prototype.update.call(skill, skillRelativePath);
    return skill;
}

function validateTianlongsiScenario(areaData) {
    const core = loadActionScenario(areaData, "fb/tianlongsi/banruotai", { diff: 1, "fb/tianlongsi/disguise": 1 });
    attachScenarioSpawns(core, { "fb/tianlongsi/monk": 1 });
    core.room.on_enter(core.me);
    if (core.room.query_temp(core.me, "fb/tianlongsi/core_spawned", 0)
        || core.room.items.filter(item => item.path === "fb/tianlongsi/monk").length !== 0) return "般若台困难目标克隆失败后提前锁定核心阶段";
    core.room.on_enter(core.me);
    if (!core.room.query_temp(core.me, "fb/tianlongsi/core_spawned", 0)
        || core.room.items.filter(item => item.path === "fb/tianlongsi/monk").length !== 2) return "般若台重进未补齐困难路线和尚";

    const failedNormal = loadActionScenario(areaData, "fb/tianlongsi/munitang", { diff: 0 });
    const failedNormalMonk = loadNpcScenario("fb/tianlongsi/monk");
    failedNormalMonk.on_died(failedNormal.me);
    failedNormalMonk.on_died(failedNormal.me);
    loadNpcScenario("fb/tianlongsi/monk").on_died(failedNormal.me);
    loadNpcScenario("fb/tianlongsi/monk").on_died(failedNormal.me);
    let state = failedNormal.room.query_fb_state(failedNormal.me);
    if (!state.failed || state.score !== 10) return "普通路线抓人前第三名和尚未立即失败";

    const failedDifficult = loadActionScenario(areaData, "fb/tianlongsi/munitang", { diff: 1 });
    const failedDifficultMonk = loadNpcScenario("fb/tianlongsi/monk");
    failedDifficultMonk.on_died(failedDifficult.me);
    state = failedDifficult.room.query_fb_state(failedDifficult.me);
    if (!state.failed || state.score !== 0) return "困难路线抓人前击杀和尚未立即失败";

    const normal = loadActionScenario(areaData, "fb/tianlongsi/munitang", { diff: 0 });
    const kurong = loadNpcScenario("fb/tianlongsi/kurong");
    let hasKurong = true;
    const duanyu = { name: "段誉", moveto() {} };
    normal.room.find_obj_bypath = function (target) {
        if (target === "fb/tianlongsi/duanyu") return duanyu;
        if (target === "fb/tianlongsi/kurong" && hasKurong) return kurong;
        return null;
    };
    const normalMonk1 = loadNpcScenario("fb/tianlongsi/monk");
    normalMonk1.on_died(normal.me);
    normalMonk1.on_died(normal.me);
    loadNpcScenario("fb/tianlongsi/monk").on_died(normal.me);
    hasKurong = false;
    normal.room.actions["抓段誉"].call(normal.room, normal.me);
    state = normal.room.query_fb_state(normal.me);
    if (state.score !== 10 || state.milestones["抓段誉"]) return "枯荣不存活时仍可抓住段誉";
    hasKurong = true;
    normal.room.actions["抓段誉"].call(normal.room, normal.me);
    if (state.score !== 30 || !state.milestones["抓段誉"]) return "普通路线抓段誉未按20分完成";
    const normalMonk3 = loadNpcScenario("fb/tianlongsi/monk");
    normalMonk3.on_died(normal.me);
    normalMonk3.on_died(normal.me);
    loadNpcScenario("fb/tianlongsi/monk").on_died(normal.me);
    if (state.milestones["余下和尚"]) return "普通路线不足五名和尚时提前计分";
    loadNpcScenario("fb/tianlongsi/monk").on_died(normal.me);
    if (state.score !== 60 || !state.milestones["余下和尚"]) return "普通路线五名和尚未按30分完成";
    kurong.on_died(normal.me);
    if (state.score !== 75 || !state.milestones["枯荣"]) return "抓段誉后击杀枯荣未按15分完成";

    const difficult = loadActionScenario(areaData, "fb/tianlongsi/munitang", { diff: 1 });
    difficult.room.find_obj_bypath = function (target) {
        if (target === "fb/tianlongsi/duanyu") return duanyu;
        if (target === "fb/tianlongsi/kurong") return kurong;
        return null;
    };
    difficult.room.actions["抓段誉"].call(difficult.room, difficult.me);
    state = difficult.room.query_fb_state(difficult.me);
    for (let count = 0; count < 5; count++) loadNpcScenario("fb/tianlongsi/monk").on_died(difficult.me);
    if (state.milestones["六名和尚"]) return "困难路线不足六名和尚时提前计分";
    loadNpcScenario("fb/tianlongsi/monk").on_died(difficult.me);
    if (state.score !== 50 || !state.milestones["六名和尚"]) return "困难路线六名和尚未按30分完成";
    return null;
}

function validateXuedaomenScenario(areaData) {
    const normal = loadActionScenario(areaData, "fb/xuedaomen/shangu", { diff: 0 });
    const luohua = loadNpcScenario("fb/xuedaomen/luohua");
    luohua.on_died(normal.me);
    luohua.on_died(normal.me);
    for (let count = 0; count < 2; count++) loadNpcScenario("fb/xuedaomen/luohua").on_died(normal.me);
    let state = normal.room.query_fb_state(normal.me);
    if (state.score !== 45 || normal.room.query_temp(normal.me, "fb/xuedaomen/shift_count", 0) !== 3) return "前三次转移未逐阶段计分";
    loadNpcScenario("fb/xuedaomen/luohua").on_died(normal.me);
    if (state.score !== 70 || !state.milestones["最终转移"] || !state.milestones["老祖到谷"]) return "第四次转移未同时授予最终阶段和老祖到谷";

    let now = 10000;
    let replacements = 0;
    const team = loadActionScenario(areaData, "fb/xuedaomen/shangu", { diff: 2 });
    const teamLuohua = loadNpcScenario("fb/xuedaomen/luohua", {
        Date: { now() { return now; } },
        NPC: { CLONE() { replacements++; return {}; } }
    });
    teamLuohua.on_died(team.me);
    now = 15000;
    loadNpcScenario("fb/xuedaomen/luohua", {
        Date: { now() { return now; } },
        NPC: { CLONE() { replacements++; return {}; } }
    }).on_died(team.me);
    state = team.room.query_fb_state(team.me);
    if (state.score !== 15 || team.room.query_temp(team.me, "fb/xuedaomen/shift_count", 0) !== 1) return "组队快速死亡仍推进转移或授分";
    if (team.room.query_temp(team.me, "fb/xuedaomen/frenzy", 0) !== 1 || replacements !== 1) return "组队快速死亡未幂等增加嗜血并补位";
    now = 20000;
    loadNpcScenario("fb/xuedaomen/luohua", {
        Date: { now() { return now; } },
        NPC: { CLONE() { replacements++; return {}; } }
    }).on_died(team.me);
    if (state.score !== 30 || team.room.query_temp(team.me, "fb/xuedaomen/shift_count", 0) !== 2) return "组队死亡间隔达到10秒后未恢复计分";

    const ancestor = loadNpcScenario("fb/xuedaomen/xuedaolaozu");
    ancestor.environment = team.room;
    team.room.path = "fb/xuedaomen/shangu";
    if (ancestor.on_die(team.me) !== false) return "老祖在第四次转移前可以被击杀";
    team.room.set_temp(team.me, "fb/xuedaomen/shift4", 1);
    if (ancestor.on_die(team.me) === false) return "第四次转移后老祖仍不可被击杀";
    return null;
}

function validateGumuScenario(areaData) {
    const combat = loadActionScenario(areaData, "fb/gumu/qinshi", { diff: 0 });
    combat.room.grant_fb_milestone(combat.me, "小龙女", 15);
    const yangguo = loadNpcScenario("fb/gumu/yangguo", {
        add_status(buff) {
            if (buff && buff.is_faint) this.is_faint = buff.duration || 1;
            return true;
        }
    });
    yangguo.environment = combat.room;
    let state = combat.room.query_fb_state(combat.me);
    if (yangguo.on_die(combat.me) !== false || state.milestones["昏迷杨过"]) return "击杀杨过仍会完成昏迷阶段";
    yangguo.add_status({ id: "faint", is_faint: true, duration: 1000 }, combat.me);
    if (state.score !== 25 || !state.milestones["昏迷杨过"]) return "实际昏迷杨过未按10分完成";
    yangguo.add_status({ id: "faint", is_faint: true, duration: 1000 }, combat.me);
    if (state.score !== 25) return "重复昏迷杨过可以重复计分";

    const water = loadActionScenario(areaData, "fb/gumu/shuilu", { diff: 0, "fb/gumu/direction": "north" });
    let moved = 0;
    water.context.ROOM.Get = function () { return { copy_rooms: { undefined: {} } }; };
    water.me.moveto = function () { moved++; };
    water.me.hp = 100;
    water.me.max_hp = 100;
    water.room.actions["游水"].call(water.room, water.me, "south");
    state = water.room.query_fb_state(water.me);
    if (water.me.hp !== 90 || moved !== 0 || state.milestones["游水"]) return "游错方向未在当前水路扣血并阻断计分";
    water.room.actions["游水"].call(water.room, water.me, "north");
    if (water.me.hp !== 80 || state.score !== 15 || !state.milestones["游水"]) return "正确游水未扣血或未按15分完成";

    const tide = loadActionScenario(areaData, "fb/gumu/qiaobi", { diff: 1, "fb/gumu/swim": 1, "fb/gumu/stone": 1 });
    tide.room.grant_fb_milestone(tide.me, "昏迷杨过", 10);
    tide.room.grant_fb_milestone(tide.me, "石块", 10);
    const accuracies = [];
    tide.me.hp = 4000000;
    tide.me.max_hp = 4000000;
    tide.me.from_attack = function (damage, accuracy) {
        accuracies.push(accuracy);
        this.add_hp(-damage);
        return false;
    };
    tide.room.actions["承受海潮"].call(tide.room, tide.me);
    state = tide.room.query_fb_state(tide.me);
    if (accuracies.length !== 7 || accuracies.some(value => value !== 1000000)) return "困难海潮未执行七次百万命中攻击";
    if (tide.me.hp !== 150000 || state.score !== 35 || !state.milestones["海潮七击"]) return "存活七次海潮后未按15分完成";

    const failedTide = loadActionScenario(areaData, "fb/gumu/qiaobi", { diff: 1, "fb/gumu/swim": 1, "fb/gumu/stone": 1 });
    failedTide.room.grant_fb_milestone(failedTide.me, "昏迷杨过", 10);
    failedTide.room.grant_fb_milestone(failedTide.me, "石块", 10);
    failedTide.me.hp = 500000;
    failedTide.me.max_hp = 500000;
    failedTide.me.from_attack = function (damage) { this.add_hp(-damage); return false; };
    failedTide.room.actions["承受海潮"].call(failedTide.room, failedTide.me);
    state = failedTide.room.query_fb_state(failedTide.me);
    if (state.milestones["海潮七击"] || failedTide.room.query_temp(failedTide.me, "fb/gumu/tide", 0) !== 0) return "海潮中倒下仍推进或完成七击";

    const sword = loadNpcScenario("fb/gumu/jianling");
    sword.environment = failedTide.room;
    if (sword.on_die(failedTide.me) !== false) return "未通过海潮时剑灵可以被击杀";
    sword.environment = tide.room;
    if (sword.on_die(tide.me) === false) return "通过海潮后剑灵仍不可被击杀";

    const swordPit = loadActionScenario(areaData, "fb/gumu/jianzhong", { diff: 1 });
    const jianling = { path: "fb/gumu/jianling", environment: swordPit.room };
    swordPit.room.items = [jianling];
    swordPit.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
    swordPit.room.item_changed = function (item, isIn) {
        const index = this.items.indexOf(item);
        if (isIn && index < 0) this.items.push(item);
        if (!isIn && index >= 0) this.items.splice(index, 1);
        item.environment = isIn ? this : null;
    };
    let jianmoAttempts = 0;
    swordPit.room.NPC.CLONE = function (target) {
        if (target !== "fb/gumu/jianmo") return null;
        jianmoAttempts++;
        if (jianmoAttempts === 1) return null;
        return {
            path: target,
            hp: 100,
            max_hp: 100,
            mp: 100,
            max_mp: 100,
            str: 100,
            con: 100,
            dex: 100,
            int: 100,
            prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 }
        };
    };
    swordPit.room.on_enter(swordPit.me);
    if (!swordPit.room.find_obj_bypath("fb/gumu/jianling") || swordPit.room.find_obj_bypath("fb/gumu/jianmo")) return "剑冢剑魔克隆失败时错误移除剑灵";
    swordPit.room.on_enter(swordPit.me);
    if (jianmoAttempts !== 2 || swordPit.room.find_obj_bypath("fb/gumu/jianling") || !swordPit.room.find_obj_bypath("fb/gumu/jianmo")) return "剑冢重进后未恢复剑魔并替换剑灵";
    return null;
}

function validateHuashanScenario(areaData) {
    const stageNames = ["一绝", "二绝", "三绝", "四绝", "五绝"];
    const stageNpcs = ["huangyaoshi", "yideng", "ouyangfeng", "hongqigong", "wangchongyang"];
    const stageRooms = ["tai1", "tai2", "tai3", "tai4", "tai5"];
    const prepare = scenario => {
        scenario.room.items = [];
        scenario.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
        scenario.room.item_changed = function (item, isIn) {
            const index = this.items.indexOf(item);
            if (isIn && index < 0) this.items.push(item);
            if (!isIn && index >= 0) this.items.splice(index, 1);
            item.environment = isIn ? this : null;
        };
        scenario.room.set_item = function () {};
        return scenario;
    };
    const spawn = (scenario, npcPath) => {
        const target = { path: "fb/huashanlunjian/" + npcPath, is_npc: true, environment: scenario.room };
        scenario.room.items.push(target);
        return target;
    };
    const kill = (scenario, npcPath, milestone) => {
        const target = scenario.room.find_obj_bypath("fb/huashanlunjian/" + npcPath);
        if (!target) return false;
        scenario.room.item_changed(target, false);
        loadNpcScenario("fb/huashanlunjian/" + npcPath).on_died(scenario.me);
        const state = scenario.room.query_fb_state(scenario.me);
        return Boolean(state && state.milestones[milestone]);
    };

    const reset = prepare(loadActionScenario(areaData, "fb/huashanlunjian/entry", { diff: 0 }));
    loadScenarioRoom(reset, "fb/huashanlunjian/taixia");
    loadScenarioRoom(reset, "fb/huashanlunjian/tai1");
    reset.room.on_enter(reset.me);
    spawn(reset, "huangyaoshi");
    if (reset.room.on_leave(reset.me, "north") !== false) return "华山论剑第一战未击败黄药师仍可北行";
    if (!kill(reset, "huangyaoshi", "一绝")) return "华山论剑黄药师死亡未结算第一战";
    loadScenarioRoom(reset, "fb/huashanlunjian/tai2");
    reset.room.on_enter(reset.me);
    spawn(reset, "yideng");
    if (reset.room.on_leave(reset.me, "south") !== undefined) return "华山论剑离台重置未执行返回拦截";
    const resetState = reset.room.query_fb_state(reset.me);
    if (resetState.score !== 0 || Object.keys(resetState.milestones).length || reset.room.query_temp(reset.me, "fb/huashanlunjian/active", 0)) return "华山论剑离台后未清空完成度和当前战斗状态";

    const complete = prepare(loadActionScenario(areaData, "fb/huashanlunjian/entry", { diff: 0 }));
    loadScenarioRoom(complete, "fb/huashanlunjian/taixia");
    for (let index = 0; index < stageRooms.length; index++) {
        loadScenarioRoom(complete, "fb/huashanlunjian/" + stageRooms[index]);
        complete.room.on_enter(complete.me);
        spawn(complete, stageNpcs[index]);
        if (complete.room.on_leave(complete.me, "north") !== false) return "华山论剑第" + (index + 1) + "战未击败目标仍可北行";
        if (!kill(complete, stageNpcs[index], stageNames[index])) return "华山论剑第" + (index + 1) + "战死亡未幂等结算";
        if (complete.room.on_leave(complete.me, "north") === false) return "华山论剑第" + (index + 1) + "战完成后仍被门禁阻断";
    }
    const state = complete.room.query_fb_state(complete.me);
    if (state.score !== 100 || Object.keys(state.milestones).length !== 5) return "华山论剑五绝车轮战未恰好完成100分";
    loadScenarioRoom(complete, "fb/huashanlunjian/juebi");
    loadScenarioRoom(complete, "fb/huashanlunjian/treasure");
    complete.room.on_enter(complete.me);
    if (complete.room.query_fb_state(complete.me).score !== 100 || complete.room.query_temp(complete.me, "fb/huashanlunjian/active", 0)) return "华山论剑五绝宝箱错误改写完成度或战斗状态";
    return null;
}

function validateGuangmingdingScenario(areaData) {
    const encounter = loadActionScenario(areaData, "fb/guangmingding/banshanting", { diff: 0 });
    const allyPath = "fb/guangmingding/menpai_dizi#shaolin";
    const allies = [];
    const enemies = [];
    let fights = 0;
    for (let index = 0; index < 4; index++) {
        allies.push({ id: "ally-" + index, path: allyPath, hp: 60000 });
        enemies.push({
            path: "fb/guangmingding/mingjiao_dizi",
            hp: 55000,
            do_kill(target) {
                if (target !== allies[index]) throw new Error("光明顶敌我配对顺序错误");
                fights++;
            }
        });
    }
    encounter.room.items = enemies.concat(allies);
    encounter.room.on_enter(encounter.me);
    encounter.room.on_enter(encounter.me);
    if (fights !== 4) return "六大门派救援战没有按四组启动或可重复启动";

    const firstAlly = loadNpcScenario("fb/guangmingding/menpai_dizi");
    firstAlly.id = "casualty-1";
    firstAlly.name = "少林弟子";
    firstAlly.die_room = encounter.room;
    firstAlly.on_died(enemies[0]);
    firstAlly.on_died(enemies[0]);
    let state = encounter.room.query_fb_state(encounter.me);
    if (state.guangmingdingOrderLevel !== 1 || state.score !== 0) return "同一援军死亡重复增加号令或错误计分";
    const secondAlly = loadNpcScenario("fb/guangmingding/menpai_dizi");
    secondAlly.id = "casualty-2";
    secondAlly.name = "武当弟子";
    secondAlly.die_room = encounter.room;
    secondAlly.on_died(enemies[1]);
    const teammate = { query_teamid() { return "team"; }, notify() {} };
    if (encounter.room.query_fb_state(teammate) !== state || state.guangmingdingOrderLevel !== 2) return "组队成员未共享光明顶号令层数";

    const zhangwuji = loadNpcScenario("fb/guangmingding/zhangwuji");
    zhangwuji.environment = encounter.room;
    zhangwuji.query_prop = function (key) { return this.prop[key] || 0; };
    zhangwuji.recount = function () { this.gj = this.prop.gj; this.mz = this.prop.mz; this.ds = this.prop.ds; this.fy = this.prop.fy; };
    const baseGj = zhangwuji.prop.gj;
    if (zhangwuji.apply_order_level(encounter.me) !== 2 || zhangwuji.prop.gj !== Math.ceil(baseGj * Math.pow(1.1, 2))) return "张无忌未按两层号令强化";
    const twoLayerGj = zhangwuji.prop.gj;
    zhangwuji.apply_order_level(encounter.me);
    if (zhangwuji.prop.gj !== twoLayerGj) return "重复进入圣火坛会重复叠加同层号令";
    state.guangmingdingOrderLevel = 3;
    zhangwuji.apply_order_level(encounter.me);
    if (zhangwuji.prop.gj !== Math.ceil(baseGj * Math.pow(1.1, 3))) return "号令升级未从原始基线重算";

    const rescue = loadActionScenario(areaData, "fb/guangmingding/ding", { diff: 0 });
    for (const [key, amount] of [["颜垣", 5], ["闻苍松", 5], ["庄铮", 5], ["辛然", 5], ["唐洋", 5], ["韦一笑", 5], ["殷天正", 5]]) rescue.room.grant_fb_milestone(rescue.me, key, amount);
    let hasBlocker = true;
    rescue.room.find_obj_bypath = function (target) {
        return hasBlocker && (target === "fb/guangmingding/shuobude" || target === "fb/guangmingding/pengyingyu") ? {} : null;
    };
    rescue.room.actions["救出灭绝"].call(rescue.room, rescue.me);
    state = rescue.room.query_fb_state(rescue.me);
    if (state.milestones["救灭绝"]) return "说不得或彭莹玉存活时仍可救出灭绝";
    hasBlocker = false;
    rescue.room.actions["救出灭绝"].call(rescue.room, rescue.me);
    rescue.room.actions["救出灭绝"].call(rescue.room, rescue.me);
    if (state.score !== 50 || !state.milestones["救灭绝"]) return "清理五旗、护法和围攻者后未幂等救出灭绝";

    const hall = loadActionScenario(areaData, "fb/guangmingding/shenghuotang", { diff: 0 });
    if (hall.room.on_leave(hall.me, "north") !== false) return "未击败光明左右使仍可进入圣火坛";
    hall.room.grant_fb_milestone(hall.me, "光明左使", 10);
    hall.room.grant_fb_milestone(hall.me, "光明右使", 10);
    if (hall.room.on_leave(hall.me, "north") === false) return "击败光明左右使后仍无法进入圣火坛";

    let endedFights = 0;
    encounter.room.items = [
        { fight_type: 2, end_fight() { endedFights++; } },
        { fight_type: 2, end_fight() { endedFights++; } }
    ];
    encounter.room.destroy();
    if (endedFights !== 2 || !encounter.room.wasDestroyed) return "副本销毁时未清理 NPC 战斗计时状态";
    return null;
}

function validateCihangScenario(areaData) {
    const gateFiles = ["qikumenu", "qikumenu2", "qikumenu3", "qikumenu4", "qikumenu5", "qikumenu6", "qikumenu7"];
    const expectedGateRooms = gateFiles.map(fileName => "fb/cihang/" + fileName);
    const areaRooms = new Set((areaData.map || []).map(item => item.id));
    const expectedBranchRooms = ["fb/cihang/fenlu", "fb/cihang/langlu", "fb/cihang/qibinglu"];
    if (expectedGateRooms.concat(expectedBranchRooms).some(roomId => !areaRooms.has(roomId))) return "慈航七重门或左右分支未完整登记到 AREA 地图";

    const loadRoom = (scenario, fileName) => {
        scenario.room.actions = {};
        const file = path.join(root, "world", "map", "fb", "cihang", fileName + ".js");
        vm.runInNewContext(fs.readFileSync(file, "utf8"), scenario.room, { filename: file });
    };
    const varied = loadActionScenario(areaData, "fb/cihang/qikumenu", { "fb/cihang/route": "浪子", diff: 0 });
    varied.me.random = function (max) { return Math.max(0, max - 1); };
    varied.room.on_enter(varied.me);
    const variedOrder = varied.room.query_temp(varied.me, "fb/cihang/qiku_order", 0);

    const scenario = loadActionScenario(areaData, "fb/cihang/qikumenu", { "fb/cihang/route": "浪子", diff: 0 });
    scenario.room.on_enter(scenario.me);
    const order = scenario.room.query_temp(scenario.me, "fb/cihang/qiku_order", 0);
    if (!Array.isArray(order) || order.length !== 7 || new Set(order).size !== 7
        || !Array.isArray(variedOrder) || order.join("/") === variedOrder.join("/")) return "七苦门未生成七重唯一且可变化的实例顺序";
    let state = scenario.room.query_fb_state(scenario.me);
    for (let index = 0; index < gateFiles.length; index++) {
        if (index > 0) loadRoom(scenario, gateFiles[index]);
        scenario.room.on_enter(scenario.me);
        const expectedSouth = index === 0 ? "fb/cihang/entry" : expectedGateRooms[index - 1];
        const expectedNorth = index === 6 ? "fb/cihang/fenlu" : expectedGateRooms[index + 1];
        if (scenario.room.exits.south !== expectedSouth || scenario.room.exits.north !== expectedNorth
            || scenario.room.name !== order[index] + "门") return "慈航第" + (index + 1) + "重门名或出口与实例拓扑不一致";
        const passGate = scenario.room.actions["通过七苦"];
        if (!passGate || scenario.room.on_leave(scenario.me, "north") !== false) return "慈航第" + (index + 1) + "重未通过仍可北行或动作缺失";
        const wrongGate = order[index] === "生" ? "老" : "生";
        passGate.call(scenario.room, scenario.me, wrongGate);
        if (scenario.room.query_temp(scenario.me, "fb/cihang/qiku_index", -1) !== index || state.score !== 0) return "慈航第" + (index + 1) + "重错误门名仍推进进度或授分";
        passGate.call(scenario.room, scenario.me, order[index]);
        if (scenario.room.query_temp(scenario.me, "fb/cihang/qiku_index", -1) !== index + 1
            || scenario.room.on_leave(scenario.me, "north") === false) return "慈航第" + (index + 1) + "重正确门名未开放下一门";
    }
    state = scenario.room.query_fb_state(scenario.me);
    if (!scenario.room.query_temp(scenario.me, "fb/cihang/qiku_done", 0) || state.score !== 20 || !state.milestones["七苦门"]) return "七苦门完整顺序未按20分完成";
    scenario.room.actions["通过七苦"].call(scenario.room, scenario.me, order[6]);
    loadRoom(scenario, gateFiles[0]);
    scenario.room.on_enter(scenario.me);
    if (state.score !== 20 || scenario.room.on_leave(scenario.me, "north") === false
        || scenario.room.query_temp(scenario.me, "fb/cihang/qiku_order", 0).join("/") !== order.join("/")) return "七苦门完成后重复计分或回退重进丢失实例顺序";

    loadRoom(scenario, "fenlu");
    if (scenario.room.exits.south !== "fb/cihang/qikumenu7" || scenario.room.exits.west !== "fb/cihang/langlu"
        || scenario.room.exits.east !== "fb/cihang/qibinglu") return "慈航分路口出口目标不闭合";
    if (scenario.room.on_leave(scenario.me, "west") !== false || scenario.room.on_leave(scenario.me, "east") === false) return "浪子路线未被引导到祁冰云东路";
    loadRoom(scenario, "qibinglu");
    if (scenario.room.exits.west !== "fb/cihang/fenlu" || scenario.room.exits.northwest !== "fb/cihang/jiangdao") return "祁冰云东路出口目标不闭合";
    if (scenario.room.on_leave(scenario.me, "northwest") !== false) return "浪子路线未完成遗书仍可进入拦江岛";
    const spawnedQibingyun = [];
    scenario.room.find_obj_bypath = function (target) { return spawnedQibingyun.find(item => item.path === target); };
    scenario.room.NPC.CLONE = function (target) { return target === "fb/cihang/qibingyun" ? { path: target } : null; };
    scenario.room.item_changed = function (item, isIn) { if (isIn) spawnedQibingyun.push(item); };
    scenario.room.actions["挑战祁冰云"].call(scenario.room, scenario.me);
    scenario.room.actions["挑战祁冰云"].call(scenario.room, scenario.me);
    if (spawnedQibingyun.length !== 1) return "浪子祁冰云东路可重复生成挑战目标";
    spawnedQibingyun.length = 0;
    scenario.room.on_enter(scenario.me);
    scenario.room.on_enter(scenario.me);
    if (spawnedQibingyun.length !== 1) return "浪子重进东路未单次恢复缺失的祁冰云";
    const qibingyun = loadNpcScenario("fb/cihang/qibingyun");
    qibingyun.on_died(scenario.me);
    qibingyun.on_died(scenario.me);
    scenario.room.actions["交付遗书"].call(scenario.room, scenario.me);
    scenario.room.actions["交付遗书"].call(scenario.room, scenario.me);
    if (state.score !== 45 || !state.milestones["祁冰云"] || !state.milestones["遗书"] || scenario.room.on_leave(scenario.me, "northwest") === false) return "浪子祁冰云/遗书阶段未按45分完成并解除东路门禁";

    loadRoom(scenario, "jiangdao");
    attachScenarioSpawns(scenario);
    scenario.room.on_enter(scenario.me);
    if (!scenario.room.find_obj_bypath("fb/cihang/langfanyun")
        || scenario.room.find_obj_bypath("fb/cihang/pangban")) return "浪子进入拦江岛未先单独生成浪翻云";
    const langziLang = loadNpcScenario("fb/cihang/langfanyun", { NPC: scenario.room.NPC });
    langziLang.on_died(scenario.me);
    langziLang.on_died(scenario.me);
    if (state.score !== 60 || !state.milestones["浪翻云"]
        || !scenario.room.find_obj_bypath("fb/cihang/pangban")) return "浪子实际胜过浪翻云后未幂等结算并衔接庞斑";
    for (let count = 0; count < 3; count++) loadNpcScenario("fb/cihang/pangban", { NPC: scenario.room.NPC }).on_died(scenario.me);
    if (state.score !== 85 || !state.milestones["庞斑三命"] || scenario.room.on_leave(scenario.me, "north") === false) return "浪子三命庞斑未完成85分或桃源门禁未开启";
    loadRoom(scenario, "taoyuan");
    scenario.room.actions["领悟"].call(scenario.room, scenario.me);
    if (state.score !== 100) return "浪子石窟领悟后未完成100分";

    const guoshi = loadActionScenario(areaData, "fb/cihang/fenlu", {
        "fb/cihang/route": "国师",
        "fb/cihang/qiku_done": 1,
        diff: 0,
        fb_progress: { score: 20, milestones: { "七苦门": 1 }, route: "国师", failed: false, reason: "" }
    });
    if (guoshi.room.on_leave(guoshi.me, "east") !== false || guoshi.room.on_leave(guoshi.me, "west") === false) return "国师路线未被引导到观云西路";
    loadRoom(guoshi, "langlu");
    if (guoshi.room.exits.east !== "fb/cihang/fenlu" || guoshi.room.exits.northeast !== "fb/cihang/jiangdao") return "观云西路出口目标不闭合";
    if (guoshi.room.on_leave(guoshi.me, "northeast") !== false) return "国师未观战仍可进入拦江岛";
    guoshi.room.actions["观战求突破"].call(guoshi.room, guoshi.me);
    guoshi.room.actions["观战求突破"].call(guoshi.room, guoshi.me);
    if (guoshi.room.query_fb_state(guoshi.me).score !== 30 || guoshi.room.on_leave(guoshi.me, "northeast") === false) return "国师观云西路未幂等结算10分或解除门禁";

    loadRoom(guoshi, "jiangdao");
    attachScenarioSpawns(guoshi, { "fb/cihang/pangban": 1 });
    guoshi.room.actions["比试庞斑"].call(guoshi.room, guoshi.me);
    if (guoshi.room.query_temp(guoshi.me, "fb/cihang/pangban_duel_started", 0)
        || guoshi.room.query_fb_state(guoshi.me).score !== 30) return "国师庞斑克隆失败后提前锁定或授分";
    guoshi.room.actions["比试庞斑"].call(guoshi.room, guoshi.me);
    if (!guoshi.room.find_obj_bypath("fb/cihang/pangban")
        || !guoshi.room.query_temp(guoshi.me, "fb/cihang/pangban_duel_started", 0)) return "国师未成功开启实际庞斑比试";
    const guoshiPangban = loadNpcScenario("fb/cihang/pangban", { NPC: guoshi.room.NPC });
    guoshiPangban.on_died(guoshi.me);
    guoshiPangban.on_died(guoshi.me);
    let guoshiState = guoshi.room.query_fb_state(guoshi.me);
    if (guoshiState.score !== 45 || !guoshiState.milestones["比试庞斑"]
        || !guoshi.room.find_obj_bypath("fb/cihang/langfanyun")) return "国师实际胜过庞斑后未幂等结算15分并衔接浪翻云";
    guoshi.room.actions["完成浪翻云阶段"].call(guoshi.room, guoshi.me);
    if (guoshiState.score !== 45) return "国师仍可通过旧动作直接取得浪翻云40分";
    guoshi.room.remove_jingnian_npcs("fb/cihang/langfanyun");
    guoshi.room.on_enter(guoshi.me);
    if (!guoshi.room.find_obj_bypath("fb/cihang/langfanyun")) return "国师重进拦江岛未恢复浪翻云";
    const guoshiLang = loadNpcScenario("fb/cihang/langfanyun", { NPC: guoshi.room.NPC });
    guoshiLang.on_died(guoshi.me);
    guoshiLang.on_died(guoshi.me);
    if (guoshiState.score !== 85 || !guoshiState.milestones["浪翻云阶段"]
        || guoshi.room.on_leave(guoshi.me, "north") === false) return "国师实际浪翻云战斗未幂等结算40分或解除桃源门禁";
    loadRoom(guoshi, "taoyuan");
    guoshi.room.actions["领悟"].call(guoshi.room, guoshi.me);
    if (guoshiState.score !== 100) return "国师石窟领悟后未完成100分";

    const difficult = loadActionScenario(areaData, "fb/cihang/jiangdao", {
        "fb/cihang/route": "剑魔",
        "fb/cihang/deliver_done": 1,
        diff: 1,
        fb_progress: { score: 30, milestones: { "七苦门": 1, "遗书与挑战": 1 }, route: "剑魔", failed: false, reason: "" }
    });
    if (difficult.room.exits.southwest !== "fb/cihang/langlu" || difficult.room.exits.southeast !== "fb/cihang/qibinglu"
        || difficult.room.exits.north !== "fb/cihang/taoyuan") return "拦江岛左右分支反向出口不闭合";
    const spawned = [];
    const createPangban = () => ({
        path: "fb/cihang/pangban",
        hp: 180000,
        max_hp: 180000,
        mp: 30000,
        max_mp: 30000,
        str: 100,
        con: 100,
        dex: 100,
        int: 100,
        prop: { gj: 5600, mz: 4600, ds: 3500, fy: 4300, zj: 3000 }
    });
    difficult.room.NPC.CLONE = function (target) { return target === "fb/cihang/pangban" ? createPangban() : null; };
    difficult.room.item_changed = function (item, isIn) { if (isIn) spawned.push(item); };
    const firstLife = loadNpcScenario("fb/cihang/pangban", { NPC: difficult.room.NPC });
    const secondLife = loadNpcScenario("fb/cihang/pangban", { NPC: difficult.room.NPC });
    const thirdLife = loadNpcScenario("fb/cihang/pangban", { NPC: difficult.room.NPC });
    firstLife.on_died(difficult.me);
    firstLife.on_died(difficult.me);
    if (difficult.room.query_temp(difficult.me, "fb/cihang/pangban_life", 0) !== 1 || spawned.length !== 1) return "庞斑第一命重复死亡可重复推进或生成阶段";
    if (spawned[0].max_hp !== 270000 || spawned[0].prop.gj !== 6720 || spawned[0].fbDifficultyType !== 1) return "庞斑后续生命未应用困难动态缩放";
    secondLife.on_died(difficult.me);
    secondLife.on_died(difficult.me);
    if (difficult.room.query_temp(difficult.me, "fb/cihang/pangban_life", 0) !== 2 || spawned.length !== 2) return "庞斑第二命重复死亡可重复推进或生成阶段";
    thirdLife.on_died(difficult.me);
    thirdLife.on_died(difficult.me);
    state = difficult.room.query_fb_state(difficult.me);
    if (difficult.room.query_temp(difficult.me, "fb/cihang/pangban_life", 0) !== 3 || spawned.length !== 2 || state.score !== 70 || !state.milestones["庞斑三命"]) return "庞斑第三命未幂等完成剑魔路线里程碑";
    difficult.room.actions["获得剑魔阶段"].call(difficult.room, difficult.me);
    loadRoom(difficult, "taoyuan");
    difficult.room.actions["领悟"].call(difficult.room, difficult.me);
    if (state.score !== 100) return "剑魔路线三命战斗、剑魔阶段和石窟领悟未完成100分";

    const unqualified = loadActionScenario(areaData, "fb/cihang/jiangdao", { "fb/cihang/route": "国师", diff: 0 });
    loadNpcScenario("fb/cihang/pangban", { NPC: difficult.room.NPC }).on_died(unqualified.me);
    if (unqualified.room.query_temp(unqualified.me, "fb/cihang/pangban_duel_done", 0)
        || unqualified.room.query_fb_state(unqualified.me).score !== 0) return "国师未开启比试仍可从庞斑死亡回调授分";

    const magic = loadActionScenario(areaData, "fb/cihang/jiangdao", {
        "fb/cihang/route": "魔师",
        "fb/cihang/longsheng": 1,
        diff: 1,
        fb_progress: { score: 25, milestones: { "七苦门": 1, "长生资格": 1 }, route: "魔师", failed: false, reason: "" }
    });
    attachScenarioSpawns(magic, { "fb/cihang/pangban": 1 });
    magic.room.on_enter(magic.me);
    let magicState = magic.room.query_fb_state(magic.me);
    if (magicState.score !== 25 || magic.room.query_temp(magic.me, "fb/cihang/island_fight", 0)) return "魔师庞斑克隆失败仍提前触发拦江岛战斗15分";
    magic.room.on_enter(magic.me);
    if (magicState.score !== 40 || !magicState.milestones["拦江岛战斗"]
        || !magic.room.find_obj_bypath("fb/cihang/pangban")) return "魔师庞斑成功生成后未触发拦江岛战斗";
    for (let count = 0; count < 3; count++) loadNpcScenario("fb/cihang/pangban", { NPC: magic.room.NPC }).on_died(magic.me);
    if (magicState.score !== 85 || !magicState.milestones["魔师战斗"]
        || magic.room.on_leave(magic.me, "north") === false) return "魔师三命庞斑未幂等完成45分战斗";
    loadRoom(magic, "taoyuan");
    magic.room.actions["领悟"].call(magic.room, magic.me);
    if (magicState.score !== 100) return "魔师石窟领悟后未完成100分";
    return null;
}

function validateZhanshendianScenario(areaData) {
    const starDirections = {
        "角": "northeast", "亢": "northeast", "氐": "east", "房": "east", "心": "east", "尾": "southeast", "箕": "southeast",
        "井": "southwest", "鬼": "southwest", "柳": "south", "星": "south", "张": "south", "翼": "south", "轸": "southeast",
        "奎": "northwest", "娄": "northwest", "胃": "west", "昴": "west", "毕": "west", "觜": "west", "参": "southwest",
        "斗": "northwest", "牛": "northwest", "女": "north", "虚": "north", "危": "north", "室": "northeast", "壁": "north"
    };
    const directionNames = {
        north: "北", northeast: "东北", east: "东", southeast: "东南",
        south: "南", southwest: "西南", west: "西", northwest: "西北"
    };
    const starSequences = [
        ["角", "亢", "氐", "房", "心", "尾", "箕", "井"],
        ["井", "鬼", "柳", "星", "张", "翼", "轸", "奎"],
        ["奎", "娄", "胃", "昴", "毕", "觜", "参", "斗"],
        ["斗", "牛", "女", "虚", "危", "室", "壁", "角"]
    ];
    for (let sequenceIndex = 0; sequenceIndex < starSequences.length; sequenceIndex++) {
        const sequence = starSequences[sequenceIndex];
        const stars = loadActionScenario(areaData, "fb/zhanshendian/xingsu", {
            diff: 0,
            "fb/zhanshendian/star_sequence": sequence
        });
        const answer = sequence.map(star => starDirections[star]);
        const press = stars.room.actions["点按石板"];
        const firstWrong = answer[0] === "north" ? "south" : "north";
        press.call(stars.room, stars.me, firstWrong);
        let starState = stars.room.query_fb_state(stars.me);
        if (starState.score !== 0 || stars.room.query_temp(stars.me, "fb/zhanshendian/star_progress", -1) !== 0 || stars.room.query_temp(stars.me, "fb/zhanshendian/solved", 0)) return "错误星宿方位仍推进石板";
        if (stars.room.on_leave(stars.me, "north") !== false) return "星宿石板未解开仍可北行";
        press.call(stars.room, stars.me, answer[0]);
        press.call(stars.room, stars.me, directionNames[answer[1]]);
        const thirdWrong = answer[2] === "west" ? "east" : "west";
        press.call(stars.room, stars.me, thirdWrong);
        if (stars.room.query_temp(stars.me, "fb/zhanshendian/star_progress", -1) !== 0) return "星宿中途点错未清空当前八板进度";
        for (let index = 0; index < answer.length; index++) {
            press.call(stars.room, stars.me, index % 2 ? directionNames[answer[index]] : answer[index]);
        }
        press.call(stars.room, stars.me, answer[0]);
        starState = stars.room.query_fb_state(stars.me);
        if (starState.score !== 20 || !starState.milestones["星宿八卦"] || stars.room.query_temp(stars.me, "fb/zhanshendian/star_progress", 0) !== 8 || stars.room.on_leave(stars.me, "north") === false) return "二十八宿四组逐板映射未唯一解开或可重复计分";
    }

    const generatedStars = loadActionScenario(areaData, "fb/zhanshendian/xingsu", { diff: 1 });
    const generatedSequence = generatedStars.room.query_star_sequence(generatedStars.me);
    if (generatedSequence.length !== 8 || new Set(generatedSequence).size !== 8 || generatedStars.room.query_star_sequence(generatedStars.me).join("") !== generatedSequence.join("")) return "星宿题未按实例生成八个不重复且可恢复的星宿";

    const guxingDirections = ["east", "south", "west", "north"];
    for (let index = 0; index < guxingDirections.length; index++) {
        const diff = index % 2;
        const direction = guxingDirections[index];
        const guxing = loadActionScenario(areaData, "fb/zhanshendian/guxing", {
            diff,
            "fb/zhanshendian/guxing": direction
        });
        guxing.room.owner = "copy";
        guxing.context.ROOM.Get = function (targetPath) { return { copy_rooms: { copy: { path: targetPath } } }; };
        guxing.me.moveto = function (target) { this.movedTo = target; };
        const wrongDirection = guxingDirections[(index + 1) % guxingDirections.length];
        guxing.room.actions["跃入孤星"].call(guxing.room, guxing.me, wrongDirection);
        let guxingState = guxing.room.query_fb_state(guxing.me);
        if (guxingState.score !== 0 || guxing.me.movedTo) return "孤星错误方向仍计分或移动";
        guxing.room.actions["跃入孤星"].call(guxing.room, guxing.me, direction);
        guxingState = guxing.room.query_fb_state(guxing.me);
        const expectedScore = diff === 1 ? 5 : 10;
        const expectedTarget = diff === 1 ? "fb/zhanshendian/shendian" : "fb/zhanshendian/mufeng";
        if (guxingState.score !== expectedScore || !guxingState.milestones["孤星"] || !guxing.me.movedTo || guxing.me.movedTo.path !== expectedTarget) return "孤星正确方向未按模式结算或移动";
    }

    const elements = loadActionScenario(areaData, "fb/zhanshendian/elements", { diff: 1 });
    const embed = elements.room.actions["嵌入圆盘"];
    if (elements.room.actions["取得元素石"]) return "四元素石仍可在圆盘房直接领取";
    if (elements.room.on_leave(elements.me, "north") !== false) return "四元素圆盘未开启仍可北行";
    embed.call(elements.room, elements.me);
    if (elements.room.query_temp(elements.me, "fb/zhanshendian/embedded", 0)) return "四元素石未集齐仍可嵌入圆盘";
    const elementSources = [
        ["molong", "水石"],
        ["jinbishou", "金石"],
        ["huoni", "火石"],
        ["mufeng", "木石"]
    ];
    for (const [npcPath, key] of elementSources) {
        const source = loadNpcScenario("fb/zhanshendian/" + npcPath);
        source.on_died(elements.me);
        source.on_died(elements.me);
        if (!elements.room.query_temp(elements.me, "fb/zhanshendian/element_" + key, 0)) return key + "未由对应元素守卫写入实例状态";
    }
    const before = elements.room.query_fb_state(elements.me).score;
    embed.call(elements.room, elements.me);
    embed.call(elements.room, elements.me);
    let state = elements.room.query_fb_state(elements.me);
    if (before !== 20 || state.score !== 25 || elementSources.some(([, key]) => !state.milestones[key]) || !state.milestones["圆盘"] || elements.room.on_leave(elements.me, "north") === false) return "四元素守卫、圆盘幂等计分或门禁异常";

    const normalElements = loadActionScenario(areaData, "fb/zhanshendian/elements", { diff: 0 });
    for (const [npcPath] of elementSources) loadNpcScenario("fb/zhanshendian/" + npcPath).on_died(normalElements.me);
    state = normalElements.room.query_fb_state(normalElements.me);
    if (state.milestones["水石"] || state.milestones["金石"] || state.milestones["火石"] || state.milestones["木石"] || normalElements.room.query_temp(normalElements.me, "fb/zhanshendian/element_水石", 0)) return "普通路线错误取得困难元素石";

    const waveNames = ["一", "二", "三"];
    for (let waveNumber = 1; waveNumber <= 3; waveNumber++) {
        const required = waveNumber === 3 ? 8 : 5;
        const milestone = "守卫" + waveNames[waveNumber - 1];
        for (const [diff, finishedAt, expectedScore] of [[0, 121000, 10], [1, 61000, 5]]) {
            let now = finishedAt;
            const wave = loadActionScenario(areaData, "fb/zhanshendian/guard" + waveNumber, {
                diff,
                ["fb/zhanshendian/guard_start_" + waveNumber]: 1000
            });
            wave.room.path = "fb/zhanshendian/guard" + waveNumber;
            const createGuard = () => loadNpcScenario("fb/zhanshendian/guard", { Date: { now() { return now; } } });
            const firstGuard = createGuard();
            firstGuard.on_died(wave.me);
            firstGuard.on_died(wave.me);
            if (wave.room.query_temp(wave.me, "fb/zhanshendian/guard_count_" + waveNumber, 0) !== 1) return "第" + waveNames[waveNumber - 1] + "波同一守卫重复死亡仍推进计数";
            for (let count = 1; count < required; count++) createGuard().on_died(wave.me);
            state = wave.room.query_fb_state(wave.me);
            if (state.score !== expectedScore || !state.milestones[milestone] || !wave.room.query_temp(wave.me, "fb/zhanshendian/guard_done_" + waveNumber, 0)) return "第" + waveNames[waveNumber - 1] + "波未在模式时限边界幂等完成";
            now = 200000;
            firstGuard.on_died(wave.me);
            createGuard().on_died(wave.me);
            if (state.failed || wave.room.query_temp(wave.me, "fb/zhanshendian/guard_count_" + waveNumber, 0) !== required) return "第" + waveNames[waveNumber - 1] + "波完成后迟到回调反向触发失败或继续计数";
        }

        let now = 61001;
        const overtime = loadActionScenario(areaData, "fb/zhanshendian/guard" + waveNumber, {
            diff: 1,
            ["fb/zhanshendian/guard_start_" + waveNumber]: 1000
        });
        overtime.room.path = "fb/zhanshendian/guard" + waveNumber;
        for (let count = 0; count < required; count++) {
            const guard = loadNpcScenario("fb/zhanshendian/guard", { Date: { now() { return now; } } });
            guard.on_died(overtime.me);
        }
        state = overtime.room.query_fb_state(overtime.me);
        if (!state.failed || state.score !== 0 || state.milestones[milestone]) return "第" + waveNames[waveNumber - 1] + "波困难超时仍授分或未立即失败";
    }

    const normal = loadActionScenario(areaData, "fb/zhanshendian/molong", { diff: 0 });
    normal.room.owner = "copy";
    normal.room.items = [];
    normal.room.find_obj_bypath = function (target) { return this.items.find(item => item.path === target); };
    normal.room.item_changed = function (item, isIn) { if (isIn && !this.items.includes(item)) this.items.push(item); };
    const dragon = {
        path: "fb/zhanshendian/molong",
        faint: false,
        attacked: [],
        query_status(id) { return id === "faint" && this.faint ? 1 : 0; },
        do_kill(target) { this.attacked.push(target); }
    };
    let dragonSpawns = 0;
    normal.room.NPC.CLONE = function (target) {
        if (target !== "fb/zhanshendian/molong") return null;
        dragonSpawns++;
        return dragon;
    };
    const finishTarget = { path: "fb/zhanshendian/finish" };
    normal.context.ROOM.Get = function () { return { copy_rooms: { copy: finishTarget } }; };
    normal.me.name = "测试者";
    normal.me.moveto = function (target) { this.movedTo = target; };
    const woodPhoenix = loadNpcScenario("fb/zhanshendian/mufeng");
    woodPhoenix.on_died(normal.me);
    woodPhoenix.on_died(normal.me);
    let normalState = normal.room.query_fb_state(normal.me);
    if (normalState.score !== 15 || !normalState.milestones["木凤"] || !normal.room.query_temp(normal.me, "fb/zhanshendian/bird_nest", 0)) return "普通木凤未幂等授予鸟窝状态";

    const normalDragonNpc = loadNpcScenario("fb/zhanshendian/molong");
    normalDragonNpc.environment = normal.room;
    if (normalDragonNpc.on_die(normal.me) !== false) return "普通魔龙未骑乘前仍可被直接击杀";
    const dive = normal.room.actions["潜入深潭"];
    dive.call(normal.room, normal.me);
    dive.call(normal.room, normal.me);
    if (dragonSpawns !== 0 || normal.room.query_temp(normal.me, "fb/zhanshendian/dive", 0) !== 2) return "普通魔龙不足三次潜水仍提前出现";
    dive.call(normal.room, normal.me);
    normal.room.on_enter(normal.me);
    if (dragonSpawns !== 1 || dragon.attacked.length !== 1 || dragon.attacked[0] !== normal.me) return "普通魔龙第三次潜水未单次出现并主动攻击";
    if (normal.room.on_leave(normal.me, "north") !== false) return "普通魔龙未骑乘仍可抵达暗河岸边";
    const mount = normal.room.actions["骑上魔龙"];
    mount.call(normal.room, normal.me);
    normalState = normal.room.query_fb_state(normal.me);
    if (normalState.score !== 15 || normal.room.query_temp(normal.me, "fb/zhanshendian/molong_ridden", 0) || normal.me.movedTo) return "普通魔龙未昏迷仍可骑乘";
    dragon.faint = true;
    mount.call(normal.room, normal.me);
    mount.call(normal.room, normal.me);
    normalState = normal.room.query_fb_state(normal.me);
    if (normalState.score !== 30 || !normalState.milestones["魔龙"] || !normal.room.query_temp(normal.me, "fb/zhanshendian/molong_ridden", 0) || normal.me.movedTo !== finishTarget || normal.room.on_leave(normal.me, "north") === false) return "普通魔龙昏迷骑乘未幂等结算或移动";
    if (normalDragonNpc.on_die(normal.me) === false) return "普通魔龙完成骑乘后仍被阻止结算死亡";

    const finish = loadActionScenario(areaData, "fb/zhanshendian/finish", {
        diff: 0,
        "fb/zhanshendian/bird_nest": 1,
        "fb/zhanshendian/molong_ridden": 1,
        fb_progress: {
            score: 30,
            milestones: { "木凤": 1, "魔龙": 1 },
            route: null,
            failed: false,
            reason: ""
        }
    });
    const ride = finish.room.actions["骑龙渡河"];
    ride.call(finish.room, finish.me);
    if (finish.room.query_fb_state(finish.me).score !== 30) return "未穿戴鸟窝仍可完成渡河";
    finish.room.actions["穿戴鸟窝"].call(finish.room, finish.me);
    finish.room.actions["穿戴鸟窝"].call(finish.room, finish.me);
    ride.call(finish.room, finish.me);
    ride.call(finish.room, finish.me);
    state = finish.room.query_fb_state(finish.me);
    if (state.score !== 40 || !state.milestones["完成剧情"] || !finish.room.query_temp(finish.me, "fb/zhanshendian/bird_nest_worn", 0)) return "鸟窝穿戴和骑龙渡河未幂等结算";

    const difficultFinish = loadActionScenario(areaData, "fb/zhanshendian/finish", { diff: 1 });
    difficultFinish.room.actions["骑龙渡河"].call(difficultFinish.room, difficultFinish.me);
    if (difficultFinish.room.query_fb_state(difficultFinish.me).score !== 0) return "困难路线错误结算普通骑龙终局";

    const shrine = loadActionScenario(areaData, "fb/zhanshendian/shendian", { diff: 1 });
    if (shrine.room.on_leave(shrine.me, "north") !== false) return "困难路线未祭拜仍可进入元素窟";
    shrine.room.actions["祭拜"].call(shrine.room, shrine.me);
    shrine.room.actions["祭拜"].call(shrine.room, shrine.me);
    state = shrine.room.query_fb_state(shrine.me);
    if (state.score !== 5 || !state.milestones["祭拜"] || shrine.room.on_leave(shrine.me, "north") === false) return "困难祭拜未幂等结算或开启门禁";

    const souls = loadActionScenario(areaData, "fb/zhanshendian/souls", { diff: 1 });
    if (souls.room.on_leave(souls.me, "north") !== false) return "三魂未聚齐仍可进入刀皇殿";
    for (const npcPath of ["jianhun", "zhanhun", "bingzhuhun"]) {
        const soul = loadNpcScenario("fb/zhanshendian/" + npcPath);
        soul.on_died(souls.me);
        soul.on_died(souls.me);
    }
    state = souls.room.query_fb_state(souls.me);
    if (state.score !== 15 || ["剑魂", "战魂", "兵主魂"].some(key => !state.milestones[key]) || souls.room.on_leave(souls.me, "north") === false) return "三魂死亡结算或门禁异常";

    const bladeEmperor = loadActionScenario(areaData, "fb/zhanshendian/daohuang", { diff: 1 });
    if (bladeEmperor.room.on_leave(bladeEmperor.me, "north") !== false) return "刀皇存活仍可进入蚩尤殿";
    const spawnedBladeEmperors = [];
    bladeEmperor.room.NPC.CLONE = function (target) {
        if (target !== "fb/zhanshendian/daohuang") return null;
        return {
            path: target,
            hp: 100,
            max_hp: 100,
            mp: 100,
            max_mp: 100,
            str: 100,
            con: 100,
            dex: 100,
            int: 100,
            prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 }
        };
    };
    bladeEmperor.room.item_changed = function (item, isIn) { if (isIn) spawnedBladeEmperors.push(item); };
    const firstBladeEmperor = loadNpcScenario("fb/zhanshendian/daohuang", { NPC: bladeEmperor.room.NPC });
    firstBladeEmperor.on_died(bladeEmperor.me);
    firstBladeEmperor.on_died(bladeEmperor.me);
    state = bladeEmperor.room.query_fb_state(bladeEmperor.me);
    if (state.score !== 0 || state.milestones["刀皇"] || bladeEmperor.room.query_temp(bladeEmperor.me, "fb/zhanshendian/daohuang_life", 0) !== 1 || spawnedBladeEmperors.length !== 1) return "刀皇第一命重复推进、提前结算或未生成第二命";
    if (spawnedBladeEmperors[0].max_hp !== 150 || spawnedBladeEmperors[0].max_mp !== 120 || spawnedBladeEmperors[0].prop.gj !== 120 || spawnedBladeEmperors[0].fbDifficultyType !== 1) return "刀皇第二命未继承困难动态缩放";
    if (bladeEmperor.room.on_leave(bladeEmperor.me, "north") !== false) return "刀皇第一命后仍可进入蚩尤殿";
    const secondBladeEmperor = loadNpcScenario("fb/zhanshendian/daohuang", { NPC: bladeEmperor.room.NPC });
    secondBladeEmperor.on_died(bladeEmperor.me);
    secondBladeEmperor.on_died(bladeEmperor.me);
    state = bladeEmperor.room.query_fb_state(bladeEmperor.me);
    if (state.score !== 10 || !state.milestones["刀皇"] || bladeEmperor.room.query_temp(bladeEmperor.me, "fb/zhanshendian/daohuang_life", 0) !== 2 || !bladeEmperor.room.query_temp(bladeEmperor.me, "fb/zhanshendian/daohuang_done", 0)) return "刀皇第二命未幂等结算";
    if (spawnedBladeEmperors.length !== 1 || bladeEmperor.room.on_leave(bladeEmperor.me, "north") === false) return "刀皇完成后重复生成或门禁未开启";

    const recoveredBladeEmperor = loadActionScenario(areaData, "fb/zhanshendian/daohuang", {
        diff: 1,
        "fb/zhanshendian/daohuang_life": 1
    });
    const recoveredSpawns = [];
    recoveredBladeEmperor.room.find_obj_bypath = function (target) { return recoveredSpawns.find(item => item.path === target); };
    recoveredBladeEmperor.room.NPC.CLONE = bladeEmperor.room.NPC.CLONE;
    recoveredBladeEmperor.room.item_changed = function (item, isIn) { if (isIn) recoveredSpawns.push(item); };
    recoveredBladeEmperor.room.on_enter(recoveredBladeEmperor.me);
    recoveredBladeEmperor.room.on_enter(recoveredBladeEmperor.me);
    if (recoveredSpawns.length !== 1 || recoveredSpawns[0].fbDifficultyType !== 1) return "刀皇第二命离房恢复时未单次生成并应用困难缩放";

    const normalBladeEmperor = loadActionScenario(areaData, "fb/zhanshendian/daohuang", { diff: 0 });
    loadNpcScenario("fb/zhanshendian/daohuang", { NPC: normalBladeEmperor.room.NPC }).on_died(normalBladeEmperor.me);
    if (normalBladeEmperor.room.query_fb_state(normalBladeEmperor.me).score !== 0 || normalBladeEmperor.room.query_temp(normalBladeEmperor.me, "fb/zhanshendian/daohuang_life", 0)) return "普通路线错误推进刀皇双命";

    const chiyou = loadActionScenario(areaData, "fb/zhanshendian/chiyou_room", { diff: 1 });
    if (chiyou.room.on_leave(chiyou.me, "north") !== false) return "蚩尤死亡前仍可进入九重天";
    let chiyouKillCalls = 0;
    const chiyouNpc = loadNpcScenario("fb/zhanshendian/chiyou", {
        do_kill() { chiyouKillCalls++; }
    });
    chiyouNpc.environment = chiyou.room;
    chiyou.room.find_obj_bypath = function (target) { return target === "fb/zhanshendian/chiyou" ? chiyouNpc : null; };
    chiyou.me.hp = 20000000;
    chiyou.me.max_hp = 20000000;
    chiyou.me.diff_sh_per = 60;
    chiyou.me.damage = function (raw) {
        const actual = Math.floor(raw * (100 - this.diff_sh_per) / 100);
        this.hp -= actual;
        return actual;
    };
    chiyou.room.on_enter(chiyou.me);
    chiyou.room.on_enter(chiyou.me);
    if (chiyou.me.hp !== 15200000 || chiyouKillCalls !== 2 || !chiyou.room.query_temp(chiyou.me, "fb/zhanshendian/chiyou_roar", 0)) return "蚩尤1200万原始吼击未按60%免伤结算或重复触发";
    chiyouNpc.on_died(chiyou.me);
    chiyouNpc.on_died(chiyou.me);
    state = chiyou.room.query_fb_state(chiyou.me);
    if (state.score !== 10 || !state.milestones["蚩尤"] || chiyou.room.on_leave(chiyou.me, "north") === false) return "蚩尤死亡结算或九重天门禁异常";

    const rawRoar = loadActionScenario(areaData, "fb/zhanshendian/chiyou_room", { diff: 1 });
    let rawKillCalls = 0;
    const rawChiyou = loadNpcScenario("fb/zhanshendian/chiyou", {
        do_kill() { rawKillCalls++; }
    });
    rawChiyou.environment = rawRoar.room;
    rawRoar.me.hp = 20000000;
    rawRoar.me.max_hp = 20000000;
    rawRoar.me.damage = function (raw) { this.hp -= raw; return raw; };
    rawChiyou.do_kill(rawRoar.me);
    rawChiyou.do_kill(rawRoar.me);
    if (rawRoar.me.hp !== 8000000 || rawKillCalls !== 2) return "蚩尤无免伤原始吼击数值或单次触发异常";

    const normalChiyou = loadActionScenario(areaData, "fb/zhanshendian/chiyou_room", { diff: 0 });
    let normalKillCalls = 0;
    const isolatedChiyou = loadNpcScenario("fb/zhanshendian/chiyou", {
        do_kill() { normalKillCalls++; }
    });
    isolatedChiyou.environment = normalChiyou.room;
    normalChiyou.me.hp = 20000000;
    normalChiyou.me.damage = function (raw) { this.hp -= raw; return raw; };
    isolatedChiyou.do_kill(normalChiyou.me);
    if (normalChiyou.me.hp !== 20000000 || normalKillCalls !== 1 || normalChiyou.room.query_temp(normalChiyou.me, "fb/zhanshendian/chiyou_roar", 0)) return "普通模式错误触发蚩尤困难吼击";

    const missingFourthSoul = loadActionScenario(areaData, "fb/zhanshendian/jiuzhong", {
        diff: 1,
        fb_progress: {
            score: 15,
            milestones: { "剑魂": 1, "战魂": 1, "兵主魂": 1 },
            route: null,
            failed: false,
            reason: ""
        }
    });
    missingFourthSoul.me.skills = {};
    missingFourthSoul.room.actions["踏上一重"].call(missingFourthSoul.room, missingFourthSoul.me);
    if (missingFourthSoul.room.query_temp(missingFourthSoul.me, "fb/zhanshendian/heaven", 0) !== 0) return "缺少刀皇第四魂仍通过第一重";

    const heaven = loadActionScenario(areaData, "fb/zhanshendian/jiuzhong", {
        diff: 1,
        fb_progress: {
            score: 95,
            milestones: { "剑魂": 1, "战魂": 1, "兵主魂": 1, "刀皇": 1 },
            route: null,
            failed: false,
            reason: ""
        }
    });
    heaven.me.skills = {};
    heaven.me.query_skill = function (id, def) { return this.skills[id] === undefined ? (def || 0) : this.skills[id]; };
    heaven.me.max_mp = 10000000;
    heaven.me.mp = 10000000;
    heaven.me.add_mp = function (value) { this.mp = Math.max(0, Math.min(this.max_mp, this.mp + value)); };
    const skillDefinitions = {};
    heaven.room.SKILL.get = function (id) { return skillDefinitions[id] || null; };
    const ascend = heaven.room.actions["踏上一重"];

    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 1) return "聚齐四魂仍无法通过第一重";
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 1) return "未领悟长生诀仍通过第二重";
    heaven.me.skills.changshengjue = 1;
    ascend.call(heaven.room, heaven.me);
    ascend.call(heaven.room, heaven.me, "生门");
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 2) return "第三重错误生死门仍可通过";
    ascend.call(heaven.room, heaven.me, "死门");

    heaven.me.max_mp = 9999999;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 3 || heaven.me.mp !== 10000000) return "最大内力差一仍通过第四重或被扣除";
    heaven.me.max_mp = 10000000;
    heaven.me.mp = 9999999;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 3 || heaven.me.mp !== 9999999) return "当前内力差一仍通过第四重或被扣除";
    heaven.me.mp = 10000000;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 4 || heaven.me.mp !== 0) return "恰好一千万内力未通过第四重或未准确扣除";
    ascend.call(heaven.room, heaven.me, "乱心");
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 4 || heaven.me.mp !== 0) return "第五重失败重复扣除第四重内力";
    ascend.call(heaven.room, heaven.me, "守心");

    const aboveMp = loadActionScenario(areaData, "fb/zhanshendian/jiuzhong", {
        diff: 1,
        "fb/zhanshendian/heaven": 3
    });
    aboveMp.me.max_mp = 10000001;
    aboveMp.me.mp = 10000001;
    aboveMp.me.add_mp = heaven.me.add_mp;
    aboveMp.room.actions["踏上一重"].call(aboveMp.room, aboveMp.me);
    if (aboveMp.room.query_temp(aboveMp.me, "fb/zhanshendian/heaven", 0) !== 4 || aboveMp.me.mp !== 1) return "超过一千万内力未按边界扣除";

    skillDefinitions.forceSkill = { grade: 3, can_enables: ["force"] };
    heaven.me.skills.forceSkill = 5001;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 5) return "品质3武学错误通过第六重";
    skillDefinitions.forceSkill.grade = 4;
    heaven.me.skills.forceSkill = 4999;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 5) return "4999级红色内功错误通过第六重";
    heaven.me.skills.forceSkill = 5000;
    ascend.call(heaven.room, heaven.me);

    skillDefinitions.dodgeSkill = { grade: 5, can_enables: ["dodge"] };
    heaven.me.skills.dodgeSkill = 4999;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 6) return "4999级品质5轻功错误通过第七重";
    heaven.me.skills.dodgeSkill = 5000;
    ascend.call(heaven.room, heaven.me);

    skillDefinitions.parrySkill = { query_grade(player) { return player === heaven.me ? 4 : 0; }, can_enables: ["parry"] };
    heaven.me.skills.parrySkill = 4999;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 7) return "4999级动态品质招架错误通过第八重";
    heaven.me.skills.parrySkill = 5000;
    ascend.call(heaven.room, heaven.me);

    skillDefinitions.swordSkill = { grade: 4, can_enables: ["sword"] };
    skillDefinitions.bladeSkill = { grade: 4, can_enables: ["blade"] };
    heaven.me.skills.swordSkill = 5000;
    heaven.me.skills.bladeSkill = 4999;
    ascend.call(heaven.room, heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 8) return "不足五项五千级红色武学仍通过第九重";
    heaven.me.skills.bladeSkill = 5000;
    ascend.call(heaven.room, heaven.me);
    state = heaven.room.query_fb_state(heaven.me);
    if (heaven.room.query_temp(heaven.me, "fb/zhanshendian/heaven", 0) !== 9 || state.score !== 100 || !state.milestones["踏九重天"] || heaven.room.query_red_skills(heaven.me).length !== 5) return "五项红色武学未完成第九重或结算异常";
    ascend.call(heaven.room, heaven.me);
    if (state.score !== 100 || heaven.me.mp !== 0) return "九重完成后仍可重复结算或扣除内力";
    return null;
}

function validateTaohuadaoScenario(areaData) {
    const layouts = [
        [8, 1, 6, 3, 5, 7, 4, 9, 2],
        [6, 1, 8, 7, 5, 3, 2, 9, 4],
        [4, 3, 8, 9, 5, 1, 2, 7, 6],
        [2, 7, 6, 9, 5, 1, 4, 3, 8],
        [4, 9, 2, 3, 5, 7, 8, 1, 6],
        [2, 9, 4, 7, 5, 3, 6, 1, 8],
        [8, 3, 4, 1, 5, 9, 6, 7, 2],
        [6, 7, 2, 1, 5, 9, 8, 3, 4]
    ];
    const positions = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ];
    const directionNames = ["向北走", "向东北走", "向东走", "向东南走", "向南走", "向西南走", "向西走", "向西北走"];
    const direction = (fromIndex, toIndex) => {
        const dx = Math.sign(positions[toIndex][0] - positions[fromIndex][0]);
        const dy = Math.sign(positions[toIndex][1] - positions[fromIndex][1]);
        return ({
            "0,-1": "north", "1,-1": "northeast", "1,0": "east", "1,1": "southeast",
            "0,1": "south", "-1,1": "southwest", "-1,0": "west", "-1,-1": "northwest"
        })[dx + "," + dy];
    };
    const expectedPositions = [
        [0, -3], [1, -3], [2, -3],
        [0, -2], [1, -2], [2, -2],
        [0, -1], [1, -1], [2, -1]
    ];
    const mazeRooms = (areaData.map || []).filter(item => /^fb\/taohuadao\/maze[1-9]$/.test(item.id));
    if (mazeRooms.length !== 9) return "桃花岛 AREA 地图未完整显示九个桃花林房间";
    for (let index = 0; index < expectedPositions.length; index++) {
        const room = mazeRooms.find(item => item.id === "fb/taohuadao/maze" + (index + 1));
        if (!room || room.p[0] !== expectedPositions[index][0] || room.p[1] !== expectedPositions[index][1]) return "桃花阵九宫房间未按3×3地图排列";
        const actionScenario = loadActionScenario(areaData, "fb/taohuadao/maze" + (index + 1), {
            diff: 0,
            "fb/taohuadao/maze_layout": 1,
            "fb/taohuadao/maze_step": 1
        });
        if (directionNames.some(name => typeof actionScenario.room.actions[name] !== "function")) return "桃花阵房间缺少八方向点击按钮";
    }

    const completeMaze = (scenario, layout) => {
        for (let number = 1; number < 9; number++) {
            const currentIndex = layout.indexOf(number);
            const targetIndex = layout.indexOf(number + 1);
            scenario.room.walk_taohua_maze(scenario.me, currentIndex, direction(currentIndex, targetIndex));
        }
        const ninthIndex = layout.indexOf(9);
        scenario.room.walk_taohua_maze(scenario.me, ninthIndex, direction(layout.indexOf(8), ninthIndex));
    };
    for (let layoutIndex = 0; layoutIndex < layouts.length; layoutIndex++) {
        const scenario = loadActionScenario(areaData, "fb/taohuadao/entry", { diff: 0 });
        scenario.me.random = function () { return layoutIndex; };
        scenario.room.move_taohua_player = function (me, targetPath) { this.lastMove = targetPath; return true; };
        scenario.room.actions["进入桃花林"].call(scenario.room, scenario.me);
        const layout = layouts[layoutIndex];
        const startIndex = layout.indexOf(1);
        if (scenario.room.lastMove !== "fb/taohuadao/maze" + (startIndex + 1)) return "桃花阵未从一棵桃树所在房间开始";
        const expectedFirst = direction(startIndex, layout.indexOf(2));
        const wrongDirection = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"].find(item => item !== expectedFirst);
        scenario.room.walk_taohua_maze(scenario.me, startIndex, wrongDirection);
        if (scenario.room.query_temp(scenario.me, "fb/taohuadao/maze_step", 0) !== 1
            || scenario.room.lastMove !== "fb/taohuadao/maze" + (startIndex + 1)) return "桃花阵走错后未回到数字一房间";
        completeMaze(scenario, layout);
        const state = scenario.room.query_fb_state(scenario.me);
        if (state.score !== 15 || !state.milestones["破阵一"] || scenario.room.lastMove !== "fb/taohuadao/taolin_exit") return "桃花阵八种布局存在不可解路径";
    }

    const second = loadActionScenario(areaData, "fb/taohuadao/entry", { diff: 0, "fb/taohuadao/need_box": 1 });
    second.me.random = function () { return 4; };
    second.room.move_taohua_player = function (me, targetPath) { this.lastMove = targetPath; return true; };
    second.room.actions["进入桃花林"].call(second.room, second.me);
    completeMaze(second, layouts[4]);
    let state = second.room.query_fb_state(second.me);
    if (state.score !== 30 || !state.milestones["回报黄蓉"] || !state.milestones["破阵二"] || second.room.lastMove !== "fb/taohuadao/zhou2") return "桃花岛第二次破阵未通往周伯通山洞";

    const difficult = loadActionScenario(areaData, "fb/taohuadao/entry", { diff: 1 });
    difficult.me.random = function () { return 7; };
    difficult.room.move_taohua_player = function (me, targetPath) { this.lastMove = targetPath; return true; };
    difficult.room.actions["进入桃花林"].call(difficult.room, difficult.me);
    completeMaze(difficult, layouts[7]);
    state = difficult.room.query_fb_state(difficult.me);
    if (state.score !== 25 || !state.milestones["破阵一"] || difficult.room.lastMove !== "fb/taohuadao/huangrong1") return "桃花岛困难破阵未通往黄药师卧室";
    return null;
}

function validateBaituoScenario(areaData) {
    const scenario = loadActionScenario(areaData, "fb/baituo/exit", { diff: 0 });
    const teammate = Object.assign({}, scenario.me, { query_teamid() { return "team"; } });
    teammate.environment = scenario.room;
    const milestones = [
        ["fb/baituo/ouyangfeng", 25],
        ["fb/baituo/baiyushaonu", 15],
        ["fb/baituo/dushe1", 15],
        ["fb/baituo/dushe2", 15],
        ["fb/baituo/guamang", 30]
    ];
    for (let index = 0; index < milestones.length; index++) {
        const npc = loadNpcScenario(milestones[index][0]);
        npc.on_died(index % 2 ? teammate : scenario.me);
    }
    const state = scenario.room.query_fb_state(scenario.me);
    if (state !== scenario.room.query_fb_state(teammate) || state.score !== 100) return "白驼山五名目标未在组队实例中共享完成100分";
    loadNpcScenario("fb/baituo/guamang").on_died(teammate);
    if (state.score !== 100) return "白驼山重复目标死亡可重复计分";
    return null;
}

function validateXingxiuScenario(areaData) {
    const scenario = loadActionScenario(areaData, "fb/xingxiu/shihouzi", { diff: 0 });
    let hasGuard = true;
    scenario.room.find_obj_bypath = function (target) { return hasGuard && target === "fb/xingxiu/shihouzi" ? {} : null; };
    if (scenario.room.on_leave(scenario.me, "north") !== false) return "狮吼子存活时仍可进入日月洞";
    loadNpcScenario("fb/xingxiu/shihouzi").on_died(scenario.me);
    hasGuard = false;
    if (scenario.room.on_leave(scenario.me, "north") === false) return "狮吼子死亡后仍不可进入日月洞";
    loadNpcScenario("fb/xingxiu/dingchunqiu").on_died(scenario.me);
    const state = scenario.room.query_fb_state(scenario.me);
    if (state.score !== 100) return "星宿海狮吼子与丁春秋未完成100分";
    return null;
}

function grantBinghuoFrontline(scenario) {
    for (const path of ["yanlong1", "yanlong2", "yanlongwang", "baixiong1", "baixiong2"]) loadNpcScenario("fb/binghuo/" + path).on_died(scenario.me);
}

function validateBinghuoScenario(areaData) {
    const normal = loadActionScenario(areaData, "fb/binghuo/central", { diff: 0 });
    if (normal.room.on_leave(normal.me, "north") !== false) return "冰火岛前置五项目标未完成仍可进入谢逊石洞";
    grantBinghuoFrontline(normal);
    if (normal.room.on_leave(normal.me, "north") === false) return "冰火岛前置五项目标完成后仍无法进入谢逊石洞";
    let normalSpawns = 0;
    const normalXiexun = loadNpcScenario("fb/binghuo/xiexun", { NPC: { CLONE() { normalSpawns++; return {}; } } });
    normalXiexun.on_died(normal.me);
    let state = normal.room.query_fb_state(normal.me);
    if (state.score !== 100 || normalSpawns !== 0) return "冰火岛普通谢逊死亡后错误生成张五侠或未完成100分";

    const difficult = loadActionScenario(areaData, "fb/binghuo/shixun", { diff: 1 });
    grantBinghuoFrontline(difficult);
    let spawned = null;
    let spawnCount = 0;
    let zhangCloneAttempts = 0;
    difficult.room.find_obj_bypath = function (target) { return target === "fb/binghuo/zhangwuxia" ? spawned : null; };
    difficult.room.item_changed = function (item, isIn) { if (isIn) { spawned = item; spawnCount++; } };
    difficult.me.send_room = function () {};
    difficult.room.NPC.CLONE = function () {
        zhangCloneAttempts++;
        if (zhangCloneAttempts === 1) return null;
        return { path: "fb/binghuo/zhangwuxia", hp: 100, max_hp: 100, mp: 100, max_mp: 100, prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 } };
    };
    const difficultXiexun = loadNpcScenario("fb/binghuo/xiexun");
    difficultXiexun.on_died(difficult.me);
    let difficultState = difficult.room.query_fb_state(difficult.me);
    if (difficultState.score !== 85 || spawnCount !== 0 || spawned) return "冰火岛困难谢逊克隆失败后错误锁定张五侠或提前生成";
    difficult.room.on_enter(difficult.me);
    difficultXiexun.on_died(difficult.me);
    difficultState = difficult.room.query_fb_state(difficult.me);
    if (difficultState.score !== 85 || spawnCount !== 1 || !spawned || zhangCloneAttempts !== 2) return "冰火岛困难谢逊重进后未按顺序且幂等生成张五侠";
    loadNpcScenario("fb/binghuo/zhangwuxia").on_died(difficult.me);
    if (state.score !== 100) return "冰火岛困难张五侠死亡后未完成100分";
    return null;
}

function validateYanziwuScenario(areaData) {
    const shrine = loadActionScenario(areaData, "fb/yanziwu/lingwei", { diff: 0 });
    const worship = shrine.room.actions["拜祭"];
    worship.call(shrine.room, shrine.me);
    worship.call(shrine.room, shrine.me);
    let state = shrine.room.query_fb_state(shrine.me);
    if (state.score !== 0 || shrine.room.query_exits("north")) return "燕子坞不足三次拜祭提前开启水阁";
    worship.call(shrine.room, shrine.me);
    worship.call(shrine.room, shrine.me);
    if (state.score !== 15 || !state.milestones["拜祭灵位"] || shrine.room.exits.north !== "fb/yanziwu/huanshi") return "燕子坞第三次拜祭未幂等开启水阁";

    const pavilion = loadActionScenario(areaData, "fb/yanziwu/huanshi", { diff: 0 });
    pavilion.room.actions["搜索水阁"].call(pavilion.room, pavilion.me);
    pavilion.room.actions["搜索水阁"].call(pavilion.room, pavilion.me);
    state = pavilion.room.query_fb_state(pavilion.me);
    if (state.score !== 10 || !state.milestones["还施水阁"] || pavilion.room.exits.north !== "fb/yanziwu/murongbo") return "燕子坞水阁搜索未幂等开启慕容博密室";
    return null;
}

function validateYinyangguScenario(areaData) {
    const unqualifiedZhulong = loadActionScenario(areaData, "fb/yinyanggu/entry", { diff: 0 });
    const chooseZhulong = unqualifiedZhulong.room.actions["选择路线"];
    chooseZhulong.call(unqualifiedZhulong.room, unqualifiedZhulong.me, "烛龙");
    if (unqualifiedZhulong.room.query_temp(unqualifiedZhulong.me, "fb/yinyanggu/route", 0)) return "阴阳谷无功法资格仍可选择烛龙路线";

    for (const skillId of ["xuehaimogong", "qiankundanuoyi", "changshengjue"]) {
        const qualified = loadActionScenario(areaData, "fb/yinyanggu/entry", { diff: 0 });
        qualified.me.query_skill = function (id, def) { return id === skillId ? 1 : (def || 0); };
        qualified.room.actions["选择路线"].call(qualified.room, qualified.me, "烛龙");
        if (qualified.room.query_temp(qualified.me, "fb/yinyanggu/route", 0) !== "烛龙") return "阴阳谷烛龙路线未接受" + skillId + "资格";
    }

    const unqualifiedYin = loadActionScenario(areaData, "fb/yinyanggu/entry", { diff: 0 });
    unqualifiedYin.room.actions["选择路线"].call(unqualifiedYin.room, unqualifiedYin.me, "幽冥");
    if (unqualifiedYin.room.query_temp(unqualifiedYin.me, "fb/yinyanggu/route", 0)) return "阴阳谷无长生诀仍可选择幽冥路线";

    const entry = loadActionScenario(areaData, "fb/yinyanggu/entry", { diff: 0 });
    entry.me.query_skill = function (id, def) { return id === "changshengjue" ? 1 : (def || 0); };
    const choose = entry.room.actions["选择路线"];
    const jump = entry.room.actions["跳下谷口"];
    if (entry.room.on_leave(entry.me, "north") !== false) return "阴阳谷未选择路线仍可离开入口";
    jump.call(entry.room, entry.me);
    if (entry.room.query_temp(entry.me, "fb/yinyanggu/jumped", 0)) return "阴阳谷未选择路线仍可跳下谷口";
    choose.call(entry.room, entry.me, "幽冥");
    if (entry.room.query_temp(entry.me, "fb/yinyanggu/route", 0) !== "幽冥") return "阴阳谷长生诀资格未能选择幽冥路线";
    choose.call(entry.room, entry.me, "烛龙");
    if (entry.room.query_temp(entry.me, "fb/yinyanggu/route", 0) !== "幽冥" || entry.room.query_fb_state(entry.me).route !== "幽冥") return "阴阳谷路线锁定后仍可切换";
    if (entry.room.on_leave(entry.me, "north") !== false) return "阴阳谷未跳下谷口仍可北行";
    jump.call(entry.room, entry.me);
    jump.call(entry.room, entry.me);
    if (!entry.room.query_temp(entry.me, "fb/yinyanggu/jumped", 0) || entry.room.on_leave(entry.me, "north") === false) return "阴阳谷跳下谷口后仍被入口阻断";

    const stone = loadActionScenario(areaData, "fb/yinyanggu/dashi", { diff: 0, "fb/yinyanggu/route": "幽冥" });
    const lift = stone.room.actions["抱起大石"];
    lift.call(stone.room, stone.me);
    if (stone.room.query_temp(stone.me, "fb/yinyanggu/stone", 0) || stone.room.query_fb_state(stone.me).score !== 0) return "阴阳谷未跳下仍可抱起大石";
    stone.room.set_temp(stone.me, "fb/yinyanggu/jumped", 1);
    lift.call(stone.room, stone.me);
    lift.call(stone.room, stone.me);
    if (!stone.room.query_temp(stone.me, "fb/yinyanggu/stone", 0) || stone.room.query_fb_state(stone.me).score !== 10) return "阴阳谷抱石未幂等结算10分";

    const blockedDive = loadActionScenario(areaData, "fb/yinyanggu/shenshui", { diff: 0, "fb/yinyanggu/route": "烛龙" });
    blockedDive.room.actions["下潜"].call(blockedDive.room, blockedDive.me);
    if (blockedDive.room.query_temp(blockedDive.me, "fb/yinyanggu/depth", 0)) return "阴阳谷未抱石仍可下潜";

    const lowHealth = loadActionScenario(areaData, "fb/yinyanggu/shenshui", { diff: 0, "fb/yinyanggu/route": "烛龙", "fb/yinyanggu/stone": 1 });
    lowHealth.me.hp = 4;
    const lowHealthDive = lowHealth.room.actions["下潜"];
    lowHealthDive.call(lowHealth.room, lowHealth.me);
    if (lowHealth.me.hp !== 1 || lowHealth.room.query_temp(lowHealth.me, "fb/yinyanggu/depth", 0) !== 1) return "阴阳谷深水低气血保护未保留1点气血";
    lowHealthDive.call(lowHealth.room, lowHealth.me);
    if (lowHealth.room.query_temp(lowHealth.me, "fb/yinyanggu/depth", 0) !== 1) return "阴阳谷1点气血仍可继续下潜";

    const zhulongDive = loadActionScenario(areaData, "fb/yinyanggu/shenshui", { diff: 0, "fb/yinyanggu/route": "烛龙", "fb/yinyanggu/stone": 1 });
    zhulongDive.me.hp = 100;
    const dive = zhulongDive.room.actions["下潜"];
    dive.call(zhulongDive.room, zhulongDive.me);
    dive.call(zhulongDive.room, zhulongDive.me);
    if (zhulongDive.room.on_leave(zhulongDive.me, "north") !== false || zhulongDive.room.query_fb_state(zhulongDive.me).score !== 0) return "阴阳谷烛龙路线未到第三层仍可北行或提前结算深度";
    dive.call(zhulongDive.room, zhulongDive.me);
    if (zhulongDive.room.query_temp(zhulongDive.me, "fb/yinyanggu/depth", 0) !== 3 || zhulongDive.room.query_fb_state(zhulongDive.me).score !== 20 || zhulongDive.room.on_leave(zhulongDive.me, "north") === false) return "阴阳谷烛龙路线第三层未结算深度或仍被阻断";

    const yinDive = loadActionScenario(areaData, "fb/yinyanggu/shenshui", { diff: 0, "fb/yinyanggu/route": "幽冥", "fb/yinyanggu/stone": 1 });
    yinDive.me.hp = 100;
    const yinDiveAction = yinDive.room.actions["下潜"];
    const swimLight = yinDive.room.actions["游向光点"];
    yinDiveAction.call(yinDive.room, yinDive.me);
    yinDiveAction.call(yinDive.room, yinDive.me);
    swimLight.call(yinDive.room, yinDive.me);
    if (yinDive.room.query_temp(yinDive.me, "fb/yinyanggu/ice_entry", 0) || yinDive.room.query_fb_state(yinDive.me).score !== 0) return "阴阳谷幽冥路线在第二处光点前仍可游入玄冰洞";
    yinDiveAction.call(yinDive.room, yinDive.me);
    if (yinDive.room.on_leave(yinDive.me, "north") !== false || yinDive.room.query_fb_state(yinDive.me).score !== 0) return "阴阳谷幽冥路线未游向第二处光点仍可北行或提前计分";
    swimLight.call(yinDive.room, yinDive.me);
    swimLight.call(yinDive.room, yinDive.me);
    if (!yinDive.room.query_temp(yinDive.me, "fb/yinyanggu/ice_entry", 0) || yinDive.room.query_fb_state(yinDive.me).score !== 20 || yinDive.room.on_leave(yinDive.me, "north") === false) return "阴阳谷幽冥路线第二处光点未幂等开启玄冰洞";

    const zhulongCave = loadActionScenario(areaData, "fb/yinyanggu/cave", { diff: 0, "fb/yinyanggu/route": "烛龙" });
    const zhuzhao = { path: "fb/yinyanggu/zhuzhao", attacked: [], do_kill(target) { this.attacked.push(target); } };
    zhulongCave.room.find_obj_bypath = function (target) { return target === zhuzhao.path ? zhuzhao : null; };
    zhulongCave.room.on_enter(zhulongCave.me);
    if (zhuzhao.attacked.length !== 1 || zhuzhao.attacked[0] !== zhulongCave.me) return "阴阳谷烛龙路线进入洞窟时烛照未主动叫杀";

    const yinCave = loadActionScenario(areaData, "fb/yinyanggu/cave", { diff: 0, "fb/yinyanggu/route": "幽冥" });
    let removedZhuzhao = false;
    yinCave.room.find_obj_bypath = function (target) { return target === zhuzhao.path && !removedZhuzhao ? zhuzhao : null; };
    yinCave.room.item_changed = function (item, isIn) { if (item === zhuzhao && !isIn) removedZhuzhao = true; };
    yinCave.room.actions["跳下洞窟"].call(yinCave.room, yinCave.me);
    if (!removedZhuzhao || !yinCave.room.query_temp(yinCave.me, "fb/yinyanggu/cave", 0)) return "阴阳谷幽冥路线跳下洞窟未移除烛照";

    const team = loadActionScenario(areaData, "fb/yinyanggu/core", {
        "fb/yinyanggu/route": "幽冥",
        "fb/yinyanggu/cave": 1,
        diff: 2
    });
    const spawned = [];
    team.room.find_obj_bypath = function (target) { return spawned.find(item => item.path === target); };
    team.room.item_changed = function (item, isIn) { if (isIn && !spawned.includes(item)) spawned.push(item); };
    team.room.NPC.CLONE = function (target) {
        return {
            path: target,
            hp: 100,
            max_hp: 100,
            mp: 100,
            max_mp: 100,
            str: 100,
            con: 100,
            dex: 100,
            int: 100,
            prop: { gj: 100, fy: 100, mz: 100, ds: 100, zj: 100 }
        };
    };
    team.room.on_enter(team.me);
    if (spawned.length !== 0) return "阴阳谷幽冥路线击杀烛九阴前提前生成双子";
    const zhuzhaoyin = loadNpcScenario("fb/yinyanggu/zhuzhaoyin");
    zhuzhaoyin.on_died(team.me);
    if (spawned.length !== 2 || spawned.some(item => item.max_hp !== 200 || item.prop.gj !== 135 || item.fbDifficultyType !== 2)) return "阴阳谷组队幽冥双子未在烛九阴死亡后动态缩放生成";
    if (team.room.query_fb_state(team.me).score !== 25 || !team.room.query_fb_state(team.me).milestones["烛九阴幽冥"]) return "阴阳谷幽冥烛九阴死亡未结算25分";
    zhuzhaoyin.on_died(team.me);
    team.room.on_enter(team.me);
    if (spawned.length !== 2) return "阴阳谷烛九阴重复死亡或重进核心时重复生成双子";

    const firstTwin = loadNpcScenario("fb/yinyanggu/shuangzi");
    const secondTwin = loadNpcScenario("fb/yinyanggu/shuangzi2");
    firstTwin.on_died(team.me);
    firstTwin.on_died(team.me);
    secondTwin.on_died(team.me);
    if (team.room.query_fb_state(team.me).score !== 55 || !team.room.query_fb_state(team.me).milestones["双子一"] || !team.room.query_fb_state(team.me).milestones["双子二"]) return "阴阳谷幽冥双子未分别幂等结算15分";

    const zhulongCore = loadActionScenario(areaData, "fb/yinyanggu/core", { diff: 0, "fb/yinyanggu/route": "烛龙", "fb/yinyanggu/cave": 1 });
    let zhulongSpawns = 0;
    zhulongCore.room.NPC.CLONE = function () { zhulongSpawns++; return {}; };
    const zhulongBoss = loadNpcScenario("fb/yinyanggu/zhuzhaoyin");
    zhulongBoss.on_died(zhulongCore.me);
    firstTwin.on_died(zhulongCore.me);
    secondTwin.on_died(zhulongCore.me);
    zhulongCore.room.on_enter(zhulongCore.me);
    const zhulongState = zhulongCore.room.query_fb_state(zhulongCore.me);
    if (zhulongSpawns !== 0 || zhulongState.score !== 30 || !zhulongState.milestones["烛九阴"] || zhulongState.milestones["双子一"] || zhulongState.milestones["双子二"]) return "阴阳谷烛龙路线错误生成双子或跨路线结算双子分数";
    return null;
}

function validateJingnianScenario(areaData) {
    const expectedTopology = {
        "fb/jingnian/entry": { north: "fb/jingnian/zhudian" },
        "fb/jingnian/zhudian": { south: "fb/jingnian/entry", north: "fb/jingnian/baishi" },
        "fb/jingnian/baishi": {
            south: "fb/jingnian/zhudian",
            west: "fb/jingnian/yadi",
            north: "fb/jingnian/zhonglou",
            northwest: "fb/jingnian/houshan",
            southeast: "fb/jingnian/lanlu",
            east: "fb/jingnian/tongdian"
        },
        "fb/jingnian/yadi": { east: "fb/jingnian/baishi", north: "fb/jingnian/zhonglou" },
        "fb/jingnian/houshan": { southeast: "fb/jingnian/baishi", northeast: "fb/jingnian/zhonglou" },
        "fb/jingnian/zhonglou": {
            south: "fb/jingnian/baishi",
            east: "fb/jingnian/tongdian",
            southwest: "fb/jingnian/houshan",
            north: "fb/jingnian/changsheng"
        },
        "fb/jingnian/lanlu": { northwest: "fb/jingnian/baishi", east: "fb/jingnian/tongdian" },
        "fb/jingnian/tongdian": {
            west: "fb/jingnian/zhonglou",
            south: "fb/jingnian/baishi",
            southwest: "fb/jingnian/lanlu"
        },
        "fb/jingnian/changsheng": { south: "fb/jingnian/zhonglou" }
    };
    const mapRooms = new Map((areaData.map || []).map(item => [item.id, item]));
    for (const [roomId, exits] of Object.entries(expectedTopology)) {
        if (!mapRooms.has(roomId)) return "净念禅宗缺少真实房间 " + roomId;
        const scenario = loadActionScenario(areaData, roomId, { "fb/jingnian/route": "盗帅" });
        for (const [dir, target] of Object.entries(exits)) {
            if (!scenario.room.exits || scenario.room.exits[dir] !== target) return roomId + " 的 " + dir + " 出口不一致";
        }
    }

    const monkKing = loadActionScenario(areaData, "fb/jingnian/zhudian", { "fb/jingnian/route": "僧王" });
    attachScenarioSpawns(monkKing);
    for (let count = 0; count < 4; count++) monkKing.room.actions["强制退出"].call(monkKing.room, monkKing.me);
    let state = monkKing.room.query_fb_state(monkKing.me);
    if (state.score !== 15 || !state.milestones["三次退出"] || monkKing.room.on_leave(monkKing.me, "north") === false) return "僧王主殿四次退出或北行门禁异常";
    loadScenarioRoom(monkKing, "fb/jingnian/baishi");
    monkKing.room.on_enter(monkKing.me);
    const monkKingCanLeaveBaishi = monkKing.room.on_leave(monkKing.me, "north") !== false;
    if (state.score !== 25 || !state.milestones["白石阶段"] || !monkKingCanLeaveBaishi) {
        return "僧王进入白石广场未恢复并结算阶段（分数 " + state.score
            + "，里程碑 " + Boolean(state.milestones["白石阶段"])
            + "，北行 " + monkKingCanLeaveBaishi + "）";
    }
    loadScenarioRoom(monkKing, "fb/jingnian/zhonglou");
    if (monkKing.room.on_leave(monkKing.me, "east") !== false) return "僧王未等黑影仍可进入铜殿";
    monkKing.room.actions["等待黑影"].call(monkKing.room, monkKing.me);
    if (state.score !== 35 || monkKing.room.on_leave(monkKing.me, "east") === false) return "僧王黑影阶段未开启铜殿";
    loadScenarioRoom(monkKing, "fb/jingnian/tongdian");
    attachScenarioSpawns(monkKing, { "fb/jingnian/laoxu": 1 });
    monkKing.room.on_enter(monkKing.me);
    if (monkKing.room.find_obj_bypath("fb/jingnian/laoxu")) return "老徐首次克隆失败后仍写入了无效目标";
    monkKing.room.on_enter(monkKing.me);
    if (!monkKing.room.find_obj_bypath("fb/jingnian/laoxu")) return "僧王重进铜殿未恢复老徐";
    const normalLaoxu = loadNpcScenario("fb/jingnian/laoxu");
    normalLaoxu.on_died(monkKing.me);
    normalLaoxu.on_died(monkKing.me);
    if (state.score !== 80 || !state.milestones["老徐"] || !state.milestones["和氏璧"]
        || !monkKing.room.query_temp(monkKing.me, "fb/jingnian/heshibi", 0)) return "僧王老徐与临时和氏璧未幂等结算";
    loadScenarioRoom(monkKing, "fb/jingnian/zhonglou");
    monkKing.room.actions["跳入长生门"].call(monkKing.room, monkKing.me);
    if (state.score !== 100 || monkKing.room.on_leave(monkKing.me, "north") === false) return "僧王路线未完成100分并开启长生门";

    const thief = loadActionScenario(areaData, "fb/jingnian/yadi", { "fb/jingnian/route": "盗帅" });
    attachScenarioSpawns(thief);
    const sanren = loadNpcScenario("fb/jingnian/sanren");
    sanren.on_died(thief.me);
    sanren.on_died(thief.me);
    thief.me.str = 8999;
    thief.room.actions["跳上去"].call(thief.room, thief.me);
    state = thief.room.query_fb_state(thief.me);
    if (state.score !== 30 || thief.room.on_leave(thief.me, "north") === false) return "盗帅崖底战斗或四千轻功跳跃异常";
    loadScenarioRoom(thief, "fb/jingnian/zhonglou");
    if (thief.room.on_leave(thief.me, "east") === false) return "盗帅完成轻功后仍不能从钟楼进入铜殿";
    loadScenarioRoom(thief, "fb/jingnian/tongdian");
    thief.room.actions["推开铜殿"].call(thief.room, thief.me);
    if (state.score !== 30) return "盗帅臂力差1仍推开铜殿";
    thief.me.str = 9000;
    thief.room.actions["推开铜殿"].call(thief.room, thief.me);
    for (let count = 0; count < 5; count++) loadNpcScenario("fb/jingnian/monk").on_died(thief.me);
    thief.room.actions["取得和氏璧"].call(thief.room, thief.me);
    if (state.score !== 80 || !thief.room.query_temp(thief.me, "fb/jingnian/heshibi", 0)
        || thief.room.on_leave(thief.me, "west") === false) return "盗帅铜殿战斗、九千臂力或临时和氏璧异常";
    loadScenarioRoom(thief, "fb/jingnian/zhonglou");
    thief.room.actions["跳入长生门"].call(thief.room, thief.me);
    if (state.score !== 100) return "盗帅路线未完成100分";

    const marshal = loadActionScenario(areaData, "fb/jingnian/entry", { diff: 0 });
    attachScenarioSpawns(marshal);
    marshal.room.actions["选择路线"].call(marshal.room, marshal.me, "少帅");
    state = marshal.room.query_fb_state(marshal.me);
    if (state.score !== 10 || state.route !== "少帅") return "少帅路线未在正门锁定并结算入寺";
    loadScenarioRoom(marshal, "fb/jingnian/zhudian");
    marshal.room.actions["取得阿朱面具"].call(marshal.room, marshal.me);
    marshal.room.actions["使用阿朱面具"].call(marshal.room, marshal.me);
    loadScenarioRoom(marshal, "fb/jingnian/baishi");
    if (marshal.room.on_leave(marshal.me, "north") === false) return "少帅首次进入钟楼被错误阻断";
    loadScenarioRoom(marshal, "fb/jingnian/zhonglou");
    if (marshal.room.on_leave(marshal.me, "southwest") !== false) return "少帅未查看黑影仍可进入后山";
    marshal.room.actions["查看后山黑影"].call(marshal.room, marshal.me);
    if (marshal.room.on_leave(marshal.me, "southwest") === false) return "少帅记录可恢复提示后仍不能进入后山";
    loadScenarioRoom(marshal, "fb/jingnian/houshan");
    attachScenarioSpawns(marshal, { "fb/jingnian/kouzhong": 1 });
    marshal.room.actions["诱出寇仲"].call(marshal.room, marshal.me);
    if (marshal.room.query_temp(marshal.me, "fb/jingnian/kouzhong_started", 0)) return "寇仲克隆失败后提前锁定挑战";
    marshal.room.actions["诱出寇仲"].call(marshal.room, marshal.me);
    const firstKouzhong = marshal.room.find_obj_bypath("fb/jingnian/kouzhong");
    if (!firstKouzhong || !marshal.room.query_temp(marshal.me, "fb/jingnian/kouzhong_started", 0)) return "少帅路线未成功生成寇仲";
    marshal.room.item_changed(firstKouzhong, false);
    marshal.room.on_enter(marshal.me);
    if (!marshal.room.find_obj_bypath("fb/jingnian/kouzhong")) return "少帅重进后山未恢复丢失的寇仲";
    const kouzhong = loadNpcScenario("fb/jingnian/kouzhong");
    kouzhong.on_died(marshal.me);
    kouzhong.on_died(marshal.me);
    marshal.room.actions["完成伪装"].call(marshal.room, marshal.me);
    marshal.room.actions["等候老徐"].call(marshal.room, marshal.me);
    const statusMessages = [];
    marshal.me.notify = message => statusMessages.push(message);
    marshal.room.actions["查看阶段"].call(marshal.room, marshal.me);
    if (!statusMessages.some(message => message.includes("下一步") && message.includes("白石广场"))) return "少帅阶段提示不可查询恢复";
    loadScenarioRoom(marshal, "fb/jingnian/baishi");
    marshal.room.on_leave(marshal.me, "north");
    loadScenarioRoom(marshal, "fb/jingnian/zhonglou");
    marshal.room.actions["跳入长生门"].call(marshal.room, marshal.me);
    if (state.score !== 100 || !marshal.room.query_temp(marshal.me, "fb/jingnian/heshibi", 0)) return "少帅路线未以实例和氏璧完成100分";

    const evil = loadActionScenario(areaData, "fb/jingnian/entry", { diff: 1 });
    attachScenarioSpawns(evil);
    evil.room.actions["选择路线"].call(evil.room, evil.me, "邪王");
    loadScenarioRoom(evil, "fb/jingnian/zhudian");
    attachScenarioSpawns(evil, { "fb/jingnian/hudianseng": 1 });
    evil.room.on_enter(evil.me);
    if (evil.room.on_leave(evil.me, "north") !== false) return "护殿僧克隆失败仍可完成主殿抗杀";
    evil.room.on_enter(evil.me);
    const guards = evil.room.items.filter(item => item.path === "fb/jingnian/hudianseng");
    if (guards.length !== 2 || guards.some(item => item.attacked[0] !== evil.me)
        || evil.room.on_leave(evil.me, "north") === false) return "邪王主殿未恢复两名主动护殿僧或抗杀门禁异常";
    loadScenarioRoom(evil, "fb/jingnian/baishi");
    attachScenarioSpawns(evil);
    evil.room.on_enter(evil.me);
    if (evil.room.on_leave(evil.me, "southeast") !== false) return "邪王未昏迷指定和尚仍可进入拦僧道";
    evil.room.actions["昏迷和尚"].call(evil.room, evil.me);
    if (evil.room.on_leave(evil.me, "southeast") === false) return "邪王昏迷指定和尚后仍被白石广场阻断";
    loadScenarioRoom(evil, "fb/jingnian/lanlu");
    attachScenarioSpawns(evil);
    evil.room.on_enter(evil.me);
    if (evil.room.items.filter(item => item.path === "fb/jingnian/lanluseng").length !== 3) return "拦僧道未生成三名实际战斗目标";
    if (evil.room.on_leave(evil.me, "east") !== false) return "三名拦路僧未击败仍可进入铜殿";
    for (let count = 0; count < 3; count++) loadNpcScenario("fb/jingnian/lanluseng").on_died(evil.me);
    if (evil.room.on_leave(evil.me, "east") === false) return "三名拦路僧击败后仍不能进入铜殿";
    loadScenarioRoom(evil, "fb/jingnian/tongdian");
    evil.me.str = 9999;
    evil.room.actions["推开铜殿"].call(evil.room, evil.me);
    state = evil.room.query_fb_state(evil.me);
    if (state.score !== 40) return "邪王臂力差1仍推开铜殿";
    evil.me.str = 10000;
    evil.room.actions["推开铜殿"].call(evil.room, evil.me);
    for (let count = 0; count < 5; count++) loadNpcScenario("fb/jingnian/monk").on_died(evil.me);
    evil.room.actions["取得和氏璧"].call(evil.room, evil.me);
    evil.room.actions["完成邪王剧情"].call(evil.room, evil.me);
    evil.room.actions["完成邪王剧情"].call(evil.room, evil.me);
    if (state.score !== 100 || !state.milestones["邪王剧情"]) return "邪王实际五僧、临时和氏璧或原地剧情未完成100分";

    const killedMonk = loadActionScenario(areaData, "fb/jingnian/baishi", { diff: 1, "fb/jingnian/route": "邪王" });
    attachScenarioSpawns(killedMonk);
    killedMonk.room.on_enter(killedMonk.me);
    loadNpcScenario("fb/jingnian/xiaoseng").on_died(killedMonk.me);
    if (!killedMonk.room.query_fb_state(killedMonk.me).failed) return "邪王击杀指定和尚后路线未明确失败";

    const difficultMonk = loadActionScenario(areaData, "fb/jingnian/entry", { diff: 1 });
    attachScenarioSpawns(difficultMonk);
    difficultMonk.room.actions["选择路线"].call(difficultMonk.room, difficultMonk.me, "困难僧王");
    loadScenarioRoom(difficultMonk, "fb/jingnian/baishi");
    attachScenarioSpawns(difficultMonk, { "fb/jingnian/laoxu": 1 });
    difficultMonk.room.on_enter(difficultMonk.me);
    if (difficultMonk.room.find_obj_bypath("fb/jingnian/laoxu")) return "困难僧王老徐首次克隆失败后留下目标";
    difficultMonk.room.on_enter(difficultMonk.me);
    if (!difficultMonk.room.find_obj_bypath("fb/jingnian/laoxu")) return "困难僧王重进白石广场未恢复老徐";
    loadNpcScenario("fb/jingnian/laoxu").on_died(difficultMonk.me);
    if (difficultMonk.room.on_leave(difficultMonk.me, "north") === false) return "困难僧王击败老徐后仍不能进入钟楼";
    loadScenarioRoom(difficultMonk, "fb/jingnian/zhonglou");
    attachScenarioSpawns(difficultMonk, { "fb/jingnian/tian_seng": 1 });
    difficultMonk.room.on_enter(difficultMonk.me);
    state = difficultMonk.room.query_fb_state(difficultMonk.me);
    if (state.score !== 50 || difficultMonk.room.find_obj_bypath("fb/jingnian/tian_seng")) return "困难僧王进入钟楼或天僧首次克隆失败处理异常";
    difficultMonk.room.on_enter(difficultMonk.me);
    if (!difficultMonk.room.find_obj_bypath("fb/jingnian/tian_seng")) return "困难僧王重进钟楼未恢复天僧";
    const tianSeng = loadNpcScenario("fb/jingnian/tian_seng");
    tianSeng.on_died(difficultMonk.me);
    tianSeng.on_died(difficultMonk.me);
    difficultMonk.room.remove_jingnian_npcs("fb/jingnian/tian_seng");
    difficultMonk.room.on_enter(difficultMonk.me);
    if (difficultMonk.room.find_obj_bypath("fb/jingnian/tian_seng")) return "已击败天僧在重进钟楼后复生";
    difficultMonk.room.actions["跳入长生门"].call(difficultMonk.room, difficultMonk.me);
    if (state.score !== 100) return "困难僧王路线未完成100分";
    return null;
}

function validateBranchScenarios(areaData, id) {
    if (id === "taohuadao") return validateTaohuadaoScenario(areaData);
    if (id === "baituo") return validateBaituoScenario(areaData);
    if (id === "xingxiu") return validateXingxiuScenario(areaData);
    if (id === "binghuo") return validateBinghuoScenario(areaData);
    if (id === "yihuagong") return validateYihuagongScenario(areaData);
    if (id === "yanziwu") return validateYanziwuScenario(areaData);
    if (id === "heimuya") return validateHeimuyaScenario(areaData);
    if (id === "piaomiaofeng") return validatePiaomiaofengScenario(areaData);
    if (id === "tianlongsi") return validateTianlongsiScenario(areaData);
    if (id === "xuedaomen") return validateXuedaomenScenario(areaData);
    if (id === "gumu") return validateGumuScenario(areaData);
    if (id === "huashanlunjian") return validateHuashanScenario(areaData);
    if (id === "guangmingding") return validateGuangmingdingScenario(areaData);
    if (id === "jingnian") return validateJingnianScenario(areaData);
    if (id === "cihang") {
        return validateCihangScenario(areaData);
    }
    if (id === "zhanshendian") {
        return validateZhanshendianScenario(areaData);
    }
    if (id === "yinyanggu") return validateYinyangguScenario(areaData);
    return null;
}

function validateBranchDeclarations(areaData, id) {
    const expected = {
        jingnian: {
            normal: { 僧王: ["三次退出", "白石阶段", "黑影赴铜殿", "老徐", "和氏璧", "长生门"], 少帅: ["入寺", "阿朱面具", "寇仲与伪装", "老徐归来", "钟楼突破", "长生门"], 盗帅: ["崖底三人组", "轻功跳跃", "推开铜殿", "五僧", "和氏璧", "长生门"] },
            1: { 邪王: ["主殿抗杀", "昏迷突破", "拦路僧", "推开铜殿", "五僧", "和氏璧", "邪王剧情"], 困难僧王: ["入寺", "老徐", "进入钟楼", "拦路天僧", "长生门"] }
        },
        cihang: {
            normal: { 浪子: ["七苦门", "祁冰云", "遗书", "浪翻云", "庞斑三命", "石窟领悟"], 国师: ["七苦门", "观战求突破", "比试庞斑", "浪翻云阶段", "石窟领悟"] },
            1: { 剑魔: ["七苦门", "遗书与挑战", "庞斑三命", "剑魔阶段", "石窟领悟"], 魔师: ["七苦门", "长生资格", "拦江岛战斗", "魔师战斗", "石窟领悟"] }
        },
        yinyanggu: {
            normal: { 烛龙: ["大石", "深度", "幽莹", "藤蔓", "洞窟", "烛照", "烛九阴"], 幽冥: ["大石", "深度", "藤蔓", "洞窟", "烛九阴幽冥", "双子一", "双子二"] }
        }
    };
    const routeExpected = expected[id];
    if (!routeExpected) return validateBranchScenarios(areaData, id);
    for (const [mode, routes] of Object.entries(routeExpected)) {
        const actualMode = areaData.fb_routes[mode] || areaData.fb_routes[String(mode)];
        for (const [route, keys] of Object.entries(routes)) {
            const actual = actualMode && actualMode[route];
            const actualKeys = Object.keys(actual || {});
            if (!actual || actualKeys.length !== keys.length || keys.some(key => !Object.prototype.hasOwnProperty.call(actual, key))) return `${id}:${mode}.${route} 路线里程碑与计划不一致`;
            const total = keys.reduce((sum, key) => sum + Number(actual[key] || 0), 0);
            if (total !== 100) return `${id}:${mode}.${route} 场景路线分值为${total}`;
        }
    }
    return validateBranchScenarios(areaData, id);
}

const errors = [];
const seenRecords = new Set([16, 17, 18, 19]);
function inspectClickOnlyInteraction(id, label, source) {
    const hasParameterizedRoomAction = /add_action\([\s\S]*?function\s*\(\s*me\s*,\s*par\s*\)/.test(source);
    if (hasParameterizedRoomAction && !source.includes("add_fb_click_choices")) {
        errors.push(`${id}: ${label} 存在参数型动作但没有点击选项`);
    }
    if (/请输入|请手动输入|输入[^。\n]{0,20}(?:命令|方向|路线|编号)/.test(source)) {
        errors.push(`${id}: ${label} 仍提示玩家键盘输入`);
    }
}
for (const [id, record] of expected) {
    const file = path.join(areaDir, `fb${record + 1}.js`);
    if (!fs.existsSync(file)) {
        errors.push(`${id}: 缺少 ${path.relative(root, file)}`);
        continue;
    }
    const area = loadArea(file);
    if (area.id !== id) errors.push(`${id}: AREA id 为 ${area.id || "空"}`);
    if (area.record_index !== record) errors.push(`${id}: record_index 为 ${area.record_index}`);
    if (seenRecords.has(area.record_index)) errors.push(`${id}: record_index 重复 ${area.record_index}`);
    seenRecords.add(area.record_index);
    if (!area.first || !fs.existsSync(path.join(root, "world", "map", area.first + ".js"))) {
        errors.push(`${id}: first 房间不存在 ${area.first || "空"}`);
    }
    const roomIds = new Set((area.map || []).map(item => item.id));
    for (const item of area.map || []) {
        const roomFile = path.join(root, "world", "map", item.id + ".js");
        if (!fs.existsSync(roomFile)) errors.push(`${id}: 地图房间不存在 ${item.id}`);
        roomIds.add(item.id);
    }
    const roomDir = path.join(root, "world", "map", "fb", id);
    if (fs.existsSync(roomDir)) {
        for (const roomFileName of fs.readdirSync(roomDir)) {
            if (!roomFileName.endsWith(".js")) continue;
            const roomFile = path.join(roomDir, roomFileName);
            const source = fs.readFileSync(roomFile, "utf8");
            inspectClickOnlyInteraction(id, `world/map/fb/${id}/${roomFileName}`, source);
            const refs = [...source.matchAll(/(?:this\.exits\s*=|this\.add_exit\([^,]+,)\s*[^\n]*?fb\/[a-z0-9_]+\/([a-z0-9_]+)/g)];
            for (const match of refs) {
                const target = `fb/${id}/${match[1]}`;
                if (!fs.existsSync(path.join(root, "world", "map", target + ".js"))) {
                    errors.push(`${id}: ${roomFileName} 引用不存在房间 ${target}`);
                }
            }
            const npcRefs = [...source.matchAll(/this\.set_npc\([\s\S]*?fb\/[a-z0-9_]+\/([a-z0-9_]+)/g)];
            for (const match of npcRefs) {
                const target = `fb/${id}/${match[1]}`;
                if (!fs.existsSync(path.join(root, "world", "npc", target + ".js"))) {
                    errors.push(`${id}: ${roomFileName} 引用不存在 NPC ${target}`);
                }
            }
        }
    }
    const routes = area.fb_routes || {};
    for (const [mode, definitions] of Object.entries(routes)) {
        const routeList = definitions.default ? { default: definitions.default } : definitions;
        for (const [routeId, route] of Object.entries(routeList || {})) {
            const milestones = route.milestones || route;
            const total = Object.values(milestones).reduce((sum, value) => sum + Number(value || 0), 0);
            if (total !== 100) errors.push(`${id}:${mode}.${routeId} 分值为 ${total}`);
            if (new Set(Object.keys(milestones)).size !== Object.keys(milestones).length) {
                errors.push(`${id}:${mode}.${routeId} 存在重复里程碑`);
            }
            const simulationError = simulateRoute(area, mode, routeId, milestones);
            if (simulationError) errors.push(`${id}:${mode}.${routeId} ${simulationError}`);
        }
    }
    const declaredMilestones = new Set();
    for (const definitions of Object.values(routes)) {
        const routeList = definitions && definitions.default ? { default: definitions.default } : definitions;
        for (const route of Object.values(routeList || {})) {
            const milestones = route && (route.milestones || route);
            for (const key of Object.keys(milestones || {})) declaredMilestones.add(key);
        }
    }
    const usedMilestones = new Set();
    const inspectMilestoneSource = (label, source) => {
        for (const match of source.matchAll(/grant_fb_milestone\s*\(\s*[^,]+,\s*["']([^"']+)/g)) {
            usedMilestones.add(match[1]);
            if (!declaredMilestones.has(match[1])) errors.push(`${id}: ${label} 使用未声明里程碑 ${match[1]}`);
        }
        for (const key of declaredMilestones) {
            if (source.includes('"' + key + '"') || source.includes("'" + key + "'")) usedMilestones.add(key);
        }
    };
    for (const relativeDir of [`world/map/fb/${id}`, `world/npc/fb/${id}`]) {
        const resourceDir = path.join(root, relativeDir);
        if (!fs.existsSync(resourceDir)) continue;
        for (const fileName of fs.readdirSync(resourceDir)) {
            if (!fileName.endsWith(".js")) continue;
            const source = fs.readFileSync(path.join(resourceDir, fileName), "utf8");
            inspectMilestoneSource(`${relativeDir}/${fileName}`, source);
        }
    }
    const dungeonExtension = path.join(root, "world", "extends", "map", id + ".js");
    if (fs.existsSync(dungeonExtension)) {
        const extensionSource = fs.readFileSync(dungeonExtension, "utf8");
        inspectMilestoneSource(`world/extends/map/${id}.js`, extensionSource);
        inspectClickOnlyInteraction(id, `world/extends/map/${id}.js`, extensionSource);
    }
    for (const key of declaredMilestones) {
        if (!usedMilestones.has(key)) errors.push(`${id}: 声明里程碑未找到实际授予路径 ${key}`);
    }
    if (id === "xiakedao") {
        const scenarioError = validateXiakeScenario(area);
        if (scenarioError) errors.push(`${id}: ${scenarioError}`);
    }
    if (["taohuadao", "baituo", "xingxiu", "binghuo", "yihuagong", "yanziwu", "heimuya", "piaomiaofeng", "guangmingding", "tianlongsi", "xuedaomen", "gumu", "huashanlunjian", "jingnian", "cihang", "yinyanggu", "zhanshendian"].includes(id)) {
        const branchError = validateBranchDeclarations(area, id);
        if (branchError) errors.push(`${id}: ${branchError}`);
    }
}

for (const record of [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]) {
    if (!seenRecords.has(record)) errors.push(`缺少 record_index ${record}`);
}

if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    console.log(`副本路线校验通过：${expected.size} 个新增 AREA，record_index 20-37 连续、路线均为 100 分，18 个动作场景已执行。`);
}
