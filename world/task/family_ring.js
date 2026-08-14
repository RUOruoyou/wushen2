this.inherits(USERTASK);
this.id = "family_ring";
this.requests = new Map();

const CONFIG = WORLD.FAMILY_TASK;
const KEY_DAY = "family_task_day";
const KEY_DAILY = "family_task_daily";
const KEY_RING_DONE = "family_task_ring_done";
const KEY_RING_STEP = "family_task_ring_step";
const KEY_STREAK = "family_task_streak";
const KEY_REWARDS = "family_task_rewards";
const KEY_ACTIVE = "family_task_active";
const AUTO_ENGAGE_DELAY = 500;
const AUTO_CONTINUE_DELAY = 800;
const AUTO_RETRY_DELAY = 500;
const AUTO_RETRY_LIMIT = 20;

this.on_create = function () {
    const oldTask = USERTASK.GET(this.id);
    if (oldTask && oldTask.requests) this.requests = oldTask.requests;
};

this.on_start = function (player) {
    if (player.query_temp(KEY_ACTIVE) && !this.query_request(player)) {
        player.remove_temp(KEY_ACTIVE);
    }
    this.ensure_day(player);
    if (this.retry_pending_rewards(player)) {
        this.save_player(player, "师门任务奖励恢复");
    }
};

this.query_title = function (player) {
    const familyName = player.family && CONFIG.queryFamily(player.family.id)
        ? player.family.name : "师门";
    return "<hiy>" + familyName + "任务</hiy>";
};

this.ensure_day = function (player) {
    const day = CONFIG.queryDayKey();
    if (player.query_temp(KEY_DAY) !== day) {
        const rewards = this.read_rewards(player);
        let hasPendingReward = false;
        for (const slotKey in rewards) {
            if (rewards[slotKey] && !rewards[slotKey].delivered) {
                hasPendingReward = true;
            } else {
                delete rewards[slotKey];
            }
        }
        player.set_temp(KEY_DAY, day);
        player.set_temp(KEY_DAILY, 0);
        player.set_temp(KEY_RING_DONE, 0);
        player.set_temp(KEY_RING_STEP, 0);
        if (hasPendingReward) this.write_rewards(player, rewards);
        else player.remove_temp(KEY_REWARDS);
    }
    return {
        day: day,
        daily: CONFIG.clampInt(player.query_temp(KEY_DAILY, 0), 0, CONFIG.DAILY_LIMIT),
        ringDone: CONFIG.clampInt(player.query_temp(KEY_RING_DONE, 0), 0, CONFIG.DAILY_RINGS),
        ringStep: CONFIG.clampInt(player.query_temp(KEY_RING_STEP, 0), 0, CONFIG.RING_SIZE - 1),
        streak: CONFIG.clampInt(player.query_temp(KEY_STREAK, 0), 0, Number.MAX_SAFE_INTEGER)
    };
};

this.query_state = function (player) {
    if (!player.family || !CONFIG.isSupportedFamily(player.family)) return 0;
    const state = this.ensure_day(player);
    if (state.daily >= CONFIG.DAILY_LIMIT || state.ringDone >= CONFIG.DAILY_RINGS) return 3;
    return 1;
};

this.query_desc = function (player) {
    if (!player.family || !CONFIG.isSupportedFamily(player.family)) return;
    const state = this.ensure_day(player);
    const request = this.query_request(player);
    const ratio = CONFIG.queryDifficultyRatio(state.streak);
    const parts = [
        "<mem>今日成功 ", state.daily, "/", CONFIG.DAILY_LIMIT,
        "｜完成环数 ", state.ringDone, "/", CONFIG.DAILY_RINGS,
        "｜当前环 ", state.ringStep, "/", CONFIG.RING_SIZE,
        "｜下次难度 ", formatRatio(ratio), "</mem>"
    ];
    if (request && request.npc && request.npc.hp > 0) {
        parts.push("<br>目标：", request.npc.name,
            "｜地点：", request.roomName,
            "｜剩余：", formatDuration(request.expiresAt - Date.now()));
    } else if (state.daily >= CONFIG.DAILY_LIMIT) {
        parts.push("<br><hiy>今日师门任务次数已经完成。</hiy>");
    } else if (state.ringStep > 0) {
        parts.push("<br>当前环待继续。");
    } else {
        parts.push("<br>可在本门后勤管理员处接取师门任务。");
    }
    return parts.join("");
};

