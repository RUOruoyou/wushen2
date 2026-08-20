this.inherits(ROOM);
this.name = "失足岩";
this.desc = "卓不凡守在狭窄岩脊，女童还需要有人背负。";
this.exits = { south: "fb/piaomiaofeng/duanhunya", north: "fb/piaomiaofeng/tiesuoqiao" };
this.set_npc("fb/piaomiaofeng/zhuobufan");
this.apply_carry_status = function (me) {
    if (me.query_status && me.query_status("fb_piaomiaofeng_carry")) return;
    if (!this.query_temp(me, "fb/piaomiaofeng/bridge_base_ds", 0)) {
        this.set_temp(me, "fb/piaomiaofeng/bridge_base_ds", Math.max(0, Number(me.ds) || 0));
    }
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
this.add_action("carry", "背起女童", function (me) {
    if (this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) return me.notify("你已经背起女童。");
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["保护女童"]) return me.notify("先击退守在断魂崖的敌人。");
    const base = ROOM.Get("fb/piaomiaofeng/duanhunya");
    const source = base && base.copy_rooms && base.copy_rooms[this.owner];
    const child = source && source.find_obj_bypath("fb/piaomiaofeng/tonglao");
    if (!child) return me.notify("女童已经不在断魂崖，无法继续护送。");
    if (child.environment) child.environment.item_changed(child, false, "你将女童背到身后，行动和攻守都受到牵制。");
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
