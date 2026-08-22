
WORLD.on_startup = function () {
    init_fams();
    WORLD.COMMANDS.jh.init();
    if (WORLD.ADMIN_BRIDGE) WORLD.ADMIN_BRIDGE.start();
    WORLD.__qimie_runtime_started = true;
    const qimie = typeof TASK !== "undefined" && TASK.GET && TASK.GET("qimie_event");
    if (qimie && qimie.on_world_startup) qimie.on_world_startup();
}

function init_fams() {
    for (let fam in FAMILIES) {
        FAMILIES[fam].init();
    }
}

WORLD.on_user_quit = function (user) {
    //在玩家退出游戏时调用
    if (WORLD.is_server(user)) {
        if (user.query_temp('pt')) {
            WORLD.COMMANDS['party'].on_user_login(user, false);//帮派初始化
        }
        WORLD.on_user_save(user);
    } else {
        if (user.query_temp('cross_type') == 'duizhan') {
            WORLD.PUB_USERS.push(user);
            user.disconnect_time = 0;
        }
    }
}
WORLD.on_user_save = function (user) {
    //在玩家退出游戏，或者游戏关闭时候调用
    if (typeof HOUSEHOLD !== "undefined") HOUSEHOLD.tick(user, Date.now());

}


WORLD.on_heart_beat = function (now) {
    if (typeof HOUSEHOLD !== "undefined" && Array.isArray(WORLD.USERS)) {
        for (const user of WORLD.USERS) {
            if (user && user.socket) HOUSEHOLD.tick(user, now);
        }
    }
}

// Cold-load audit for copy NPCs. This is intentionally opt-in so normal
// startup never clones every copy resource or emits diagnostic output.
WORLD.on_resource_loaded = function () {
    if (process.env.WSMUD_VALIDATE_EQUIPMENT === "1") {
        validateFbEquipment();
        return;
    }
    if (process.env.WSMUD_VALIDATE_SKILLS === "1") {
        validateFbSkills();
        return;
    }
    if (process.env.WSMUD_VALIDATE_LOOT === "1") {
        validateFbLoot();
        return;
    }
    if (process.env.WSMUD_VALIDATE_SWEEP_STATS === "1") {
        validateFbSweepStats();
        return;
    }
    if (process.env.WSMUD_VALIDATE_THRESHOLDS === "1") {
        validateFbThresholds();
        return;
    }
    if (process.env.WSMUD_VALIDATE_EFFECTIVE !== "1"
        && process.env.WSMUD_VALIDATE_SWEEP !== "1"
        && process.env.WSMUD_VALIDATE_LIFECYCLE !== "1") return;

    const fs = UTIL.require("fs");
    const path = UTIL.require("path");
    const expected = [
        "taohuadao", "baituo", "xingxiu", "binghuo", "yihuagong",
        "yanziwu", "heimuya", "piaomiaofeng", "guangmingding", "tianlongsi",
        "xuedaomen", "gumu", "huashanlunjian", "xiakedao", "jingnian",
        "cihang", "yinyanggu", "zhanshendian"
    ];
    const rows = [];
    const failures = [];
    const walk = (dir, relative) => {
        if (!fs.existsSync(dir)) return;
        for (const name of fs.readdirSync(dir)) {
            const full = path.join(dir, name);
            if (fs.statSync(full).isDirectory()) {
                walk(full, relative + name + "/");
                continue;
            }
            if (!name.endsWith(".js")) continue;
            const resourcePath = relative + name.slice(0, -3);
            try {
                const npc = NPC.CLONE(resourcePath);
                if (!npc) throw new Error("克隆结果为空");
                const values = {
                    gj: npc.gj,
                    mz: npc.mz,
                    ds: npc.ds,
                    zj: npc.zj,
                    fy: npc.fy,
                    hp: npc.hp,
                    max_hp: npc.max_hp,
                    mp: npc.mp,
                    max_mp: npc.max_mp,
                    gjsd: npc.gjsd
                };
                for (const [key, value] of Object.entries(values)) {
                    if (!Number.isFinite(value)) throw new Error(key + " 无效");
                }
                rows.push({
                    area: relative.split("/")[1],
                    npc: resourcePath,
                    raw: npc.prop || {},
                    effective: values
                });
            } catch (error) {
                failures.push(resourcePath + ":" + error.message);
            }
        }
    };
    for (const area of expected) walk(path.join(__PATH.NPC, "fb", area), "fb/" + area + "/");

    const byArea = {};
    for (const row of rows) {
        const list = byArea[row.area] || (byArea[row.area] = []);
        list.push(row);
    }
    const missing = expected.filter(area => !byArea[area] || !byArea[area].length);
    if (missing.length) failures.push("缺少 NPC 资源: " + missing.join(","));
    if (failures.length) throw new Error("副本 NPC 有效属性校验失败: " + failures.join(","));
    console.log("FB_EFFECTIVE_JSON:" + JSON.stringify({ count: rows.length, areas: byArea, failures }));
    console.log("副本 NPC 有效属性校验通过，共" + rows.length + " 条。");

    if (process.env.WSMUD_VALIDATE_LIFECYCLE === "1") validateFbLifecycle();
    if (process.env.WSMUD_VALIDATE_SWEEP !== "1") return;
    if (WORLD.COMMANDS.jh && WORLD.COMMANDS.jh.getAllMaps) WORLD.COMMANDS.jh.getAllMaps();
    const sweepResults = [];
    const sweepUser = (id, area, diff) => {
        const messages = [];
        const user = new USER();
        user.id = "validate-sweep-" + id + "-" + diff;
        user.name = "扫荡校验角色";
        user.exp = 0;
        user.pot = 0;
        user.level = 6;
        user.temp = { fb: 38, fb_unlock_order_v3: 1 };
        user.items = [];
        user.max_item_count = 10000;
        user.socket = { send(text) { messages.push(String(text)); } };
        user.environment = { is_fb() { return false; }, parent: null };
        const token = OBJ.CREATE("cash/saodang");
        token.count = 10;
        user.items.push(token);
        user.set_temp("fb_sao" + area.query_record_index(), diff ? 2 : 1);
        WORLD.COMMANDS.cr.enter(user, id + " " + (diff ? 1 : 0) + " 1");
        const tokenAfter = user.find_obj_bypath("cash/saodang");
        const completionKey = "fbc_" + (diff ? 1 : 0) + "_" + area.query_record_index();
        if (!user.query_temp(completionKey, 0) || !tokenAfter || tokenAfter.count !== 9
            || user.query_temp("fb_count", 0) !== 1 || user.query_jingli() !== 200 - area.expend) {
            throw new Error(id + (diff ? " 困难" : " 普通") + "扫荡未完成实际奖励/消耗校验");
        }
        sweepResults.push({ id, diff, messages: messages.length, itemCount: user.items.length });
    };
    for (const id of expected) {
        const area = AREA.Get(id);
        if (!area) throw new Error("扫荡校验找不到 AREA " + id);
        sweepUser(id, area, false);
        if (area.is_diffi) sweepUser(id, area, true);
        else {
            const messages = [];
            const user = new USER();
            user.id = "validate-sweep-invalid-" + id;
            user.name = "扫荡边界校验角色";
            user.temp = { fb: 38, fb_unlock_order_v3: 1 };
            user.items = [];
            user.max_item_count = 10000;
            user.socket = { send(text) { messages.push(String(text)); } };
            user.environment = { is_fb() { return false; }, parent: null };
            const token = OBJ.CREATE("cash/saodang");
            token.count = 10;
            user.items.push(token);
            user.set_temp("fb_sao" + area.query_record_index(), 2);
            WORLD.COMMANDS.cr.enter(user, id + " 1 1");
            if (!messages.some(message => message.includes("没有困难模式"))) {
                throw new Error(id + " 错误开放困难扫荡");
            }
        }
    }
    const multi = expected.filter(id => AREA.Get(id).is_multi);
    for (const id of multi) {
        const messages = [];
        const user = new USER();
        user.id = "validate-sweep-team-" + id;
        user.name = "组队扫荡边界校验角色";
        user.temp = { fb: 38, fb_unlock_order_v3: 1 };
        user.items = [];
        user.socket = { send(text) { messages.push(String(text)); } };
        user.environment = { is_fb() { return false; }, parent: null };
        WORLD.COMMANDS.cr.enter(user, id + " 2 1");
        if (!messages.some(message => message.includes("组队副本不可以扫荡"))) {
            throw new Error(id + " 错误允许组队扫荡");
        }
    }
    console.log("FB_SWEEP_JSON:" + JSON.stringify({ runs: sweepResults.length, multi: multi.length }));
    console.log("副本扫荡调用链校验通过，共" + sweepResults.length + " 次实际扫荡。");
};

