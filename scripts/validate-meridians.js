const fs = require("fs");
const path = require("path");
const vm = require("vm");

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function createHarness() {
    function Character() {}
    Character.prototype.query_prop = function () { return 0; };
    Character.prototype.query_force_rad = function () { return 0.1; };
    Character.prototype.is_fighting = function () { return this.fight_type > 0; };

    function User() {
        this.is_player = true;
        this.level = 2;
        this.max_mp = 100000;
        this.mp = 100000;
        this.limit_mp = 300000;
        this.max_hp = 11000;
        this.hp = 11000;
        this.con = 200;
        this.fight_type = 0;
        this.is_faint = false;
        this.is_busy = false;
        this.state = null;
        this.titles = [];
        this.environment = {
            name: "练功房",
            can_practice_meridian: true,
            parent: { not_fb: true },
            is_copy() { return true; }
        };
        this.saveCount = 0;
        this.saveResult = true;
    }
    User.prototype = Object.create(Character.prototype);
    User.prototype.constructor = User;
    User.prototype.loadData = function () {};
    User.prototype.getData = function () { return { data: "{base:1}" }; };
    User.prototype.do_login = function () { return true; };
    User.prototype.query_title = function (type) {
        const item = this.titles.find(entry => entry.type === type);
        return item ? item.title : null;
    };
    User.prototype.add_title = function (title, type) {
        this.titles = this.titles.filter(entry => entry.type !== type);
        if (title) this.titles.push({ title, type });
    };
    User.prototype.recount = function () {
        this.max_hp = Math.max(1, parseInt(this.con * 5
            + (this.max_mp * this.query_force_rad() + this.query_prop("max_hp")
                + this.query_prop("con") * this.con)
            * (100 + this.query_prop("hp_per")) / 100));
        if (this.hp > this.max_hp) this.hp = this.max_hp;
    };
    User.prototype.notify_hp = function () {};
    User.prototype.notify = function () {};
    User.prototype.notify_fail = function () {};
    User.prototype.send = function () {};
    User.prototype.set_state = function (state) { this.state = state; };
    User.prototype.save = async function () {
        this.saveCount++;
        return this.saveResult;
    };

    const contextJson = {
        stringify: JSON.stringify,
        parse: JSON.parse,
        toObject(value) {
            return Function("return (" + value + ")")();
        }
    };
    const context = {
        console,
        CHARACTER: Character,
        USER: User,
        SKILL: { get() { return null; } },
        JSON: contextJson,
        Number,
        Math
    };
    const source = fs.readFileSync(path.join(__dirname, "..", "world/extends/char/meridian.js"), "utf8");
    vm.runInNewContext(source, context, { filename: "world/extends/char/meridian.js" });
    return { User, JSON: contextJson };
}

async function validateConfiguration(User) {
    const user = new User();
    let view = user.query_meridian_view();
    assert(view.totalNodes === 194, "经脉总穴位数错误");
    assert(view.totalSpent === 0, "初始累计投入不为0");
    assert(view.items.length === 10, "经脉数量错误");
    assert(view.items[0].id === "ren" && view.items[1].id === "du", "任督顺序错误");

    const invalid = user.normalize_meridian_data({ ren: "10", du: -1, dai: 999 });
    assert(invalid.ren === 0, "字符串进度未清零");
    assert(invalid.du === 0, "负数进度未清零");
    assert(invalid.dai === 19, "超大进度未限制到最大值");

    for (const item of view.items) invalid[item.id] = item.total;
    user.normalize_meridian_data(invalid);
    view = user.query_meridian_view();
    assert(view.totalProgress === 194, "全通进度错误");
    assert(view.totalSpent === 21180000, "十脉累计投入错误");
    assert(user.query_prop("study_per") === 300, "任脉学习效率错误");
    assert(user.query_prop("lianxi_per") === 300, "任脉练习效率错误");
    assert(user.query_prop("dazuo_per") === 300, "督脉打坐效率错误");
    assert(user.query_prop("max_hp") === 145000, "带脉气血奖励错误");
    assert(user.query_prop("gj") === 5800, "冲脉攻击奖励错误");
    assert(user.query_prop("limit_mp") === 158000, "阴跷脉封顶奖励错误");
    assert(user.query_prop("mz") === 5600, "阳跷脉命中奖励错误");
    assert(user.query_prop("bj_per") === 34, "阳维脉暴击奖励错误");
    assert(user.query_prop("zj") === 4600, "阴维脉招架奖励错误");
    assert(user.query_prop("ds") === 5800, "手三阳躲闪奖励错误");
    assert(user.query_prop("fy") === 5800, "手三阴防御奖励错误");
    assert(user.query_prop("add_sh_per") === 10, "周天最终伤害错误");
    assert(user.query_prop("diff_sh_per") === 10, "周天伤害减免错误");
    assert(user.query_prop("diff_fy_per") === 5, "周天忽视防御错误");
    user.ensure_meridian_title();
    assert(user.query_title("meridian_zhou_tian") === "周天圆满", "周天圆满称号未发放");
}