this.start = function (player) {
    if (WORLD.is_auto_recovery_pending && WORLD.is_auto_recovery_pending(player)) {
        player.notify("<mem>正在自动恢复状态，完成后将继续当前自动任务。</mem>");
        return true;
    }
    if (!player.family || !CONFIG.isSupportedFamily(player.family)) {
        return player.notify("你当前没有可以接取师门任务的正式门派。");
    }

    this.ensure_day(player);
    if (this.retry_pending_rewards(player)) {
        this.save_player(player, "师门任务奖励补发");
    }

    let request = this.query_request(player);
    if (request && request.npc && request.npc.hp > 0) {
        player.notify("你当前的师门目标仍未完成，正在继续执行。");
        player.send_commands("family_task auto", "继续师门任务", "family_task giveup", "放弃师门任务");
        this.schedule_auto(player, request.npc, 0);
        this.refresh_actions(player);
        return true;
    }
    if (request) this.remove_request(player, true);
    if (player.query_temp(KEY_ACTIVE)) player.remove_temp(KEY_ACTIVE);

    const state = this.ensure_day(player);
    if (state.daily >= CONFIG.DAILY_LIMIT) {
        player.notify("你今日已经成功完成20次师门任务，明日再来吧。");
        return false;
    }
    if (state.ringDone >= CONFIG.DAILY_RINGS) {
        player.notify("你今日两环师门任务已经完成，明日再来吧。");
        return false;
    }

    const room = this.random_room(player.family);
    if (!room) {
        player.notify("师门暂时没有合适的试炼地点，请稍后再试。");
        return false;
    }

    const familyId = player.family.id;
    const ratio = CONFIG.queryDifficultyRatio(state.streak);
    const npc = NPC.CLONE("pub/family_task");
    npc.init_from(player, {
        ratio: ratio,
        familyId: familyId,
        familyName: player.family.name,
        ringStep: state.ringStep + 1,
        streak: state.streak
    });
    room.item_changed(npc, true);
    this.set_request(player, npc, room, state, familyId, ratio);

    player.set_temp(KEY_ACTIVE, npc.id);
    npc.set_temp("player", player.id);
    npc.set_temp("family", familyId);
    npc.on_died = this.check.bind(this, npc);
    npc.on_kill = this.check_player;

    const ringIndex = Math.min(state.ringDone + 1, CONFIG.DAILY_RINGS);
    player.notify(player.family.name + "后勤传令：请前往" + room.long_name
        + "击败" + npc.name + "。这是今日第" + ringIndex + "环第"
        + (state.ringStep + 1) + "/" + CONFIG.RING_SIZE + "次任务。");
    player.notify("<mem>目标难度为你接取任务时综合属性的" + formatRatio(ratio)
        + "，失败不消耗今日成功次数，但会清空当前环进度和难度累计。</mem>");
    player.send_commands("family_task auto", "立即执行", "family_task giveup", "放弃师门任务");
    this.schedule_auto(player, npc, AUTO_ENGAGE_DELAY);
    this.refresh_actions(player);
    return true;
};

this.auto = function (player) {
    const request = this.query_request(player);
    if (request && request.npc && request.npc.hp > 0) {
        player.notify("<mem>师门任务继续执行。</mem>");
        return this.schedule_auto(player, request.npc, 0);
    }
    return this.start(player);
};