function validateFbLifecycle() {
    const area = AREA.Get("piaomiaofeng");
    const entry = area && ROOM.Get(area.first);
    const outside = ROOM.Get("yz/wumiao");
    if (!area || !entry || !outside) throw new Error("生命周期校验找不到缥缈峰或安全入口");

    const makeSocket = () => ({
        user: null,
        sent: [],
        send(text) { this.sent.push(String(text)); },
        end() { this.ended = true; },
        setTimeout() {}
    });
    const makeUser = id => {
        const user = new USER();
        user.id = id;
        user.userid = id;
        user.name = "副本生命周期校验角色";
        user.serverid = WORLD.SERVERID;
        user.level = 6;
        user.str = 60;
        user.con = 60;
        user.dex = 60;
        user.int = 60;
        user.hp = user.max_hp = 100000;
        user.mp = user.max_mp = 100000;
        user.temp = { enter_room: "yz/wumiao" };
        user.items = [];
        user.equipment = [];
        user.skills = {};
        user.socket = makeSocket();
        user.recount = function () {};
        user.notify = function () {};
        user.send = function (text) { if (this.socket) this.socket.send(text); };
        user.save = function () { return Promise.resolve(true); };
        return user;
    };
    const enterCopy = (user, diff) => {
        const copy = entry.create_copy2(user, diff);
        if (!copy) throw new Error("副本实例创建失败: " + user.id);
        copy.do_enter(user, false);
        return copy;
    };

    const owner = "validate-fb-lifecycle";
    const user = makeUser(owner);
    enterCopy(user, 0);
    const shizuyan = ROOM.Get("fb/piaomiaofeng/shizuyan").query_copy(owner);
    if (!shizuyan) throw new Error("缥缈峰失足岩复制房间缺失");
    user.moveto(shizuyan, null, null);
    shizuyan.set_temp(user, "diff", 0);
    shizuyan.set_temp(user, "fb/piaomiaofeng/carry_child", 1);
    shizuyan.set_temp(user, "fb/lifecycle/room_marker", 1);
    user.set_temp("fb/lifecycle/player_marker", 1);
    shizuyan.apply_carry_status(user);
    if (!user.query_status("fb_piaomiaofeng_carry")) throw new Error("背负状态未建立");
    const roomBeforeDisconnect = user.environment;
    user.disconnect();
    if (user.socket || user.environment !== roomBeforeDisconnect
        || shizuyan.query_temp(user, "fb/lifecycle/room_marker", 0) !== 1) {
        throw new Error("断线后副本房间或临时进度未保留");
    }
    const replacement = makeUser(owner + "-relogin");
    user.relogin(replacement);
    if (!user.socket || user.environment !== roomBeforeDisconnect
        || shizuyan.query_temp(user, "fb/lifecycle/room_marker", 0) !== 1
        || !user.query_status("fb_piaomiaofeng_carry") || user.disconnect_time) {
        throw new Error("副本内重连未恢复原实例、房间进度或背负状态");
    }
    const savedRole = user.getData();
    if (!savedRole.data.includes('quit_room:"yz/wumiao"')
        || savedRole.data.includes("fb/lifecycle/room_marker")) {
        throw new Error("副本断线存档未回退安全入口或泄漏房间临时状态");
    }

    user.moveto(outside, null, null);
    if (user.query_status("fb_piaomiaofeng_carry")) throw new Error("离开缥缈峰后背负状态未清理");
    area.clear_copy(user);
    if (entry.query_copy(owner)) throw new Error("离开副本后复制房间未清理");

    const quitOwner = owner + "-quit";
    const quitUser = makeUser(quitOwner);
    const quitEntry = enterCopy(quitUser, 0);
    quitEntry.set_temp(quitUser, "fb/lifecycle/room_marker", 1);
    quitUser.set_temp("fb/lifecycle/player_marker", 1);
    quitUser.quit();
    if (quitUser.environment || quitUser.query_temp("fb/lifecycle/player_marker", 0)
        || entry.query_copy(quitOwner)) {
        throw new Error("主动退出后玩家状态、临时键或副本实例未清理");
    }
    console.log("FB_LIFECYCLE_JSON:" + JSON.stringify({ reconnect: true, leave: true, quit: true }));
    console.log("副本断线、离开与退出生命周期校验通过。");
}

