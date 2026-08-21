this.inherits(TASK);
this.id = "qimie_event";
const SELF = this;
const KEY = "qimie_event_ledger", STATE_KEY = "qimie_event_state", MAIL_KEY = "qimie_event_mail";
const RALLY = 30000, RETRY = 900000, FIGHT = 720000, SIDE = 15000, ACTIVE = 30000, EMPTY = 60000, MECH_MIN = 45000, MECH_MAX = 75000, SPECIAL_MIN = 30000, SPECIAL_MAX = 45000, ENRAGE_SPECIAL_MIN = 20000, ENRAGE_SPECIAL_MAX = 30000;
const BASE_HP = 10000000;
const REWARD_WHITELIST = ["money/gold", "money/pot", "money/shanhai_exp", "book/wudao", "book/up", "st/xuanjing", "drug/shanhai_heart"];
const REWARD_LIMIT = 100000000;
const ROOMS = { center: "fb/qimie/center", east: "fb/qimie/east", south: "fb/qimie/south", west: "fb/qimie/west", north: "fb/qimie/north" };
const ASPECTS = [
    { id: "cangming_jianhun", name: "苍溟剑魂", room: "east", buff: "命中+10%，攻击间隔缩短10%", path: "fb/qimie/cangming_jianhun" },
    { id: "lihuo_lingpo", name: "离火灵魄", room: "south", buff: "攻击+8%，暴击+5%", path: "fb/qimie/lihuo_lingpo" },
    { id: "gengjin_shaying", name: "庚金煞影", room: "west", buff: "防御+10%，减伤8%", path: "fb/qimie/gengjin_shaying" },
    { id: "xuanming_zhenhun", name: "玄冥镇魂", room: "north", buff: "闪避+10%，受疗+10%", path: "fb/qimie/xuanming_zhenhun" }
];
function ts() { return Date.now(); }
function day(t) { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function user(p) { return p && p.is_player && p.id ? p : null; }
function aid(p) { return user(p) ? (p.userid || p.user_id || p.id) : null; }
function tell(p, s) { if (p && p.notify) p.notify(s); else if (p && p.send) p.send(s); }
let saveQueue = Promise.resolve();
function save() { try { if (!WORLD.DATA.save) return saveQueue; saveQueue = saveQueue.catch(() => undefined).then(() => WORLD.DATA.save()); saveQueue.catch(e => console.error("七灭账本保存失败", e && e.message || e)); return saveQueue; } catch (e) { console.error("七灭账本保存失败", e.message); return saveQueue; } }
function valid_count(n) { n = Math.floor(Number(n) || 0); return Math.max(1, Math.min(REWARD_LIMIT, n)); }
function reward_path_allowed(path) { return REWARD_WHITELIST.indexOf(path) >= 0 || typeof path === "string" && path.indexOf("book/bc#") === 0; }
this.startup = function () { this.stopped = false; this.event = null; this.timers = new Set(); this.ready = false; this.install_hooks(); this.install_battlefield_hook(); this.schedule_daily(); if (WORLD.__qimie_runtime_started) this.on_world_startup(); };
this.on_world_startup = function () { if (this.ready) return; this.ready = true; const stored = WORLD.DATA.query_temp(STATE_KEY), legacy = WORLD.DATA.query_temp(KEY), old = stored && stored.phase ? stored : legacy && legacy.phase ? legacy : null; if (old && old.phase && old.phase !== "terminal") { old.phase = "terminal"; old.terminal = true; old.terminalReason = "aborted"; } WORLD.DATA.remove_temp(STATE_KEY); if (old) this.set_ledger(old, false, false); else if (stored) save(); this.retry_pending_mail(); };
this.stop = function () { this.stopped = true; this.clear_timers(); clearTimeout(this.dailyTimer); clearTimeout(this.retryTimer); if (this.event && !this.event.terminal) this.terminal("aborted", false); this.event = null; };
this.clear_timers = function () { for (const h of this.timers || []) clearTimeout(h); if (this.timers) this.timers.clear(); };
this.timer = function (fn, delay) { const id = this.event && this.event.eventId; let h = setTimeout(() => { this.timers.delete(h); if (this.stopped || (id && (!this.event || this.event.eventId !== id || this.event.terminal))) return; fn.call(this); }, Math.max(1, delay)); this.timers.add(h); return h; };
this.schedule_daily = function () { if (this.stopped) return; const d = new Date(); d.setHours(20, 30, 0, 0); if (d.getTime() <= ts()) d.setDate(d.getDate() + 1); this.dailyTimer = setTimeout(() => { this.dailyTimer = null; this.start_rally(false); this.schedule_daily(); }, Math.max(1000, d.getTime() - ts())); };
this.install_hooks = function () { const login = WORLD.COMMANDS && WORLD.COMMANDS.login; if (login && !login.__qimie_login_hook) { const oldLogin = login.on_user_login, oldRelogin = login.on_user_relogin; login.on_user_login = function (p) { if (oldLogin) oldLogin.call(this, p); const t = TASK.GET("qimie_event"); if (t) t.on_relogin(p); }; login.on_user_relogin = function (oldUser, newUser) { const ok = oldRelogin ? oldRelogin.call(this, oldUser, newUser) : true; const t = TASK.GET("qimie_event"); if (t && ok !== false) t.on_relogin(newUser); return ok; }; login.__qimie_login_hook = true; } if (!WORLD.__qimie_quit_hook) { const oldQuit = WORLD.on_user_quit; WORLD.on_user_quit = function (p) { const t = TASK.GET("qimie_event"); if (t) t.on_quit(p); return oldQuit ? oldQuit.call(this, p) : undefined; }; WORLD.__qimie_quit_hook = true; } };
this.on_quit = function (p) { const e = this.query_event(), x = e && p && e.participants[p.id]; if (!x) return false; x.active = false; x.player = null; x.absentAt = ts(); this.persist(); this.broadcast_state(); return true; };
this.is_battlefield = function (p) { const id = p && p.environment && p.environment.id; return !!id && Object.keys(ROOMS).some(k => ROOMS[k] === id); };
this.is_dead_lock = function (p) { const until = p && Number(p.qimieDeadUntil) || 0; if (!until) return false; if (until <= ts()) { this.on_dead_return(p); return false; } return true; };
this.schedule_dead_return = function (p) { if (!p) return; if (p.qimieDeadTimer) clearTimeout(p.qimieDeadTimer); const wait = Math.max(1, (Number(p.qimieDeadUntil) || ts()) - ts()); p.qimieDeadTimer = setTimeout(() => { p.qimieDeadTimer = null; this.on_dead_return(p); }, wait); };
this.on_user_die = function (p) { if (!user(p) || !this.is_battlefield(p)) return false; p.qimieDeadUntil = ts() + 30000; p.set_temp && p.set_temp("qimie_dead", 1, 30000); p.qimieDeadRoom = p.environment && p.environment.id || ROOMS.center; const e = this.query_event(), x = e && e.participants[p.id]; if (x) { x.active = false; x.activeAt = 0; x.player = p; x.absentAt = ts(); this.persist(); this.broadcast_state(); } this.schedule_dead_return(p); return true; };
this.on_dead_return = function (p) { if (!user(p)) return false; const until = Number(p.qimieDeadUntil) || 0; if (!until || until > ts()) return false; if (p.qimieDeadTimer) { clearTimeout(p.qimieDeadTimer); p.qimieDeadTimer = null; } const wasBattlefield = this.is_battlefield(p); p.qimieDeadUntil = 0; p.qimieDeadRoom = null; p.remove_temp && p.remove_temp("qimie_dead"); if (wasBattlefield && p.moveto) p.moveto(ROOMS.center); const e = this.query_event(), x = e && e.participants[p.id]; if (x) { x.player = p; x.active = false; x.activeAt = 0; x.absentAt = ts(); this.persist(); this.broadcast_state(); } if (p.notify) p.notify("七灭战场死亡保护结束，你已回到中央战场。可以重新复活或离场。"); return true; };
this.command_allowed = function (p, name, cmd) { if (!user(p)) return true; const n = String(name || cmd && cmd.command || "").split(",")[0].toLowerCase(); const admin = n === "worldboss" && WORLD.is_admin && WORLD.is_admin(p); if (admin) return true; if (this.is_dead_lock(p)) { const readOnly = ["look", "l", "look1", "look3", "status", "score", "score2", "events", "message", "stats"]; return readOnly.indexOf(n) >= 0; } if (!this.is_battlefield(p)) return true; // 命令注册分散在 world/cmd，故只拦截确定的跨地图、脱战和快速恢复入口；go/path 等正常移动保留。
const blocked = ["goto", "jh", "cr", "cr2", "escape", "dazuo", "liaoshang", "recover", "relive"]; return blocked.indexOf(n) < 0; };
this.install_battlefield_hook = function () { if (WORLD.__qimie_die_hook) return; const old = WORLD.on_user_die; WORLD.on_user_die = function (p, killer) { const t = TASK.GET("qimie_event"); if (t) t.on_user_die(p, killer); return old ? old.call(this, p, killer) : undefined; }; WORLD.__qimie_die_hook = true; };
this.query_event = function () { return this.event && !this.event.terminal ? this.event : null; };
this.query_state = function () { return this.event ? this.payload(this.event) : null; };
this.persistable = function (e) {
    if (!e) return null;
    return JSON.parse(JSON.stringify(e, function (key, value) {
        if (key === "boss" || key === "npc" || key === "player" || key === "bossTarget" || value && value.is_player) return undefined;
        return typeof value === "function" ? undefined : value;
    }));
};
this.set_ledger = function (e, reward, retry) {
    if (!e || e.testing) return;
    const previous = WORLD.DATA.query_temp(KEY, {}) || {};
    const ledger = previous && typeof previous === "object" && !Array.isArray(previous) && !previous.eventId && !previous.phase ? previous : {};
    const currentDay = day(ts()), cutoff = ts() - 30 * 24 * 3600000;
    Object.keys(ledger).forEach(id => { const row = ledger[id]; if (row && row.settledAt && row.settledAt < cutoff && row.eventDate !== currentDay) delete ledger[id]; });
    const participants = {};
    Object.keys(e.participants || {}).forEach(id => {
        const x = e.participants[id] || {};
        participants[id] = { id: x.id || id, accountId: x.accountId, name: x.name, damage: x.damage || 0, aspectDamage: x.aspectDamage || 0, mechanics: x.mechanics || 0, active: x.active !== false, absentAt: x.absentAt || 0 };
    });
    const status = reward ? "succeeded" : e.terminalReason === "aborted" ? "aborted" : e.terminalReason === "empty_rally" ? "cancelled" : e.retry ? "failed_final" : retry ? "failed_once" : "failed_final";
    const entry = { eventDate: e.day, instanceId: e.instanceId || e.eventId, status: status, reason: e.terminalReason || "unknown", createdAt: e.createdAt, settledAt: ts(), lockedCount: e.lockedCount || 0, bossMaxHp: e.bossMaxHp || 0, participants: participants };
    if (reward) entry.successAccounts = this.award_snapshot(e).filter(x => x.eligible && x.accountId).map(x => x.accountId);
    ledger[e.instanceId || e.eventId] = entry;
    WORLD.DATA.set_temp(KEY, ledger);
    save();
};
this.retry_pending_mail = function () {
    const ledger = WORLD.DATA.query_temp(MAIL_KEY, {}) || {};
    const currentDay = day(ts()), cutoff = ts() - 30 * 24 * 3600000;
    Object.keys(ledger).forEach(key => { const row = ledger[key]; if (row && row.status !== "pending" && row.createdAt && row.createdAt < cutoff && row.eventDate !== currentDay) delete ledger[key]; });
    WORLD.DATA.set_temp(MAIL_KEY, ledger);
    Object.keys(ledger).forEach(key => { if (ledger[key] && ledger[key].status === "pending") this.deliver_mail(key, ledger[key]); });
    save();
};
this.clear_runtime_state = function () { WORLD.DATA.remove_temp(STATE_KEY); };
this.can_schedule_retry = function () { const now = ts(), cutoff = new Date(now); cutoff.setHours(23, 0, 0, 0); return now + RETRY < cutoff.getTime(); };
this.timeout = function () {
    const e = this.event;
    if (!e || e.terminal) return;
    this.terminal("timeout", false, true);
};
this.boss_attack_allowed = function (e, boss, target) {
    return !!(e && !e.terminal && (e.phase === "normal" || e.phase === "enrage") && boss && e.boss === boss && boss.eventId === e.eventId && target && target.hp > 0 && this.is_active(target) && target.environment && target.environment.id === ROOMS.center && boss.environment && boss.environment.id === ROOMS.center);
};
this.remove_boss_enemy = function (target, boss) {
    if (!target || !Array.isArray(target.enemy)) return;
    for (let i = target.enemy.length - 1; i >= 0; i--) if (target.enemy[i] === boss) target.enemy.splice(i, 1);
    if (!target.enemy.length && target.fight_type && target.end_fight) target.end_fight();
};
this.stop_boss_attack = function (e) {
    const boss = e && e.boss;
    if (!boss) return;
    if (boss.attack_handler) clearTimeout(boss.attack_handler);
    boss.attack_handler = null;
    if (boss.end_fight) boss.end_fight();
    Object.keys(e.participants || {}).forEach(id => this.remove_boss_enemy(e.participants[id].player || WORLD.getUser(id), boss));
    e.bossTarget = null;
};
this.query_boss_target = function (e) {
    return Object.keys(e.participants || {}).map(id => e.participants[id].player || WORLD.getUser(id)).filter(p => this.boss_attack_allowed(e, e.boss, p));
};
this.bind_boss_target = function (e, target) {
    const boss = e && e.boss;
    if (!this.boss_attack_allowed(e, boss, target)) return false;
    if (e.bossTarget !== target) this.stop_boss_attack(e);
    if (target.begin_attack && (!target.is_fighting || !target.is_fighting(boss))) target.begin_attack(boss, 2);
    if (boss.begin_attack && (!boss.is_fighting || !boss.is_fighting(target))) {
        boss.begin_attack(target, 2);
        if (boss.attack_handler) clearTimeout(boss.attack_handler);
        boss.attack_handler = null;
    }
    e.bossTarget = target;
    return true;
};
this.boss_attack = function () {
    const e = this.event, boss = e && e.boss;
    if (!e || e.terminal || !boss) return;
    const target = this.query_boss_target(e)[0];
    if (!this.boss_attack_allowed(e, boss, target)) this.stop_boss_attack(e);
    else if (this.bind_boss_target(e, target) && boss.qimie_attack) boss.qimie_attack(target);
    if (this.event === e && !e.terminal) this.timer(this.boss_attack, Math.max(1000, Number(boss.gjsd) || 4000));
};
this.start_boss_attack = function (e) {
    if (!e || e.terminal || !e.boss || e.bossAttackStarted) return false;
    e.bossAttackStarted = true;
    this.timer(this.boss_attack, 1);
    return true;
};
this.start_rally = function (testing, retry) {
    if (this.stopped || this.query_event()) return null;
    const t = ts();
    if (!testing) { const cutoff = new Date(t); cutoff.setHours(23, 0, 0, 0); if (t >= cutoff.getTime()) return null; }
    const id = (testing ? "qimie_test_" : "qimie_") + t;
    const e = {
        eventId: id,
        instanceId: id,
        day: day(t),
        testing: !!testing,
        retry: !!retry,
        phase: "rally",
        terminal: false,
        createdAt: t,
        rallyEndsAt: t + RALLY, fightEndsAt: t + RALLY + FIGHT,
        expiresAt: t + RALLY,
        serverNow: t,
        bossHp: BASE_HP,
        bossMaxHp: BASE_HP,
        stacks: 0,
        aspects: [],
        mechanic: null,
        participants: {},
        lockedCount: 0,
        multiplier: 1,
        thresholdIndex: 0,
        thresholdPending: false,
        sideRounds: {},
        sideHistory: [],
        totalActiveAt: t,
        enrageAt: 0,
        nextSideAt: 0,
        mechanicBag: ["yinyang", "tiangang"],
        messages: []
    };
    this.event = e;
    this.persist();
    this.timer(this.lock_rally, RALLY);
    return e;
};
this.lock_rally = function () { const e = this.event; if (!e || e.phase !== "rally" || e.terminal) return; const t = ts(), ids = Object.keys(e.participants).filter(id => e.participants[id].activeAt >= t - ACTIVE); const accounts = {}, locked = []; ids.forEach(id => { const p = e.participants[id]; if (!accounts[p.accountId]) { accounts[p.accountId] = id; p.locked = true; p.active = true; locked.push(id); } }); if (!locked.length) return this.cancel_empty_rally(); e.lockedCount = locked.length; e.multiplier = this.multiplier(locked.length); e.bossMaxHp = e.bossHp = Math.floor(BASE_HP * e.multiplier); e.phase = "normal"; e.expiresAt = e.fightEndsAt; e.enrageAt = t + 600000; e.nextSideAt = t + this.mechanic_delay(); e.nextTargetAt = t + this.special_delay(false); e.mechanicBag = ["yinyang", "tiangang"]; if (!this.spawn_battle(e)) return this.terminal("spawn_failed", false, false); this.persist(); this.broadcast_state(); this.timer(this.timeout, FIGHT); this.timer(this.tick, 5000); this.timer(this.empty_check, 5000); };
this.cancel_empty_rally = function () { return this.terminal("empty_rally", false, false); };
this.multiplier = function (n) { n = Math.max(0, Number(n) || 0); if (n <= 7) return 1; if (n <= 16) return 1 + (n - 7) / 9; return Math.min(3, 2 + (n - 16) * .02); };
this.mechanic_delay = function () { return MECH_MIN + Math.floor(Math.random() * (MECH_MAX - MECH_MIN + 1)); };
this.special_delay = function (enrage) { const min = enrage ? ENRAGE_SPECIAL_MIN : SPECIAL_MIN, max = enrage ? ENRAGE_SPECIAL_MAX : SPECIAL_MAX; return min + Math.floor(Math.random() * (max - min + 1)); };
this.draw_mechanic = function (e) { e.mechanicBag = Array.isArray(e.mechanicBag) ? e.mechanicBag : []; if (!e.mechanicBag.length) e.mechanicBag = ["yinyang", "tiangang"]; const i = Math.floor(Math.random() * e.mechanicBag.length); return e.mechanicBag.splice(i, 1)[0]; };
this.join = function (p) { p = user(p); const e = this.query_event(); if (!p || !e) { tell(p, "七灭天劫当前不在集结或战斗时间。"); return false; } const id = p.id, account = aid(p); for (const k of Object.keys(e.participants)) if (k !== id && e.participants[k].accountId === account && e.participants[k].locked) return tell(p, "同一账号已有角色锁定参战名额。"), false; if (!e.participants[id]) e.participants[id] = { id, accountId: account, name: p.name, joinedAt: ts(), activeAt: ts(), active: true, locked: false, damage: 0, mechanics: 0, score: 0 }; const x = e.participants[id]; x.player = p; x.active = true; x.activeAt = ts(); x.absentAt = 0; if (p.environment && p.environment.id !== ROOMS.center && p.moveto) p.moveto(ROOMS.center); this.touch(p); this.broadcast_state(); return true; };
this.leave = function (p) { const e = this.query_event(); if (!e || !user(p)) return false; const x = e.participants[p.id]; if (x) { x.active = false; x.player = null; x.absentAt = ts(); } if (p.moveto) p.moveto("yz/nanmen"); this.broadcast_state(); return true; };
this.spawn_aspects = function () { const e = this.event; if (!e || e.terminal || !e.boss) return false; const made = []; e.aspects = []; try { ASPECTS.forEach(base => { const npc = NPC.CLONE(base.path), room = ROOM.Get(ROOMS[base.room]); if (!npc || !room) throw new Error(base.path + "房间或对象不可用"); const max = Math.floor(e.bossMaxHp * .1); npc.qimie_event = this; npc.eventId = e.eventId; npc.aspectId = base.id; npc.no_fight = true; npc.no_refresh = true; if (npc.init) npc.init(); if (npc.recount) npc.recount(); npc.hp = npc.max_hp = max; const a = { id: base.id, name: base.name, room: base.room, hp: max, maxHp: max, alive: true, buff: base.buff, npc: npc }; e.aspects.push(a); made.push(npc); room.item_changed(npc, true); }); } catch (err) { console.error("七灭法身生成失败", err && err.message || err); made.forEach(npc => { if (npc.environment && npc.environment.item_changed) npc.environment.item_changed(npc, false); if (npc.destroy) npc.destroy("七灭天劫生成失败。"); }); e.aspects = []; this.terminal("spawn_failed", false, false); return false; } e.phase = "aspect"; e.expiresAt = ts() + 45000; e.nextSideAt = 0; e.nextTargetAt = 0; this.recount_boss(); this.persist(); this.broadcast_state(); this.pulse(); this.timer(this.finish_aspect, 45000); return true; };
this.is_active = function (p) { const e = this.query_event(), x = e && user(p) && e.participants[p.id]; if (!x || !x.locked || x.activeAt < ts() - ACTIVE) { if (x && x.locked) x.active = false; return false; } return x.active !== false; };
this.players = function () { const e = this.query_event(); return e ? Object.keys(e.participants).map(id => e.participants[id].player || WORLD.getUser(id)).filter(p => p && this.is_active(p)) : []; };
this.event_players = function () { const e = this.query_event(); return e ? Object.keys(e.participants).map(id => e.participants[id].player || WORLD.getUser(id)).filter(p => p && p.send) : []; };
this.spawn_battle = function (e) { let room, boss; try { room = ROOM.Get(ROOMS.center); boss = NPC.CLONE("fb/qimie/qimie_zunzhe"); if (!room || !boss) throw new Error("BOSS房间或对象不可用"); boss.qimie_event = this; boss.eventId = e.eventId; boss.hp = boss.max_hp = e.bossMaxHp; boss.no_fight = true; boss.no_refresh = true; if (boss.init) boss.init(); if (boss.recount) boss.recount(); boss.hp = boss.max_hp = e.bossMaxHp; e.boss = boss; e.baseStats = { gj: boss.gj || 0, mz: boss.mz || 0, ds: boss.ds || 0, fy: boss.fy || 0, gjsd: boss.gjsd || 0 }; this.recount_boss(); room.item_changed(boss, true); return true; } catch (err) { console.error("七灭尊者生成失败", err && err.message || err); if (boss && boss.destroy) boss.destroy("七灭天劫生成失败。"); e.boss = null; return false; } };
this.destroy_aspects = function () { const e = this.event; if (!e) return; (e.aspects || []).forEach(a => { if (a.npc && a.npc.environment && a.npc.environment.item_changed) a.npc.environment.item_changed(a.npc, false); if (a.npc && a.npc.destroy) a.npc.destroy("法身随劫云消散。"); a.npc = null; a.alive = false; }); };
this.finish_aspect = function () { const e = this.event; if (!e || e.terminal || e.phase !== "aspect") return; if (e.aspects.length && e.aspects.every(a => !a.alive)) { e.phase = "vulnerability"; e.vulnerabilityUntil = Math.min(e.fightEndsAt, ts() + 12000); e.expiresAt = e.vulnerabilityUntil; e.nextSideAt = 0; e.nextTargetAt = 0; this.recount_boss(); this.timer(this.end_vulnerability, Math.max(1, e.vulnerabilityUntil - ts())); } else { const survivors = e.aspects.filter(a => a.alive).length; this.destroy_aspects(); e.stacks = Math.min(6, e.stacks + survivors); e.phase = "normal"; e.expiresAt = e.fightEndsAt; e.nextSideAt = ts() + this.mechanic_delay(); e.nextTargetAt = ts() + this.special_delay(false); this.recount_boss(); } this.persist(); this.broadcast_state(); };
this.damage_player = function (p, amount, from, diffFy, par) { if (!p || !(amount > 0) || !p.damage || p.hp <= 0) return 0; const dealt = p.damage(amount, from, diffFy, par); if (p.hp <= 0 && p.die) { p.die(from); if (p.hp <= 0 && p.end_fight) p.end_fight(); } return dealt; };
this.end_vulnerability = function () { const e = this.event; if (!e || e.terminal || e.phase !== "vulnerability") return; e.vulnerabilityUntil = 0; e.phase = "normal"; e.expiresAt = e.fightEndsAt; e.nextSideAt = ts() + this.mechanic_delay(); e.nextTargetAt = ts() + this.special_delay(false); this.recount_boss(); this.broadcast_state(); };
this.pulse = function () { const e = this.event; if (!e || e.terminal || e.phase !== "aspect") return; const n = e.aspects.filter(a => a.alive).length; this.players().forEach(p => { const room = p.environment && p.environment.id; if (!Object.keys(ROOMS).some(k => ROOMS[k] === room)) return; const dmg = Math.floor((p.max_hp || 0) * (.02 + n * .01 + (e.stacks >= 6 ? .1 : 0))); if (dmg > 0 && p.damage) this.damage_player(p, dmg, e.boss, 0, { qimie: true }); }); if (this.event === e && !e.terminal && e.phase === "aspect") this.timer(this.pulse, 5000); };
this.aspect_dead = function (npc, killer) { const e = this.event, a = e && e.aspects.find(x => x.id === npc.aspectId); if (!e || e.terminal || npc.eventId !== e.eventId || !a || !a.alive) return; a.alive = false; a.hp = 0; a.killer = killer && killer.id; if (npc.environment) npc.environment.item_changed(npc, false); npc.destroy(); this.recount_boss(); if (e.aspects.every(x => !x.alive)) this.finish_aspect(); else this.broadcast_state(); };
this.recount_boss = function () { const e = this.event, boss = e && e.boss; if (!e || !boss) return false; const base = e.baseStats || {}; const active = e.aspects || []; const add = {}; active.forEach(a => { if (!a.alive) return; if (a.id === "cangming_jianhun") { add.mz = (add.mz || 0) + .10; add.gjsd = (add.gjsd || 0) + .10; } else if (a.id === "lihuo_lingpo") { add.gj = (add.gj || 0) + .08; add.crit = (add.crit || 0) + .05; } else if (a.id === "gengjin_shaying") { add.fy = (add.fy || 0) + .10; add.reduce = (add.reduce || 0) + .08; } else if (a.id === "xuanming_zhenhun") { add.shan = (add.shan || 0) + .10; add.heal = (add.heal || 0) + .10; } }); const stack = Math.min(6, e.stacks || 0) * .05, side = e.sideBuffUntil > ts() ? .10 : 0, rage = e.phase === "enrage" ? .50 : 0; ["gj", "mz", "ds", "fy"].forEach(k => { const value = Number(base[k]) || 0; const extra = add[k] || 0; boss[k] = Math.floor(value * (1 + stack + side + rage + extra)); if (boss.prop) boss.prop[k] = boss[k]; }); const interval = Number(base.gjsd) || 0; if (interval > 0) boss.gjsd = Math.max(1, Math.floor(interval * (1 - Math.min(.6, stack * .6 + (add.gjsd || 0) + (e.phase === "enrage" ? .1 : 0))))); boss.max_hp = e.bossMaxHp; boss.hp = Math.max(0, Math.min(boss.hp, boss.max_hp)); return true; };
this.threshold = function (npc) { const e = this.event; if (!e || e.terminal || npc !== e.boss || (e.phase !== "normal" && e.phase !== "enrage") || e.thresholdIndex >= 3) return false; const ratios = [.75, .50, .25], ratio = ratios[e.thresholdIndex]; if (npc.hp > e.bossMaxHp * ratio) return false; e.thresholdIndex++; e.thresholdPending = true; if (!e.mechanic) { e.thresholdPending = false; return this.spawn_aspects(); } return true; };
this.terminal = function (reason, reward, retry) { const e = this.event; if (!e || e.terminal) return false; e.terminal = true; e.phase = "terminal"; e.terminalReason = reason; e.expiresAt = ts(); this.clear_timers(); this.stop_boss_attack(e); if (e.boss && e.boss.environment) e.boss.destroy("七灭天劫已结束。"); (e.aspects || []).forEach(a => { if (a.npc && a.npc.environment && a.npc.environment.item_changed) a.npc.environment.item_changed(a.npc, false); if (a.npc && a.npc.destroy) a.npc.destroy("法身随劫云消散。"); a.npc = null; a.alive = false; }); this.clear_runtime_state(); this.broadcast_clear(); this.close_raid(); if (reason !== "empty_rally") this.set_ledger(e, reward, retry); this.issue_rewards(e); this.event = null; if (retry && !e.testing && !e.retry && this.can_schedule_retry()) this.retryTimer = setTimeout(() => { this.retryTimer = null; if (!this.stopped && !this.query_event()) this.start_rally(false, true); }, RETRY); return true; };
this.accept_damage = function (npc, amount, from, apply) { const e = this.event, source = user(from) || (from && from.master && WORLD.getUser(from.master)); const x = e && source && e.participants[source.id], aspect = e && e.aspects && e.aspects.find(a => a.npc === npc || a.id === npc.aspectId); const isAspect = !!aspect; const blocked = !e || e.terminal || !npc || npc.eventId !== e.eventId || !(amount > 0) || e.phase === "rally" || e.phase === "side" || (!isAspect && e.phase === "aspect") || (isAspect && e.phase !== "aspect") || !this.is_active(source) || !x; if (blocked) return 0; const before = npc.hp; npc._qimieDamageInFlight = true; let result; try { result = apply(); } finally { npc._qimieDamageInFlight = false; } let dealt = Math.max(0, before - npc.hp); if (npc === e.boss && e.phase !== "vulnerability") { const ratios = [.75, .5, .25], ratio = ratios[e.thresholdIndex]; if (ratio !== undefined && npc.hp < e.bossMaxHp * ratio) { npc.qimieLockHp = Math.ceil(e.bossMaxHp * ratio); npc.hp = npc.qimieLockHp; } } dealt = Math.max(0, before - npc.hp); if (dealt > 0 && e.phase === "vulnerability" && npc === e.boss) { const bonus = Math.min(npc.max_hp - npc.hp, Math.floor(dealt * .2)); if (bonus > 0) { npc.hp -= bonus; dealt += bonus; npc.notify_hp && npc.notify_hp("hp", npc.hp); } } if (dealt > 0) { if (isAspect) x.aspectDamage = (x.aspectDamage || 0) + dealt; else x.damage = (x.damage || 0) + dealt; x.activeAt = ts(); if (npc === e.boss) this.threshold(npc); this.persist(); this.broadcast_state(); } if (npc === e.boss && e.pendingKill && !e.terminal) { e.pendingKill = false; this.terminal("success", true); } return dealt || result || 0; };
this.kill = function (npc, killer) { const e = this.event; if (!e || e.terminal || npc !== e.boss) return; if (npc._qimieDamageInFlight) { e.pendingKill = true; return; } this.terminal("success", true); };
this.tick = function () { const e = this.event; if (!e || e.terminal) return; Object.keys(e.participants).forEach(id => { const x = e.participants[id]; if (x.locked && x.activeAt < ts() - ACTIVE) x.active = false; }); if (e.phase === "normal" && e.enrageAt && ts() >= e.enrageAt) this.enter_enrage(); else if (e.phase === "normal" && e.nextSideAt && ts() >= e.nextSideAt && !e.mechanic) { e.nextSideAt = 0; this.start_side(this.draw_mechanic(e)); } if ((e.phase === "normal" || e.phase === "enrage") && e.nextTargetAt && ts() >= e.nextTargetAt && !e.mechanic) { e.nextTargetAt = 0; this.cast_mechanic(); if (!e.mechanic) e.nextTargetAt = ts() + this.special_delay(e.phase === "enrage"); } this.broadcast_state(); this.timer(this.tick, 5000); };
this.empty_check = function () { const e = this.event; if (!e || e.terminal || e.phase === "rally") return; if (this.players().length) e.totalActiveAt = ts(); else if (ts() - e.totalActiveAt >= EMPTY) return this.terminal("empty", false, true); this.timer(this.empty_check, 5000); };
this.raid_message = function (p, text) { const e = this.event; if (!e || !this.is_active(p) || !String(text || "").trim()) return false; this.touch(p); e.messages = (e.messages || []).concat({ id: p.id + "_" + ts(), playerId: p.id, name: p.name, content: String(text).trim().slice(0, 200), at: ts() }).slice(-20); this.broadcast_raid(); return true; };
this.payload = function (e) { return { type: "boss_event", action: "state", eventId: e.eventId, phase: e.phase, expiresAt: e.expiresAt || 0, serverNow: ts(), bossHp: e.boss ? e.boss.hp : e.bossHp || 0, bossMaxHp: e.bossMaxHp || 0, stacks: e.stacks || 0, aspects: (e.aspects || []).map(a => ({ id: a.id, name: a.name, room: a.room, hp: a.npc ? a.npc.hp : a.hp, maxHp: a.maxHp, alive: !!a.alive, buff: a.buff })), mechanic: e.mechanic || null }; };
this.persist = function () { if (this.event) WORLD.DATA.set_temp(STATE_KEY, this.persistable(this.event)); else WORLD.DATA.remove_temp(STATE_KEY); if (this.event) save(); };
this.broadcast_clear = function () { const e = this.event; if (!e) return; const msg = JSON.stringify({ type: "boss_event", action: "clear", eventId: e.eventId, phase: "terminal", expiresAt: ts(), serverNow: ts(), bossHp: 0, bossMaxHp: e.bossMaxHp || 0, stacks: e.stacks || 0, aspects: [], mechanic: null }); Object.keys(e.participants).forEach(id => { const p = WORLD.getUser(id); if (p && p.send) p.send(msg); }); };
this.broadcast_raid = function () { const e = this.event; if (!e) return; const ids = Object.keys(e.participants).filter(id => e.participants[id].locked), body = { type: "raid", action: "state", eventId: e.eventId, members: ids.map(id => { const p = e.participants[id]; return { id, name: p.name, active: !!p.active, room: p.player && p.player.environment && p.player.environment.id || "" }; }), messages: (e.messages || []).slice(-20) }; ids.forEach(id => { const p = WORLD.getUser(id); if (p && p.send) p.send(JSON.stringify(body)); }); };
this.close_raid = function () { const e = this.event; if (!e) return; const body = JSON.stringify({ type: "raid", action: "close", eventId: e.eventId, members: [], messages: [] }); Object.keys(e.participants).forEach(id => { const p = WORLD.getUser(id); if (p && p.send) p.send(body); }); };
this.start_side = function (type) { const e = this.event; if (!e || e.terminal || e.phase !== "normal" || e.mechanic || (e.sideRounds && e.sideRounds[e.thresholdIndex])) return false; const active = this.players(); if (!active.length) return false; type = type === "tiangang" ? "tiangang" : "yinyang"; const isYinyang = type === "yinyang"; const recent = new Set((e.sideHistory || []).slice(-2).reduce((all, round) => all.concat(Array.isArray(round) ? round : [round]), [])); let candidates = active.filter(p => !recent.has(p.id)); if (candidates.length < (isYinyang ? 2 : 1)) candidates = active.slice(); candidates.sort(() => Math.random() - .5); let targetRooms, targets; if (isYinyang) { targetRooms = ["north", "south"]; targets = candidates.slice(0, 2); } else { const target = candidates[0]; const choices = ["east", "south", "west", "north"].filter(room => !target.environment || ROOMS[room] !== target.environment.id); targetRooms = [choices[Math.floor(Math.random() * choices.length)]]; targets = [target]; } e.sideRounds = e.sideRounds || {}; e.sideRounds[e.thresholdIndex] = true; e.sideHistory = (e.sideHistory || []).concat([targets.map(p => p.id)]).slice(-2); e.phase = "side"; e.mechanic = { type: type, expiresAt: ts() + SIDE, targetIds: targets.map(p => p.id), targetRoom: targetRooms[0], targetRooms: targetRooms, requiredCount: isYinyang ? 2 : Math.min(4, Math.max(1, active.length)), participants: [] }; this.persist(); this.broadcast_state(); this.timer(this.resolve_side, SIDE); return true; };
this.mechanic_action = function (p, type) { const e = this.event, m = e && e.mechanic; if (!e || e.terminal || e.phase !== "side" || !this.is_active(p) || !m || m.type !== type) return false; const room = p.environment && p.environment.id; if (type === "yinyang") { const idx = m.participants.length; if (idx >= 2 || p.id !== m.targetIds[idx] || room !== ROOMS[m.targetRooms[idx]]) return false; } else if (room !== ROOMS[m.targetRoom]) return false; if (m.participants.indexOf(p.id) < 0) m.participants.push(p.id); const x = e.participants[p.id]; if (x) { x.activeAt = ts(); x.player = p; } if (m.participants.length >= m.requiredCount) this.resolve_side(true); else this.broadcast_state(); return true; };
this.resolve_side = function (success) { const e = this.event, m = e && e.mechanic; if (!e || e.terminal || e.phase !== "side" || !m) return; const targetRequired = m.type === "yinyang" ? m.requiredCount : 1; const targetsReady = m.targetIds.length >= targetRequired && m.targetIds.slice(0, targetRequired).every((id, i) => { const p = WORLD.getUser(id); return this.is_active(p) && p.hp > 0 && p.environment && p.environment.id === ROOMS[m.targetRooms[Math.min(i, m.targetRooms.length - 1)]]; }); const completed = !!success && m.participants.length >= m.requiredCount && targetsReady; if (completed) m.participants.forEach(id => { const x = e.participants[id]; if (x) x.mechanics = Math.min(4, (x.mechanics || 0) + 1); }); else { const targetSet = new Set(m.targetIds); const rooms = m.targetRooms || [m.targetRoom]; rooms.forEach(roomName => { this.players().filter(p => p.environment && p.environment.id === ROOMS[roomName]).forEach(p => { let damage = Math.floor((p.max_hp || 0) * .2); if (targetSet.has(p.id)) damage += Math.floor((p.max_hp || 0) * .1); if (damage > 0 && p.damage) this.damage_player(p, damage, e.boss, 0, { qimie: true }); }); }); e.sideBuffUntil = ts() + 10000; this.timer(this.clear_side_buff, 10000); } e.mechanic = null; e.phase = "normal"; e.expiresAt = e.fightEndsAt; e.nextSideAt = ts() + this.mechanic_delay(); e.nextTargetAt = ts() + this.special_delay(false); this.recount_boss(); if (e.thresholdPending) { e.thresholdPending = false; this.spawn_aspects(); } this.persist(); this.broadcast_state(); };
this.clear_side_buff = function () { const e = this.event; if (!e || e.terminal || !(e.sideBuffUntil > 0) || e.sideBuffUntil > ts()) return; e.sideBuffUntil = 0; this.recount_boss(); this.persist(); this.broadcast_state(); };
this.resolve_cast = function () { const e = this.event, m = e && e.mechanic; if (!e || e.terminal || !m || m.resolvedAt || (e.phase !== "normal" && e.phase !== "enrage")) return; const remaining = m.expiresAt - ts(); if (remaining > 0) return this.timer(this.resolve_cast, remaining); m.resolvedAt = ts(); if (m.type === "灭魂指") { const target = WORLD.getUser(m.targetIds[0]); if (target && target.hp > 0 && this.is_active(target) && target.environment && target.environment.id === ROOMS.center) { const damage = Math.floor((e.boss && e.boss.gj || 0) * 1.8); if (damage > 0 && target.damage) this.damage_player(target, damage, e.boss, e.boss.diff_fy_per || 0, { qimie: true }); } } else if (m.type === "七灭天音") { this.players().forEach(p => { const damage = Math.floor((p.max_hp || 0) * .1); if (damage > 0 && p.damage) this.damage_player(p, damage, e.boss, 0, { qimie: true }); }); } if (e.mechanic === m) e.mechanic = null; e.nextTargetAt = ts() + this.special_delay(e.phase === "enrage"); if (e.thresholdPending) { e.thresholdPending = false; this.spawn_aspects(); } this.persist(); this.broadcast_state(); };
this.cast_mechanic = function () { const e = this.event; if (!e || e.terminal || e.mechanic || (e.phase !== "normal" && e.phase !== "enrage")) return; const expiresAt = Math.min(e.fightEndsAt, ts() + 20000); if (e.phase === "normal") { const pool = this.players().filter(p => p.environment && p.environment.id === ROOMS.center); if (!pool.length) return; const target = pool[Math.floor(Math.random() * pool.length)]; e.mechanic = { type: "灭魂指", expiresAt: expiresAt, targetIds: [target.id], targetRoom: "center", requiredCount: 0, participants: [] }; } else { e.mechanic = { type: "七灭天音", expiresAt: expiresAt, targetIds: this.players().map(p => p.id), targetRoom: "all", requiredCount: 0, participants: [] }; } this.persist(); this.broadcast_state(); this.timer(this.resolve_cast, Math.max(1, expiresAt - ts())); };
this.enter_enrage = function () { const e = this.event; if (!e || e.terminal || e.phase === "enrage") return; e.phase = "enrage"; e.expiresAt = e.fightEndsAt; e.nextSideAt = 0; e.nextTargetAt = ts() + this.special_delay(true); e.mechanic = null; this.recount_boss(); this.persist(); this.broadcast_state(); };
this.public_skill_path = function (candidate) {
    const pool = [], skills = typeof WORLD !== "undefined" && WORLD.SKILLS || {};
    Object.keys(skills).forEach(id => {
        const skill = skills[id], types = typeof SKILL_TYPES !== "undefined" ? SKILL_TYPES : {};
        if (!skill || skill.id !== id || skill.is_hidden || skill.disabled || skill.disable || skill.grade <= 0 || types.SKILL !== undefined && skill.type !== types.SKILL || typeof FAMILIES !== "undefined" && FAMILIES.MONSTER !== undefined && skill.family === FAMILIES.MONSTER) return;
        const path = "book/bc#" + id;
        if (reward_path_allowed(path)) pool.push(path);
    });
    if (candidate) return pool.indexOf(candidate) >= 0 ? candidate : null;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
};
this.build_reward = function (x, fraction, allowRare) {
    if (!x || !x.eligible) return null;
    const scale = Number(fraction) > 0 ? Number(fraction) : 1, tier = fraction ? 1 : x.score >= 60 ? 3 : x.score >= 30 ? 2 : 1;
    const attachments = [{ obj: "money/gold", count: valid_count(Math.floor(tier * 1000 * scale)) }, { obj: "money/pot", count: valid_count(Math.floor(tier * 100 * scale)) }, { obj: "money/shanhai_exp", count: valid_count(Math.floor(tier * 100 * scale)) }];
    if (!fraction && tier >= 2) attachments.push({ obj: "st/xuanjing", count: valid_count(tier * 2) });
    if (!fraction && tier >= 3) {
        attachments.push({ obj: "book/wudao", count: valid_count(tier * 2) }, { obj: "book/up", count: valid_count(tier) });
        if (allowRare && Math.random() < .10) attachments.push({ obj: "drug/shanhai_heart", count: 1 });
        const skillPath = allowRare && Math.random() < .25 ? this.public_skill_path() : null;
        if (skillPath) attachments.push({ obj: skillPath, count: 1 });
    }
    let valid = attachments.length <= 10;
    attachments.forEach(a => {
        if (!reward_path_allowed(a.obj) || a.count < 1 || a.count > REWARD_LIMIT) { valid = false; return; }
        try { const obj = OBJ.CREATE(a.obj, a.count); if (!obj || obj.no_get || obj.no_alloc) valid = false; } catch (err) { console.error("七灭奖励对象创建失败", a.obj, err && err.message || err); valid = false; }
    });
    return valid ? attachments : null;
};
this.deliver_mail = function (mailKey, row) {
    if (!row || row.status !== "pending" || !Array.isArray(row.attachments) || row.attachments.length > 10) return false;
    try {
        row.attachments.forEach(a => { if (!a || !reward_path_allowed(a.obj) || a.obj.indexOf("book/bc#") === 0 && !this.public_skill_path(a.obj) || !(a.count >= 1) || a.count > REWARD_LIMIT) throw new Error("奖励附件不在白名单"); const obj = OBJ.CREATE(a.obj, a.count); if (!obj || obj.no_get || obj.no_alloc) throw new Error("奖励对象不可用"); });
        if (typeof COMMAND === "undefined" || !COMMAND || !COMMAND.DO) throw new Error("COMMAND.DO不可用");
        COMMAND.DO("send", row.playerId, { from: "qimie_event", from_name: "七灭天劫", title: "七灭天劫讨伐奖励", summary: "七灭尊者结算奖励", content: "你在七灭天劫中的贡献奖励已送达。", attach: row.attachments, dedupe: "qimie:" + mailKey });
        row.status = "sent";
        row.sentAt = ts();
        return true;
    } catch (err) { console.error("七灭奖励邮件发送失败", mailKey, err && err.message || err); return false; }
};
this.issue_rewards = function (e) {
    if (!e || e.testing) return;
    const ledger = WORLD.DATA.query_temp(MAIL_KEY, {}) || {}, rows = [], date = e.day || day(ts()), settled = WORLD.DATA.query_temp(KEY, {}) || {};
    if (e.terminalReason === "success") this.award_snapshot(e).forEach(x => { if (x.eligible && x.accountId) rows.push({ accountId: x.accountId, playerId: x.playerId, score: x.score, eligible: true, reward: 1 }); });
    if (e.terminalReason === "timeout" || e.terminalReason === "empty" || e.terminalReason === "spawn_failed") {
        const best = {}, successful = {};
        Object.keys(settled).forEach(id => { const item = settled[id]; if (item && item.eventDate === date && item.status === "succeeded") (item.successAccounts || []).forEach(a => { successful[a] = true; }); });
        Object.keys(settled).forEach(id => { const item = settled[id]; if (!item || item.eventDate !== date || item.status !== "failed_final") return; Object.keys(item.participants || {}).forEach(pid => { const p = item.participants[pid], effective = (p.damage || 0) + (p.aspectDamage || 0), target = item.lockedCount > 0 ? item.bossMaxHp / item.lockedCount : item.bossMaxHp, score = Math.min(70, target > 0 ? effective / target * 70 : 0) + Math.min(30, Math.min(4, p.mechanics || 0) / 4 * 30); if (!p.accountId || successful[p.accountId] || (effective <= 0 && !(p.mechanics > 0)) || best[p.accountId] && best[p.accountId].score >= score) return; best[p.accountId] = { accountId: p.accountId, playerId: p.id, score: score, eligible: true, reward: .25 }; }); });
        Object.keys(best).forEach(a => rows.push(best[a]));
    }
    rows.forEach(x => {
        const mailKey = date + ":" + x.accountId, old = ledger[mailKey];
        if (old && old.status === "sent") return;
        const attachments = x.reward === 1 ? this.build_reward(x, 0, true) : old && old.attachments || this.build_reward(x, x.reward === .25 ? .25 : 0, false);
        if (!attachments) { console.error("七灭奖励对象校验失败", mailKey); return; }
        ledger[mailKey] = { status: "pending", eventDate: date, playerId: old && old.playerId || x.playerId, accountId: x.accountId, score: x.score, attachments: attachments, createdAt: old && old.createdAt || ts() };
        WORLD.DATA.set_temp(MAIL_KEY, ledger);
        this.deliver_mail(mailKey, ledger[mailKey]);
    });
    WORLD.DATA.set_temp(MAIL_KEY, ledger);
    save();
};
this.on_relogin = function (p) { if (!user(p)) return false; const dead = p.query_temp && p.query_temp("qimie_dead", 0); if (dead && p.temp && p.temp.qimie_dead && p.temp.qimie_dead.e) { p.qimieDeadUntil = p.temp.qimie_dead.e; this.schedule_dead_return(p); } const e = this.query_event(); if (!e) return !!dead; const x = e.participants[p.id]; if (!x || !x.locked) return !!dead; x.player = p; x.activeAt = p.qimieDeadUntil > ts() ? 0 : ts(); x.active = !(p.qimieDeadUntil > ts()); this.broadcast_state(); return true; };
this.test_start = function () { return this.start_rally(true); };
this.test_phase = function (phase) { const e = this.query_event(); if (!e || !e.testing) return false; if (!["rally", "normal", "side", "aspect", "vulnerability", "enrage", "terminal"].includes(phase)) return false; if (phase === "terminal") return this.terminal("aborted", false); if (phase === "normal" && !e.boss) { e.lockedCount = Math.max(1, e.lockedCount); e.multiplier = 1; e.bossMaxHp = e.bossHp = BASE_HP; if (!this.spawn_battle(e)) return false; } if (phase === "aspect" && !e.boss) return false; e.phase = phase; if (phase === "aspect" && !e.aspects.length) return this.spawn_aspects(); this.recount_boss(); this.broadcast_state(); return true; };
this.test_stop = function (confirm) { const e = this.query_event(); if (!e || !e.testing) return false; if (!confirm) { e.testStopToken = e.eventId + ":stop"; this.persist(); return "confirm"; } if (e.testStopToken !== e.eventId + ":stop") return false; e.testStopToken = ""; return this.terminal("aborted", false); };
const qimieSpawnBattle = this.spawn_battle;
this.spawn_battle = function (e) {
    const ok = qimieSpawnBattle.call(this, e);
    if (ok) this.start_boss_attack(e);
    return ok;
};
