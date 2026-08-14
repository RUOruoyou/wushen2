this.inherits(ROOM);
this.name = "失足岩";
this.desc = "卓不凡守在狭窄岩脊，女童还需要有人背负。";
this.exits = { south: "fb/piaomiaofeng/duanhunya", north: "fb/piaomiaofeng/tiesuoqiao" };
this.set_npc("fb/piaomiaofeng/zhuobufan");
this.apply_carry_status = function (me) {
    if (me.query_status && me.query_status("fb_piaomiaofeng_carry")) return;
    if (typeof me.add_status === "function") {
        me.add_status({
            id: "fb_piaomiaofeng_carry",
            name: "背负童姥",
            desc: "背负童姥时攻击、命中、防御、躲闪和招架大幅降低。",
            duration: 3600000,
            prop: { gj_per: -100, mz_per: -100, fy_per: -100, ds_per: -100, zj_per: -100 }
        });
    }
};
this.add_action("carry", "背起女童", function (me) {
    if (this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) return me.notify("你已经背起女童。");
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["保护女童"]) return me.notify("先击退守在断魂崖的敌人。");
    const base = ROOM.Get("fb/piaomiaofeng/duanhunya");
    const source = base && base.copy_rooms && base.copy_rooms[this.owner];
    const child = source && source.find_obj_bypath("fb/piaomiaofeng/tonglao");
    if (!child) return me.notify("女童已经不在断魂崖，无法继续护送。");
    if (child.environment) child.environment.item_changed(child, false, "你将女童背到身后，四维战斗属性骤降。");
    this.set_temp(me, "fb/piaomiaofeng/carry_child", 1);
    this.apply_carry_status(me);
    this.grant_fb_milestone(me, "背女童", 10);
    me.notify("你背起女童，沿着岩脊小心前行。");
});
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    if (this.find_obj_bypath("fb/piaomiaofeng/zhuobufan")) { me.notify("卓不凡挡住了铁索桥入口。"); return false; }
    if (!this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) { me.notify("你还没有背起女童。"); return false; }
};