function validateFbThresholds() {
    let userIndex = 0;
    const assert = (condition, message) => {
        if (!condition) throw new Error("副本硬门槛校验失败: " + message);
    };
    const makeUser = label => {
        const messages = [];
        const user = new USER();
        user.id = "validate-threshold-" + (++userIndex) + "-" + label;
        user.userid = user.id;
        user.name = "副本门槛校验角色";
        user.serverid = WORLD.SERVERID;
        user.level = 6;
        user.exp = 100000000;
        user.pot = 0;
        user.str = user.con = user.dex = user.int = 100;
        user.hp = user.max_hp = 100000000;
        user.mp = user.max_mp = 100000000;
        user.temp = { fb: 38, fb_unlock_order_v3: 1 };
        user.prop = {};
        user.items = [];
        user.equipment = [];
        user.skills = {};
        user.socket = { send(text) { messages.push(String(text)); } };
        return { user, messages };
    };
    const createScenario = (areaId, roomPath, temp, diff) => {
        const area = AREA.Get(areaId);
        const entryBase = area && ROOM.Get(area.first);
        assert(area && entryBase, areaId + " AREA 或入口不存在");
        const result = makeUser(areaId);
        const entry = entryBase.create_copy2(result.user, diff || 0);
        assert(entry, areaId + " 复制房间创建失败");
        entry.do_enter(result.user, false);
        const roomBase = ROOM.Get(roomPath);
        const room = roomBase && roomBase.query_copy(result.user.id);
        assert(room, roomPath + " 复制房间不存在");
        room.set_temp(result.user, "diff", diff || 0);
        for (const [key, value] of Object.entries(temp || {})) room.set_temp(result.user, key, value);
        result.area = area;
        result.entry = entry;
        result.room = room;
        result.cleanup = () => {
            if (result.user.environment) result.user.environment.item_changed(result.user, false);
            entry.clear_copy(result.user);
        };
        return result;
    };
    const runAction = (scenario, command, parameter) => {
        const action = scenario.room.actions && scenario.room.actions[command];
        assert(action && typeof action.action === "function", scenario.room.path + " 缺少动作 " + command);
        return action.action.call(scenario.room, scenario.user, parameter);
    };
    const setSkill = (user, skillId, level) => {
        assert(SKILL.get(skillId), "技能资源不存在: " + skillId);
        user.skills[skillId] = { level, exp: 0 };
    };

    const report = {
        piaomiaofeng: { cases: 0 },
        jingnian: { cases: 0 },
        xiakedao: { cases: 0 },
        yinyanggu: { cases: 0 },
        zhanshendian: { mp: 0, skillLevels: 0, quality: 0, skillCount: 0, fullRoute: false },
        isolated: true
    };

    for (const config of [
        { key: "str", threshold: 25 },
        { key: "dex", threshold: 25 },
        { key: "bridge_base_ds", threshold: 9000, temp: true }
    ]) {
        for (const value of [config.threshold - 1, config.threshold, config.threshold + 1]) {
            const scenario = createScenario("piaomiaofeng", "fb/piaomiaofeng/tiesuoqiao", {
                "fb/piaomiaofeng/carry_child": 1,
                "fb/piaomiaofeng/bridge_base_ds": 9000
            }, 0);
            scenario.user.str = 25;
            scenario.user.dex = 25;
            scenario.user.ds = 1;
            if (config.temp) scenario.room.set_temp(scenario.user, "fb/piaomiaofeng/bridge_base_ds", value);
            else scenario.user[config.key] = value;
            const result = scenario.room.on_leave(scenario.user, "north");
            const passed = scenario.room.query_temp(scenario.user, "fb/piaomiaofeng/bridge", 0) === 1;
            assert(passed === (value >= config.threshold), "缥缈峰 " + config.key + "=" + value + " 边界异常");
            assert((result === false) === !passed, "缥缈峰 " + config.key + "=" + value + " 返回值异常");
            scenario.cleanup();
            report.piaomiaofeng.cases++;
        }
    }
    for (const value of [14999, 15000, 15001]) {
        const scenario = createScenario("piaomiaofeng", "fb/piaomiaofeng/tiesuoqiao", {
            "fb/piaomiaofeng/carry_child": 1,
            "fb/piaomiaofeng/bridge_base_ds": value
        }, 1);
        scenario.user.str = 25;
        scenario.user.dex = 25;
        scenario.user.ds = 1;
        const result = scenario.room.on_leave(scenario.user, "north");
        const passed = scenario.room.query_temp(scenario.user, "fb/piaomiaofeng/bridge", 0) === 1;
        assert(passed === (value >= 15000), "缥缈峰困难 bridge_base_ds=" + value + " 边界异常");
        assert((result === false) === !passed, "缥缈峰困难 bridge_base_ds=" + value + " 返回值异常");
        scenario.cleanup();
        report.piaomiaofeng.cases++;
    }
    {
        const scenario = createScenario("piaomiaofeng", "fb/piaomiaofeng/tiesuoqiao", {
            "fb/piaomiaofeng/bridge_base_ds": 9000
        }, 0);
        scenario.user.str = 25;
        scenario.user.dex = 25;
        scenario.user.ds = 1;
        assert(scenario.room.on_leave(scenario.user, "north") === false
            && !scenario.room.query_temp(scenario.user, "fb/piaomiaofeng/bridge", 0), "缥缈峰未背负女童仍可过桥");
        scenario.cleanup();
        report.piaomiaofeng.cases++;
    }

    for (const level of [3999, 4000, 4001]) {
        const scenario = createScenario("jingnian", "fb/jingnian/yadi", {
            "fb/jingnian/route": "盗帅"
        }, 0);
        setSkill(scenario.user, "dodge", level);
        runAction(scenario, "jump");
        const passed = scenario.room.query_temp(scenario.user, "fb/jingnian/jump_done", 0) === 1;
        assert(passed === (level >= 4000), "净念盗帅轻功=" + level + " 边界异常");
        scenario.cleanup();
        report.jingnian.cases++;
    }
    for (const config of [
        { route: "盗帅", diff: 0, threshold: 9000 },
        { route: "邪王", diff: 1, threshold: 10000 }
    ]) {
        for (const value of [config.threshold - 1, config.threshold, config.threshold + 1]) {
            const scenario = createScenario("jingnian", "fb/jingnian/tongdian", {
                "fb/jingnian/route": config.route,
                "fb/jingnian/block_monk": 3
            }, config.diff);
            scenario.user.str = value;
            runAction(scenario, "push");
            const passed = scenario.room.query_temp(scenario.user, "fb/jingnian/push_done", 0) === 1;
            assert(passed === (value >= config.threshold), "净念" + config.route + "臂力=" + value + " 边界异常");
            scenario.cleanup();
            report.jingnian.cases++;
        }
    }
    for (const count of [2, 3, 4]) {
        const scenario = createScenario("jingnian", "fb/jingnian/tongdian", {
            "fb/jingnian/route": "邪王",
            "fb/jingnian/block_monk": count
        }, 1);
        scenario.user.str = 10000;
        runAction(scenario, "push");
        const passed = scenario.room.query_temp(scenario.user, "fb/jingnian/push_done", 0) === 1;
        assert(passed === (count >= 3), "净念邪王拦路僧=" + count + " 边界异常");
        scenario.cleanup();
        report.jingnian.cases++;
    }

    if (WORLD.COMMANDS.jh && WORLD.COMMANDS.jh.getAllMaps) WORLD.COMMANDS.jh.getAllMaps();
    const xiakedaoArea = AREA.Get("xiakedao");
    const xiakedaoEntry = xiakedaoArea && ROOM.Get(xiakedaoArea.first);
    const outside = ROOM.Get("yz/wumiao");
    assert(xiakedaoArea && xiakedaoEntry && outside, "侠客岛或武庙入口不存在");
    for (const energy of [59, 60, 61]) {
        const scenario = makeUser("xiakedao-" + energy);
        scenario.user.set_temp("ex_jl", 200 - energy);
        outside.do_enter(scenario.user, false);
        WORLD.COMMANDS.cr.enter(scenario.user, "xiakedao 0 0");
        const copy = xiakedaoEntry.query_copy(scenario.user.id);
        const entered = !!(copy && scenario.user.environment && scenario.user.environment.owner === scenario.user.id);
        assert(entered === (energy >= 60), "侠客岛精力=" + energy + " 入场边界异常");
        assert(scenario.user.query_jingli() === energy - (entered ? 60 : 0), "侠客岛精力=" + energy + " 扣除异常");
        if (scenario.user.environment) scenario.user.environment.item_changed(scenario.user, false);
        if (copy) copy.clear_copy(scenario.user);
        report.xiakedao.cases++;
    }

    for (const route of ["烛龙", "幽冥"]) {
        const scenario = createScenario("yinyanggu", "fb/yinyanggu/entry", {}, 0);
        runAction(scenario, "choose", route);
        assert(!scenario.room.query_temp(scenario.user, "fb/yinyanggu/route", 0), "阴阳谷无资格仍选择" + route + "路线");
        scenario.cleanup();
        report.yinyanggu.cases++;
    }
    for (const skillId of ["xuehaimogong", "qiankundanuoyi", "changshengjue"]) {
        const scenario = createScenario("yinyanggu", "fb/yinyanggu/entry", {}, 0);
        setSkill(scenario.user, skillId, 1);
        runAction(scenario, "choose", "烛龙");
        assert(scenario.room.query_temp(scenario.user, "fb/yinyanggu/route", 0) === "烛龙", "阴阳谷烛龙路线不接受 " + skillId);
        scenario.cleanup();
        report.yinyanggu.cases++;
    }
    {
        const scenario = createScenario("yinyanggu", "fb/yinyanggu/entry", {}, 0);
        setSkill(scenario.user, "changshengjue", 1);
        runAction(scenario, "choose", "幽冥");
        runAction(scenario, "choose", "烛龙");
        assert(scenario.room.query_temp(scenario.user, "fb/yinyanggu/route", 0) === "幽冥"
            && scenario.room.query_fb_state(scenario.user).route === "幽冥", "阴阳谷路线锁定后仍可切换");
        scenario.cleanup();
        report.yinyanggu.cases++;
    }

    const makeHeaven = (heaven, label) => createScenario("zhanshendian", "fb/zhanshendian/jiuzhong", {
        "fb/zhanshendian/heaven": heaven
    }, 1);
    for (const config of [
        { maxMp: 9999999, mp: 10000000, passed: false },
        { maxMp: 10000000, mp: 9999999, passed: false },
        { maxMp: 10000000, mp: 10000000, passed: true, remain: 0 },
        { maxMp: 10000001, mp: 10000001, passed: true, remain: 1 }
    ]) {
        const scenario = makeHeaven(3, "mp");
        scenario.user.max_mp = config.maxMp;
        scenario.user.mp = config.mp;
        runAction(scenario, "ascend");
        const passed = scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === 4;
        assert(passed === config.passed, "战神殿内力 " + config.maxMp + "/" + config.mp + " 边界异常");
        assert(scenario.user.mp === (config.passed ? config.remain : config.mp), "战神殿第四重内力扣除异常");
        scenario.cleanup();
        report.zhanshendian.mp++;
    }
    for (const config of [
        { heaven: 5, type: "force", skill: "hamagong" },
        { heaven: 6, type: "dodge", skill: "xuanxubu" },
        { heaven: 7, type: "parry", skill: "douzhuanxingyi" }
    ]) {
        for (const level of [4999, 5000, 5001]) {
            const scenario = makeHeaven(config.heaven, config.type);
            setSkill(scenario.user, config.skill, level);
            runAction(scenario, "ascend");
            const passed = scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === config.heaven + 1;
            assert(passed === (level >= 5000), "战神殿" + config.type + "武学=" + level + " 边界异常");
            scenario.cleanup();
            report.zhanshendian.skillLevels++;
        }
    }
    for (const config of [
        { skill: "shenghuoshengong", passed: false },
        { skill: "hamagong", passed: true },
        { skill: "longxianggong", passed: true }
    ]) {
        const scenario = makeHeaven(5, "quality");
        setSkill(scenario.user, config.skill, 5000);
        runAction(scenario, "ascend");
        const passed = scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === 6;
        assert(passed === config.passed, "战神殿武学品质边界异常: " + config.skill);
        scenario.cleanup();
        report.zhanshendian.quality++;
    }
    const redSkills = ["changshengjue", "xuanxubu", "douzhuanxingyi", "bianjianfa", "tanzhishentong", "hamagong"];
    for (const count of [4, 5, 6]) {
        const scenario = makeHeaven(8, "count");
        for (const skillId of redSkills.slice(0, count)) setSkill(scenario.user, skillId, 5000);
        runAction(scenario, "ascend");
        const passed = scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === 9;
        assert(passed === (count >= 5), "战神殿五项红色武学数量=" + count + " 边界异常");
        scenario.cleanup();
        report.zhanshendian.skillCount++;
    }
    {
        const scenario = makeHeaven(0, "full");
        const state = scenario.room.query_fb_state(scenario.user);
        state.score = 95;
        state.milestones = { "剑魂": 1, "战魂": 1, "兵主魂": 1 };
        runAction(scenario, "ascend");
        assert(scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === 0, "战神殿缺少刀皇仍通过第一重");
        state.milestones["刀皇"] = 1;
        for (const skillId of redSkills.slice(0, 5)) setSkill(scenario.user, skillId, 5000);
        scenario.user.max_mp = scenario.user.mp = 10000001;
        const parameters = [undefined, undefined, "死门", undefined, "守心", undefined, undefined, undefined, undefined];
        for (let level = 1; level <= 9; level++) {
            runAction(scenario, "ascend", parameters[level - 1]);
            assert(scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === level, "战神殿完整九重在第" + level + "重未准确推进");
        }
        assert(scenario.user.mp === 1 && state.score === 100 && state.milestones["踏九重天"], "战神殿九重结算或内力扣除异常");
        runAction(scenario, "ascend");
        assert(scenario.room.query_temp(scenario.user, "fb/zhanshendian/heaven", 0) === 9
            && scenario.user.mp === 1 && state.score === 100, "战神殿九重重复操作改变状态");
        scenario.cleanup();
        report.zhanshendian.fullRoute = true;
    }

    console.log("FB_THRESHOLDS_JSON:" + JSON.stringify(report));
    console.log("副本精力、属性、武学与路线资格硬门槛边界校验通过。");
}

