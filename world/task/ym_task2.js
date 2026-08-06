this.inherits(USERTASK);
this.id = "yamen2";
this.requests = new Map();

this.on_create = function () {
    var task = USERTASK.GET('yamen2');
    if (task) {
        this.requests = task.requests;
    }
}

const TAGS = ['wht', 'hic', 'hiy', 'hiz', 'hio', 'ora', 'ord'];
const TITLES = ['', '衙役', '捕快', '捕头', '总捕头', '巡检', '神捕'];
const MAX_LEVEL = TITLES.length - 1;

const DAILY_LIMIT = 30;
const DAILY_RINGS = 3;
const RING_SIZE = 10;
const AUTO_ENGAGE_DELAY = 500;
const AUTO_CONTINUE_DELAY = 800;
const AUTO_RETRY_DELAY = 500;
const AUTO_RETRY_LIMIT = 20;

// 30次/天时，从衙役晋升到神捕约需60天满勤。
const UPGRADE_COUNT = [1, 180, 270, 360, 450, 540, 0];
const LEVEL_LIMIT = [0, 1000000, 5000000, 17000000, 80000000, 300000000, 1000000000];
const LEVEL_LIMIT2 = [0, 0, 0, 0, 23000000, 50000000, 1500000000];

const MODE_FIXED = "fixed";
const MODE_RISE = "rise";
const MODES = {
    fixed: { name: "固定难度", reward: 1 },
    rise: { name: "递增难度", reward: 1.5 }
};

const EXPS = [0, 5000, 8000, 12000, 16000, 20000, 25000];
const STONE_PATHS = ["st/st_blu#", "st/st_gre#", "st/st_red#", "st/st_yel#"];

const YAMEN_ROOMS = [
    "yz/guangchang", "yz/beidajie1", "yz/beidajie2", "yz/beimen",
    "yz/xidajie1", "yz/xidajie2", "yz/ximen",
    "yz/nandajie1", "yz/nandajie2", "yz/nanmen",
    "yz/dongdajie1", "yz/dongdajie2", "yz/dongmen",
    "yz/hanshui", "yz/kuang", "yz/yaolin", "yz/work"
];

function today_key() {
    return new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
}

