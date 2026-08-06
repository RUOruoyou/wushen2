this.inherits(ROOM);
this.name = "葬锋坡";
this.desc = "灰白山坡上剑柄林立，风穿过残破剑穗，发出低沉呜咽。";
this.exits = { south: "mijing/duanjianzhong" };
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
