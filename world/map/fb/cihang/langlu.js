this.inherits(ROOM);
this.name = "观云山路";
this.desc = "西侧山路可观察浪翻云与庞斑的气机，确认当前路线的突破契机。";
this.exits = { east: "fb/cihang/fenlu", northeast: "fb/cihang/jiangdao" };
this.add_action("watch", "观战求突破", function (me) {
    if (this.query_temp(me, "fb/cihang/route", 0) !== "国师") return me.notify("只有国师路线可以观战求突破。");
    if (this.query_temp(me, "fb/cihang/watch", 0)) return me.notify("观战求突破已经完成。");
    this.set_temp(me, "fb/cihang/watch", 1);
    this.grant_fb_milestone(me, "观战求突破", 10);
    me.notify("你观战求突破，准备在拦江岛与庞斑交手。");
});
this.add_action("longsheng", "确认长生资格", function (me) {
    if (this.query_temp(me, "fb/cihang/route", 0) !== "魔师") return me.notify("只有魔师路线需要确认长生资格。");
    if (this.query_temp(me, "fb/cihang/longsheng", 0)) return me.notify("长生资格已经确认。");
    this.set_temp(me, "fb/cihang/longsheng", 1);
    this.grant_fb_milestone(me, "长生资格", 10);
    me.notify("长生诀资格确认，魔师路线的拦江岛战斗已经开启。");
});
this.on_leave = function (me, dir) {
    if (dir !== "northeast") return;
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (route === "国师" && !this.query_temp(me, "fb/cihang/watch", 0)) { me.notify("请先观战求突破。"); return false; }
    if (route === "魔师" && !this.query_temp(me, "fb/cihang/longsheng", 0)) { me.notify("请先确认长生资格。"); return false; }
};
