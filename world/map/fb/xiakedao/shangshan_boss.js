this.inherits(ROOM);
this.name = "赏善岛主";
this.desc = "石破天在岛主房间中运转内息。察觉他的内息变化后方可比试，胜出后再帮他稳住气息。";
this.exits = { south: "fb/xiakedao/shangshan6" };
this.set_npc("fb/xiakedao/shipotian");
this.on_enter = function (me) {
    if (this.query_temp(me, "fb/xiakedao/route", 0) !== "赏善") this.fail_fb_route(me, "未选择赏善路线就进入岛主房间");
};
this.add_action("observe", "等待内息变化", function (me) {
    const state = this.query_fb_state(me);
    if (!state || state.route !== "赏善") return me.notify("当前不是赏善路线。");
    if (!state.milestones["问答"] || !state.milestones["第六层"]) return me.notify("六层石壁尚未全部领悟。");
    if (this.query_temp(me, "fb/xiakedao/shangshan/inner_change", 0)) return me.notify("你已经记下石破天的内息变化。");
    this.set_temp(me, "fb/xiakedao/shangshan/inner_change", 1);
    me.notify("你耐心观察，终于察觉石破天内息忽强忽弱，正是提出比试的时机。");
});
this.add_action("duel", "比试", function (me) {
    const state = this.query_fb_state(me);
    if (!state || state.route !== "赏善") return me.notify("当前不是赏善路线。");
    if (state.milestones["比试"]) return me.notify("你已经完成与石破天的比试。");
    if (!this.query_temp(me, "fb/xiakedao/shangshan/inner_change", 0)) return me.notify("石破天内息未显变化，现在还不是比试时机。");
    if (this.query_temp(me, "fb/xiakedao/shangshan/duel", 0)) return me.notify("你已经向石破天提出比试。");
    this.set_temp(me, "fb/xiakedao/shangshan/duel", 1);
    me.notify("你向石破天提出比试。击败他后再回来选择“帮他一把”。");
});
this.add_action("help", "帮他一把", function (me) {
    const state = this.query_fb_state(me);
    if (!state || state.route !== "赏善") return me.notify("当前不是赏善路线。");
    if (!state.milestones["比试"]) return me.notify("先完成与石破天的比试。");
    if (state.milestones["帮忙"]) return me.notify("你已经帮石破天稳住内息。");
    this.grant_fb_milestone(me, "帮忙", 15);
    me.notify("你出手帮石破天稳住内息，赏善之行圆满。");
});
