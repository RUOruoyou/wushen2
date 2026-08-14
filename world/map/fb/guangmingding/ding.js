this.inherits(ROOM);
this.name = "光明顶";
this.desc = "灭绝师太被困在光明顶中央，东西两侧是五旗支路。";
this.exits = { south: "fb/guangmingding/linjian", west: "fb/guangmingding/houtu", east: "fb/guangmingding/lianwu", north: "fb/guangmingding/shenghuotang" };
this.set_npc("fb/guangmingding/miejue", "fb/guangmingding/weiyixiao", "fb/guangmingding/yintiangzheng", "fb/guangmingding/shuobude", "fb/guangmingding/pengyingyu");
this.add_action("rescue", "救出灭绝", function (me) {
    const state = this.query_fb_state(me);
    const keys = ["颜垣", "闻苍松", "庄铮", "辛然", "唐洋", "韦一笑", "殷天正"];
    if (!state || keys.some(key => !state.milestones[key])) return me.notify("五旗支路尚未清理完，灭绝仍被困住。");
    if (this.find_obj_bypath("fb/guangmingding/shuobude") || this.find_obj_bypath("fb/guangmingding/pengyingyu")) return me.notify("说不得和彭莹玉仍在围攻灭绝。");
    if (this.query_temp(me, "fb/guangmingding/rescue", 0)) return me.notify("灭绝已经脱险。");
    this.set_temp(me, "fb/guangmingding/rescue", 1);
    this.grant_fb_milestone(me, "救灭绝", 15);
    me.notify("你救出灭绝师太，圣火堂的大门打开了。");
});
this.on_leave = function (me, dir) { if (dir === "north" && !this.query_temp(me, "fb/guangmingding/rescue", 0)) { me.notify("灭绝尚未脱险，不能进入圣火堂。"); return false; } };