this.random_room = function (family) {
    const rooms = family && family.area && family.area.rooms;
    if (!rooms || !rooms.length) return null;
    const available = [];
    for (const room of rooms) {
        if (!room || room.no_fight || room.no_save || room.is_shadow) continue;
        if (!(room.max_item_count > 1) || room.items.length >= room.max_item_count - 1) continue;
        available.push(room);
    }
    return available.length ? available.random() : null;
};

this.query_request = function (player) {
    return player ? this.requests.get(player.id) : null;
};

this.set_request = function (player, npc, room, state, familyId, ratio) {
    this.requests.set(player.id, {
        npc: npc,
        familyId: familyId,
        roomName: room.long_name,
        day: state.day,
        ringStep: state.ringStep,
        ratio: ratio,
        expiresAt: Date.now() + CONFIG.TASK_TIMEOUT,
        timeoutHandler: this.call_out(this.timeout, CONFIG.TASK_TIMEOUT, player, npc),
        autoHandler: null,
        autoRetries: 0
    });
};

this.schedule_auto = function (player, npc, delay) {
    const request = this.query_request(player);
    if (!request || request.npc !== npc || npc.hp <= 0) return false;
    if (request.autoHandler) clearTimeout(request.autoHandler);
    request.autoHandler = this.call_out(this.run_auto,
        delay === undefined ? AUTO_ENGAGE_DELAY : delay, player, npc);
    return true;
};

this.run_auto = function (player, npc) {
    const request = this.query_request(player);
    if (!request || request.npc !== npc || player.query_temp(KEY_ACTIVE) !== npc.id) return false;
    request.autoHandler = null;
    if (!player.in_world || !player.in_world()) return false;
    if (player.hp <= 0) {
        player.notify("<hiy>师门任务因角色死亡暂停，复活后可以继续当前目标。</hiy>");
        player.send_commands("family_task auto", "继续师门任务", "family_task giveup", "放弃师门任务");
        return false;
    }
    if (!npc.environment || npc.hp <= 0) return false;

    if (player.is_fighting && player.is_fighting()) {
        const enemy = player.query_enemy ? player.query_enemy() : null;
        if (enemy === npc) return true;
        if (!enemy && player.end_fight) player.end_fight();
        if (enemy) {
            request.autoRetries++;
            if (request.autoRetries <= AUTO_RETRY_LIMIT) {
                return this.schedule_auto(player, npc, AUTO_RETRY_DELAY);
            }
            player.notify("<hiy>师门任务因当前战斗未结束而暂停。</hiy>");
            player.send_commands("family_task auto", "继续师门任务", "family_task giveup", "放弃师门任务");
            return false;
        }
    }

    request.autoRetries = 0;
    if (!player.can_trans || !player.can_trans()) {
        player.notify("<hiy>当前状态无法前往师门任务地点，请稍后继续。</hiy>");
        return false;
    }
    player.moveto(npc.environment, player.name + "离开了。", player.name + "赶来执行师门任务。", "family_task");
    if (player.environment !== npc.environment) {
        player.notify("<hiy>暂时无法到达师门任务地点，请稍后继续。</hiy>");
        return false;
    }

    const killCommand = WORLD.COMMANDS.kill;
    if (!killCommand) return player.notify("师门任务战斗指令暂时不可用。");
    killCommand.enter(player, npc.id);
    if (!player.is_fighting || !player.is_fighting(npc)) {
        player.notify("<hiy>未能发起师门任务战斗，请点击继续重试。</hiy>");
        player.send_commands("family_task auto", "继续师门任务", "family_task giveup", "放弃师门任务");
        return false;
    }
    return true;
};

