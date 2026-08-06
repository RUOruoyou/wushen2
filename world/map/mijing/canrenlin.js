this.inherits(ROOM);
this.name = "残刃林";
this.desc = "折断的长剑如枯木般密布，残刃映着幽光，四周剑气森然。";
this.exits = { west: "mijing/duanjianzhong" };
this.add_action("mijing_over", "结束挑战", function (me) {
    const task = TASK.GET("duanjianzhong");
    return task && task.leave(me);
});
this.on_enter = function (obj) {
    const task = TASK.GET("duanjianzhong");
    task && task.on_enter_room(obj);
};
this.on_relogin = function (obj) {
    const task = TASK.GET("duanjianzhong");
    task && task.restore(obj);
};
this.on_leave = function (me, dir) {
    if (!me || !me.is_player) return true;
    const task = TASK.GET("duanjianzhong");
    return !task || task.can_leave(me, dir);
};
