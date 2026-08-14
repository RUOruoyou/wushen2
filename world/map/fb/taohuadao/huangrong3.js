this.inherits(ROOM);
this.name = "石匣交付处";
this.desc = "黄蓉打开石匣，岛上的机关终于全部闭合。";
this.exits = { south: "fb/taohuadao/zhou2" };
this.add_action("deliver", "交付石匣", function (me) {
    if (this.query_temp(me, "fb/taohuadao/delivered", 0)) return me.notify("石匣已经交给黄蓉。");
    this.set_temp(me, "fb/taohuadao/delivered", 1);
    this.grant_fb_milestone(me, "交付黄蓉", 15);
    me.notify("黄蓉收下石匣，桃花岛的机关安静下来。现在可以完成副本。");
});