function clamp_int(value, min, max) {
    value = parseInt(value || 0);
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function format_count(value) {
    value = parseInt(value || 0);
    if (value >= 100000000) return parseInt(value / 100000000) + "亿";
    if (value >= 10000) return parseInt(value / 10000) + "万";
    return value.toString();
}

this.query_title = function (me) {
    let level = clamp_int(me.query_temp('ym_level', 0), 0, TAGS.length - 1);
    return `<${TAGS[level]}>衙门追捕</${TAGS[level]}>`;
}

this.ensure_day = function (me) {
    const key = today_key();
    if (me.query_temp("ym_day") !== key) {
        me.set_temp("ym_day", key);
        me.set_temp("ym_daily_success", 0);
        me.set_temp("ym_ring_done", 0);
        me.set_temp("ym_ring_step", 0);
        me.remove_temp("ym_ring_mode");
    }
    return {
        key: key,
        daily: clamp_int(me.query_temp("ym_daily_success", 0), 0, DAILY_LIMIT),
        ringDone: clamp_int(me.query_temp("ym_ring_done", 0), 0, DAILY_RINGS),
        ringStep: clamp_int(me.query_temp("ym_ring_step", 0), 0, RING_SIZE),
        mode: this.normalize_mode(me.query_temp("ym_ring_mode"))
    };
}

this.normalize_mode = function (mode) {
    if (mode === MODE_FIXED || mode === "fix" || mode === "guding") return MODE_FIXED;
    if (mode === MODE_RISE || mode === "up" || mode === "riseup" || mode === "dizeng") return MODE_RISE;
    return null;
}

this.mode_name = function (mode) {
    mode = this.normalize_mode(mode) || MODE_FIXED;
    return MODES[mode].name;
}

this.query_state = function (me) {
    const request = this.query_request(me);
    if (me.query_temp("ym_task") && request) return 1;
    this.ensure_day(me);
    if (me.query_temp("ym_ring_step", 0) > 0 || me.query_temp("ym_ring_mode")) return 1;
    return 0;
}

this.query_desc = function (me) {
    const state = this.ensure_day(me);
    const request = this.query_request(me);
    const level = clamp_int(me.query_temp("ym_level", 0), 0, MAX_LEVEL);
    const level2 = clamp_int(me.query_temp("ym_lv2", 0), 0, UPGRADE_COUNT[level] || 0);
    const mode = state.mode || (request && request.mode);
    const str = [];

    str.push("<mem>今日 ", state.daily, "/", DAILY_LIMIT,
        "｜环数 ", state.ringDone, "/", DAILY_RINGS,
        "｜当前环 ", state.ringStep, "/", RING_SIZE);
    if (mode) str.push("｜", this.mode_name(mode));
    str.push("</mem>");

    if (request && request.npc) {
        let time = request.time - Date.now();
        if (time <= 0) {
            this.clear(me, request.npc);
            return "你的追捕任务失败了，当前环进度已重置，今日成功次数保留。";
        }
        str.push("<br>目标：", request.npc.name,
            "｜地点：", request.wz,
            "｜剩余：", parseInt(time / 60000), "分", parseInt((time % 60000) / 1000), "秒");
    } else if (state.ringStep > 0) {
        str.push("<br><mem>当前环待继续</mem>");
    }

    if (level === 0) {
        str.push("<br><mem>职位：未入职</mem>");
    } else if (level < MAX_LEVEL) {
        str.push("<br><mem>职位：", TITLES[level],
            "｜晋升 ", level2, "/", UPGRADE_COUNT[level]);
        if (level2 >= UPGRADE_COUNT[level] && this.query_gate(me, level)) {
            str.push("｜资格未达");
        }
        str.push("</mem>");
    } else {
        str.push("<br><mem>职位：神捕</mem>");
    }
    return str.join("");
}

this.query_gate = function (player, level) {
    if (level <= 0 || level >= MAX_LEVEL) return null;
    const needExp = LEVEL_LIMIT[level] || 0;
    const needScore = LEVEL_LIMIT2[level] || 0;
    const miss = [];
    if ((player.exp || 0) < needExp) {
        miss.push("经验需达到" + format_count(needExp));
    }
    if ((player.score || 0) < needScore) {
        miss.push("武学评价需达到" + format_count(needScore));
    }
    if (!miss.length) return null;
    return "程药发对你说道：你目前还不够资格继续晋升，" + miss.join("，") + "。";
}

this.prompt_mode = function (player) {
    player.notify("程药发对你说道：本环追捕请选择难度。固定难度更稳，递增难度会逐次增强逃犯，环奖励更高。");
    player.send_commands("yamen start fixed", "固定难度", "yamen start rise", "递增难度");
}

this.prepare_start = function (player, mode) {
    const state = this.ensure_day(player);
    mode = this.normalize_mode(mode);

    if (state.daily >= DAILY_LIMIT) {
        player.notify("程药发对你说道：你今日追捕次数已满，明日再来吧。");
        return null;
    }
    if (state.ringDone >= DAILY_RINGS) {
        player.notify("程药发对你说道：你今日三环追捕已完成，明日再来吧。");
        return null;
    }

    if (state.ringStep > 0) {
        if (mode && state.mode && mode !== state.mode) {
            player.notify("程药发对你说道：本环已选择" + this.mode_name(state.mode) + "，若要更换难度请先放弃当前环。");
            return null;
        }
        mode = state.mode || mode || MODE_FIXED;
    } else {
        mode = mode || state.mode;
        if (!mode) {
            this.prompt_mode(player);
            return null;
        }
        player.set_temp("ym_ring_mode", mode);
    }

    state.mode = mode;
    return state;
}

this.random_room = function () {
    for (let i = 0; i < YAMEN_ROOMS.length * 2; i++) {
        const rm = ROOM.Get(YAMEN_ROOMS.random());
        if (rm && !rm.no_fight && rm.max_item_count > 1) return rm;
    }
    return ROOM.Get("yz/guangchang");
}

this.query_ratio = function (player, level, level2, mode, ringStep) {
    level = clamp_int(level, 0, MAX_LEVEL);
    const need = UPGRADE_COUNT[level] || 1;
    const progress = Math.min(level2 / need, 1);
    const realm = clamp_int(player.level, 0, 6);
    const rankPressure = Math.min(0.2, level * 0.02 + realm * 0.015 + progress * 0.05);

    if (mode === MODE_RISE) {
        const stepPressure = RING_SIZE <= 1 ? 0 : ringStep * 0.5 / (RING_SIZE - 1);
        return Math.min(1.5, 1 + rankPressure + stepPressure);
    }
    return Math.min(1.25, 1 + rankPressure);
}

this.refresh_actions = function (player) {
    const cmd = WORLD.COMMANDS["actions"];
    if (cmd) cmd.enter(player);
}

this.start = function (player, mode) {
    let request = this.query_request(player);
    if (player.query_temp("ym_task") && request) {
        player.notify("程药发对你说道：你不是在追捕吗？ 好好干。");
        player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
        this.refresh_actions(player);
        return true;
    }
    if (player.query_temp("ym_task") && !request) {
        player.remove_temp("ym_task");
    }

    const state = this.prepare_start(player, mode);
    if (!state) return false;

    const level = clamp_int(player.query_temp('ym_level', 0), 0, MAX_LEVEL);
    const level2 = clamp_int(player.query_temp('ym_lv2', 0), 0, UPGRADE_COUNT[level] || 0);
    const ratio = this.query_ratio(player, level, level2, state.mode, state.ringStep);

    const npc = NPC.CLONE("pub/yamen");
    npc.init_from(player, level, level2, {
        mode: state.mode,
        ringStep: state.ringStep + 1,
        ratio: ratio
    });

    const rm = this.random_room();
    rm.item_changed(npc, true);
    this.set_request(player, npc, rm.long_name, state.mode, state.ringStep, ratio);

    const ringIndex = Math.min(state.ringDone + 1, DAILY_RINGS);
    const chaseIndex = state.ringStep + 1;
    if (level > 0) {
        player.notify("程药发对你说道：你来的正好，" + npc.name + "作恶多端，还请" + player.call()
            + "为民除害。此为今日第" + ringIndex + "环第" + chaseIndex + "/" + RING_SIZE
            + "次，听说他最近在" + rm.long_name + "出现过。");
    } else {
        player.notify("程药发对你说道：这位" + player.call() + "，你还没加入衙门吧。你去除掉"
            + npc.name + "，我就收了你。听说他最近在" + rm.long_name + "出现过。");
    }

    player.notify("<mem>今日剩余追捕成功次数：" + (DAILY_LIMIT - state.daily) + "/" + DAILY_LIMIT
        + "，当前难度：" + this.mode_name(state.mode) + "。</mem>");
    player.send_commands("yamen auto", "立即自动追捕", "yamen giveup", "放弃追捕");

    player.set_temp("ym_task", npc.id);
    npc.set_temp("player", player.id);
    npc.on_died = this.check.bind(this, npc);
    npc.on_kill = this.check_player;
    this.schedule_auto_chase(player, npc, AUTO_ENGAGE_DELAY);
    this.refresh_actions(player);
    return true;
}

this.auto = function (player, mode) {
    const request = this.query_request(player);
    if (request && request.npc && request.npc.hp > 0) {
        player.notify("<mem>自动追捕继续执行。</mem>");
        return this.schedule_auto_chase(player, request.npc, 0);
    }
    return this.start(player, mode);
}

this.to_taofan = function (player) {
    var request = this.requests.get(player.id);
    if (!request || !request.npc || request.npc.hp <= 0 || !request.npc.environment) {
        player.notify("你当前没有正在追捕的逃犯。");
        player.send_commands("yamen auto", "继续追捕");
        return false;
    }
    if (request.time <= Date.now()) {
        this.clear(player, request.npc);
        return false;
    }
    if (player.state) {
        player.set_state(null);
        if (player.state) return false;
    }
    if (!player.can_trans()) return false;
    player.moveto(request.npc.environment, player.name + '离开了。', player.name + "走了过来。");
    return true;
}

this.query_request = function (me) {
    return this.requests.get(me.id);
}

this.set_request = function (me, npc, wz, mode, ringStep, ratio) {
    this.requests.set(me.id, {
        npc: npc,
        time: Date.now() + 600000,
        handler: this.call_out(this.clear, 600000, me, npc),
        autoHandler: null,
        autoRetries: 0,
        wz: wz,
        mode: mode,
        ringStep: ringStep,
        ratio: ratio
    });
}

this.schedule_auto_chase = function (player, npc, delay) {
    const request = this.query_request(player);
    if (!request || request.npc !== npc || npc.hp <= 0) return false;
    if (request.autoHandler) clearTimeout(request.autoHandler);
    request.autoHandler = this.call_out(this.run_auto_chase,
        delay === undefined ? AUTO_ENGAGE_DELAY : delay, player, npc);
    return true;
}

this.run_auto_chase = function (player, npc) {
    const request = this.query_request(player);
    if (!request || request.npc !== npc || player.query_temp("ym_task") !== npc.id) return false;
    request.autoHandler = null;

    if (!player.in_world || !player.in_world()) return false;
    if (player.hp <= 0) {
        player.notify("<hiy>自动追捕已暂停，复活后可继续当前目标。</hiy>");
        player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
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
                return this.schedule_auto_chase(player, npc, AUTO_RETRY_DELAY);
            }
            player.notify("<hiy>自动追捕因当前战斗未结束而暂停。</hiy>");
            player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
            return false;
        }
    }

    request.autoRetries = 0;
    if (!this.to_taofan(player)) {
        player.notify("<hiy>自动追捕暂时无法前往目标地点，请稍后继续。</hiy>");
        player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
        return false;
    }
    if (player.environment !== npc.environment) {
        player.notify("<hiy>自动追捕未能到达目标地点，请稍后继续。</hiy>");
        player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
        return false;
    }

    const killCommand = WORLD.COMMANDS["kill"];
    if (!killCommand) {
        player.notify("<hiy>自动追捕暂时不可用，请稍后重试。</hiy>");
        return false;
    }
    killCommand.enter(player, npc.id);
    if (!player.is_fighting || !player.is_fighting(npc)) {
        player.notify("<hiy>自动追捕未能发起战斗，请点击继续重试。</hiy>");
        player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
        return false;
    }
    return true;
}