function validateFbEquipment() {
    const fs = UTIL.require("fs");
    const path = UTIL.require("path");
    const root = path.join(__PATH.OBJ, "eq", "fb");
    const files = [];
    const walk = (dir, relative) => {
        if (!fs.existsSync(dir)) return;
        for (const name of fs.readdirSync(dir)) {
            const full = path.join(dir, name);
            if (fs.statSync(full).isDirectory()) {
                walk(full, relative + name + "/");
            } else if (name.endsWith(".js")) {
                files.push(relative + name.slice(0, -3));
            }
        }
    };
    walk(root, "eq/fb/");
    if (!files.length) throw new Error("未找到副本装备资源");

    const numericProps = item => {
        const props = {};
        const add = source => {
            if (!source) return;
            for (const [key, value] of Object.entries(source)) {
                if (typeof value === "number" && Number.isFinite(value)) props[key] = (props[key] || 0) + value;
            }
        };
        add(item.prop);
        for (const stone of item.st_prop || []) add(stone.prop);
        return props;
    };
    const snapshot = user => {
        const values = { prop: {}, gj: user.gj, fy: user.fy, mz: user.mz, ds: user.ds, zj: user.zj };
        for (const [key, value] of Object.entries(user.prop || {})) {
            if (typeof value === "number" && Number.isFinite(value) && value !== 0) values.prop[key] = value;
        }
        return values;
    };
    const equalNumber = (left, right) => left === right;
    const makeUser = id => {
        const user = new USER();
        user.id = id;
        user.name = "副本装备校验角色";
        user.str = user.con = user.dex = user.int = 1000;
        user.gender = 2;
        user.max_mp = user.mp = 100000;
        user.hp = user.max_hp = 100000;
        user.prop = {};
        user.items = [];
        user.equipment = [];
        user.skills = {};
        user.auto_skills = [];
        user.socket = { send() {} };
        user.notify_fail = () => false;
        user.query_skill = () => 999;
        user.query_used_skill = () => null;
        user.on_skillchanged = null;
        return user;
    };
    const failures = [];
    const rows = [];
    const byType = new Set();
    for (const resourcePath of files.sort()) {
        const item = OBJ.CREATE(resourcePath);
        if (!item || !item.is_equipment) {
            failures.push(resourcePath + ":不是装备");
            continue;
        }
        const reference = globalThis.FB_EQUIPMENT_REFERENCE && globalThis.FB_EQUIPMENT_REFERENCE[item.name];
        if (!reference) {
            failures.push(resourcePath + ":缺少参考文档装备规格");
            continue;
        }
        if (item.desc !== reference.desc) failures.push(resourcePath + ":装备说明未应用参考文档");
        if (JSON.stringify(item.prop || {}) !== JSON.stringify(reference.prop || {})) {
            failures.push(resourcePath + ":装备属性未应用参考文档");
        }
        if (JSON.stringify(item.condition || {}) !== JSON.stringify(reference.condition || {})) {
            failures.push(resourcePath + ":装备条件未应用参考文档");
        }
        if (reference.holeCount !== undefined && item.hole_count !== reference.holeCount) {
            failures.push(resourcePath + ":装备孔位未应用参考文档");
        }
        byType.add(item.eq_type);
        const user = makeUser(resourcePath);
        const before = snapshot(user);
        user.items.push(item);
        user.recount();
        const base = snapshot(user);
        user.equip(item);
        const equipped = snapshot(user);
        if (user.equipment[item.eq_type] !== item || user.items.includes(item)) {
            failures.push(resourcePath + ":装备槽或背包状态错误");
        }
        const expected = numericProps(item);
        for (const [key, value] of Object.entries(expected)) {
            const delta = (equipped.prop[key] || 0) - (base.prop[key] || 0);
            if (!equalNumber(delta, value)) failures.push(resourcePath + ":属性" + key + "增加" + delta + "应为" + value);
        }
        const duplicate = snapshot(user);
        user.equip(item);
        const duplicateAfter = snapshot(user);
        if (JSON.stringify(duplicate) !== JSON.stringify(duplicateAfter)) failures.push(resourcePath + ":重复装备改变属性");
        if (user.unequip(item, true) === false) failures.push(resourcePath + ":卸下失败");
        const restored = snapshot(user);
        if (user.equipment[item.eq_type] || !user.items.includes(item)) failures.push(resourcePath + ":卸下后槽位或背包错误");
        if (JSON.stringify(base) !== JSON.stringify(restored)) failures.push(resourcePath + ":卸下后属性未完全恢复");
        user.unequip(item, true);
        if (JSON.stringify(restored) !== JSON.stringify(snapshot(user))) failures.push(resourcePath + ":重复卸下改变属性");

        rows.push({ path: resourcePath, type: item.eq_type, grade: item.grade, props: expected });
    }

    const weapons = files.filter(resourcePath => {
        const item = OBJ.CREATE(resourcePath);
        return item && item.eq_type === EQUIP_TYPE.WEAPON;
    });
    if (weapons.length >= 2) {
        const user = makeUser("weapon-switch");
        const first = OBJ.CREATE(weapons[0]);
        const second = OBJ.CREATE(weapons[1]);
        user.recount();
        const weaponBase = snapshot(user);
        user.items.push(first, second);
        user.equip(first);
        const firstState = snapshot(user);
        user.equip(second);
        const secondState = snapshot(user);
        const expectedSecond = numericProps(second);
        const keys = new Set([...Object.keys(numericProps(first)), ...Object.keys(expectedSecond)]);
        for (const key of keys) {
            const delta = (secondState.prop[key] || 0) - (firstState.prop[key] || 0);
            const expectedDelta = (expectedSecond[key] || 0) - (numericProps(first)[key] || 0);
            if (delta !== expectedDelta) failures.push("武器切换属性" + key + "残留");
        }
        if (user.equipment[EQUIP_TYPE.WEAPON] !== second || !user.items.includes(first)) failures.push("武器切换槽位或背包错误");
        user.unequip(second, true);
        if (JSON.stringify(snapshot(user)) !== JSON.stringify(weaponBase)) failures.push("武器切换卸下后属性未恢复");
    }
    const setPaths = [
        "eq/fb/zhanshendian/molong_zhanjia", "eq/fb/zhanshendian/jinbi_guguan",
        "eq/fb/zhanshendian/mufeng_yuxue", "eq/fb/zhanshendian/huoni_doupeng"
    ];
    const setUser = makeUser("zhanshen-set");
    const setItems = setPaths.map(resourcePath => OBJ.CREATE(resourcePath));
    setUser.items.push(...setItems);
    setUser.recount();
    const setBase = snapshot(setUser);
    for (const item of setItems) setUser.equip(item);
    for (const key of ["gj_per", "mz_per", "zj_per", "ds_per", "fy_per"]) {
        const itemTotal = setItems.reduce((total, item) => total + ((item.prop && item.prop[key]) || 0), 0);
        if ((setUser.prop[key] || 0) - (setBase.prop[key] || 0) !== itemTotal + 10) failures.push("战神殿四件套" + key + "未生效");
    }
    setUser.unequip(setItems[0], true);
    for (const key of ["gj_per", "mz_per", "zj_per", "ds_per", "fy_per"]) {
        const remainingTotal = setItems.slice(1).reduce((total, item) => total + ((item.prop && item.prop[key]) || 0), 0);
        if ((setUser.prop[key] || 0) - (setBase.prop[key] || 0) !== remainingTotal) failures.push("战神殿四件套" + key + "卸下一件后未清理");
    }
    const costUser = makeUser("equipment-cost");
    const yaoyue = OBJ.CREATE("eq/fb/yihuagong/yaoyue_shouhuan");
    costUser.items.push(yaoyue);
    costUser.equip(yaoyue);
    const costPerform = SKILL.get("tanzhishentong").pfm.jinglei;
    if (costPerform.query_mp(costUser, 1000) !== 900) failures.push("邀月的手镯内力消耗减少120未生效");
    if (byType.size < 4) failures.push("副本装备部位覆盖不足");
    if (failures.length) throw new Error("副本装备穿卸校验失败: " + failures.join(","));
    console.log("FB_EQUIPMENT_JSON:" + JSON.stringify({ count: rows.length, types: [...byType].sort((a, b) => a - b), rows }));
    console.log("副本装备穿戴、卸下、重复操作和武器切换校验通过，共" + rows.length + " 件。");
}

