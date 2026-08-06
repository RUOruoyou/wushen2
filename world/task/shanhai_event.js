this.inherits(TASK);
this.id = "shanhai_event";

const SHANHAI_TASK = this;
const SCHEDULE_KEY = "shanhai_event_schedule";
const MAX_TIMER_DELAY = 2147480000;
const CONFIG = {
    dailyCount: [10, 60],
    batchCount: [1, 5],
    lifetime: 10 * 60 * 1000,
    attributeRatio: [0.7, 0.8],
    skillRatio: [0.4, 1.2],
    hpRatio: 10,
    contributionRatio: 0.03,
    killerReward: {
        gold: [8, 20],
        pot: [150000, 300000],
        exp: [15000, 35000],
        pageOdds: 2500,
        pageCount: [1, 1],
        skillPageOdds: 2000,
        skillPageMax: 3,
        heartOdds: 500
    },
    participantReward: {
        gold: [1, 4],
        pot: [25000, 60000],
        exp: [2500, 7500],
        pageOdds: 300,
        pageCount: [1, 1],
        skillPageOdds: 200,
        skillPageMax: 3,
        heartOdds: 50
    }
};

const BEASTS = [
    ["穷奇", "形似猛虎，背生双翼，凶威如潮。"],
    ["饕餮", "羊身人面，目在腋下，贪食之气吞吐不休。"],
    ["梼杌", "虎身人面，獠牙外露，性情桀骜难驯。"],
    ["混沌", "形如巨犬，目不可见，行动却迅疾莫测。"],
    ["毕方", "独足青羽，赤纹白喙，周身似有烈焰升腾。"],
    ["夔牛", "苍身独足，出入风雨，吼声如雷。"],
    ["相柳", "九首蛇身，吐息腥烈，所过之处草木尽枯。"],
    ["蛊雕", "形似雕而生角，鸣声如婴啼，凶厉异常。"],
    ["狰", "赤身五尾，头生一角，击石之声铿锵。"],
    ["诸犍", "人面豹身，牛耳独目，长尾挥动如鞭。"],
    ["祸斗", "通体漆黑，形似巨犬，口中吞吐火光。"],
    ["九尾狐", "九尾如云，啼声似婴，灵动中暗藏杀机。"],
    ["英招", "马身人面，虎纹鸟翼，巡游山海之间。"],
    ["陆吾", "虎身九尾，人面虎爪，威严不可逼视。"],
    ["天狗", "形似狸猫而首白，伏行时悄无声息。"],
    ["朱厌", "白首赤足，猿形如山，现世常伴兵戈。"],
    ["猰貐", "牛身人面，马足婴声，气息阴冷。"],
    ["旋龟", "鸟首虺尾，甲壳如岩，鸣声沉厚。"],
    ["鹿蜀", "白首虎纹，赤尾如焰，奔行快若流光。"],
    ["当康", "牙如长戟，昂首长鸣，踏地声震四野。"]
];

const ATTACK_BASES = ["unarmed", "sword", "blade", "staff", "club", "whip"];
const BASE_SKILL_IDS = ["force", "dodge", "parry", "unarmed", "sword", "blade", "staff", "club", "whip"];
const WEAPON_PATHS = {
    sword: "eq/lv0/jian",
    blade: "eq/lv1/dandao",
    staff: "eq/lv0/tiezhang",
    club: "eq/lv0/tiegun",
    whip: "eq/lv0/whip"
};
const INCOMPATIBLE_SKILLS = {
    shashengjue: true,
    xiaowuxianggong: true
};

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (max <= min) return min;
    return min + Math.floor(Math.random() * (max - min + 1));
}

function randomRatio(range) {
    return range[0] + Math.random() * (range[1] - range[0]);
}

function shuffle(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const index = Math.floor(Math.random() * (i + 1));
        const item = result[i];
        result[i] = result[index];
        result[index] = item;
    }
    return result;
}

function padNumber(value) {
    return value < 10 ? "0" + value : String(value);
}

function queryDayKey(date) {
    return date.getFullYear() + "-" + padNumber(date.getMonth() + 1) + "-" + padNumber(date.getDate());
}

