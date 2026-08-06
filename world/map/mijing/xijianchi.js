this.inherits(ROOM);
this.name = "洗剑池";
this.desc = "池水早已干涸，只余一道道纵横剑痕，残存寒意从池底不断升起。";
this.exits = { north: "mijing/duanjianzhong" };
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