function validateFbSkills() {
    const expected = {
        zhaixinggong: 2, feixingshu: 2, shenjianjue: 2, tiannanbu: 2,
        anyingfuxiang: 3, luoyingshenjian: 3, sanyinwugongzhao: 3, tianyuqijian: 3,
        shenghuoshengong: 3, duanjiajian: 3, yunvxinjing: 3, yinsuojinling: 3,
        tanzhishentong: 4, lingshezhangfa: 4, hamagong: 4, huagongdafa: 4,
        canhezhi: 4, kuihuashengong: 4, kumushengong: 4, yiyangzhi: 4,
        xuanxubu: 4, bianjianfa: 4, douzhuanxingyi: 5, bulaochangchungong: 5,
        liumaishenjian: 5, anranxiaohunzhang: 5, xuantiejianfa: 5, jiuyinshengong: 5,
        taixuangong: 5, wunianchangong: 5, rulaishenzhang: 5, lingxibu: 5,
        changshengjue: 6, cihangjiandian: 6, yinyangjiuzhuan: 6, zhanshentulu: 6
    };
    const expectedEnables = {
        zhaixinggong: ["dodge"], feixingshu: ["throwing"], shenjianjue: ["sword"], tiannanbu: ["dodge"],
        anyingfuxiang: ["dodge"], luoyingshenjian: ["sword"], sanyinwugongzhao: ["unarmed", "parry"], tianyuqijian: ["sword"],
        shenghuoshengong: ["force"], duanjiajian: ["sword"], yunvxinjing: ["force"], yinsuojinling: ["whip"],
        tanzhishentong: ["unarmed"], lingshezhangfa: ["staff", "parry"], hamagong: ["force", "unarmed"], huagongdafa: ["force"],
        canhezhi: ["unarmed"], kuihuashengong: ["force", "dodge"], kumushengong: ["force"], yiyangzhi: ["unarmed"],
        xuanxubu: ["dodge"], bianjianfa: ["sword", "parry"], douzhuanxingyi: ["parry"], bulaochangchungong: ["force"],
        liumaishenjian: ["unarmed"], anranxiaohunzhang: ["unarmed"], xuantiejianfa: ["sword", "parry"], jiuyinshengong: ["force"],
        taixuangong: ["force"], wunianchangong: ["force"], rulaishenzhang: ["unarmed"], lingxibu: ["dodge"],
        changshengjue: ["force"], cihangjiandian: ["force"], yinyangjiuzhuan: ["force"], zhanshentulu: ["force"]
    };
    const expectedPerforms = {
        feixingshu: [["星雨", 1020, 4000, 10000]],
        shenjianjue: [["剑芒", 2550, 500, 30000], ["剑气", 2550, 3700, 20000]],
        anyingfuxiang: [["暗影", 1020, 500, 32000]],
        luoyingshenjian: [["落英缤纷", 1020, 4000, 10000]],
        sanyinwugongzhao: [["三阴毒爪", 1020, 4000, 18000], ["追魂爪", 1020, 4000, 18000]],
        tianyuqijian: [["天女散花", 1887, 4000, 20000], ["天羽诀", 2448, 4000, 15000]],
        shenghuoshengong: [["圣火护体", 1020, 500, 60000]],
        duanjiajian: [["一阳剑气", 1020, 4000, 35000], ["无形剑气", 1020, 4000, 35000]],
        yunvxinjing: [["轻舞", 1020, 4000, 28000]],
        yinsuojinling: [["隔空点穴", 1020, 4000, 30000]],
        tanzhishentong: [["弹指惊雷", 1020, 4000, 20000], ["点穴", 1020, 4000, 30000]],
        lingshezhangfa: [["灵蛇出洞", 1020, 4000, 10000]],
        hamagong: [["蛤蟆吸气", 1020, 500, 20000], ["蛤蟆冲击", 1020, 4000, 5000]],
        huagongdafa: [["化毒", 0, 500, 30000], ["化功", 0, 500, 20000]],
        canhezhi: [["参合之殇", 1020, 4000, 20000]],
        kuihuashengong: [["鬼魅", 1020, 500, 30000]],
        kumushengong: [["枯木逢春", 1020, 500, 60000]],
        yiyangzhi: [["一指乾坤", 1020, 4000, 20000], ["点穴", 1020, 4000, 30000]],
        xuanxubu: [["幻影", 1020, 500, 45000]],
        bianjianfa: [["彼岸九式", 2040, 3000, 35000]],
        douzhuanxingyi: [["星移", 2550, 4000, 30000], ["斗转", 4590, 4000, 30000]],
        bulaochangchungong: [["不老长春", 1020, 4000, 28000], ["唯我独尊", 2040, 4000, 40000]],
        liumaishenjian: [["无形剑气", 1530, 4000, 30000], ["六脉纵横", 1530, 4000, 20000]],
        anranxiaohunzhang: [["无中生有", 1734, 4000, 20000], ["呆若木鸡", 1020, 4000, 36000]],
        xuantiejianfa: [["海潮汹涌", 0, 4000, 30000], ["重剑无锋", 2040, 4000, 30000]],
        jiuyinshengong: [["追魂", 1020, 4000, 30000], ["逆转九阴", 1020, 500, 60000]],
        taixuangong: [["十步杀一人", 1020, 4000, 30000], ["白首太玄", 1020, 4000, 45000]],
        wunianchangong: [["净念", 2550, 500, 30000], ["无念", 2040, 4000, 30000], ["闭口禅", 4080, 500, 50000]],
        rulaishenzhang: [["万佛朝宗", 6120, 4000, 25000], ["灭魔", 6120, 4000, 48000]],
        lingxibu: [["比翼", 6120, 500, 60000]],
        changshengjue: [["天地决", 188700, 4000, 60000], ["混沌诀", 118320, 4000, 60000]],
        cihangjiandian: [["心有灵犀", 58650, 4000, 30000], ["剑心通明", 132600, 4000, 60000]],
        yinyangjiuzhuan: [["转阴阳", 6120, 4000, 30000], ["定乾坤", 107100, 4000, 60000], ["镇天地", 84150, 4000, 60000]],
        zhanshentulu: [["战神决", 46920, 4000, 60000], ["湮灭", 64770, 4000, 45000], ["破碎九重天", 0, 4000, 60000]]
    };
    const failures = [];
    const snapshot = user => Object.fromEntries(Object.entries(user.prop || {})
        .filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value !== 0));
    const makeUser = () => {
        const user = new USER();
        user.is_player = false;
        user.str = user.con = user.dex = user.int = 1000;
        user.max_mp = user.mp = 100000;
        user.exp = 100000000;
        user.level = 6;
        user.gender = 1;
        user.prop = {};
        user.skills = {};
        user.notify = () => {};
        user.notify_fail = () => false;
        user.send = () => {};
        user.add_score = () => {};
        user.query_used_skill = () => null;
        user.query_weapon_type = () => WEAPON_TYPE.NONE;
        user.on_skillchanged = null;
        user.recount = () => {};
        return user;
    };
    const makeCombatUser = id => {
        const user = {
            id: id,
            name: id,
            hp: 1000000,
            max_hp: 1000000,
            mp: 1000000,
            max_mp: 1000000,
            gj: 10000,
            mz: 10000,
            ds: 1000,
            fy: 1000,
            diff_sh_per: 10,
            status: [],
            temp: {},
            enemy: [],
            query_prop() { return 0; },
            query_skill() { return 1000; },
            query_status(sid) {
                const item = this.status.find(status => status.id === sid);
                return item ? item.count || 1 : 0;
            },
            add_status(status) {
                const current = this.status.find(item => item.id === status.id);
                if (current && status.override === 1) current.count = Math.min(status.max_count || 10, (current.count || 1) + (status.count || 1));
                else if (current) Object.assign(current, status);
                else this.status.push(Object.assign({ count: 1 }, status));
                return true;
            },
            remove_status(sid) { this.status = this.status.filter(status => status.id !== sid); },
            remvoe_statuses(filter) { const before = this.status.length; this.status = this.status.filter(status => !filter(status)); return before - this.status.length; },
            clear_status() { this.status = []; },
            query_temp(key) { return this.temp[key]; },
            set_temp(key, value) { this.temp[key] = value; },
            remove_temp(key) { delete this.temp[key]; },
            add_hp(value) { this.hp = Math.max(0, Math.min(this.max_hp, this.hp + value)); return value; },
            add_mp(value) { this.mp = Math.max(0, Math.min(this.max_mp, this.mp + value)); return value; },
            do_recover(value) { return this.add_hp(value); },
            damage2(value) { this.add_hp(-Math.max(0, value)); return value; },
            do_attack(options) { if (!options || !options.target) return 0; return Math.max(1, Math.floor(options.gj || this.gj)); },
            end_attack() {},
            send_room() {},
            notify() {},
            is_here() { return true; },
            call_out() { return 0; }
        };
        return user;
    };
    const baseSkills = ["force", "dodge", "parry", "unarmed", "sword", "blade", "staff", "club", "whip", "throwing"];
    for (const [id, grade] of Object.entries(expected)) {
        if (grade === null) continue;
        const skill = SKILL.get(id);
        if (!skill) {
            failures.push(id + ":技能资源不存在");
            continue;
        }
        if (skill.grade !== grade) failures.push(id + ":品质为" + skill.grade + "应为" + grade);
        if (!Array.isArray(skill.can_enables) || !skill.can_enables.length) {
            failures.push(id + ":缺少激活基本功");
            continue;
        }
        if (JSON.stringify(skill.can_enables) !== JSON.stringify(expectedEnables[id])) {
            failures.push(id + ":激活基本功与参考资料不符");
        }
        const book = OBJ.CREATE("book/bc#" + id);
        if (!book || book.skill !== id) failures.push(id + ":武学残页无法创建");

        const user = makeUser();
        for (const base of baseSkills) user.skills[base] = { level: 1000, exp: 0, enable_skill: null };
        if (skill.do_learn && skill.do_learn(user) === false) failures.push(id + ":学习条件校验失败");
        const before = snapshot(user);
        user.skills[id] = { level: 100, exp: 0 };
        for (const base of skill.can_enables) {
            if (!user.skills[base]) user.skills[base] = { level: 1000, exp: 0, enable_skill: null };
            if (skill.enable(user, base) !== true) {
                failures.push(id + ":激活" + base + "失败");
                continue;
            }
            user.skills[base].enable_skill = id;
            user.skills[id][base] = true;
            skill.disenable(user, base);
            user.skills[base].enable_skill = null;
            user.skills[id][base] = false;
            if (JSON.stringify(snapshot(user)) !== JSON.stringify(before)) {
                failures.push(id + ":取消激活" + base + "后属性未恢复");
            }
        }
        if (user.remove_skill(id) !== true || user.skills[id]) failures.push(id + ":放弃武学失败");
        user.set_skill(id, 1);
        if (!user.skills[id] || user.query_skill(id) !== 1) failures.push(id + ":重新学习失败");
        if (user.remove_skill(id) !== true || user.skills[id]) failures.push(id + ":重新学习后再次放弃失败");

        const performs = Object.values(skill.pfm || {});
        const performSpec = expectedPerforms[id] || [];
        if (performs.length !== performSpec.length) {
            failures.push(id + ":绝招数量为" + performs.length + "应为" + performSpec.length);
        }
        for (let i = 0; i < performSpec.length; i++) {
            const actual = performs[i];
            const expectedPerform = performSpec[i];
            if (!actual) continue;
            if (actual.name !== expectedPerform[0]) failures.push(id + ":绝招名称错误");
            if (typeof actual.use !== "function" || typeof actual.query_desc !== "function") failures.push(id + ":绝招缺少可执行实现");
            if (actual.query_mp(user, 1000) !== expectedPerform[1]) failures.push(id + ":" + actual.name + "内力消耗错误");
            if (actual.query_releasetime(user, 1000) !== expectedPerform[2]) failures.push(id + ":" + actual.name + "出招时间错误");
            if (actual.query_distime(user, 1000) !== expectedPerform[3]) failures.push(id + ":" + actual.name + "冷却时间错误");
            if (!actual.query_desc(user, 1000)) failures.push(id + ":" + actual.name + "缺少招式说明");
            const attacker = makeCombatUser("perform-attacker");
            const target = makeCombatUser("perform-target");
            attacker.enemy = [target];
            target.enemy = [attacker];
            try {
                if (actual.use(attacker, target, 1000, actual.enable_skill) === false) {
                    failures.push(id + ":" + actual.name + "实战调用返回失败");
                }
            } catch (error) {
                failures.push(id + ":" + actual.name + "实战调用异常(" + error.message + ")");
            }
        }
    }
    if (failures.length) throw new Error("副本武学学习/激活校验失败: " + failures.join(","));
    console.log("FB_SKILLS_JSON:" + JSON.stringify({ count: Object.keys(expected).length, performs: Object.values(expectedPerforms).flat().length }));
    console.log("副本武学创建、品质、学习、激活、招式、放弃和重新学习校验通过。");
}