function queryReferenceNumber(reference, key, fallback) {
    const value = Number(reference && reference[key]);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function queryReferenceProp(reference, key) {
    if (!reference || typeof reference.query_prop !== "function") return 0;
    const value = Number(reference.query_prop(key));
    return Number.isFinite(value) ? value : 0;
}

this.startup = function () {
    this.is_stopped = false;
    this.active_beasts = new Map();
    this.boot_handler = this.call_out(this.initialize, 100);
};

this.stop = function () {
    this.is_stopped = true;
    if (this.boot_handler) clearTimeout(this.boot_handler);
    if (this.schedule_handler) clearTimeout(this.schedule_handler);
    this.boot_handler = null;
    this.schedule_handler = null;
    if (!this.active_beasts) return;
    for (const active of this.active_beasts.values()) {
        if (active.handler) clearTimeout(active.handler);
        this.remove_beast_activity(active.npc, active);
        this.remove_beast_from_combat(active.npc);
        active.npc.destroy(active.npc.name + "隐入山海异境，转瞬不见。");
    }
    this.active_beasts.clear();
};

this.initialize = function () {
    this.boot_handler = null;
    if (this.is_stopped) return;
    if (WORLD.status < 0) {
        this.boot_handler = this.call_out(this.initialize, 1000);
        return;
    }

    const now = Date.now();
    this.ensure_schedule(now);
    let hasMissed = false;
    for (const batch of this.schedule.batches) {
        if (batch.status === "pending" && batch.at <= now) {
            batch.status = "missed";
            batch.processedAt = now;
            hasMissed = true;
        }
    }
    if (hasMissed) this.persist_schedule().catch(this.log_error.bind(this, "保存过期批次失败"));
    this.schedule_next();
};

this.ensure_schedule = function (now) {
    const date = new Date(now);
    const dayKey = queryDayKey(date);
    const saved = WORLD.DATA.query_temp(SCHEDULE_KEY);
    if (saved && saved.date === dayKey && Array.isArray(saved.batches)) {
        this.schedule = saved;
        return;
    }

    this.schedule = this.create_schedule(date);
    WORLD.DATA.set_temp(SCHEDULE_KEY, this.schedule);
    this.persist_schedule().catch(this.log_error.bind(this, "保存山海活动日程失败"));
};

this.create_schedule = function (date) {
    const now = date.getTime();
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
    const total = randomInt(CONFIG.dailyCount[0], CONFIG.dailyCount[1]);
    const batchCounts = [];
    let remaining = total;
    while (remaining > 0) {
        const count = Math.min(remaining, randomInt(CONFIG.batchCount[0], CONFIG.batchCount[1]));
        batchCounts.push(count);
        remaining -= count;
    }

    const minAt = Math.min(now + 60000, dayEnd - 1000);
    const maxAt = Math.max(minAt, dayEnd - 1000);
    const usedTimes = {};
    const batches = [];
    for (let i = 0; i < batchCounts.length; i++) {
        let at = randomInt(minAt, maxAt);
        while (usedTimes[at] && at < maxAt) at++;
        usedTimes[at] = true;
        batches.push({
            id: queryDayKey(date).replace(/-/g, "") + "_" + (i + 1),
            at: at,
            count: batchCounts[i],
            status: "pending"
        });
    }
    batches.sort((a, b) => a.at - b.at);
    return {
        version: 1,
        date: queryDayKey(date),
        total: total,
        createdAt: now,
        batches: batches
    };
};

this.persist_schedule = async function () {
    if (!this.schedule) return;
    WORLD.DATA.set_temp(SCHEDULE_KEY, this.schedule);
    await WORLD.DATA.save();
};

this.schedule_next = function () {
    if (this.is_stopped || !this.schedule) return;
    if (this.schedule_handler) clearTimeout(this.schedule_handler);
    this.schedule_handler = null;

    const now = Date.now();
    let nextBatch = null;
    for (const batch of this.schedule.batches) {
        if (batch.status !== "pending") continue;
        if (!nextBatch || batch.at < nextBatch.at) nextBatch = batch;
    }
    if (nextBatch) {
        const delay = Math.min(MAX_TIMER_DELAY, Math.max(1, nextBatch.at - now));
        this.schedule_handler = this.call_out(this.run_due_batches, delay);
        return;
    }

    const date = new Date(now);
    const nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 1);
    this.schedule_handler = this.call_out(this.roll_day, Math.max(1000, nextDay.getTime() - now));
};

this.roll_day = function () {
    this.schedule_handler = null;
    if (this.is_stopped) return;
    this.ensure_schedule(Date.now());
    this.schedule_next();
};