this.continue_ring = function (player, mode) {
    if (!player.in_world || !player.in_world() || player.hp <= 0) return false;
    if (this.query_request(player) || player.query_temp("ym_task")) return false;

    const state = this.ensure_day(player);
    if (state.daily >= DAILY_LIMIT || state.ringDone >= DAILY_RINGS
        || state.ringStep <= 0 || state.ringStep >= RING_SIZE) {
        return false;
    }
    return this.start(player, state.mode || mode);
}

this.check_player = function (me) {
    if (me.id != this.query_temp("player")) {
        return me.notify_fail(this.name + "对你喊道：" + me.call(true) + "，别多管闲事！");
    }
}

this.remove_request = function (me, isremove) {
    var request = this.requests.get(me.id);
    if (!request) return;
    if (request.handler) clearTimeout(request.handler);
    if (request.autoHandler) clearTimeout(request.autoHandler);
    if (isremove && request.npc && request.npc.hp > 0) {
        request.npc.destroy("<cyn>" + request.npc.name + "向后跃开三尺，高声喊道：青山不改，绿水长流，咱们走着瞧！</cyn>\n");
    }
    request.npc = null;
    this.requests.delete(me.id);
}

this.reset_ring = function (player) {
    this.ensure_day(player);
    player.set_temp("ym_ring_step", 0);
    player.remove_temp("ym_ring_mode");
}