function validateFbLoot() {
    const failures = [];
    const makeUser = (filter, maxItems, id) => {
        const user = new USER();
        user.id = id || "validate-fb-loot";
        user.name = "战利品校验角色";
        user.settings = { auto_get: 1, auto_get_filter: filter };
        user.max_item_count = maxItems;
        user.items = [];
        user.money = 0;
        user.socket = { send() {} };
        user.notify = () => {};
        user.environment = null;
        return user;
    };
    const highEquipment = OBJ.CREATE("eq/fb/binghuo/tulongdao");
    const material = OBJ.CREATE("sp/fb/yinyanggu/pojun");
    if (!highEquipment || !material) throw new Error("战利品校验资源缺失");

    const filter = JSON.stringify([
        { action: "ignore", type: "equipment", grade: 5, gradeOp: ">=" },
        { action: "sell", type: "material" }
    ]);
    const user = makeUser(filter, 0);
    if (!WORLD.has_loot_filter(user)) failures.push("过滤规则未启用");
    const highAction = WORLD.query_loot_action(user, highEquipment);
    const materialAction = WORLD.query_loot_action(user, material);
    if (highAction.action !== "ignore") failures.push("高品质装备忽略规则未命中");
    if (materialAction.action !== "sell") failures.push("材料自动出售规则未命中");
    const ignored = WORLD.accept_loot_item(user, highEquipment, { action: "ignore" });
    if (ignored || user.items.length) failures.push("忽略物品错误进入背包");
    const sold = WORLD.accept_loot_item(user, material, { action: "sell", allowDirectSell: true });
    if (!sold || user.items.length || user.money !== material.value * material.count) failures.push("满包材料未自动出售");

    const room = {
        items: [],
        is_fb() { return false; },
        item_changed() {},
        find_obj(id) { return this.items.find(item => item.id === id); }
    };
    const corpse = new CORPSE();
    corpse.create_id();
    corpse.items = [OBJ.CREATE("eq/fb/binghuo/tulongdao")];
    corpse.environment = room;
    room.items.push(corpse);
    const picker = makeUser(JSON.stringify([{ action: "pick", type: "equipment" }]), 2);
    picker.environment = room;
    const rumors = [];
    const sendAll = WORLD.sendAll;
    WORLD.sendAll = message => rumors.push(String(message));
    picker.set_temp("auto_get_filtering", 1);
    WORLD.COMMANDS.get.enter(picker, "", "all", corpse.id);
    WORLD.sendAll = sendAll;
    if (!picker.find_obj_bypath("eq/fb/binghuo/tulongdao")) failures.push("过滤拾取未进入背包");
    if (!rumors.some(message => message.includes("听说有人捡到了一"))) failures.push("高品质拾取未发送传闻");

    const full = makeUser("0", 1);
    full.items.push(OBJ.CREATE("eq/fb/taohuadao/ruanweijia"));
    const blocked = WORLD.accept_loot_item(full, OBJ.CREATE("eq/fb/binghuo/tulongdao"), { action: "pick" });
    if (blocked || full.items.length !== 1) failures.push("背包满时仍错误拾取装备");

    const memberOne = makeUser("0", 20, "loot-member-1");
    const memberTwo = makeUser("0", 20, "loot-member-2");
    memberOne.name = "需求队员一";
    memberTwo.name = "需求队员二";
    memberOne.random = () => 99;
    memberTwo.random = () => 0;
    const teamRoom = {
        parent: { no_team: false, is_copy: false },
        is_fb() { return false; },
        items: [memberOne, memberTwo],
        find_obj(id) { return this.items.find(item => item.id === id); },
        item_changed() {}
    };
    memberOne.environment = teamRoom;
    memberTwo.environment = teamRoom;
    WORLD.USERS.push(memberOne, memberTwo);
    memberTwo.set_temp("team", memberOne.id);
    WORLD.COMMANDS.team.team_reply(memberTwo, "ok");
    const team = memberOne.team;
    const teamItem = OBJ.CREATE("eq/fb/binghuo/tulongdao");
    team.objs = [teamItem];
    teamItem.dice = { user: null, users: [memberOne.id, memberTwo.id], num: 0 };
    WORLD.COMMANDS.dice.enter(memberOne, 0, teamItem.id);
    WORLD.COMMANDS.dice.enter(memberTwo, 0, teamItem.id);
    if (!memberOne.find_obj_bypath(teamItem.path) || memberTwo.find_obj_bypath(teamItem.path)
        || team.objs.length || teamItem.dice) {
        failures.push("组队需求分配未按投骰结果唯一发放");
    }
    if (failures.length) throw new Error("战利品过滤/背包边界校验失败: " + failures.join(","));
    console.log("FB_LOOT_JSON:" + JSON.stringify({ filter: true, ignore: true, sell: true, full: true, rumor: true, party: true }));
    console.log("战利品过滤、忽略、自动出售、背包满、高品质传闻和组队分配校验通过。");
}