this.run_due_batches = async function () {
    this.schedule_handler = null;
    if (this.is_stopped || !this.schedule) return;
    const now = Date.now();
    const dueBatches = this.schedule.batches.filter((batch) => batch.status === "pending" && batch.at <= now + 1000);
    if (!dueBatches.length) {
        this.schedule_next();
        return;
    }

    for (const batch of dueBatches) {
        batch.status = "fired";
        batch.processedAt = now;
    }
    try {
        await this.persist_schedule();
    } catch (error) {
        this.log_error("投放前保存山海批次失败", error);
    }
    if (this.is_stopped) return;

    for (const batch of dueBatches) {
        try {
            batch.spawned = this.spawn_batch(batch);
            if (!batch.spawned) batch.status = "skipped";
        } catch (error) {
            batch.status = "skipped";
            this.log_error("山海异兽投放失败", error);
        }
    }
    try {
        await this.persist_schedule();
    } catch (error) {
        this.log_error("保存山海投放结果失败", error);
    }
    this.schedule_next();
};

this.query_reference = function () {
    const tops = WORLD.STATS && WORLD.STATS.TOPS || [];
    for (const top of tops) {
        if (!top || !top.userid) continue;
        if (WORLD.is_admin && WORLD.is_admin(top)) continue;
        if (top.query_temp && top.query_temp("cross_type")) continue;
        const online = WORLD.getUser(top.userid);
        if (online && WORLD.STATS.isRankedPlayer && !WORLD.STATS.isRankedPlayer(online)) continue;
        if (this.is_valid_reference(top)) return top;
    }

    let reference = null;
    let bestScore = -1;
    for (const user of WORLD.USERS) {
        if (!user || !user.is_player || !user.socket) continue;
        if (WORLD.STATS.isRankedPlayer && !WORLD.STATS.isRankedPlayer(user)) continue;
        if (!this.is_valid_reference(user)) continue;
        const score = Number(user.score) || user.max_hp + user.max_mp + user.gj + user.fy + user.mz + user.ds + user.zj;
        if (score > bestScore) {
            bestScore = score;
            reference = user;
        }
    }
    return reference;
};

this.is_valid_reference = function (reference) {
    const values = [reference.max_hp, reference.max_mp, reference.gj, reference.fy,
        reference.mz, reference.ds, reference.zj];
    for (const value of values) {
        if (!Number.isFinite(Number(value)) || Number(value) <= 0 || Number(value) > Number.MAX_SAFE_INTEGER) {
            return false;
        }
    }
    return true;
};

this.query_areas = function () {
    return WORLD.AREAS.filter((area) => area && area.is_area && !area.is_copy
        && Array.isArray(area.rooms) && area.rooms.some((room) => this.is_eligible_room(room)));
};

this.is_eligible_room = function (room) {
    if (!room || room.no_fight || room.is_copy_room || room.is_shadow) return false;
    if (!(room.max_item_count > 1) || room.is_full(1)) return false;
    if (!Array.isArray(room.items)) return false;
    for (const item of room.items) {
        if (item && item.is_shanhai_beast) return false;
        if (item && !item.is_player && item.hp > 0 && item.on_enter) return false;
    }
    return true;
};

this.spawn_batch = function (batch) {
    const reference = this.query_reference();
    if (!reference) {
        console.log("山海活动没有可用的正常玩家属性快照，本批次跳过", batch.id);
        return 0;
    }

    const areas = shuffle(this.query_areas());
    const locations = [];
    let spawned = 0;
    for (const area of areas) {
        if (spawned >= batch.count) break;
        const rooms = area.rooms.filter((room) => this.is_eligible_room(room));
        if (!rooms.length) continue;
        const room = rooms[randomInt(0, rooms.length - 1)];
        const npc = this.create_beast(reference, batch, spawned);
        if (!npc) continue;
        room.item_changed(npc, true);
        const expiresAt = Date.now() + CONFIG.lifetime;
        const handler = this.call_out(this.expire_beast, CONFIG.lifetime, npc);
        const active = {
            npc: npc,
            handler: handler,
            expiresAt: expiresAt,
            location: room.long_name || area.name + "-" + room.name
        };
        this.active_beasts.set(npc.id, active);
        active.activityId = this.add_beast_activity(active);
        locations.push(active.location);
        spawned++;
    }

    if (locations.length) {
        COMMAND.DO("rumor", "山海异境忽现裂隙，" + locations.join("、")
            + "各有一只异兽现身，十分钟后便会遁去！");
    }
    return spawned;
};