this.check = function (npc, killer, corpse) {
    var user = npc.query_temp("player");
    if (!killer || killer.id != user || killer.query_temp("ym_task") != npc.id) {
        var real_player = WORLD.getUser(user);
        if (real_player) {
            real_player.notify("<hic>你追捕的逃犯被别人击杀，你的任务失败了；当前环进度已重置，今日成功次数保留。</hic>");
            real_player.remove_temp("ym_task");
            this.remove_request(real_player, false);
            this.reset_ring(real_player);
            this.refresh_actions(real_player);
        }
        return;
    }

    const player = killer;
    const request = this.query_request(player) || {};
    const mode = this.normalize_mode(request.mode) || this.normalize_mode(player.query_temp("ym_ring_mode")) || MODE_FIXED;
    this.remove_request(player, false);
    player.remove_temp("ym_task");

    let state = this.ensure_day(player);
    let daily = player.add_temp("ym_daily_success", 1);
    if (daily > DAILY_LIMIT) {
        daily = DAILY_LIMIT;
        player.set_temp("ym_daily_success", DAILY_LIMIT);
    }
    let ringStep = player.add_temp("ym_ring_step", 1);
    if (ringStep > RING_SIZE) {
        ringStep = RING_SIZE;
        player.set_temp("ym_ring_step", RING_SIZE);
    }

    this.update_promotion(player);
    const level = clamp_int(player.query_temp("ym_level", 0), 1, MAX_LEVEL);
    this.grant_chase_reward(player, level, mode);

    const remain = DAILY_LIMIT - daily;
    if (ringStep >= RING_SIZE) {
        const ringDone = player.add_temp("ym_ring_done", 1);
        player.set_temp("ym_ring_step", 0);
        player.remove_temp("ym_ring_mode");
        this.grant_ring_reward(player, level, mode, ringDone);

        if (remain > 0 && ringDone < DAILY_RINGS) {
            player.notify("<hiy>本环已完成，可选择下一环难度继续追捕。</hiy>");
            player.send_commands("yamen start fixed", "下一环固定", "yamen start rise", "下一环递增");
        } else if (remain <= 0) {
            player.notify("<hiy>今日追捕成功次数已用完，明日再来吧。</hiy>");
        }
        this.refresh_actions(player);
        return;
    }

    player.notify("<hic>追捕成功，当前环进度" + ringStep + "/" + RING_SIZE
        + "，今日剩余成功次数" + remain + "/" + DAILY_LIMIT + "。</hic>");
    if (remain > 0) {
        player.notify("<mem>自动追捕将继续下一名逃犯。</mem>");
        this.call_out(this.continue_ring, AUTO_CONTINUE_DELAY, player, mode);
        player.send_commands("yamen auto", "继续自动追捕", "yamen giveup", "放弃追捕");
    } else {
        player.notify("<hiy>今日追捕成功次数已用完，明日再来吧。</hiy>");
    }
    this.refresh_actions(player);
}

