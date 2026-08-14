const MERIDIAN_VERSION = 1;
const MERIDIAN_COST_UNIT = 10000;
const MERIDIAN_TITLE = "周天圆满";
const MERIDIAN_TITLE_TYPE = "meridian_zhou_tian";

const MERIDIAN_PRACTICE_MIN_MS = 60 * 1000;
const MERIDIAN_PRACTICE_MAX_MS = 5 * 60 * 1000;

const MERIDIAN_PRACTICE_DESC = [
    "你凝神屏息，引导内息缓缓冲击闭塞的穴道。",
    "一股暖流沿经脉缓缓流动，穴道处传来阵阵酥麻。",
    "你感到经脉深处似乎有什么东西正在松动。",
    "额头沁出细汗，你咬牙坚持，将内力一点点向前推进。",
    "经脉中传来隐隐的刺痛，你知道这是贯通前的征兆。"
];

const MERIDIAN_CONFIGS = [
    {
        id: "ren",
        name: "任脉",
        holes: ["会阴", "曲骨", "中极", "关元", "气海", "神阙", "中脘", "膻中", "天突", "承浆"],
        perHole: { study_per: 20, lianxi_per: 20 },
        full: { study_per: 100, lianxi_per: 100 },
        effect: "学习、练习效率各+20%",
        fullEffect: "学习、练习效率各额外+100%",
        current(progress, complete) {
            const value = progress * 20 + (complete ? 100 : 0);
            return "学习、练习效率各+" + value + "%";
        }
    },
    {
        id: "du",
        name: "督脉",
        holes: ["长强", "腰阳关", "命门", "至阳", "大椎", "风府", "百会", "上星", "水沟", "龈交"],
        perHole: { dazuo_per: 20 },
        full: { dazuo_per: 100 },
        effect: "打坐效率+20%",
        fullEffect: "打坐效率额外+100%",
        current(progress, complete) {
            return "打坐效率+" + (progress * 20 + (complete ? 100 : 0)) + "%";
        }
    },
    {
        id: "dai",
        name: "带脉",
        holes: ["带脉", "五枢", "维道", "天冲", "浮白", "头窍阴", "完骨", "本神", "阳白", "头临泣", "目窗", "正营", "承灵", "脑空", "外丘", "光明", "阳辅", "悬钟", "丘墟"],
        perHole: { max_hp: 5000 },
        full: { max_hp: 50000 },
        effect: "气血上限+5000",
        fullEffect: "气血上限额外+50000",
        current(progress, complete) {
            return "气血上限+" + (progress * 5000 + (complete ? 50000 : 0));
        }
    },
    {
        id: "chong",
        name: "冲脉",
        holes: ["会阴", "阴交", "气冲", "横骨", "大赫", "气穴", "四满", "中注", "肓俞", "商曲", "石关", "阴都", "通谷", "幽门", "关门", "太乙", "滑肉门", "天枢", "外陵", "大巨", "水道", "归来", "气舍", "水突"],
        perHole: { gj: 200 },
        full: { gj: 1000 },
        effect: "攻击+200",
        fullEffect: "攻击额外+1000",
        current(progress, complete) {
            return "攻击+" + (progress * 200 + (complete ? 1000 : 0));
        }
    },
    {
        id: "yinqiao",
        name: "阴跷脉",
        holes: ["然谷", "照海", "交信", "阴谷", "横骨", "气冲", "乳根", "缺盆", "人迎", "睛明", "不容", "梁门", "犊鼻", "足三里", "丰隆", "解溪", "冲阳", "厉兑"],
        perHole: { limit_mp: 6000 },
        full: { limit_mp: 50000 },
        effect: "内力封顶+6000",
        fullEffect: "内力封顶额外+50000",
        current(progress, complete) {
            return "内力封顶+" + (progress * 6000 + (complete ? 50000 : 0));
        }
    },
    {
        id: "yangqiao",
        name: "阳跷脉",
        holes: ["申脉", "仆参", "跗阳", "居髎", "臑俞", "肩髃", "巨骨", "地仓", "巨髎", "承泣", "风池", "攒竹", "眉冲", "曲差", "五处", "承光", "通天", "络却", "玉枕", "天柱", "承山", "飞扬", "昆仑"],
        perHole: { mz: 200 },
        full: { mz: 1000 },
        effect: "命中+200",
        fullEffect: "命中额外+1000",
        current(progress, complete) {
            return "命中+" + (progress * 200 + (complete ? 1000 : 0));
        }
    },
    {
        id: "yangwei",
        name: "阳维脉",
        holes: ["金门", "阳交", "臑俞", "天髎", "肩井", "头维", "本神", "阳白", "头临泣", "目窗", "正营", "承灵", "脑空", "风池", "风府", "哑门", "云门", "尺泽", "孔最", "列缺", "经渠", "太渊", "鱼际", "少商"],
        perHole: { bj_per: 1 },
        full: { bj_per: 10 },
        effect: "暴击率+1%",
        fullEffect: "暴击率额外+10%",
        current(progress, complete) {
            return "暴击率+" + (progress + (complete ? 10 : 0)) + "%";
        }
    },
    {
        id: "yinwei",
        name: "阴维脉",
        holes: ["府舍", "大横", "阳交", "腹哀", "期门", "廉泉", "天突", "极泉", "青灵", "少海", "膻中", "灵道", "通里", "阴郄", "神门", "少府", "少冲", "筑宾"],
        perHole: { zj: 200 },
        full: { zj: 1000 },
        effect: "招架+200",
        fullEffect: "招架额外+1000",
        current(progress, complete) {
            return "招架+" + (progress * 200 + (complete ? 1000 : 0));
        }
    },
    {
        id: "handyang",
        name: "手三阳经",
        holes: ["迎香", "禾髎", "扶突", "天鼎", "巨骨", "手五里", "阳溪", "商阳", "丝竹空", "角孙", "天牖", "肩髎", "清冷渊", "四渎", "中渚", "关冲", "听宫", "颧髎", "天容", "天窗", "天宗", "小海", "后溪", "少泽"],
        perHole: { ds: 200 },
        full: { ds: 1000 },
        effect: "躲闪+200",
        fullEffect: "躲闪额外+1000",
        current(progress, complete) {
            return "躲闪+" + (progress * 200 + (complete ? 1000 : 0));
        }
    },
    {
        id: "handyin",
        name: "手三阴经",
        holes: ["天府", "尺泽", "孔最", "列缺", "经渠", "太渊", "鱼际", "少商", "天池", "曲泽", "郄门", "间使", "内关", "大陵", "劳宫", "中冲", "极泉", "少海", "灵道", "通里", "阴郄", "神门", "少府", "少冲"],
        perHole: { fy: 200 },
        full: { fy: 1000 },
        effect: "防御+200",
        fullEffect: "防御额外+1000",
        current(progress, complete) {
            return "防御+" + (progress * 200 + (complete ? 1000 : 0));
        }
    }
];

