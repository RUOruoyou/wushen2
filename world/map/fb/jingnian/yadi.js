this.inherits(ROOM);
this.name = "崖底";
this.desc = "崖底三人组守着回到广场的路，盗帅路线还要凭轻功跳上钟楼。";
this.exits = { east: "fb/jingnian/baishi", north: "fb/jingnian/zhonglou" };
this.set_npc("fb/jingnian/sanren");
this.on_leave = function (me, dir) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (route !== "盗帅") { me.notify("当前路线不能进入崖底。"); return false; }
    if (dir === "north" && !this.query_temp(me, "fb/jingnian/sanren_done", 0)) { me.notify("崖底三人组尚未退下。"); return false; }
    if (dir === "north" && !this.query_temp(me, "fb/jingnian/jump_done", 0)) { me.notify("你还没有用轻功跳上去。"); return false; }
};
this.add_action("jump", "跳上去", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "盗帅") return me.notify("当前不是盗帅路线。");
    if (this.query_temp(me, "fb/jingnian/jump_done", 0)) return me.notify("你已经跳上钟楼。");
    if (me.query_skill("dodge", 0) < 4000) return me.notify("你的轻功不足 4000，无法跳上钟楼。");
    this.set_temp(me, "fb/jingnian/jump_done", 1);
    this.grant_fb_milestone(me, "轻功跳跃", 10);
    me.notify("你借崖壁反弹跃上高处，钟楼近在眼前。");
});
this.register_jingnian_status_action();
