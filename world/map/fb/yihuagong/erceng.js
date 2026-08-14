this.inherits(ROOM);
this.name = "二层暗道";
this.desc = "暗道漆黑，宫女留下的火折子可以照亮前路。";
this.exits = { west: "fb/yihuagong/chuangta" };
this.add_action("light", "点燃火折子", function (me) {
    if (this.query_exits("north")) return me.notify("暗道已经照亮。");
    if (!this.query_temp(me, "fb/yihuagong/firebrand", 0)) return me.notify("暗道漆黑，你还没有找到火折子。");
    this.set_temp(me, "fb/yihuagong/firebrand", 0);
    this.grant_fb_milestone(me, "暗道", 5);
    this.add_exit("north", "fb/yihuagong/huawuque");
    me.notify("你点燃火折子，暗道尽头露出密室入口。");
});