this.add_beast_activity = function (active) {
    const npc = active && active.npc;
    if (!npc) return null;
    const activityId = "shanhai_" + String(npc.id).replace(/\W/g, "_");
    npc.shanhai_activity_id = activityId;
    EVENTS.add({
        id: activityId,
        name: "山海异兽·" + npc.shanhai_name,
        desc: npc.shanhai_name + "出现在【" + active.location + "】。"
            + "在其消失前造成至少3%最大气血伤害，可获得山海异兽参与奖励。",
        time: active.expiresAt,
        grade: 4,
        command: "前往讨伐",
        on_command: function (me) {
            const current = SHANHAI_TASK.active_beasts && SHANHAI_TASK.active_beasts.get(npc.id);
            const room = current && current.npc && current.npc.environment;
            if (!current || !room) {
                EVENTS.remove(activityId);
                return me.notify("这只山海异兽已经离开了。");
            }
            if (!me.can_trans()) return false;
            if (room.is_full(1)) return me.notify("那里人太多了，你暂时无法前往。");
            me.moveto(room.path, me.name + "离开了。", me.name + "赶来讨伐山海异兽。");
            return true;
        }
    });
    return activityId;
};

this.remove_beast_activity = function (npc, active) {
    const activityId = (active && active.activityId) || (npc && npc.shanhai_activity_id);
    if (activityId) EVENTS.remove(activityId);
};

this.query_skill_pool = function (baseSkill) {
    const result = [];
    for (const skillId of Object.keys(WORLD.SKILLS || {})) {
        const skill = WORLD.SKILLS[skillId];
        if (!skill || skill.type !== SKILL_TYPES.SKILL || skill.is_hidden) continue;
        if (INCOMPATIBLE_SKILLS[skill.id]) continue;
        if (skill.family === FAMILIES.MONSTER) continue;
        if (!Array.isArray(skill.can_enables) || !skill.can_enables.includes(baseSkill)) continue;
        result.push(skill);
    }
    return result;
};

this.query_public_skill_pool = function () {
    const result = [];
    const publicSkills = FAMILIES.NONE.skills || [];
    for (const skill of publicSkills) {
        if (!skill || skill.type !== SKILL_TYPES.SKILL || skill.is_hidden) continue;
        if (INCOMPATIBLE_SKILLS[skill.id]) continue;
        if (skill.family === FAMILIES.MONSTER) continue;
        if (!skill.grade || skill.grade < 1) continue;
        result.push(skill);
    }
    return result;
};

this.query_skill_baseline = function (reference) {
    let baseline = 0;
    const skills = reference && reference.skills || {};
    for (const skillId of BASE_SKILL_IDS) {
        const level = Number(skills[skillId] && skills[skillId].level);
        if (Number.isFinite(level) && level > baseline) baseline = level;
    }
    if (baseline > 0) return baseline;
    for (const skillId of Object.keys(skills)) {
        const level = Number(skills[skillId] && skills[skillId].level);
        if (Number.isFinite(level) && level > baseline) baseline = level;
    }
    return Math.max(100, baseline);
};

this.configure_skills = function (npc, reference) {
    const selections = [];
    for (const baseSkill of ["force", "dodge", "parry"]) {
        const pool = this.query_skill_pool(baseSkill);
        if (pool.length) selections.push({ base: baseSkill, skill: pool[randomInt(0, pool.length - 1)] });
    }

    const attackPools = [];
    for (const baseSkill of ATTACK_BASES) {
        const pool = this.query_skill_pool(baseSkill);
        if (pool.length) attackPools.push({ base: baseSkill, pool: pool });
    }
    if (!attackPools.length) return [];
    const attackPool = attackPools[randomInt(0, attackPools.length - 1)];
    selections.push({
        base: attackPool.base,
        skill: attackPool.pool[randomInt(0, attackPool.pool.length - 1)]
    });

    const baseline = this.query_skill_baseline(reference);
    const baseLevels = {};
    for (const selection of selections) {
        const level = Math.max(20, Math.round(baseline * randomRatio(CONFIG.skillRatio)));
        baseLevels[selection.base] = Math.max(baseLevels[selection.base] || 0, level);
    }
    for (const baseSkill of ["force", "dodge", "parry", "unarmed", attackPool.base]) {
        const level = baseLevels[baseSkill] || Math.max(20, Math.round(baseline * randomRatio(CONFIG.skillRatio)));
        npc.skills[baseSkill] = { level: level, exp: 0 };
    }

    for (const selection of selections) {
        const level = baseLevels[selection.base];
        const special = npc.skills[selection.skill.id] || { level: level, exp: 0 };
        special.level = Math.max(special.level, level);
        special[selection.base] = true;
        npc.skills[selection.skill.id] = special;
        npc.skills[selection.base].enable_skill = selection.skill.id;
    }

    if (attackPool.base !== "unarmed") {
        const weaponPath = WEAPON_PATHS[attackPool.base];
        if (weaponPath) {
            const weapon = OBJ.CREATE(weaponPath);
            weapon.no_get = true;
            npc.equipment[EQUIP_TYPE.WEAPON] = weapon;
        }
    }
    npc.init_skill();
    npc.init_pfms();
    return selections;
};

