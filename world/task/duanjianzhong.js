this.inherits(TASK);
this.id = "duanjianzhong";

const TASK_ID = "duanjianzhong";
const AREA_ID = "duanjianzhong";
const TICKET_PATH = "cash/guixuzhong";
const KEY_DAY = "duanjianzhong_day";
const KEY_COUNT = "duanjianzhong_count";
const KEY_ACTIVE = "duanjianzhong_active";
const MAX_KILLS = 100;
const TIME_LIMIT = 12 * 60 * 1000;
const SPAWN_DELAY = 1000;
const DAILY_LIMIT = 1;
const KILL_REWARD_MIN = 500;
const KILL_REWARD_MAX = 2000;
const STATUS_IDS = [
    "duanjianzhong_jianqi",
    "duanjianzhong_canhun",
    "duanjianzhong_zhanyi"
];
const INCOMPATIBLE_SKILLS = {
    shashengjue: true,
    xiaowuxianggong: true
};
const ATTACK_BASES = ["unarmed", "sword", "blade", "staff", "club", "whip"];
const BASE_SKILLS = ["force", "dodge", "parry"];
const WEAPON_PATHS = {
    sword: "eq/lv0/jian",
    blade: "eq/lv1/dandao",
    staff: "eq/lv0/tiezhang",
    club: "eq/lv0/tiegun",
    whip: "eq/lv0/whip"
};

this.sessions = new Map();
this.death_hooks = new WeakSet();
this.area = null;

this.startup = function () {
    this.sessions = new Map();
    this.death_hooks = new WeakSet();
    this.area = AREA.Get(AREA_ID);
    this.install_login_hook();
    if (WORLD.USERS) {
        for (const user of WORLD.USERS) {
            if (user && user.is_player && this.is_in_area(user)) this.restore(user);
        }
    }
};

this.stop = function () {
    if (!this.sessions) return;
    for (const session of this.sessions.values()) {
        if (session.timeoutHandler) clearTimeout(session.timeoutHandler);
        if (session.spawnHandler) clearTimeout(session.spawnHandler);
        if (session.npc && session.npc.environment) session.npc.destroy("断剑残魂暂时散去。");
    }
    this.sessions.clear();
};

this.install_login_hook = function () {
    const login = WORLD.COMMANDS.login;
    if (!login || login.__duanjianzhong_login_hook) return;
    const oldLogin = login.on_user_login;
    login.on_user_login = function (user) {
        oldLogin && oldLogin.call(this, user);
        const task = TASK.GET(TASK_ID);
        task && task.restore(user);
    };
    login.__duanjianzhong_login_hook = true;
};

this.query_day = function (time) {
    const date = new Date(time || Date.now());
    if (date.getHours() < 5) date.setDate(date.getDate() - 1);
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0")
        + "-" + String(date.getDate()).padStart(2, "0");
};

this.ensure_day = function (me) {
    const day = this.query_day();
    if (me.query_temp(KEY_DAY) !== day) {
        me.set_temp(KEY_DAY, day);
        me.set_temp(KEY_COUNT, 0);
    }
    return {
        day: day,
        count: Math.max(0, Math.min(DAILY_LIMIT, parseInt(me.query_temp(KEY_COUNT, 0)) || 0))
    };
};

this.query_session = function (me) {
    return me && this.sessions.get(me.id);
};

this.install_death_hook = function (me) {
    if (!me || !me.is_player || this.death_hooks.has(me)) return;
    const task = this;
    const oldDied = me.on_died;
    me.on_died = function (killer) {
        try {
            if (oldDied) oldDied.call(this, killer);
        } finally {
            const current = TASK.GET(TASK_ID) || task;
            const session = current.query_session(this);
            if (session && !session.ending) current.finish(this, session, "死亡");
        }
    };
    this.death_hooks.add(me);
};

this.is_in_area = function (me) {
    return !!(me && me.environment && me.environment.parent
        && me.environment.parent.id === AREA_ID);
};

this.query_base_room = function () {
    return this.area && ROOM.Get(this.area.first);
};