this.continue_ring = function (player) {
    if (!player.in_world || !player.in_world() || player.hp <= 0) return false;
    if (this.query_request(player) || player.query_temp(KEY_ACTIVE)) return false;
    const state = this.ensure_day(player);
    if (state.daily >= CONFIG.DAILY_LIMIT || state.ringDone >= CONFIG.DAILY_RINGS
        || state.ringStep <= 0 || state.ringStep >= CONFIG.RING_SIZE) return false;
    return this.start(player);
};

this.check_player = function (player) {
    if (!player || player.id !== this.query_temp("player")) {
        return player && player.notify_fail(this.name + "喝道：此事与你无关！");
    }
};

this.check = function (npc, killer) {
    const ownerId = npc.query_temp("player");
    const player = killer && killer.id === ownerId ? killer : WORLD.getUser(ownerId);
    if (!killer || killer.id !== ownerId || killer.query_temp(KEY_ACTIVE) !== npc.id) {
        if (player) this.fail(player, "你的师门任务目标被他人击败，任务失败。");
        return;
    }

    const request = this.query_request(killer);
    if (!request || request.npc !== npc || request.familyId !== killer.family.id) {
        return this.fail(killer, "师门任务归属已经失效，当前任务失败。");
    }

    this.remove_request(killer, false);
    killer.remove_temp(KEY_ACTIVE);
    const state = this.ensure_day(killer);
    if (state.daily >= CONFIG.DAILY_LIMIT) return this.refresh_actions(killer);

    const daily = Math.min(CONFIG.DAILY_LIMIT, state.daily + 1);
    const ringStep = Math.min(CONFIG.RING_SIZE, state.ringStep + 1);
    const streak = Math.min(Number.MAX_SAFE_INTEGER, state.streak + 1);
    const ringIndex = Math.min(state.ringDone + 1, CONFIG.DAILY_RINGS);
    killer.set_temp(KEY_DAILY, daily);
    killer.set_temp(KEY_RING_STEP, ringStep);
    killer.set_temp(KEY_STREAK, streak);

    this.grant_base_reward(killer);
    if (ringStep === 9 || ringStep === 10) {
        this.grant_special_reward(killer, ringIndex, ringStep, streak);
    }
    this.retry_pending_rewards(killer);

    const remain = CONFIG.DAILY_LIMIT - daily;
    if (ringStep >= CONFIG.RING_SIZE) {
        const ringDone = Math.min(CONFIG.DAILY_RINGS, state.ringDone + 1);
        killer.set_temp(KEY_RING_DONE, ringDone);
        killer.set_temp(KEY_RING_STEP, 0);
        killer.notify("<hiy>你完成了今日第" + ringDone + "/" + CONFIG.DAILY_RINGS
            + "环师门任务，难度累计保留为" + streak + "层。</hiy>");
        if (remain > 0 && ringDone < CONFIG.DAILY_RINGS) {
            killer.notify("下一环不会自动开始，可在门派后勤处继续接取。");
            killer.send_commands("family_task start", "开始下一环", "family_task giveup", "清空难度");
        } else if (remain <= 0) {
            killer.notify("<hiy>今日20次师门任务已经完成。</hiy>");
        }
        this.save_player(killer, "师门任务整环完成");
        this.refresh_actions(killer);
        return;
    }

    killer.notify("<hic>师门任务完成，当前环进度" + ringStep + "/" + CONFIG.RING_SIZE
        + "，今日成功" + daily + "/" + CONFIG.DAILY_LIMIT
        + "，下一名敌人难度" + formatRatio(CONFIG.queryDifficultyRatio(streak)) + "。</hic>");
    if (remain > 0) {
        killer.notify("<mem>师门任务将继续下一名目标。</mem>");
        if (!WORLD.queue_auto_recovery
            || !WORLD.queue_auto_recovery(killer, "family_ring", null, AUTO_CONTINUE_DELAY)) {
            this.call_out(this.continue_ring, AUTO_CONTINUE_DELAY, killer);
        }
        killer.send_commands("family_task auto", "继续师门任务", "family_task giveup", "放弃师门任务");
    } else {
        killer.notify("<hiy>今日20次师门任务已经完成。</hiy>");
    }
    this.save_player(killer, "师门任务完成");
    this.refresh_actions(killer);
};