const MERIDIAN_CONFIG_MAP = {};
for (const config of MERIDIAN_CONFIGS) MERIDIAN_CONFIG_MAP[config.id] = config;

const MERIDIAN_ZHOUTIAN_PROPS = {
    add_sh_per: 10,
    diff_sh_per: 10,
    diff_fy_per: 5
};

function normalizeProgress(value, max) {
    if (typeof value !== "number" || !Number.isFinite(value)) return 0;
    value = Math.floor(value);
    if (value < 0) return 0;
    return Math.min(value, max);
}

function format_meridian_duration(ms) {
    if (!(ms > 0)) return "即将完成";
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return seconds + "秒";
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return rest > 0 ? minutes + "分" + rest + "秒" : minutes + "分钟";
}

function normalizeMeridianData(value) {
    const data = { version: MERIDIAN_VERSION };
    const source = value && typeof value === "object" ? value : {};
    for (const config of MERIDIAN_CONFIGS) {
        data[config.id] = normalizeProgress(source[config.id], config.holes.length);
    }
    return data;
}

function copyMeridianData(value) {
    return normalizeMeridianData(value);
}

function isMeridianComplete(data, config) {
    return data[config.id] >= config.holes.length;
}

function isZhoutianComplete(data) {
    for (const config of MERIDIAN_CONFIGS) {
        if (!isMeridianComplete(data, config)) return false;
    }
    return true;
}