this.enter = function (me) {
    if (!me || !me.is_player) return false;
    const active = me.query_temp(KEY_ACTIVE);
    const existing = this.query_session(me);
    if (active || existing) {
        if (!this.is_in_area(me)) {
            const stale = existing || {
                state: active,
                npc: null,
                timeoutHandler: null,
                spawnHandler: null,
                ending: false,
                leaving: false
            };
            if (!existing) this.sessions.set(me.id, stale);
            return this.finish(me, stale, "异常离开");
        }
        this.restore(me);
        return me.notify("你正在断剑冢中挑战，请继续当前秘境。");
    }
    if (!this.area) return me.notify("断剑冢暂未开放。");
    if (me.check_command({
        allow_busy: false,
        allow_state: false,
        allow_die: false,
        allow_faint: false,
        allow_fight: false
    }) === false) return false;
    if (me.environment && me.environment.is_copy && me.environment.is_copy()) {
        return me.notify("你正在其它副本或秘境中，无法开启断剑冢。");
    }
    if (me.team && me.team.some(item => item && item.is_player && item !== me)) {
        return me.notify("断剑冢只能独自进入，不能与其他玩家组队。");
    }

    const day = this.ensure_day(me);
    if (day.count >= DAILY_LIMIT) return me.notify("你今日已经挑战过断剑冢了。");
    const ticket = me.find_obj_bypath(TICKET_PATH);
    if (!ticket || ticket.count < 1) return me.notify("进入断剑冢需要一枚归墟种。");

    const baseRoom = this.query_base_room();
    if (!baseRoom) return me.notify("断剑冢入口暂时无法定位。");
    const oldCopy = baseRoom.query_copy(me.id);
    if (oldCopy) baseRoom.clear_by_area(this.area, me.id);
    const copy = baseRoom.create_copy(me.id, 0);
    if (!copy) return me.notify("断剑冢开启失败，请稍后再试。");

    const enterRoom = me.environment && me.environment.path;
    if (!me.remove_obj(ticket, 1)) {
        baseRoom.clear_by_area(this.area, me.id);
        return me.notify("归墟种消耗失败，无法开启断剑冢。");
    }
    const now = Date.now();
    const activeState = {
        runId: me.create_uid(),
        day: day.day,
        startedAt: now,
        expiresAt: now + TIME_LIMIT,
        kills: 0,
        enterRoom: enterRoom || "yz/wumiao"
    };
    const session = {
        state: activeState,
        npc: null,
        timeoutHandler: null,
        spawnHandler: null,
        ending: false,
        leaving: false
    };
    this.sessions.set(me.id, session);
    this.install_death_hook(me);
    me.set_temp(KEY_COUNT, day.count + 1);
    me.set_temp(KEY_ACTIVE, activeState);

    me.moveto(copy, me.name + "走入了归墟裂隙。", me.name + "踏入了断剑冢。", "mijing");
    if (!this.is_in_area(me)) {
        this.sessions.delete(me.id);
        me.remove_temp(KEY_ACTIVE);
        me.set_temp(KEY_COUNT, day.count);
        me.add_obj(TICKET_PATH, 1, true);
        baseRoom.clear_by_area(this.area, me.id);
        return me.notify("断剑冢传送失败，归墟种已经返还。");
    }
    this.schedule_timeout(me, session);
    this.spawn_monster(me, session);
    this.save_player(me, "断剑冢进入");
    this.send_status(me);
    return true;
};

this.leave = function (me) {
    const session = this.query_session(me);
    if (!session) return me.notify("你当前不在断剑冢中。");
    return this.finish(me, session, "主动离开");
};

this.can_leave = function (me, dir) {
    const session = this.query_session(me);
    if (!session || session.ending || session.leaving) return true;
    const room = me && me.environment;
    const nextPath = room && room.exits && dir && room.exits[dir];
    const nextRoom = nextPath && ROOM.Get(nextPath);
    if (nextRoom && nextRoom.parent && room.parent === nextRoom.parent) return true;
    me.notify("断剑冢没有退路，请使用“结束挑战”离开。");
    return false;
};

