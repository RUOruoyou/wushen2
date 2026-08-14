this.inherits(ROOM);
this.name = "铁索桥";
this.desc = "铁索桥在云海中摇晃，背负女童时更难保持平衡。";
this.exits = { south: "fb/piaomiaofeng/shizuyan", north: "fb/piaomiaofeng/xianchoumen" };
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    if (!this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) { me.notify("你还没有背起女童。"); return false; }
    if ((Number(me.str) || 0) < 25 || (Number(me.dex) || 0) < 45 || (Number(me.ds) || 0) < 9000) {
        me.notify("背负状态下需要至少25点先天臂力、45点先天身法和9000点躲闪才能通过铁索桥。");
        return false;
    }
    if (!this.query_temp(me, "fb/piaomiaofeng/bridge", 0)) { this.set_temp(me, "fb/piaomiaofeng/bridge", 1); this.grant_fb_milestone(me, "铁索桥", 15); me.notify("你稳住铁索，背着女童走过铁索桥。"); }
};