this.grant_base_reward = function (player) {
    const reward = CONFIG.queryBaseReward(player);
    player.add_exp(reward.exp, reward.pot);
    player.family.add_gongji(player, reward.merit);
    player.notify("你获得了" + reward.merit + "点师门功绩。");
};

this.grant_special_reward = function (player, ringIndex, ringStep, streak) {
    const day = player.query_temp(KEY_DAY) || CONFIG.queryDayKey();
    const slotKey = day + "_" + ringIndex + "_" + ringStep;
    const rewards = this.read_rewards(player);
    let reward = rewards[slotKey];
    if (reward && reward.delivered) return true;
    if (!reward) {
        reward = this.create_special_reward(player, ringIndex, ringStep, streak);
        rewards[slotKey] = reward;
        this.write_rewards(player, rewards);
    }

    const delivered = this.deliver_special_reward(player, reward, slotKey);
    if (!delivered) {
        player.notify("<hiy>特殊奖励暂未发放成功，系统将在下次结算时继续尝试。</hiy>");
        return false;
    }
    reward.delivered = true;
    rewards[slotKey] = reward;
    this.write_rewards(player, rewards);
    return true;
};

this.retry_pending_rewards = function (player) {
    const rewards = this.read_rewards(player);
    let changed = false;
    for (const slotKey in rewards) {
        const reward = rewards[slotKey];
        if (!reward || reward.delivered) continue;
        if (!this.deliver_special_reward(player, reward, slotKey)) continue;
        reward.delivered = true;
        changed = true;
    }
    if (changed) this.write_rewards(player, rewards);
    return changed;
};

this.read_rewards = function (player) {
    const saved = player.query_temp(KEY_REWARDS, "");
    if (!saved) return {};
    if (typeof saved === "object") return Object.assign({}, saved);
    try {
        const rewards = JSON.parse(decodeURIComponent(saved));
        return rewards && typeof rewards === "object" && !Array.isArray(rewards) ? rewards : {};
    } catch (error) {
        console.error("读取师门任务奖励状态失败", player.id, error.message);
        return {};
    }
};

this.write_rewards = function (player, rewards) {
    player.set_temp(KEY_REWARDS, encodeURIComponent(JSON.stringify(rewards || {})));
};

this.create_special_reward = function (player, ringIndex, ringStep, streak) {
    const type = CONFIG.rollSpecialReward();
    const day = player.query_temp(KEY_DAY) || CONFIG.queryDayKey();
    if (type === "merit") {
        return {
            type: type,
            amount: CONFIG.queryMeritReward(player, ringIndex, streak),
            day: day,
            ringIndex: ringIndex,
            ringStep: ringStep,
            delivered: false
        };
    }
    if (type === "page") {
        return {
            type: type,
            path: "book/up",
            count: CONFIG.rollPageCount(ringIndex, streak),
            day: day,
            ringIndex: ringIndex,
            ringStep: ringStep,
            delivered: false
        };
    }
    const grade = CONFIG.rollEquipmentGrade(player, ringIndex, streak);
    const partId = CONFIG.PART_ORDER.random();
    return {
        type: "equipment",
        path: CONFIG.queryEquipmentPath(player.family.id, partId, grade),
        partId: partId,
        grade: grade,
        count: 1,
        day: day,
        ringIndex: ringIndex,
        ringStep: ringStep,
        delivered: false
    };
};