this.on_area_leaved = function (me) {
    const session = this.query_session(me);
    if (!session) return;
    if (!session.ending) {
        this.finish(me, session, "离开秘境");
    } else if (!this.is_in_area(me)) {
        this.clear_copy(me);
    }
};

this.on_enter_room = function (obj) {
    if (!obj) return;
    const ownerId = obj.is_player ? obj.id : obj.master;
    const owner = ownerId && WORLD.getUser(ownerId);
    if (!owner) return;
    if (!this.query_session(owner)) {
        if (obj.is_player && owner.query_temp(KEY_ACTIVE)) this.restore(owner);
        return;
    }
    this.apply_statuses(obj);
    if (obj.is_player) this.send_controls(obj);
};

this.restore = function (me) {
    if (!me || !me.is_player || !this.is_in_area(me)) return false;
    const activeState = me.query_temp(KEY_ACTIVE);
    if (!activeState || !activeState.runId) return false;
    let session = this.query_session(me);
    if (!session) {
        session = {
            state: activeState,
            npc: null,
            timeoutHandler: null,
            spawnHandler: null,
            ending: false,
            leaving: false
        };
        this.sessions.set(me.id, session);
    } else {
        session.state = activeState;
    }
    this.install_death_hook(me);
    if (activeState.expiresAt <= Date.now()) {
        return this.finish(me, session, "超时");
    }
    this.apply_statuses(me);
    this.schedule_timeout(me, session);
    if (!session.npc && activeState.kills < MAX_KILLS) this.spawn_monster(me, session);
    this.send_status(me);
    this.send_controls(me);
    return true;
};

this.schedule_timeout = function (me, session) {
    if (session.timeoutHandler) clearTimeout(session.timeoutHandler);
    const remaining = Math.max(1, session.state.expiresAt - Date.now());
    session.timeoutHandler = this.call_out(this.on_timeout, remaining, me.id, session.state.runId);
};

this.on_timeout = function (userId, runId) {
    const me = WORLD.getUser(userId);
    const session = me && this.query_session(me);
    if (!session || session.state.runId !== runId) return;
    this.finish(me, session, "超时");
};

this.query_skill_pool = function (baseSkill) {
    const result = [];
    for (const skillId of Object.keys(WORLD.SKILLS || {})) {
        const skill = WORLD.SKILLS[skillId];
        if (!skill || skill.type !== SKILL_TYPES.SKILL || skill.is_hidden) continue;
        if (INCOMPATIBLE_SKILLS[skill.id] || skill.family === FAMILIES.MONSTER) continue;
        if (!Array.isArray(skill.can_enables) || !skill.can_enables.includes(baseSkill)) continue;
        result.push(skill);
    }
    return result;
};

