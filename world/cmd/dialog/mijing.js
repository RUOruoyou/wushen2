this.inherits(COMMAND);
this.command = "mijing";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_fight = true;
this.enter = function (me, arg) {
    const task = TASK.GET("duanjianzhong");
    if (!task) return me.notify("秘境暂未开放。");
    if (arg === "start") return task.enter(me);
    if (arg === "over") return task.leave(me);
    return task.send_status(me);
};