function validateFbSweepStats() {
    const area = AREA.Get("binghuo");
    if (!area) throw new Error("扫荡统计找不到冰火岛");
    if (WORLD.COMMANDS.jh && WORLD.COMMANDS.jh.getAllMaps) WORLD.COMMANDS.jh.getAllMaps();
    const originalLimit = area.fb_daily_limit;
    area.fb_daily_limit = 1000000;
    const run = diff => {
        let special = 0;
        let runs = 0;
        for (let i = 0; i < 1000; i++) {
            const user = new USER();
            user.id = "validate-sweep-stats-" + diff + "-" + i;
            user.name = "扫荡统计角色";
            user.level = 6;
            user.exp = 100000000;
            user.temp = { fb: 38, fb_unlock_order_v3: 1 };
            user.items = [];
            user.max_item_count = 100000;
            const messages = [];
            user.socket = { send(message) { messages.push(String(message)); } };
            user.environment = { is_fb() { return false; }, parent: null };
            user.query_jingli = () => 1000000;
            user.expend_jingli = () => true;
            const token = OBJ.CREATE("cash/saodang");
            token.count = 2;
            user.items.push(token);
            user.set_temp("fb_sao" + area.query_record_index(), diff ? 2 : 1);
            WORLD.COMMANDS.cr.enter(user, "binghuo " + (diff ? 1 : 0) + " 1");
            const item = user.find_obj_bypath("eq/fb/binghuo/tulongdao");
            if (item) special += item.count || 1;
            if (user.query_temp("fb_count", 0) !== 1) throw new Error("扫荡未完成: " + diff + ":" + i + ":" + messages.join("|"));
            runs++;
        }
        return { runs, special };
    };
    let normal;
    let hard;
    try {
        normal = run(false);
        hard = run(true);
    } finally {
        area.fb_daily_limit = originalLimit;
    }
    if (normal.special !== 0 || hard.special < 20 || hard.special > 300) {
        throw new Error("扫荡模式掉落统计异常: " + JSON.stringify({ normal, hard }));
    }
    console.log("FB_SWEEP_STATS_JSON:" + JSON.stringify({ normal, hard, isolated: true }));
    console.log("普通/困难扫荡各1000次统计通过，模式专属掉落未跨模式出现。");
}