this.create_monster = function () {
    const npc = NPC.CLONE("pub/shanhai_beast");
    if (!npc) return null;
    npc.name = ["守冢剑魂", "折锋残魂", "无名剑客残影"].random();
    npc.color_name = "<hio>" + npc.name + "</hio>";
    npc.desc = "断剑冢中不肯散去的剑客残魂，武学路数每次都不相同。";
    npc.skills = {};
    npc.equipment = [];
    const selections = [];
    for (const baseSkill of BASE_SKILLS) {
        const pool = this.query_skill_pool(baseSkill);
        if (pool.length) selections.push({ base: baseSkill, skill: pool[Math.floor(Math.random() * pool.length)] });
    }
    const attackPools = [];
    for (const baseSkill of ATTACK_BASES) {
        const pool = this.query_skill_pool(baseSkill);
        if (pool.length) attackPools.push({ base: baseSkill, pool: pool });
    }
    if (!attackPools.length) return null;
    const attackPool = attackPools[Math.floor(Math.random() * attackPools.length)];
    selections.push({
        base: attackPool.base,
        skill: attackPool.pool[Math.floor(Math.random() * attackPool.pool.length)]
    });
    for (const baseSkill of BASE_SKILLS.concat([attackPool.base])) {
        npc.skills[baseSkill] = { level: 500, exp: 0 };
    }
    for (const selection of selections) {
        const skill = npc.skills[selection.skill.id] || { level: 500, exp: 0 };
        skill.level = 500;
        skill.exp = 0;
        skill[selection.base] = true;
        npc.skills[selection.skill.id] = skill;
        npc.skills[selection.base].enable_skill = selection.skill.id;
    }
    const weaponPath = WEAPON_PATHS[attackPool.base];
    if (weaponPath) {
        const weapon = OBJ.CREATE(weaponPath);
        if (weapon) {
            weapon.no_get = true;
            npc.equipment[EQUIP_TYPE.WEAPON] = weapon;
        }
    }
    npc.clear_prop();
    npc.str = npc.con = npc.dex = npc.int = 20;
    npc.init();
    npc.recount();

    const prop = npc.prop || (npc.prop = {});
    // NPC模板的内力只有500点，必须以500级基本内功和启用特殊内功的上限为准。
    const baseLimitMp = Math.max(0, Number(npc.limit_mp) || 0);
    const skillLimitMp = Math.max(1, Math.floor(baseLimitMp
        + (Number(npc.query_prop("limit_mp")) || 0)));
    const scale = 1.2;
    const combat = {
        gj: Math.max(1, Math.floor(npc.gj * scale)),
        fy: Math.max(1, Math.floor(npc.fy * scale)),
        mz: Math.max(1, Math.floor(npc.mz * scale)),
        ds: Math.max(1, Math.floor(npc.ds * scale)),
        zj: Math.max(1, Math.floor(npc.zj * scale)),
        bj: Math.max(0, Math.floor(npc.bj * scale)),
        gjsd: Math.max(500, Math.floor(npc.gjsd * 0.8))
    };
    const per = function (name) {
        return (100 + (Number(prop[name]) || 0)) / 100;
    };
    prop.gj = (combat.gj / Math.max(0.01, per("gj_per"))) - npc.str
        - (Number(prop.str) || 0) * npc.str / 10;
    prop.fy = (combat.fy / Math.max(0.01, per("fy_per"))) - (npc.str + npc.con) / 10
        - (Number(prop.con) || 0) * npc.con / 10;
    prop.mz = combat.mz / Math.max(0.01, per("mz_per")) - npc.dex / 2;
    prop.ds = combat.ds / Math.max(0.01, per("ds_per")) - npc.dex / 2
        - (Number(prop.dex) || 0) * npc.dex / 5;
    prop.zj = combat.zj / Math.max(0.01, per("zj_per")) - npc.str / 2
        - (Number(prop.str) || 0) * npc.str / 5;
    prop.bj_per = combat.bj - npc.dex / 10;
    prop.diff_sh_per = Math.floor((Number(prop.diff_sh_per) || 0) * scale);
    prop.diff_fy_per = Math.floor((Number(prop.diff_fy_per) || 0) * scale);
    const speedPer = 1 - (Number(prop.gjsd_per) || 0) / 100;
    if (speedPer > 0) {
        prop.gjsd = 4000 - combat.gjsd / speedPer;
    } else {
        prop.gjsd_per = 0;
        prop.gjsd = 4000 - combat.gjsd;
    }
    npc.recount();
    npc.gj = combat.gj;
    npc.fy = combat.fy;
    npc.mz = combat.mz;
    npc.ds = combat.ds;
    npc.zj = combat.zj;
    npc.bj = combat.bj;
    npc.gjsd = combat.gjsd;
    npc.limit_mp = baseLimitMp;
    npc.max_mp = Math.max(1, Math.floor(Math.max(npc.max_mp, skillLimitMp) * scale));
    const forceRad = npc.query_force_rad ? npc.query_force_rad() : 0.1;
    const hpPer = (100 + (Number(prop.hp_per) || 0)) / 100;
    const skillMaxHp = npc.con * 5 + (npc.max_mp * forceRad
        + (Number(prop.max_hp) || 0) + (Number(prop.con) || 0) * npc.con) * hpPer;
    npc.max_hp = Math.max(1, Math.floor(Math.max(npc.max_hp, skillMaxHp) * 2));
    npc.hp = npc.max_hp;
    npc.mp = npc.max_mp;
    npc.score = 0;
    npc.no_refresh = true;
    npc.is_duanjianzhong = true;
    npc.auto_pfm = true;
    npc.item_types = null;
    npc.init_pfms && npc.init_pfms();
    return npc;
};

