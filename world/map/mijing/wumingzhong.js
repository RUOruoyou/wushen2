this.inherits(ROOM);
this.name = "无名冢";
this.desc = "无字石碑半埋荒土，碑前插着一柄锈剑，游离残魂在阴影间徘徊。";
this.exits = { east: "mijing/duanjianzhong" };
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