function addConfiguredProp(config, progress, name) {
    let value = (config.perHole[name] || 0) * progress;
    if (progress >= config.holes.length) value += config.full[name] || 0;
    return value;
}

function queryMeridianProp(data, name) {
    let value = 0;
    for (const config of MERIDIAN_CONFIGS) {
        value += addConfiguredProp(config, data[config.id], name);
    }
    if (isZhoutianComplete(data)) value += MERIDIAN_ZHOUTIAN_PROPS[name] || 0;
    return value;
}

function querySpent(progress) {
    return MERIDIAN_COST_UNIT * progress * (progress + 1) / 2;
}

function queryTotalProgress(data) {
    let value = 0;
    for (const config of MERIDIAN_CONFIGS) value += data[config.id];
    return value;
}

function queryTotalSpent(data) {
    let value = 0;
    for (const config of MERIDIAN_CONFIGS) value += querySpent(data[config.id]);
    return value;
}

function queryCompletedCount(data) {
    let value = 0;
    for (const config of MERIDIAN_CONFIGS) {
        if (isMeridianComplete(data, config)) value++;
    }
    return value;
}

USER.prototype.normalize_meridian_data = function (value) {
    this.meridians = normalizeMeridianData(value === undefined ? this.meridians : value);
    return this.meridians;
};

USER.prototype.query_meridian_data = function () {
    return this.normalize_meridian_data();
};

USER.prototype.export_meridian_data = function () {
    return copyMeridianData(this.query_meridian_data());
};

USER.prototype.query_meridian_prop = function (name, value) {
    const data = value ? normalizeMeridianData(value) : this.query_meridian_data();
    return queryMeridianProp(data, name);
};

USER.prototype.is_meridian_complete = function (id) {
    const config = MERIDIAN_CONFIG_MAP[id];
    return !!config && isMeridianComplete(this.query_meridian_data(), config);
};

USER.prototype.is_zhoutian_complete = function () {
    return isZhoutianComplete(this.query_meridian_data());
};

USER.prototype.is_meridian_unlocked = function (id, value) {
    if (id === "ren" || id === "du") return true;
    const data = value || this.query_meridian_data();
    return this.level >= 3
        && isMeridianComplete(data, MERIDIAN_CONFIG_MAP.ren)
        && isMeridianComplete(data, MERIDIAN_CONFIG_MAP.du);
};

USER.prototype.ensure_meridian_title = function () {
    const complete = this.is_zhoutian_complete();
    const current = this.query_title(MERIDIAN_TITLE_TYPE);
    if (complete && !current) this.add_title(MERIDIAN_TITLE, MERIDIAN_TITLE_TYPE);
    if (!complete && current) this.add_title(null, MERIDIAN_TITLE_TYPE);
    return complete;
};

USER.prototype.query_meridian_room_status = function () {
    const room = this.environment;
    if (!room || room.can_practice_meridian !== true) {
        return { allowed: false, reason: "此处人心浮动，不宜静心行功。你需要前往卧室或练功房修炼经脉。" };
    }
    if (room.is_copy && room.is_copy() && !(room.parent && room.parent.not_fb)) {
        return { allowed: false, reason: "副本和剧情区域中无法静心修炼经脉。" };
    }
    return { allowed: true, reason: "当前房间可以修炼经脉。" };
};

