this.inherits(ROOM);
this.name = "第二段吊篮";
this.desc = "第二段吊篮在风中摇摆。";
this.exits = { west: "fb/heimuya/diaolan1", east: "fb/heimuya/diaolan3" };
this.on_leave = function (me, dir) { if (dir === "east" && !this.query_temp(me, "fb/heimuya/token2", 0)) { me.notify("第二段吊篮尚未插入青龙堂令牌。"); return false; } };
this.add_action("insert_token", "插入青龙令", function (me) {
    if (this.query_temp(me, "fb/heimuya/token2", 0)) return me.notify("青龙堂令牌已经插入第二段吊篮。");
    if (!this.query_temp(me, "fb/heimuya/token2_owned", 0)) return me.notify("你还没有取得青龙堂令牌。");
    this.set_temp(me, "fb/heimuya/token2", 1);
    this.grant_fb_milestone(me, "吊篮二", 5);
    me.notify("你插入青龙堂令牌，第二段吊篮越过深谷。");
});
