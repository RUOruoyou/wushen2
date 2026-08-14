this.inherits(ROOM);
this.name = "峭壁";
this.desc = "峭壁平台上有一块沉重石块，推开后还需承受杨过的海潮考验。";
this.exits = { south: "fb/gumu/shuilu", north: "fb/gumu/jianzhong" };
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const state = this.query_fb_state(me);
    if (!this.query_temp(me, "fb/gumu/stone", 0)) {
        me.notify("沉重石块尚未推开。");
        return false;
    }
    if (!state || !state.milestones["海潮七击"]) {
        me.notify("你还没有通过杨过的海潮七击考验。");
        return false;
    }
};
this.add_action("push", "推开石块", function (me) {
    if (!this.query_temp(me, "fb/gumu/swim", 0)) return me.notify("你还没有游到峭壁。");
    if (this.query_temp(me, "fb/gumu/stone", 0)) return me.notify("石块已经移开。");
    this.set_temp(me, "fb/gumu/stone", 1);
    this.grant_fb_milestone(me, "石块", 10);
    me.notify("你爬上平台推开石块，杨过现身守住剑冢入口。");
});
this.add_action("endure", "承受海潮", function (me) {
    const state = this.query_fb_state(me);
    if (!state || state.failed || !state.milestones["昏迷杨过"] || !state.milestones["石块"]) {
        return me.notify("你还没有完成暗河前的杨过昏迷与平台石块阶段。");
    }
    if (state.milestones["海潮七击"]) return me.notify("你已经通过海潮七击考验。");
    const diff = this.query_temp(me, "diff", 0) || 0;
    const accuracy = diff === 1 ? 1000000 : 50000;
    const damage = 550000;
    this.set_temp(me, "fb/gumu/tide", 0);
    for (let count = 1; count <= 7; count++) {
        if (!(me.hp > 0)) return;
        if (typeof me.from_attack === "function") {
            me.from_attack(damage, accuracy, "杨过挥动玄铁重剑，海潮第" + count + "击轰然压下。", "海潮剑意正面击中你。", "你避开了这一重海潮剑意。");
        } else if (typeof me.damage === "function") {
            me.damage(damage);
        } else if (typeof me.add_hp === "function") {
            me.add_hp(-Math.min(damage, Math.max(0, me.hp)));
        }
        if (!(me.hp > 0)) return;
        this.set_temp(me, "fb/gumu/tide", count);
    }
    this.grant_fb_milestone(me, "海潮七击", 15);
    me.notify("你承受完杨过的海潮七击，剑冢入口终于开启。");
});
