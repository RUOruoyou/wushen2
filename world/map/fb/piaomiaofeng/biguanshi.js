this.inherits(ROOM);
this.name = "闭关室";
this.desc = "天山童姥在闭关室中等待护送。";
this.exits = { south: "fb/piaomiaofeng/xianchoumen" };
this.add_action("deliver", "送童姥", function (me) {
    if (!this.query_temp(me, "fb/piaomiaofeng/carry_child", 0)) return me.notify("你没有护送天山童姥走过铁索桥。");
    if (this.query_temp(me, "fb/piaomiaofeng/delivered", 0)) return me.notify("童姥已经安全回到闭关室。");
    const diff = this.query_temp(me, "diff", 0) || 0;
    this.set_temp(me, "fb/piaomiaofeng/delivered", 1);
    this.set_temp(me, "fb/piaomiaofeng/carry_child", 0);
    if (me.query_status && me.query_status("fb_piaomiaofeng_carry") && typeof me.remove_status === "function") me.remove_status("fb_piaomiaofeng_carry", true);
    this.grant_fb_milestone(me, "送童姥", diff === 1 ? 15 : 20);
    me.notify("你将童姥送回闭关室，缥缈峰主线完成。");
});