USER.prototype.query_meridian_action_reason = function (config, data) {
    if (!config) return "未知的经脉。";
    if (!this.is_meridian_unlocked(config.id, data)) return "任督二脉全通并达到宗师境界后开放。";
    const progress = data[config.id];
    if (progress >= config.holes.length) return "这条经脉已经全部贯通。";
    if (this.hp <= 0) return "你现在是灵魂状态，无法修炼经脉。";
    if (this.is_faint) return "你正在昏迷中，无法修炼经脉。";
    if (this.state) {
        if (this.state.id === "meridian_practice") {
            const remaining = Math.max(0, this.state.end_time - Date.now());
            return "你正在贯通经脉，还需约" + format_meridian_duration(remaining) + "，请耐心等待。";
        }
        return "你正在" + this.state.title + "，无法分心修炼经脉。";
    }
    if (this.fight_type > 0 || this.is_fighting()) return "你正在战斗，无法修炼经脉。";
    if (this.is_busy) return "你现在正忙，无法修炼经脉。";
    const roomStatus = this.query_meridian_room_status();
    if (!roomStatus.allowed) return roomStatus.reason;
    const cost = MERIDIAN_COST_UNIT * (progress + 1);
    if (this.max_mp < cost) return "当前最大内力不足，本次需要" + cost + "点最大内力。";
    return "";
};

USER.prototype.query_meridian_practicing = function () {
    const state = this.state;
    if (!state || state.id !== "meridian_practice") return null;
    const config = MERIDIAN_CONFIG_MAP[state.meridian_id];
    if (!config) return null;
    return {
        id: config.id,
        name: config.name,
        remaining: Math.max(0, state.end_time - Date.now())
    };
};

USER.prototype.query_prop_with_meridian_data = function (name, data) {
    return this.query_prop(name) - this.query_meridian_prop(name) + this.query_meridian_prop(name, data);
};

USER.prototype.query_meridian_preview_hp = function (afterMaxMp, data) {
    const forceDao = SKILL.get("force");
    const staffDao = SKILL.get("staff");
    const hpDaoBonus = (forceDao && forceDao.query_dao_hp_bonus
        ? forceDao.query_dao_hp_bonus(this) : 0)
        + (staffDao && staffDao.query_dao_hp_bonus ? staffDao.query_dao_hp_bonus(this) : 0);
    const conDaoBonus = staffDao && staffDao.query_dao_con_bonus
        ? staffDao.query_dao_con_bonus(this) : 0;
    const con = this.con * (100 + conDaoBonus) / 100;
    const maxHp = parseInt(con * 5 + (afterMaxMp * this.query_force_rad()
        + this.query_prop_with_meridian_data("max_hp", data)
        + this.query_prop_with_meridian_data("con", data) * con)
        * (100 + this.query_prop_with_meridian_data("hp_per", data) + hpDaoBonus) / 100);
    return Math.max(1, maxHp);
};

USER.prototype.query_meridian_preview = function (id, value) {
    const config = MERIDIAN_CONFIG_MAP[id];
    const data = value || this.query_meridian_data();
    if (!config) return null;
    const progress = data[id];
    if (progress >= config.holes.length) return null;
    const nextData = copyMeridianData(data);
    nextData[id] = progress + 1;
    const cost = MERIDIAN_COST_UNIT * (progress + 1);
    const afterMaxMp = Math.max(0, this.max_mp - cost);
    const afterMaxHp = this.query_meridian_preview_hp(afterMaxMp, nextData);
    const completes = nextData[id] >= config.holes.length;
    return {
        index: progress + 1,
        name: config.holes[progress],
        cost,
        afterMaxMp,
        afterMp: Math.min(this.mp, afterMaxMp),
        afterMaxHp,
        afterHp: Math.min(this.hp, afterMaxHp),
        reward: config.effect,
        fullReward: completes ? config.fullEffect : "",
        completes
    };
};