this.apply_attributes = function (npc, reference) {
    npc.str = Math.max(10, Math.floor(queryReferenceNumber(reference, "str", 20) * randomRatio(CONFIG.attributeRatio)));
    npc.con = Math.max(10, Math.floor(queryReferenceNumber(reference, "con", 20) * randomRatio(CONFIG.attributeRatio)));
    npc.dex = Math.max(10, Math.floor(queryReferenceNumber(reference, "dex", 20) * randomRatio(CONFIG.attributeRatio)));
    npc.int = Math.max(10, Math.floor(queryReferenceNumber(reference, "int", 20) * randomRatio(CONFIG.attributeRatio)));

    const target = {
        gj: Math.max(1, Math.floor(reference.gj * randomRatio(CONFIG.attributeRatio))),
        fy: Math.max(1, Math.floor(reference.fy * randomRatio(CONFIG.attributeRatio))),
        mz: Math.max(1, Math.floor(reference.mz * randomRatio(CONFIG.attributeRatio))),
        ds: Math.max(1, Math.floor(reference.ds * randomRatio(CONFIG.attributeRatio))),
        zj: Math.max(1, Math.floor(reference.zj * randomRatio(CONFIG.attributeRatio))),
        bj: Math.max(0, Math.floor((reference.bj || 0) * randomRatio(CONFIG.attributeRatio)))
    };
    const targetSpeed = Math.max(500, Math.min(4000, Math.floor(reference.gjsd || 3000)));
    npc.clear_prop();
    npc.prop = {
        gj: target.gj - npc.str,
        fy: target.fy - (npc.str + npc.con) / 10,
        mz: target.mz - npc.dex / 2,
        ds: target.ds - npc.dex / 2,
        zj: target.zj - npc.str / 2,
        bj_per: target.bj - npc.dex / 10,
        gjsd: 4000 - targetSpeed,
        diff_sh_per: Math.floor((reference.diff_sh_per || queryReferenceProp(reference, "diff_sh_per"))
            * randomRatio(CONFIG.attributeRatio)),
        diff_fy_per: Math.floor((reference.diff_fy_per || queryReferenceProp(reference, "diff_fy_per"))
            * randomRatio(CONFIG.attributeRatio)),
        add_bjsh_per: Math.floor(queryReferenceProp(reference, "add_bjsh_per")
            * randomRatio(CONFIG.attributeRatio))
    };
    npc.recount();
    npc.gj = target.gj;
    npc.fy = target.fy;
    npc.mz = target.mz;
    npc.ds = target.ds;
    npc.zj = target.zj;
    npc.bj = target.bj;
    npc.max_hp = Math.max(1000, Math.floor(reference.max_hp * CONFIG.hpRatio));
    npc.hp = npc.max_hp;
    npc.max_mp = Math.max(100, Math.floor(reference.max_mp * randomRatio(CONFIG.attributeRatio)));
    npc.mp = npc.max_mp;
    npc.gjsd = targetSpeed;
};

