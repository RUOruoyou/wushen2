this.inherits(COMMAND);
this.command = "family_task";
this.allow_busy = true;
this.allow_state = true;
this.regex = /^(\w+)?$/;

this.enter = function (player, action) {
    const task = USERTASK.GET("family_ring");
    if (!task) return player.notify("师门任务暂未开放。");
    action = action || "start";
    if (action === "start") return task.start(player);
    if (action === "auto" || action === "continue") return task.auto(player);
    if (action === "giveup" || action === "cancel") return task.giveup(player, true);
    if (action === "status") return player.notify(task.query_desc(player));
    return player.notify("师门任务指令：family_task start/auto/giveup/status。");
};
