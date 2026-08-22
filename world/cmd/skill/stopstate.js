this.inherits(COMMAND);
this.command = "stopstate";
this.allow_busy = true;
this.allow_state = true;
this.enter = function (player) {
    if (player.state) {
        if (player.state.no_stop) return player.notify(player.state.no_stop);
        // 家族成员的岗位展示状态与家族任务绑定，停止时要同步任务数据。
        if (player.master && String(player.state.id || "").indexOf("hh_") === 0
            && typeof HOUSEHOLD !== "undefined" && HOUSEHOLD.stop) {
            var master = typeof WORLD !== "undefined" && WORLD.getUser ? WORLD.getUser(player.master) : null;
            if (master) {
                var result = HOUSEHOLD.stop(master, player.id);
                if (result.ok) return player.notify(player.name + "停下手中的活计，回到待命。");
                return player.notify(result.message);
            }
        }
    }
    player.set_state(null);
}