this.spawn_monster = function (me, session) {
    if (!me || !session || session.ending || !this.is_in_area(me)) return false;
    if (session.state.kills >= MAX_KILLS) return this.finish(me, session, "完成");
    if (session.npc && session.npc.environment && session.npc.hp > 0) return true;
    const npc = this.create_monster();
    if (!npc) {
        this.finish(me, session, "生成失败");
        return false;
    }
    npc.set_temp("duanjianzhong_owner", me.id);
    npc.on_kill = this.check_monster_kill.bind(this, npc);
    npc.on_died = this.on_monster_died.bind(this, npc);
    session.npc = npc;
    const room = me.environment;
    room.item_changed(npc, true, "断剑冢深处又凝出一道残魂。");
    me.notify("<mem>断剑残魂出现，当前击杀 " + session.state.kills + "/" + MAX_KILLS + "。</mem>");
    if (!session.ending && npc.environment === me.environment && me.hp > 0) npc.do_kill(me);
    return true;
};

this.check_monster_kill = function (npc, killer) {
    const ownerId = npc && npc.query_temp("duanjianzhong_owner");
    if (!killer || !ownerId || (killer.id !== ownerId && killer.master !== ownerId)) {
        return killer && killer.notify_fail("这道断剑残魂只认定秘境挑战者的攻击。");
    }
    const owner = WORLD.getUser(ownerId);
    const session = owner && this.query_session(owner);
    if (!session || session.npc !== npc || session.ending) return false;
    return true;
};

this.on_monster_died = function (npc, killer, corpse) {
    const ownerId = npc && npc.query_temp("duanjianzhong_owner");
    const owner = ownerId && WORLD.getUser(ownerId);
    const session = owner && this.query_session(owner);
    if (corpse && corpse.environment) {
        corpse.items = [];
        corpse.environment.item_changed(corpse, false);
    }
    if (!owner || !session || session.npc !== npc || session.ending) return;
    if (!killer || (killer.id !== owner.id && killer.master !== owner.id)) return;
    session.npc = null;
    session.state.kills = Math.min(MAX_KILLS, (parseInt(session.state.kills) || 0) + 1);
    owner.set_temp(KEY_ACTIVE, session.state);
    const exp = KILL_REWARD_MIN + Math.floor(Math.random() * (KILL_REWARD_MAX - KILL_REWARD_MIN + 1));
    const pot = KILL_REWARD_MIN + Math.floor(Math.random() * (KILL_REWARD_MAX - KILL_REWARD_MIN + 1));
    owner.add_exp(exp, pot);
    owner.notify("<hig>你击破了" + npc.name + "，获得" + exp + "点经验和" + pot + "点潜能。</hig>");
    this.save_player(owner, "断剑冢击杀");
    this.send_status(owner);
    if (session.state.kills >= MAX_KILLS) {
        session.spawnHandler = this.call_out(() => this.finish(owner, session, "完成"), 100);
    } else {
        session.spawnHandler = this.call_out(this.spawn_monster, SPAWN_DELAY, owner, session);
    }
};

this.apply_statuses = function (me) {
    if (!me || me.hp <= 0) return;
    const session = this.query_session(me.is_player ? me : WORLD.getUser(me.master));
    const remaining = session ? Math.max(1, session.state.expiresAt - Date.now()) : TIME_LIMIT;
    for (const id of STATUS_IDS) me.remove_status(id, true);
    me.add_status({
        id: STATUS_IDS[0], name: "剑气", duration: remaining, no_clear: true,
        prop: { fy_per: -10, zj_per: -10, ds_per: -10 }
    });
    me.add_status({
        id: STATUS_IDS[1], name: "残魂", duration: remaining, no_clear: true,
        prop: { expend_mp_per: -50, recover_per: -50 }
    });
    me.add_status({
        id: STATUS_IDS[2], name: "战意", duration: remaining, no_clear: true,
        prop: { gjsd_per: 50 }
    });
};

