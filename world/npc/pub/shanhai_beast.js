this.inherits(NPC);
this.set({
    name: "<hio>山海异兽</hio>",
    title: "山海异兽",
    desc: "它从山海异境中闯入江湖，周身气机驳杂，所使武学难以预料。",
    gender: 1,
    age: 100,
    str: 20,
    con: 20,
    dex: 20,
    int: 20,
    hp: 1000,
    max_hp: 1000,
    mp: 500,
    max_mp: 500
});

this.family = FAMILIES.MONSTER;
this.is_shanhai_beast = true;
this.no_refresh = true;
this.record_damage = true;

this.record_shanhai_damage = function (from, damage) {
    if (!(damage > 0) || !from) return;
    let player = from.is_player ? from : null;
    let playerId = player && player.id;
    let playerName = player && player.name;
    if (!playerId && from.master) {
        player = WORLD.getUser(from.master);
        playerId = from.master;
        playerName = player ? player.name : from.master_name;
    }
    if (!playerId) return;
    if (!this.damages) this.damages = {};
    if (!this.damage_names) this.damage_names = {};
    this.damages[playerId] = (this.damages[playerId] || 0) + damage;
    this.sum_damages = (this.sum_damages || 0) + damage;
    if (playerName) this.damage_names[playerId] = playerName;
};

this.damage = function (damage, from, diffFy) {
    const beforeHp = this.hp;
    const shouldRecord = this.record_damage;
    this.record_damage = false;
    let result;
    try {
        result = CHARACTER.prototype.damage.call(this, damage, from, diffFy);
    } finally {
        this.record_damage = shouldRecord;
    }
    if (shouldRecord) this.record_shanhai_damage(from, Math.max(0, beforeHp - this.hp));
    return result;
};

this.damage2 = function (damage, from) {
    const beforeHp = this.hp;
    const shouldRecord = this.record_damage;
    this.record_damage = false;
    let result;
    try {
        result = CHARACTER.prototype.damage2.call(this, damage, from);
    } finally {
        this.record_damage = shouldRecord;
    }
    if (shouldRecord) this.record_shanhai_damage(from, Math.max(0, beforeHp - this.hp));
    return result;
};

this.add_auto_pfm = function (pfm, baseSkill, level, isRef) {
    if (!pfm || typeof pfm.use !== "function" || pfm.use_type === 1) return;
    if (pfm.weapon_type && pfm.weapon_type !== this.query_weapon_type()) return;
    try {
        CHARACTER.prototype.add_auto_pfm.call(this, pfm, baseSkill, level, isRef);
    } catch (error) {
        console.error("山海异兽跳过不兼容绝招", pfm.name || pfm.pid, error.message);
    }
};

this.check_pfms = function (target) {
    if (!this.auto_skills) this.init_pfms();
    if (!this.auto_skills || !this.auto_skills.length) return false;

    this.attack_count = this.attack_count || this.pfm_rate || 3;
    if (this.random(this.attack_count) !== 0) {
        this.attack_count--;
        return false;
    }
    this.attack_count = this.pfm_rate || 3;

    const now = Date.now();
    const available = [];
    for (let i = 0; i < this.auto_skills.length; i++) {
        const item = this.auto_skills[i];
        if (!item || item.ban_use || !item.pfm) continue;
        if (this.is_busy && !item.pfm.allow_busy) continue;
        if (item.release_time && item.release_time > now) continue;
        try {
            if (item.pfm.check && item.pfm.check(this, item.level, item.type) === false) continue;
            if (item.pfm.query_mp(this, item.level) > this.mp) continue;
            available.push(item);
        } catch (error) {
            item.ban_use = true;
            console.error("山海异兽禁用异常绝招", item.pfm.name || item.pfm.pid, error.message);
        }
    }
    if (!available.length) return false;

    const skill = available[this.random(available.length)];
    try {
        if (!this.use_pfm(target, skill.pfm, skill.level, skill.type)) return false;
        let releaseTime = skill.pfm.query_releasetime(this, skill.level);
        releaseTime = releaseTime > 0 ? releaseTime : 0;
        this.release_time = releaseTime ? now + releaseTime : 0;
        skill.release_time = now
            + skill.pfm.query_distime(this, skill.level, skill.is_ref)
            + releaseTime;
        return this.release_time > 0 || target.hp <= 0;
    } catch (error) {
        skill.ban_use = true;
        console.error("山海异兽释放绝招失败", skill.pfm.name || skill.pfm.pid, error.stack || error.message);
        return false;
    }
};