USER.prototype.query_meridian_view = function () {
    const data = this.query_meridian_data();
    const roomStatus = this.query_meridian_room_status();
    const items = [];
    for (const config of MERIDIAN_CONFIGS) {
        const progress = data[config.id];
        const complete = progress >= config.holes.length;
        const unlocked = this.is_meridian_unlocked(config.id, data);
        const preview = complete ? null : this.query_meridian_preview(config.id, data);
        const practicing = this.query_meridian_practicing();
        const reason = unlocked ? this.query_meridian_action_reason(config, data) : "任督二脉全通并达到宗师境界后开放。";
        items.push({
            id: config.id,
            name: config.name,
            progress,
            total: config.holes.length,
            complete,
            unlocked,
            effect: config.effect,
            fullEffect: config.fullEffect,
            currentEffect: config.current(progress, complete),
            spent: querySpent(progress),
            holes: config.holes,
            next: preview,
            canPractice: !reason && !practicing,
            practicing: practicing && practicing.id === config.id,
            reason
        });
    }
    return {
        version: MERIDIAN_VERSION,
        totalProgress: queryTotalProgress(data),
        totalNodes: MERIDIAN_CONFIGS.reduce((sum, item) => sum + item.holes.length, 0),
        completed: queryCompletedCount(data),
        totalMeridians: MERIDIAN_CONFIGS.length,
        totalSpent: queryTotalSpent(data),
        title: this.is_zhoutian_complete() ? MERIDIAN_TITLE : "尚未达成",
        roomAllowed: roomStatus.allowed,
        roomReason: roomStatus.reason,
        practicing: this.query_meridian_practicing(),
        maxMp: this.max_mp,
        mp: this.mp,
        maxHp: this.max_hp,
        hp: this.hp,
        limitMp: this.limit_mp + this.query_prop("limit_mp"),
        items
    };
};

USER.prototype.practice_meridian = async function (id, expectedProgress) {
    if (this._meridianPracticeLock) return { ok: false, message: "经脉操作正在处理中，请稍候。" };
    this._meridianPracticeLock = true;
    try {
        if (this.state && this.state.id === "meridian_practice") {
            return { ok: false, message: "你正在贯通经脉，请耐心等待。" };
        }
        const config = MERIDIAN_CONFIG_MAP[id];
        if (!config) return { ok: false, message: "未知的经脉。" };
        const data = this.query_meridian_data();
        const progress = data[id];
        if (!Number.isInteger(expectedProgress) || expectedProgress !== progress) {
            return { ok: false, message: "经脉进度已经变化，请根据最新状态重新操作。" };
        }
        const reason = this.query_meridian_action_reason(config, data);
        if (reason) return { ok: false, message: reason };
        const preview = this.query_meridian_preview(id, data);
        const duration = MERIDIAN_PRACTICE_MIN_MS
            + Math.floor(Math.random() * (MERIDIAN_PRACTICE_MAX_MS - MERIDIAN_PRACTICE_MIN_MS + 1));
        const endTime = Date.now() + duration;
        this.set_state({
            id: "meridian_practice",
            title: "贯通经脉",
            rate: 1,
            no_move: "你正在凝神贯通经脉，不敢有丝毫分心。",
            desc: JSON.stringify(MERIDIAN_PRACTICE_DESC),
            meridian_id: id,
            expected_progress: progress,
            end_time: endTime,
            on_enter: on_meridian_practice_tick,
            on_check: on_meridian_practice_check,
            on_stop: on_meridian_practice_stop
        });
        return {
            ok: true,
            message: "你盘膝坐下，凝神运气，开始贯通【" + config.name + "·" + preview.name + "】，预计需要" + format_meridian_duration(duration) + "。"
        };
    } finally {
        this._meridianPracticeLock = false;
    }
};

function on_meridian_practice_tick(me) {
    const state = me.state;
    if (!state || state.id !== "meridian_practice") return false;
    if (Date.now() < state.end_time) return;
    me.complete_meridian_practice(state.meridian_id, state.expected_progress);
    return false;
}

function on_meridian_practice_check(me) {
    const state = me.state;
    if (!state || state.id !== "meridian_practice") return;
    const remaining = Math.max(0, state.end_time - Date.now());
    me.send("你正在贯通经脉，还需约" + format_meridian_duration(remaining) + "。");
}

function on_meridian_practice_stop(me, isauto) {
    if (isauto) {
        return;
    }
    me.notify("<hiy>你中止了本次贯通经脉，气息渐渐平复。</hiy>");
    me.send(JSON.stringify({
        type: "dialog",
        dialog: "score",
        meridians: me.query_meridian_view()
    }));
}