this.deliver_special_reward = function (player, reward, slotKey) {
    if (reward.type === "merit") {
        player.family.add_gongji(player, reward.amount);
        player.notify("<hiy>师门特殊奖励：获得" + reward.amount + "点师门功绩。</hiy>");
        return true;
    }

    let obj;
    try {
        obj = OBJ.CREATE(reward.path, reward.count || 1);
    } catch (error) {
        console.error("创建师门特殊奖励失败", player.id, reward.path, error.message);
        return false;
    }
    if (!obj) return false;
    if (player.can_add_obj(obj, reward.count || 1)) {
        obj = player.add_obj(obj, reward.count || 1, true);
        if (!obj) return false;
        player.notify("<hiy>师门特殊奖励：获得" + obj.unit_name(reward.count || 1) + "。</hiy>");
        return true;
    }

    const sendCommand = WORLD.COMMANDS.send;
    if (!sendCommand) return false;
    sendCommand.enter(null, player.id, {
        from: "family_task",
        from_name: "师门后勤",
        title: "师门任务特殊奖励",
        summary: "背包空间不足，奖励已转入邮件附件。",
        content: "你完成了师门任务的特殊奖励节点。由于背包空间不足，奖励已通过附件发放。",
        attach: [{ obj: reward.path, count: reward.count || 1 }],
        dedupe: "family_task_" + player.id + "_" + slotKey
    });
    player.notify("<hiy>你的背包空间不足，师门特殊奖励已经发送到邮箱。</hiy>");
    return true;
};

this.timeout = function (player, npc) {
    const request = this.query_request(player);
    if (!request || request.npc !== npc) return;
    this.fail(player, "师门任务已经超时，当前环进度和难度累计已清空。");
};

this.fail = function (player, message) {
    player.remove_temp(KEY_ACTIVE);
    this.remove_request(player, true);
    player.set_temp(KEY_RING_STEP, 0);
    player.set_temp(KEY_STREAK, 0);
    player.notify("<red>" + message + " 今日成功次数保持不变。</red>");
    this.save_player(player, "师门任务失败");
    this.refresh_actions(player);
    return false;
};

this.giveup = function (player, notice) {
    if (notice === undefined) notice = true;
    if (WORLD.is_auto_recovery_pending && WORLD.is_auto_recovery_pending(player, "family_ring")) {
        WORLD.cancel_auto_recovery(player);
    }
    const state = this.ensure_day(player);
    const hadProgress = !!this.query_request(player) || !!player.query_temp(KEY_ACTIVE)
        || state.ringStep > 0 || state.streak > 0;
    player.remove_temp(KEY_ACTIVE);
    this.remove_request(player, true);
    player.set_temp(KEY_RING_STEP, 0);
    player.set_temp(KEY_STREAK, 0);
    if (notice) {
        if (hadProgress) {
            player.notify("<hiy>你已放弃师门任务；当前环进度和难度累计已清空，今日成功次数保留。</hiy>");
        } else {
            player.notify("你当前没有师门任务进度需要放弃。");
        }
    }
    this.save_player(player, "放弃师门任务");
    this.refresh_actions(player);
    return true;
};

this.remove_request = function (player, destroyNpc) {
    const request = this.query_request(player);
    if (!request) return;
    if (request.timeoutHandler) clearTimeout(request.timeoutHandler);
    if (request.autoHandler) clearTimeout(request.autoHandler);
    if (destroyNpc && request.npc && request.npc.hp > 0) {
        request.npc.destroy("<cyn>师门试炼目标见事不可为，转身离去。</cyn>\n");
    }
    request.npc = null;
    this.requests.delete(player.id);
};

this.refresh_actions = function (player) {
    const command = WORLD.COMMANDS.actions;
    if (command) command.enter(player);
};

this.save_player = function (player, reason) {
    if (player && player.save) player.save(reason);
};

function formatRatio(ratio) {
    const value = Math.round((Number(ratio) || 1) * 10000) / 100;
    return value + "%";
}

function formatDuration(value) {
    value = Math.max(0, parseInt(value || 0));
    if (value >= 60000) return Math.ceil(value / 60000) + "分钟";
    return Math.ceil(value / 1000) + "秒";
}