this.update_promotion = function (player) {
    let level = clamp_int(player.query_temp("ym_level", 0), 0, MAX_LEVEL);
    if (level === 0) {
        player.notify("<hic>你成功帮助衙门追捕犯人，获得称号【衙役】。</hic>");
        player.add_title(TITLES[1], "ym");
        player.set_temp("ym_level", 1);
        player.remove_temp("ym_lv2");
        player.set_temp("ym_tm", Math.floor(Date.now() / 100000));
        player.notify("\n<hiy>扬州衙门将对你持续发放小时报酬，可从“衙门兼职”任务领取。</hiy>\n");
        return 1;
    }
    if (level >= MAX_LEVEL) {
        player.notify("<hic>追捕成功，你已是最高职位【神捕】。</hic>");
        return level;
    }

    const need = UPGRADE_COUNT[level];
    const oldLevel2 = clamp_int(player.query_temp("ym_lv2", 0), 0, need);
    let level2 = oldLevel2;
    if (level2 < need) {
        level2 = player.add_temp("ym_lv2", 1);
    }
    if (level2 >= need) {
        player.set_temp("ym_lv2", need);
        const gate = this.query_gate(player, level);
        if (gate) {
            if (oldLevel2 < need) {
                player.notify(gate + "职位进度已保留，你仍可继续追捕。");
            }
            return level;
        }
        USERTASK.GET('yamen').on_finish(player);
        level = player.add_temp("ym_level", 1);
        player.remove_temp("ym_lv2");
        player.notify("<hic>你帮助衙门连续追捕犯人，获得称号：" + TITLES[level] + "。</hic>");
        player.add_title(TITLES[level], "ym");
        player.notify("<hiy>你的衙门兼职小时报酬等级提高了。</hiy>");
        return level;
    }

    player.notify("<hic>职位进度：" + TITLES[level] + " " + level2 + "/" + need
        + "，满后晋升为" + TITLES[level + 1] + "。</hic>");
    return level;
}

