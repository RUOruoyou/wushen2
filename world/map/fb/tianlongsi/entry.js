this.inherits(ROOM);
this.name = "天龙寺入口";
this.desc = "天龙寺山门，护送段誉回到这里才能完成路线。";
this.exits = { north: "fb/tianlongsi/shelidian" };
this.add_action("disguise", "伪装进入", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1) return me.notify("普通路线不需要伪装。");
    if (this.query_temp(me, "fb/tianlongsi/disguise", 0)) return me.notify("你已经完成伪装。");
    this.set_temp(me, "fb/tianlongsi/disguise", 1);
    this.grant_fb_milestone(me, "伪装进入", 10);
    me.notify("你戴上阿朱的面具，避开守门和尚进入天龙寺。");
});
this.add_action("escort", "护送段誉", function (me) {
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["抓段誉"] || !state.milestones["枯荣"]) return me.notify("段誉尚未被救出，或枯荣仍在阻拦。");
    const diff = this.query_temp(me, "diff", 0) || 0;
    if (diff === 0 && !state.milestones["余下和尚"]) return me.notify("寺中余下和尚尚未清理。");
    if (diff === 1 && !state.milestones["六名和尚"]) return me.notify("困难路线的六名和尚尚未清理。");
    if (state.milestones["护送段誉"]) return me.notify("段誉已经安全回到山门。");
    this.grant_fb_milestone(me, "护送段誉", 25);
    me.notify("你护送段誉回到天龙寺山门，路线完成。");
});
