this.inherits(ROOM);
this.name = "铁索桥";
this.desc = "铁索桥在云海中摇晃，背负女童时更难保持平衡。";
this.exits = { south: "fb/piaomiaofeng/shizuyan", north: "fb/piaomiaofeng/xianchoumen" };
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    if (!this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) { me.notify("你还没有背起女童。"); return false; }
    const diff = this.query_temp(me, "diff", 0) || 0;
    const requiredDs = diff === 1 ? 15000 : 9000;
    const baseDs = Number(this.query_temp(me, "fb/piaomiaofeng/bridge_base_ds", 0)) || 0;
    if ((Number(me.str) || 0) < 25 || (Number(me.dex) || 0) < 25 || baseDs < requiredDs) {
        me.notify("铁索桥需要至少25点先天臂力、25点先天身法，并在背起童姥前达到"
            + requiredDs + "点躲闪。当前记录的背负前躲闪为" + baseDs + "点。");
        return false;
    }
    if (!this.query_temp(me, "fb/piaomiaofeng/bridge", 0)) { this.set_temp(me, "fb/piaomiaofeng/bridge", 1); this.grant_fb_milestone(me, "铁索桥", 15); me.notify("你稳住铁索，背着女童走过铁索桥。"); }
};
