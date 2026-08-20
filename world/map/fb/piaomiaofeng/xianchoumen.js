this.inherits(ROOM);
this.name = "仙愁门";
this.desc = "李秋水守在仙愁门前，天山童姥的闭关室就在后方。";
this.exits = { south: "fb/piaomiaofeng/tiesuoqiao", north: "fb/piaomiaofeng/biguanshi" };
this.set_npc("fb/piaomiaofeng/liqiu_shui");
this.clear_carry_status = function (me) {
    if (me.query_status && me.query_status("fb_piaomiaofeng_carry") && typeof me.remove_status === "function") {
        me.remove_status("fb_piaomiaofeng_carry", true);
    }
};
this.apply_carry_status = function (me) {
    if (me.query_status && me.query_status("fb_piaomiaofeng_carry")) return;
    if (typeof me.add_status === "function") {
        const diff = this.query_temp(me, "diff", 0) || 0;
        const penalty = diff === 1 ? -40 : -25;
        me.add_status({
            id: "fb_piaomiaofeng_carry",
            name: "背负童姥",
            desc: diff === 1
                ? "困难护送中必须背负童姥作战，攻击、命中与防御身法大幅降低。"
                : "背负童姥时攻击、命中与防御身法有所降低。",
            duration: 3600000,
            prop: { gj_per: penalty, mz_per: penalty, fy_per: penalty, ds_per: penalty, zj_per: penalty }
        });
    }
};
this.on_enter = function (me) {
    if (!me || !me.is_player || !this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) return;
    const diff = this.query_temp(me, "diff", 0) || 0;
    if (diff === 1 || this.query_temp(me, "fb/piaomiaofeng/child_landed", 0)) return;
    const child = NPC.CLONE("fb/piaomiaofeng/tonglao");
    if (!child) return;
    this.apply_fb_spawn_difficulty(me, child);
    this.item_changed(child, true, "女童从你背上跃下，恢复为天山童姥。");
    this.set_temp(me, "fb/piaomiaofeng/carry_child", 0);
    this.set_temp(me, "fb/piaomiaofeng/child_landed", 1);
    this.clear_carry_status(me);
    const liqiu = this.find_obj_bypath("fb/piaomiaofeng/liqiu_shui");
    if (liqiu && child && typeof liqiu.do_kill === "function") liqiu.do_kill(child);
};
this.add_action("carry_again", "再次背起童姥", function (me) {
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["李秋水"]) return me.notify("李秋水尚未败退。");
    if (this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) return me.notify("你已经背起童姥。");
    const child = this.find_obj_bypath("fb/piaomiaofeng/tonglao");
    if (!child) return me.notify("天山童姥已经不在仙愁门。");
    this.item_changed(child, false, "你再次背起童姥，准备送她返回闭关室。");
    this.set_temp(me, "fb/piaomiaofeng/carry_child", 1);
    this.apply_carry_status(me);
});
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["李秋水"]) { me.notify("李秋水尚未败退。"); return false; }
    if (!this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) { me.notify("你还没有再次背起天山童姥。"); return false; }
};