// Recovery storage is optional in this distribution and must not interrupt gameplay.
if (typeof WORLD.add_recover_obj !== "function") {
    WORLD.add_recover_obj = function () {
        return false;
    }
}

const illegalUARegex = /node|python|java|curl|wget|postman|robot|spider|bot/i;
const Origins = [];
WORLD.check_connect = function (socket) {
    if (WORLD.SERVER.istest) return true;

    return true;
}

WORLD.close = async function () {
    if (this._closePromise) return this._closePromise;

    this._closePromise = (async () => {
        WORLD.status = -1;
        WORLD.is_closing = true;
        console.log('正在关闭服务器，等待在线角色完成存档');

        if (this.heart_beat_service) {
            clearInterval(this.heart_beat_service);
            this.heart_beat_service = null;
        }

        if (process.env.WSMUD_VALIDATE_RESOURCES === "1") {
            await this.DB.close();
            console.log("资源校验模式仅关闭数据连接，不保存运行数据");
            return true;
        }

        if (this.ADMIN_BRIDGE) await this.ADMIN_BRIDGE.close();

        if (this.LISTENER && this.LISTENER.tcpServer && this.LISTENER.tcpServer.listening) {
            await this.LISTENER.close();
        }
        console.log('关闭网络连接');

        for (let user of this.USERS) {
            if (!user.socket) continue;
            const socket = user.socket;
            user.socket = null;
            socket.user = null;
            socket.end();
        }

        if (await WORLD.save()) {
            await this.DB.close();
            console.log('关闭数据连接');
            return true;
        }
        return false;
    })();

    return this._closePromise;
}