USER.prototype.complete_meridian_practice = async function (id, expectedProgress) {
    const config = MERIDIAN_CONFIG_MAP[id];
    if (!config) return;
    const data = this.query_meridian_data();
    const progress = data[id];
    if (!Number.isInteger(expectedProgress) || expectedProgress !== progress) {
        this.notify_fail("经脉进度已经变化，本次贯通失败，请重新操作。");
        return;
    }
    if (this.hp <= 0) {
        this.notify_fail("你未能完成本次贯通经脉。");
        return;
    }
    if (this.state && this.state.id !== "meridian_practice") {
        this.notify_fail("你被打断了贯通经脉，本次贯通失败。");
        return;
    }
    const preview = this.query_meridian_preview(id, data);
    const old = {
        maxMp: this.max_mp,
        mp: this.mp,
        hp: this.hp,
        progress
    };
    this.max_mp = preview.afterMaxMp;
    this.mp = preview.afterMp;
    data[id] = progress + 1;
    this.meridians = data;
    const wasZhoutian = !!this.query_title(MERIDIAN_TITLE_TYPE);
    this.ensure_meridian_title();
    this.recount();
    if (this.hp > this.max_hp) this.hp = this.max_hp;
    this.notify_hp();
    const saved = await this.save("meridian:" + id + ":" + data[id]);
    if (!saved) {
        data[id] = old.progress;
        this.max_mp = old.maxMp;
        this.mp = old.mp;
        this.hp = old.hp;
        this.meridians = data;
        this.ensure_meridian_title();
        this.recount();
        this.notify_hp();
        this.notify_fail("角色存档失败，本次贯通已经撤销，请稍后重试。");
        return;
    }
    let message = "你凝神运气，成功贯通了【" + config.name + "·" + preview.name + "】，扣减" + preview.cost + "点最大内力。";
    if (preview.completes) message += "\n<hiy>" + config.name + "已经全部贯通，获得" + config.fullEffect + "。</hiy>";
    if (!wasZhoutian && this.is_zhoutian_complete()) message += "\n<hig>你已达成【周天圆满】！</hig>";
    this.notify("<hig>" + message + "</hig>");
    this.send(JSON.stringify({
        type: "dialog",
        dialog: "score",
        meridians: this.query_meridian_view(),
        meridianResult: { ok: true, completed: true }
    }));
};

if (!CHARACTER.MERIDIAN_QUERY_PROP) {
    CHARACTER.MERIDIAN_QUERY_PROP = CHARACTER.prototype.query_prop;
    CHARACTER.prototype.query_prop = function (name) {
        let value = CHARACTER.MERIDIAN_QUERY_PROP.call(this, name);
        if (this.is_player && this.query_meridian_prop) value += this.query_meridian_prop(name);
        return value;
    };
}

if (!USER.MERIDIAN_LOAD_DATA) {
    USER.MERIDIAN_LOAD_DATA = USER.prototype.loadData;
    USER.prototype.loadData = function (role) {
        let meridians;
        try {
            const data = JSON.toObject(role.data);
            meridians = data.meridians;
        } catch (error) {
            meridians = null;
        }
        USER.MERIDIAN_LOAD_DATA.call(this, role);
        this.normalize_meridian_data(meridians);
    };
}

if (!USER.MERIDIAN_GET_DATA) {
    USER.MERIDIAN_GET_DATA = USER.prototype.getData;
    USER.prototype.getData = function () {
        const role = USER.MERIDIAN_GET_DATA.call(this);
        const data = JSON.stringify(this.export_meridian_data());
        role.data = role.data.slice(0, -1) + ",meridians:" + data + "}";
        return role;
    };
}

if (!USER.MERIDIAN_DO_LOGIN) {
    USER.MERIDIAN_DO_LOGIN = USER.prototype.do_login;
    USER.prototype.do_login = function () {
        this.normalize_meridian_data();
        this.ensure_meridian_title();
        return USER.MERIDIAN_DO_LOGIN.apply(this, arguments);
    };
}
