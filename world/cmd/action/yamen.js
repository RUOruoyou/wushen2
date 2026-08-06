this.inherits(COMMAND);
this.command = "yamen";
this.allow_busy = true;
this.allow_state = true;
this.regex = /^(\w+)(?:\s+(\w+))?$/;

this.enter = function (me, cmd, par) {
    const task = USERTASK.GET("yamen2");
    if (!task) return me.notify("衙门追捕任务尚未开放。");

    if (!cmd || cmd === "start") {
        return task.start(me, par);
    }
    if (cmd === "fixed" || cmd === "fix") {
        return task.start(me, "fixed");
    }
    if (cmd === "rise" || cmd === "up") {
        return task.start(me, "rise");
    }
    if (cmd === "auto") {
        return task.auto(me, par);
    }
    if (cmd === "giveup" || cmd === "cancel") {
        return task.giveup(me, true, true);
    }
    if (cmd === "status") {
        return me.notify(task.query_desc(me));
    }
    return me.notify("衙门追捕指令：yamen start fixed/rise，yamen auto，yamen giveup。");
}