this.create_beast = function (reference, batch, index) {
    const npc = NPC.CLONE("pub/shanhai_beast");
    if (!npc) return null;
    const beast = BEASTS[randomInt(0, BEASTS.length - 1)];
    npc.name = "<hio>" + beast[0] + "</hio>";
    npc.shanhai_name = beast[0];
    npc.title = "山海异兽";
    npc.desc = beast[1];
    npc.event_id = batch.id + "_" + index + "_" + npc.id;
    npc.skills = {};
    npc.equipment = [];
    npc.items = [];
    npc.temp = {};
    npc.damages = {};
    npc.damage_names = {};
    npc.sum_damages = 0;
    npc.rewarded = {};
    npc.pfm_rate = randomInt(2, 4);
    npc.no_refresh = true;
    npc.record_damage = true;
    npc.on_die = null;
    npc.on_enter = null;

    const selections = this.configure_skills(npc, reference);
    this.apply_attributes(npc, reference);
    if (selections.length) {
        npc.desc += " 它周身流转着驳杂真气，隐约带有"
            + selections.map((item) => "【" + item.skill.name + "】").join("、") + "的路数。";
    }
    npc.on_died = function (killer, corpse) {
        SHANHAI_TASK.finish_beast(npc, killer, corpse);
    };
    return npc;
};

this.resolve_player = function (character) {
    if (!character) return null;
    if (character.is_player) return character;
    if (character.master) return WORLD.getUser(character.master) || {
        id: character.master,
        name: character.master_name
    };
    return null;
};

this.finish_beast = function (npc, killer, corpse) {
    const active = this.active_beasts && this.active_beasts.get(npc.id);
    if (active && active.handler) clearTimeout(active.handler);
    this.remove_beast_activity(npc, active);
    if (this.active_beasts) this.active_beasts.delete(npc.id);
    if (corpse) {
        corpse.items = [];
        corpse.no_alloc = true;
    }

    const threshold = Math.ceil(npc.max_hp * CONFIG.contributionRatio);
    const killerPlayer = this.resolve_player(killer);
    const killerId = killerPlayer && killerPlayer.id;
    const hasKillerReward = killerId && (npc.damages[killerId] || 0) >= threshold;
    for (const playerId of Object.keys(npc.damages || {})) {
        if ((npc.damages[playerId] || 0) < threshold || npc.rewarded[playerId]) continue;
        npc.rewarded[playerId] = true;
        const isKiller = hasKillerReward && playerId === killerId;
        const reward = this.roll_reward(isKiller ? CONFIG.killerReward : CONFIG.participantReward);
        this.deliver_reward(playerId, reward, npc.event_id, isKiller ? "killer" : "participant");
    }

    const killerName = hasKillerReward
        ? (killerPlayer.name || npc.damage_names[killerId] || "一位侠士")
        : "江湖群侠";
    COMMAND.DO("rumor", killerName + "击败了现世异兽" + npc.name + "，山海裂隙随之闭合。");
};

this.roll_reward = function (rewardConfig) {
    const hasPage = randomInt(1, 10000) <= rewardConfig.pageOdds;
    const hasSkillPage = rewardConfig.skillPageOdds && rewardConfig.skillPageMax
        && randomInt(1, 10000) <= rewardConfig.skillPageOdds;
    const hasHeart = rewardConfig.heartOdds && randomInt(1, 10000) <= rewardConfig.heartOdds;

    const reward = {
        gold: randomInt(rewardConfig.gold[0], rewardConfig.gold[1]),
        pot: randomInt(rewardConfig.pot[0], rewardConfig.pot[1]),
        exp: randomInt(rewardConfig.exp[0], rewardConfig.exp[1]),
        page: hasPage ? randomInt(rewardConfig.pageCount[0], rewardConfig.pageCount[1]) : 0,
        skillPages: [],
        heart: hasHeart
    };

    if (hasSkillPage) {
        const pool = this.query_public_skill_pool();
        if (pool.length) {
            const maxCount = Math.min(rewardConfig.skillPageMax, pool.length);
            const count = randomInt(1, maxCount);
            const shuffled = shuffle(pool);
            for (let i = 0; i < count; i++) {
                reward.skillPages.push(shuffled[i].id);
            }
        }
    }

    return reward;
};

