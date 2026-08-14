this.inherits(ROOM);
this.name = "卧室回报处";
this.desc = "黄蓉等着你回来说明周伯通的线索。";
this.exits = { south: "fb/taohuadao/zhou1" };
this.add_action("report", "回报", function (me) {
    if (this.query_exits("north")) return me.notify("黄蓉已经记下你的回报。");
    this.grant_fb_milestone(me, "回报黄蓉", 15);
    this.add_exit("north", "fb/taohuadao/taohuazhen2");
    me.notify("黄蓉请你再走一次桃花阵，寻找山洞中的石匣。");
});