this.grant_chase_reward = function (player, level, mode) {
    const rewardLevel = clamp_int(level, 1, MAX_LEVEL);
    const rewardMul = mode === MODE_RISE ? 1.25 : 1;
    const exp = parseInt(EXPS[rewardLevel] * rewardMul);
    player.add_exp(exp, exp);

    const obj = player.add_obj(STONE_PATHS.random() + Math.min(rewardLevel, 4));
    if (obj) {
        player.notify("即时追捕奖励：你获得" + obj.unit_name(1) + "。");
    }
}

this.grant_ring_reward = function (player, level, mode, ringDone) {
    const rewardLevel = clamp_int(level, 1, MAX_LEVEL);
    const rewardMul = MODES[mode] ? MODES[mode].reward : 1;
    const exp = parseInt(EXPS[rewardLevel] * RING_SIZE * 0.6 * rewardMul);
    const xuanjing = Math.max(1, parseInt(rewardLevel * 8 * rewardMul));
    const stoneCount = Math.max(1, parseInt(rewardLevel * 2 * rewardMul));

    player.add_exp(exp, exp);
    let obj = player.add_obj("st/xuanjing", xuanjing);
    if (obj) {
        player.notify("环奖励：你获得" + obj.unit_name(xuanjing) + "。");
    }
    obj = player.add_obj(STONE_PATHS.random() + Math.min(rewardLevel, 4), stoneCount);
    if (obj) {
        player.notify("环奖励：你获得" + obj.unit_name(stoneCount) + "。");
    }
    player.notify("<hiy>你完成今日第" + ringDone + "/" + DAILY_RINGS + "环衙门追捕，难度："
        + this.mode_name(mode) + "。</hiy>");
}

this.clear = function (player, npc) {
    const request = this.query_request(player);
    if (npc && request && request.npc !== npc) return;
    this.giveup(player, true, false);
    player.notify("<red>你的追捕任务失败了；当前环进度已重置，今日成功次数保留。</red>");
}

this.giveup = function (player, resetRing, notice) {
    if (resetRing === undefined) resetRing = true;
    if (notice === undefined) notice = true;

    const hadRequest = !!this.query_request(player);
    const hadRing = player.query_temp("ym_ring_step", 0) > 0 || player.query_temp("ym_ring_mode");
    player.remove_temp("ym_task");
    this.remove_request(player, true);
    if (resetRing) this.reset_ring(player);

    if (notice) {
        if (hadRequest || hadRing) {
            player.notify("<hiy>你已放弃当前追捕；当前环进度已清空，今日成功次数仍保留。</hiy>");
        } else {
            player.notify("你当前没有正在追捕的逃犯。");
        }
    }
    this.refresh_actions(player);
}