this.deliver_reward = function (playerId, reward, eventId, rewardType) {
    const player = WORLD.getUser(playerId);
    if (!player || !player.socket) {
        this.send_reward_mail(playerId, reward, eventId + "_" + rewardType, rewardType);
        return;
    }

    player.add_exp(reward.exp, reward.pot);
    player.add_obj("money/gold", reward.gold, true);
    if (reward.page > 0) {
        if (player.can_add_obj("book/wudao", reward.page)) {
            player.add_obj("book/wudao", reward.page, true);
            player.notify("<hiy>你在山海异兽奖励中获得了" + reward.page + "本武道残页。</hiy>");
        } else {
            this.send_reward_mail(playerId, { gold: 0, pot: 0, exp: 0, page: reward.page, skillPages: [], heart: false },
                eventId + "_" + rewardType + "_page", rewardType);
            player.notify("<hiy>你的背包空间不足，武道残页已经转入邮箱。</hiy>");
        }
    }

    // 公共武学残页
    if (reward.skillPages && reward.skillPages.length) {
        const overflowPages = [];
        for (const skillId of reward.skillPages) {
            const pagePath = "book/bc#" + skillId;
            if (player.can_add_obj(pagePath, 1)) {
                player.add_obj(pagePath, 1, true);
                const skill = SKILL.get(skillId);
                const skillName = skill ? skill.query_color_name(player) : skillId;
                player.notify("<hiy>你在山海异兽奖励中获得了" + skillName + "残页。</hiy>");
            } else {
                overflowPages.push(skillId);
            }
        }
        if (overflowPages.length) {
            const overflowReward = { gold: 0, pot: 0, exp: 0, page: 0, skillPages: overflowPages, heart: false };
            this.send_reward_mail(playerId, overflowReward,
                eventId + "_" + rewardType + "_skillpage", rewardType);
            player.notify("<hiy>你的背包空间不足，部分公共武学残页已经转入邮箱。</hiy>");
        }
    }

    // 异兽之心
    if (reward.heart) {
        if (player.can_add_obj("drug/shanhai_heart", 1)) {
            player.add_obj("drug/shanhai_heart", 1, true);
            player.notify("<hiy>你在山海异兽奖励中获得了<HIO>异兽之心</HIO>！</hiy>");
        } else {
            this.send_reward_mail(playerId, { gold: 0, pot: 0, exp: 0, page: 0, skillPages: [], heart: true },
                eventId + "_" + rewardType + "_heart", rewardType);
            player.notify("<hiy>你的背包空间不足，异兽之心已经转入邮箱。</hiy>");
        }
    }

    player.notify("<hig>山海异兽" + (rewardType === "killer" ? "击杀" : "参与")
        + "奖励已结算：" + reward.gold + "两黄金。</hig>");
};

this.send_reward_mail = function (playerId, reward, dedupe, rewardType) {
    const attachments = [];
    if (reward.gold > 0) attachments.push({ obj: "money/gold", count: reward.gold });
    if (reward.pot > 0) attachments.push({ obj: "money/pot", count: reward.pot });
    if (reward.exp > 0) attachments.push({ obj: "money/shanhai_exp", count: reward.exp });
    if (reward.page > 0) attachments.push({ obj: "book/wudao", count: reward.page });
    if (reward.skillPages && reward.skillPages.length) {
        for (const skillId of reward.skillPages) {
            attachments.push({ obj: "book/bc#" + skillId, count: 1 });
        }
    }
    if (reward.heart) attachments.push({ obj: "drug/shanhai_heart", count: 1 });
    if (!attachments.length) return;
    const sendCommand = WORLD.COMMANDS.send;
    if (!sendCommand) return;
    sendCommand.enter(null, playerId, {
        from: "shanhai_event",
        from_name: "山海异兽",
        title: rewardType === "killer" ? "山海异兽击杀奖励" : "山海异兽参与奖励",
        summary: "你参与的山海异兽讨伐奖励已经送达。",
        content: "你对山海异兽造成的伤害达到奖励门槛，以下奖励已经通过附件发放。",
        attach: attachments,
        dedupe: dedupe
    });
};

this.expire_beast = function (npc) {
    if (!npc || !this.active_beasts || !this.active_beasts.has(npc.id)) return;
    const active = this.active_beasts.get(npc.id);
    this.remove_beast_activity(npc, active);
    this.active_beasts.delete(npc.id);
    this.remove_beast_from_combat(npc);
    npc.destroy(npc.name + "周身泛起层层雾气，遁回了山海异境。");
};

this.remove_beast_from_combat = function (npc) {
    if (!npc) return;
    const enemies = npc.enemy ? npc.enemy.slice() : [];
    npc.end_fight();
    for (const enemy of enemies) {
        if (!enemy || !enemy.enemy) continue;
        enemy.enemy.remove(npc);
        if (!enemy.enemy.length) enemy.end_fight();
    }
};

this.log_error = function (message, error) {
    console.error(message, error && (error.stack || error.message) || error);
};
