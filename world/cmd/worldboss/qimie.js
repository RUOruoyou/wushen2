this.inherits(COMMAND);
this.command = "worldboss";
this.allow_level = 5;
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.enter = function (me, arg) {
    if (!me || (me.user_level || 0) < 5) return me && me.notify("权限不足。");
    const t = TASK.GET("qimie_event"); if (!t) return me.notify("七灭事件任务未加载。");
    const parts = String(arg || "").trim().split(/\s+/), action = parts.shift();
    if (action === "test") {
        const sub = parts.shift();
        if (sub === "start") { if (t.query_event()) return me.notify("已有七灭实例。"); if (!t.test_start()) return me.notify("七灭测试实例创建失败。"); return me.notify("七灭测试实例已创建（不发正式奖励）。"); }
        if (sub === "phase") { if (!parts[0] || !t.test_phase(parts[0])) return me.notify("用法：worldboss test phase rally|normal|side|aspect|vulnerability|enrage|terminal"); return me.notify("测试实例已切换到 " + parts[0] + "。"); }
        if (sub === "stop") {
            if (parts[0] !== "confirm") { if (t.test_stop(false) !== "confirm") return me.notify("没有可停止的测试实例。"); return me.notify("停止测试实例不会发奖。请再次输入 worldboss test stop confirm 完成确认。"); }
            if (!t.test_stop(true)) return me.notify("没有已确认的测试实例。");
            return me.notify("七灭测试实例已停止。");
        }
    }
    return me.notify("用法：worldboss test start|phase <phase>|stop [confirm]");
};
