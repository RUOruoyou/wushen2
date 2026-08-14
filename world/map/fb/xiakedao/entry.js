this.inherits(ROOM);
this.name = "侠客岛入口";
this.desc = "入岛后选择赏善或罚恶路线，选择结果锁定在副本实例内。";
this.exits = { north: "fb/xiakedao/shangshan", east: "fb/xiakedao/fae" };
this.on_leave = function (me, dir) {
    const route = this.query_temp(me, "fb/xiakedao/route", 0);
    if (dir === "north" && route !== "赏善") { me.notify("请先选择赏善路线。"); return false; }
    if (dir === "east" && route !== "罚恶") { me.notify("请先选择罚恶路线。"); return false; }
};
this.add_action("choose_shangshan", "选择赏善", function (me) { if (this.query_temp(me, "fb/xiakedao/route", 0)) return me.notify("路线已经锁定。"); this.set_temp(me, "fb/xiakedao/route", "赏善"); this.set_fb_route(me, "赏善"); this.grant_fb_milestone(me, "路线锁定", 0); me.notify("你选择赏善路线，沿石室前进。"); });
this.add_action("choose_fae", "选择罚恶", function (me) { if (this.query_temp(me, "fb/xiakedao/route", 0)) return me.notify("路线已经锁定。"); this.set_temp(me, "fb/xiakedao/route", "罚恶"); this.set_fb_route(me, "罚恶"); this.grant_fb_milestone(me, "路线锁定", 10); me.notify("你选择罚恶路线，罚恶使者在东侧等候。"); });