this.clear_statuses = function (me) {
    if (!me) return;
    const members = [me];
    const appendFollower = function (item) {
        if (item && item.master === me.id && !members.includes(item)) members.push(item);
    };
    if (me.team) me.team.forEach(appendFollower);
    if (me.follow_targets) me.follow_targets.forEach(appendFollower);
    for (const member of members) {
        for (const id of STATUS_IDS) member.remove_status(id, true);
    }
};

this.query_final_reward = function (kills) {
    if (kills >= 100) return { exp: 10000, pot: 25000, name: "断剑无魂" };
    if (kills >= 75) return { exp: 7500, pot: 15000, name: "百剑将倾" };
    if (kills >= 50) return { exp: 5000, pot: 10000, name: "剑魂辟易" };
    if (kills >= 25) return { exp: 2500, pot: 5000, name: "渐入冢心" };
    if (kills >= 10) return { exp: 1000, pot: 2000, name: "初破残魂" };
    return { exp: 0, pot: 0, name: "铩羽而归" };
};

this.finish = function (me, session, reason) {
    if (!me || !session || session.ending) return false;
    session.ending = true;
    if (session.timeoutHandler) clearTimeout(session.timeoutHandler);
    if (session.spawnHandler) clearTimeout(session.spawnHandler);
    if (session.npc && session.npc.environment) session.npc.destroy("断剑残魂化作烟尘散去。");
    session.npc = null;
    if (me.is_fighting && me.is_fighting()) me.end_fight();
    this.clear_statuses(me);
    const kills = Math.max(0, Math.min(MAX_KILLS, parseInt(session.state.kills) || 0));
    const reward = this.query_final_reward(kills);
    if (reward.exp || reward.pot) me.add_exp(reward.exp, reward.pot);
    me.notify("<hiy>断剑冢挑战结束：击杀" + kills + "只，评价【" + reward.name + "】。</hiy>");
    if (reward.exp || reward.pot) {
        me.notify("<hig>秘境结算奖励：" + reward.exp + "点经验，" + reward.pot + "点潜能。</hig>");
    }
    me.remove_temp(KEY_ACTIVE);
    this.sessions.delete(me.id);
    const wasInArea = this.is_in_area(me);
    if (wasInArea && me.hp > 0) {
        session.leaving = true;
        const target = ROOM.Get(session.state.enterRoom) || ROOM.Get("yz/wumiao");
        me.moveto(target, me.name + "离开了断剑冢。", me.name + "回到了秘境外。", "mijing");
    }
    if (!this.is_in_area(me) || me.hp <= 0) this.clear_copy(me);
    me.send('{type:"dialog",dialog:"jh",close:true}');
    this.save_player(me, "断剑冢结算");
    return true;
};

this.clear_copy = function (me) {
    const baseRoom = this.query_base_room();
    if (baseRoom) baseRoom.clear_copy(me);
};

this.query_status = function (me) {
    if (!me || !me.is_player) return null;
    const day = this.ensure_day(me);
    const session = this.query_session(me);
    const state = session && session.state || me.query_temp(KEY_ACTIVE);
    const ticket = me.find_obj_bypath(TICKET_PATH);
    return {
        active: !!(state && state.runId),
        kills: state ? Math.max(0, Math.min(MAX_KILLS, parseInt(state.kills) || 0)) : 0,
        maxKills: MAX_KILLS,
        expiresAt: state && Number(state.expiresAt) > 0 ? Number(state.expiresAt) : 0,
        ticket: ticket ? Math.max(0, parseInt(ticket.count) || 0) : 0,
        dailyCount: day.count,
        dailyLimit: DAILY_LIMIT,
        timeLimit: TIME_LIMIT
    };
};

this.send_status = function (me) {
    if (!me || !me.is_player) return;
    const status = this.query_status(me);
    me.send(JSON.stringify({
        type: "dialog",
        dialog: "jh",
        t: "mj",
        index: 0,
        status: status
    }));
};

this.send_controls = function (me) {
    if (!me || !me.is_player || !this.query_session(me)) return;
    me.send_commands("mijing over", "结束挑战");
};

this.save_player = function (me, reason) {
    if (me && me.save) me.save(reason);
};