async function validateUnlocksAndRooms(User) {
    const user = new User();
    const data = user.query_meridian_data();
    data.ren = 10;
    data.du = 10;
    assert(user.is_meridian_unlocked("dai", data) === false, "武师提前开放后续经脉");
    user.level = 3;
    assert(user.is_meridian_unlocked("dai", data) === true, "宗师未开放后续经脉");
    assert(user.query_meridian_room_status().allowed === true, "住宅复制房间被错误禁止");
    user.environment = {
        can_practice_meridian: true,
        parent: { not_fb: false },
        is_copy() { return true; }
    };
    assert(user.query_meridian_room_status().allowed === false, "副本房间被错误允许");
    user.environment = { can_practice_meridian: false, is_copy() { return false; } };
    assert(user.query_meridian_room_status().allowed === false, "未标记房间被错误允许");
}

async function validatePracticeAndPersistence(User, contextJson) {
    const user = new User();
    const data = user.query_meridian_data();
    data.du = 9;
    const preview = user.query_meridian_preview("du", data);
    assert(preview.cost === 100000, "督脉第10穴消耗错误");
    assert(preview.afterMaxMp === 0, "允许降至0的预览错误");
    const result = await user.practice_meridian("du", 9);
    assert(result.ok === true, "合法督脉贯通启动失败");
    assert(user.state && user.state.id === "meridian_practice", "贯通未进入修炼状态");
    assert(user.state.end_time > Date.now(), "贯通缺少结束时间");
    assert(user.query_meridian_data().du === 9, "贯通启动阶段提前改变进度");
    assert(user.max_mp === 100000 && user.mp === 100000, "贯通启动阶段提前扣减内力");
    assert(user.saveCount === 0, "贯通启动阶段不应立即保存");

    const duplicate = await user.practice_meridian("du", 9);
    assert(duplicate.ok === false, "重复启动贯通未被拦截");
    assert(user.query_meridian_data().du === 9, "重复启动改变了进度");

    await user.complete_meridian_practice("du", 9);
    assert(user.query_meridian_data().du === 10, "督脉进度未增加");
    assert(user.max_mp === 0 && user.mp === 0, "最大内力或当前内力扣减错误");
    assert(user.saveCount === 1, "贯通完成未立即保存");

    const rollback = new User();
    rollback.max_mp = 10000;
    rollback.mp = 10000;
    rollback.saveResult = false;
    await rollback.complete_meridian_practice("ren", 0);
    assert(rollback.max_mp === 10000 && rollback.query_meridian_data().ren === 0, "保存失败未回滚");

    const source = new User();
    source.query_meridian_data().ren = 3;
    source.query_meridian_data().du = 4;
    const role = source.getData();
    const serialized = contextJson.toObject(role.data);
    assert(serialized.meridians.ren === 3 && serialized.meridians.du === 4, "经脉数据未写入角色存档");
    const loaded = new User();
    loaded.loadData(role);
    assert(loaded.query_meridian_data().ren === 3 && loaded.query_meridian_data().du === 4, "经脉存档往返失败");

    const legacy = new User();
    legacy.loadData({ data: "{base:1}" });
    assert(legacy.query_meridian_view().totalProgress === 0, "旧角色未初始化为0进度");
}

async function main() {
    const harness = createHarness();
    await validateConfiguration(harness.User);
    await validateUnlocksAndRooms(harness.User);
    await validatePracticeAndPersistence(harness.User, harness.JSON);
    console.log("奇经八脉配置、属性、存档、贯通与安全验证通过。");
}

main().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
