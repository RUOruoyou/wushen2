const AUTO_RECOVERY_DEFAULT_HP = 80;
const AUTO_RECOVERY_DEFAULT_MP = 60;
const AUTO_RECOVERY_RETRY_DELAY = 500;
const AUTO_RECOVERY_RETRY_LIMIT = 20;
const AUTO_RECOVERY_STALL_LIMIT = 3;

function query_threshold(player, key, fallback) {
    let value = parseInt(player.query_setting(key));
    if (!Number.isInteger(value)) value = fallback;
    return Math.max(1, Math.min(100, value));
}

function is_below_threshold(current, maximum, threshold) {
    if (!(maximum > 0)) return true;
    return current * 100 < maximum * threshold;
}

function clear_handler(context) {
    if (!context || !context.handler) return;
    clearTimeout(context.handler);
    context.handler = null;
}

function schedule_check(player, context, delay) {
    clear_handler(context);
    context.handler = setTimeout(function () {
        context.handler = null;
        if (player._autoRecovery !== context) return;
        process_recovery(player, context);
    }, Math.max(0, parseInt(delay || 0)));
}

function pause_recovery(player, message) {
    WORLD.cancel_auto_recovery(player);
    if (message && !player.disconnect_time) player.notify("<hiy>" + message + "</hiy>");
    return false;
}

function retry_recovery(player, context, message) {
    context.retries++;
    if (context.retries > AUTO_RECOVERY_RETRY_LIMIT) {
        return pause_recovery(player, message);
    }
    schedule_check(player, context, AUTO_RECOVERY_RETRY_DELAY);
    return true;
}

function resume_task(player, context) {
    WORLD.cancel_auto_recovery(player);
    const task = USERTASK.GET(context.taskId);
    if (!task || typeof task.continue_ring !== "function") {
        player.notify("<hiy>自动恢复已完成，但原自动任务无法继续，请手动重试。</hiy>");
        return false;
    }
    return task.continue_ring(player, context.mode);
}

function start_state(player, context, stateId) {
    if (!player.force_skill || !player.query_skill || player.query_skill("force", 0) <= 0) {
        return pause_recovery(player, "你尚未装备可用内功，自动恢复已暂停，请调整后手动继续任务。");
    }

    context.phase = stateId;
    context.lastValue = stateId === "liaoshang" ? player.hp : player.mp;
    context.stalledTicks = 0;
    player.do_command(stateId);
    if (!player.state || player.state.id !== stateId) {
        context.phase = null;
        return pause_recovery(player, "当前状态无法自动" + (stateId === "liaoshang" ? "疗伤" : "打坐")
            + "，请恢复后手动继续任务。");
    }
    return true;
}

function process_recovery(player, context) {
    if (!player || player._autoRecovery !== context) return false;
    if (player.disconnect_time || !player.in_world || !player.in_world()) {
        return pause_recovery(player);
    }
    if (player.hp <= 0 || player.is_faint) {
        return pause_recovery(player, "角色当前无法恢复，自动任务已暂停。");
    }
    if (player.is_fighting && player.is_fighting()) {
        return retry_recovery(player, context, "战斗状态迟迟未结束，自动任务已暂停。");
    }
    if (player.is_busy) {
        return retry_recovery(player, context, "忙乱状态迟迟未结束，自动任务已暂停。");
    }
    if (player.state) {
        if (context.phase && player.state.id === context.phase) return true;
        return retry_recovery(player, context, "当前动作迟迟未结束，自动任务已暂停。");
    }

    context.retries = 0;
    if (!player.query_setting("auto_recovery")) return resume_task(player, context);

    const hpThreshold = query_threshold(player, "auto_recovery_hp", AUTO_RECOVERY_DEFAULT_HP);
    const mpThreshold = query_threshold(player, "auto_recovery_mp", AUTO_RECOVERY_DEFAULT_MP);
    const needsHp = is_below_threshold(player.hp, player.max_hp, hpThreshold);
    const needsMp = is_below_threshold(player.mp, player.max_mp, mpThreshold);
    if (!needsHp && !needsMp) return resume_task(player, context);

    if (!context.announced) {
        player.notify("<mem>当前状态低于自动恢复设定，恢复完成后继续任务。</mem>");
        context.announced = true;
    }
    if (needsHp) return start_state(player, context, "liaoshang");
    return start_state(player, context, "dazuo");
}

WORLD.queue_auto_recovery = function (player, taskId, mode, delay) {
    if (!player || (taskId !== "family_ring" && taskId !== "yamen2")) return false;
    WORLD.cancel_auto_recovery(player);
    const context = {
        taskId: taskId,
        mode: mode,
        phase: null,
        handler: null,
        retries: 0,
        stalledTicks: 0,
        lastValue: 0,
        announced: false,
        error: null
    };
    player._autoRecovery = context;
    schedule_check(player, context, delay);
    return true;
};

WORLD.is_auto_recovery_pending = function (player, taskId) {
    const context = player && player._autoRecovery;
    return !!(context && (!taskId || context.taskId === taskId));
};

WORLD.cancel_auto_recovery = function (player, message) {
    const context = player && player._autoRecovery;
    if (!context) return false;
    clear_handler(context);
    player._autoRecovery = null;
    if (context.phase && player.state && player.state.id === context.phase) {
        player.set_state(null);
    }
    if (message && !player.disconnect_time) player.notify("<hiy>" + message + "</hiy>");
    return true;
};

WORLD.should_finish_auto_recovery_state = function (player, stateId) {
    const context = player && player._autoRecovery;
    if (!context || context.phase !== stateId) return false;
    if (player.disconnect_time || player.hp <= 0 || player.is_faint
        || !player.query_setting("auto_recovery")) {
        return true;
    }

    const isHp = stateId === "liaoshang";
    const current = isHp ? player.hp : player.mp;
    const maximum = isHp ? player.max_hp : player.max_mp;
    const threshold = query_threshold(player,
        isHp ? "auto_recovery_hp" : "auto_recovery_mp",
        isHp ? AUTO_RECOVERY_DEFAULT_HP : AUTO_RECOVERY_DEFAULT_MP);
    if (!is_below_threshold(current, maximum, threshold)) return true;

    if (current > context.lastValue) context.stalledTicks = 0;
    else context.stalledTicks++;
    context.lastValue = current;
    if (context.stalledTicks >= AUTO_RECOVERY_STALL_LIMIT) {
        context.error = "恢复状态连续无进展，自动任务已暂停，请检查角色状态后手动继续。";
        return true;
    }
    return false;
};

WORLD.on_auto_recovery_state_stop = function (player, stateId, isauto) {
    const context = player && player._autoRecovery;
    if (!context || context.phase !== stateId) return false;
    context.phase = null;
    if (!isauto) {
        if (player.disconnect_time || player.hp <= 0 || player.is_faint) {
            WORLD.cancel_auto_recovery(player);
        } else {
            WORLD.cancel_auto_recovery(player, "你已停止自动恢复，自动任务不会继续下一名目标。");
        }
        return true;
    }
    if (context.error) {
        pause_recovery(player, context.error);
        return true;
    }
    schedule_check(player, context, 0);
    return true;
};
