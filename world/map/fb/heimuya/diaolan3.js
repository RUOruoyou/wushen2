this.inherits(ROOM);
this.name = "第三段吊篮";
this.desc = "第三段吊篮靠近黑木崖大门。";
this.exits = { west: "fb/heimuya/diaolan2", east: "fb/heimuya/damen" };
this.on_leave = function (me, dir) { if (dir === "east" && !this.query_temp(me, "fb/heimuya/token3", 0)) { me.notify("第三段吊篮尚未插入风雷堂令牌。"); return false; } };
this.add_action("insert_token", "插入风雷令", function (me) {
    if (this.query_temp(me, "fb/heimuya/token3", 0)) return me.notify("风雷堂令牌已经插入第三段吊篮。");
    if (!this.query_temp(me, "fb/heimuya/token3_owned", 0)) return me.notify("你还没有取得风雷堂令牌。");
    this.set_temp(me, "fb/heimuya/token3", 1);
    this.grant_fb_milestone(me, "吊篮三", 5);
    me.notify("你插入风雷堂令牌，第三段吊篮抵达黑木崖大门。");
});
