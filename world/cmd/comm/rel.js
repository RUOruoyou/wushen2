this.inherits(COMMAND);
this.command = "rel";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.regex = /^(\w+)?(?:\s+(\w+))?$/;
this.enter = function (me, type, cmd) {
    if (type === "marry") {
        return me.send("解除夫妻关系，需要到扬州城的衙门找户部主簿办理。");
    }
    if (type === "st") {
        if (me.query_temp("tudi")) return me.send("你的徒弟成长为宗师后自动解除关系，或者去扬州衙门办理强制解除。");
        if (me.query_temp("shifu")) return me.send("你成长为宗师后自动解除关系，或者去扬州衙门办理强制解除。");
        return me.send("你没有师父或徒弟，不用解除关系。");
    }
    const target = FOLLOWER.GET(me, { id: type });
    if (!target) return me.send("你没有这个随从。");
    if (cmd === "stop") {
        const stopped = HOUSEHOLD.stop(me, target.id);
        if (!stopped.ok) return me.send(stopped.message);
        return WORLD.COMMANDS.relation.enter(me);
    }
    const job = HOUSEHOLD.normalizeJob(cmd);
    if (job) {
        if (cmd === "diaoyu") return me.send("家族成员不再进行实时钓鱼，请安排种植、挖矿、炼药或授课。");
        const assigned = HOUSEHOLD.assign(me, target.id, job);
        if (!assigned.ok) return me.send(assigned.message);
        return WORLD.COMMANDS.relation.enter(me);
    }
    return me.send("你要让" + target.name + "做什么？");
};
