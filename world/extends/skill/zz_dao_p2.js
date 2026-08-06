/* P2 道配置和通用战斗辅助。该文件按资源加载顺序位于 skill.js 之后。 */
const DAO_P2_WEAPONS = {
    sword: WEAPON_TYPE.SWORD,
    blade: WEAPON_TYPE.BLADE,
    staff: WEAPON_TYPE.STAFF,
    club: WEAPON_TYPE.CLUB,
    whip: WEAPON_TYPE.WHIP
};

function daoRank(me, baseId) {
    const skill = SKILL.get(baseId);
    return skill && skill.query_dao_rank ? skill.query_dao_rank(me) : 0;
}

function daoHasDownside(target) {
    if (!target) return false;
    if (target.is_busy || target.is_faint || target.is_miss || target.is_rash) return true;
    return Array.isArray(target.status) && target.status.some((item) => item && item.downside);
}

function daoStatus(target, definition, source, baseId) {
    if (!target || !target.add_status) return false;
    const status = Object.assign({ override: 2 }, definition);
    if (source && baseId === "unarmed" && daoRank(source, baseId) >= 5
        && (status.is_busy || status.is_faint || status.is_miss || status.is_rash)) {
        status.duration = Math.round(status.duration * 1.3);
    }
    return target.add_status(status, source);
}

function daoAttack(me, target, baseId, options) {
    options = options || {};
    if (!target || !me.do_attack) return 0;
    const par = Object.assign({
        target: target,
        dao_base_id: baseId,
        dao_affected: options.dao_affected !== false,
        dao_multiplier: options.multiplier || 100,
        no_weapon: baseId === "unarmed" || baseId === "force"
            || baseId === "dodge" || baseId === "parry",
        is_throwing: baseId === "throwing",
        attack_msg: options.attack_msg || ""
    }, options);
    return me.do_attack(par);
}

function daoEndAttack(me, target) {
    if (me.end_attack && target) me.end_attack(target);
}

function daoEnemies(me, target) {
    const result = [];
    const list = Array.isArray(me.enemy) ? me.enemy : [];
    for (const item of list) {
        if (!item || item === target || item.hp <= 0 || !item.is_living || !item.is_living()) continue;
        if (target && item.environment !== target.environment) continue;
        result.push(item);
        if (result.length >= 1) break;
    }
    return result;
}

function daoExtendCooldown(target, amount) {
    if (!target || !target.temp) return;
    for (const key in target.temp) {
        if (!key.startsWith("pfm/") || !target.temp[key] || !target.temp[key].e) continue;
        target.temp[key].e += amount;
    }
}

function daoPerform(baseId, key, definition) {
    const defaults = {
        id: baseId + "/dao." + key,
        pid: "dao." + key,
        enable_skill: baseId,
        auto_allowed: true,
        required_dao: 1,
        mp: 10,
        release_time: 800,
        distime: 15000
    };
    if (DAO_P2_WEAPONS[baseId]) defaults.weapon_type = DAO_P2_WEAPONS[baseId];
    return SKILL.create_dao_perform(baseId, key, Object.assign(defaults, definition));
}

function simpleAttack(baseId, key, name, multiplier, desc, options) {
    options = options || {};
    return daoPerform(baseId, key, {
        name: name,
        required_dao: options.required_dao || 1,
        mp: options.mp || 10,
        release_time: options.release_time || 800,
        distime: options.distime || 15000,
        use: function (me, target) {
            me.send_room(options.message || ("<hic>$N使出" + name + "攻向$n。</hic>"), target);
            const daoContext = {};
            const damage = daoAttack(me, target, baseId, Object.assign({
                multiplier: multiplier,
                dao_context: daoContext
            }, options.attack));
            if (damage > 0 && options.onHit) options.onHit(me, target, damage);
            daoEndAttack(me, target);
        },
        query_desc: function () { return desc; }
    });
}

// 道名和展示用被动说明，行为由下方统一钩子计算。
const DAO_PASSIVES = {
    force: {
        2: { id: "force_mp", desc: "自身释放绝招内力消耗降低10%" },
        4: { id: "force_recover_mp", desc: "被命中后5%概率恢复最大内力3%" },
        5: { id: "force_survive", desc: "受到致命伤害时保留1点气血，冷却120秒" }
    },
    dodge: {
        2: { id: "dodge_next_damage", desc: "躲闪成功后下一次攻击伤害增加15%" },
        4: { id: "dodge_speed", desc: "攻击间隔减少150毫秒，最低500毫秒" },
        5: { id: "dodge_absolute", desc: "受到攻击时10%概率完全闪避" }
    },
    parry: {
        2: { id: "parry_reflect", desc: "招架成功后反弹本次最终伤害15%" },
        4: { id: "parry_reduce", desc: "伤害减免增加5%" },
        5: { id: "parry_crit_reduce", desc: "被暴击时额外伤害减免15%" }
    },
    unarmed: {
        2: { id: "unarmed_busy", desc: "拳脚命中后3%概率使目标忙乱2秒" },
        4: { id: "unarmed_control_damage", desc: "忙乱或昏迷目标受到的拳脚伤害增加25%" },
        5: { id: "unarmed_control_time", desc: "本系统施加的控制持续时间增加30%" }
    },
    whip: {
        2: { id: "whip_attack_down", desc: "命中后5%概率使目标攻击降低5%，最多3层" },
        4: { id: "whip_cooldown", desc: "命中后使目标当前绝招冷却增加1秒" },
        5: { id: "whip_downside_damage", desc: "负面状态目标受到的鞭法伤害增加25%" }
    },
    throwing: {
        2: { id: "throwing_hit", desc: "命中增加5%" },
        4: { id: "throwing_crit", desc: "暴击增加5%" },
        5: { id: "throwing_ignore_dodge", desc: "忽视目标躲闪10%" }
    },
    staff: {
        2: { id: "staff_con", desc: "根骨百分比增加10%" },
        4: { id: "staff_hp", desc: "最大气血额外增加8%" },
        5: { id: "staff_convert", desc: "防御的10%转化为攻击" }
    },
    club: {
        2: { id: "club_parry_damage", desc: "命中正在招架的目标时伤害增加20%" },
        4: { id: "club_parry", desc: "招架增加8%，招架成功后使攻击者攻击降低10%" },
        5: { id: "club_no_parry_damage", desc: "不可招架目标受到的棍法伤害增加30%" }
    },
    blade: {
        2: { id: "blade_ignore_fy", desc: "忽视目标防御5%" },
        4: { id: "blade_fy_stack", desc: "命中后目标防御降低3%，最多5层" },
        5: { id: "blade_low_fy", desc: "目标防御低于自身攻击50%时伤害额外增加20%" }
    }
};

for (const baseId in DAO_PASSIVES) {
    const config = SKILL.DAO_CONFIG[baseId];
    if (!config) continue;
    config.passiveByRank = Object.assign(config.passiveByRank || {}, DAO_PASSIVES[baseId]);
}

SKILL.prototype.query_dao_hp_bonus = function (me) {
    let bonus = this.id === "force" ? this.query_dao_rank(me) * 5 : 0;
    if (this.id === "staff" && this.query_dao_rank(me) >= 4) bonus += 8;
    return bonus;
};

SKILL.prototype.query_dao_ds_bonus = function (me) {
    return this.id === "dodge" ? this.query_dao_rank(me) * 5 : 0;
};

SKILL.prototype.query_dao_fy_bonus = function (me) {
    return this.id === "parry" ? this.query_dao_rank(me) * 5 : 0;
};

SKILL.prototype.query_dao_gjsd_bonus = function (me) {
    return this.id === "dodge" && this.query_dao_rank(me) >= 4 ? 150 : 0;
};

SKILL.prototype.query_dao_expend_mp_bonus = function (me) {
    return this.id === "force" && this.query_dao_rank(me) >= 2 ? 10 : 0;
};

SKILL.prototype.query_dao_hit_bonus = function (me) {
    if (this.id !== "throwing") return 0;
    const rank = this.query_dao_rank(me);
    return (rank >= 2 ? 5 : 0) + (rank >= 5 ? 10 : 0);
};

SKILL.prototype.query_dao_con_bonus = function (me) {
    return this.id === "staff" && this.query_dao_rank(me) >= 2 ? 10 : 0;
};

SKILL.prototype.query_dao_zj_bonus = function (me) {
    return this.id === "club" && this.query_dao_rank(me) >= 4 ? 8 : 0;
};

SKILL.prototype.query_dao_crit_bonus = function (me) {
    if (this.id === "sword") return this.query_dao_rank(me) >= 2 ? 3 : 0;
    return this.id === "throwing" && this.query_dao_rank(me) >= 4 ? 5 : 0;
};

SKILL.prototype.query_dao_attack_context = function (me, target, par) {
    const rank = this.query_dao_rank(me);
    const context = { damageBonus: 0, diffFyPer: 0, hitBonus: 0, critMultiplier: 1 };
    if (!rank) return context;
    if (this.id === "blade") {
        if (rank >= 2) context.diffFyPer += 5;
        if (rank >= 5 && target && (target.fy || 0) < (me.gj || 0) * 0.5) context.damageBonus += 20;
    } else if (this.id === "unarmed" && rank >= 4 && target && (target.is_busy || target.is_faint)) {
        context.damageBonus += 25;
    } else if (this.id === "whip" && rank >= 5 && daoHasDownside(target)) {
        context.damageBonus += 25;
    } else if (this.id === "club") {
        if (rank >= 2 && par && par.is_parry) context.damageBonus += 20;
        if (rank >= 5 && target && target.query_temp && target.query_temp("dao/no_parry")) {
            context.damageBonus += 30;
        }
    }
    if (this.id === "staff" && rank >= 5) context.gjBonus = Math.floor((me.fy || 0) * 0.1);
    return context;
};

SKILL.prototype.query_dao_absolute_dodge = function (me, par) {
    par = par || {};
    return this.id === "dodge" && this.query_dao_rank(me) >= 5
        && !par.no_dodge && me.random(100) < 10;
};

SKILL.prototype.query_dao_control_immune = function (me) {
    return this.id === "dodge" && this.query_dao_rank(me) >= 3
        && me.query_temp && me.query_temp("dao/dodge/control_immune");
};

CHARACTER.prototype.query_dao_damage_reduction = function (from, par) {
    const skill = SKILL.get("parry");
    if (!skill) return 0;
    let reduction = skill.query_dao_rank(this) >= 4 ? 5 : 0;
    if (par && par.iscirt && skill.query_dao_rank(this) >= 5) reduction += 15;
    return reduction;
};

CHARACTER.prototype.query_dao_parry_reflect = function (attacker, par) {
    const skill = SKILL.get("parry");
    if (!skill || skill.query_dao_rank(this) < 2) return 0;
    let value = Math.floor(((par && par.dao_parry_final_damage) || attacker.gj || 0) * 0.15);
    if (this.query_temp && this.query_temp("dao/parry/counter")) {
        value = Math.floor((this.fy || 0) * 0.5);
    }
    return Math.max(0, value);
};

CHARACTER.prototype.on_dao_hit = function (target, par, damage) {
    if (!target || !(damage > 0)) return;
    const baseId = par && par.dao_base_id;
    const rank = daoRank(this, baseId);
    if (baseId === "unarmed" && rank >= 2 && this.random(100) < 3) {
        daoStatus(target, { id: "dao_unarmed_busy", name: "拳意忙乱", duration: 2000,
            is_busy: true, downside: true }, this, baseId);
    }
    if (baseId === "whip" && rank >= 2 && this.random(100) < 5) {
        daoStatus(target, { id: "dao_whip_attack_down", name: "鞭意压制", duration: 6000,
            prop: { gj_per: -5 }, downside: true, override: 1, max_count: 3 }, this, baseId);
    }
    if (baseId === "blade" && rank >= 4) {
        daoStatus(target, { id: "dao_blade_fy_stack", name: "刀意破防", duration: 6000,
            prop: { fy_per: -3 }, downside: true, override: 1, max_count: 5 }, this, baseId);
    }
    if (baseId === "whip" && rank >= 4
        && (!par || !par.dao_context || !par.dao_context.cooldownExtended)) {
        daoExtendCooldown(target, 1000);
        if (par && par.dao_context) par.dao_context.cooldownExtended = true;
    }
};

CHARACTER.prototype.on_dao_parry_success = function (attacker) {
    const skill = SKILL.get("club");
    if (!skill || skill.query_dao_rank(this) < 4 || !attacker) return;
    daoStatus(attacker, { id: "dao_club_parry_down", name: "棍意压制", duration: 4000,
        prop: { gj_per: -10 }, downside: true, override: 2 }, this, "club");
};

CHARACTER.prototype.on_dao_dodge = function () {
    const skill = SKILL.get("dodge");
    if (skill && skill.query_dao_rank(this) >= 2) {
        this.set_temp("dao/dodge/next_damage", 1, 30000);
    }
};

CHARACTER.prototype.query_dao_next_damage_bonus = function () {
    if (!this.query_temp || !this.query_temp("dao/dodge/next_damage")) return 0;
    this.remove_temp("dao/dodge/next_damage");
    return 15;
};

CHARACTER.prototype.query_dao_no_parry = function () {
    return this.query_temp && this.query_temp("dao/no_parry");
};

CHARACTER.prototype.query_dao_damage_taken = function (sh, from, par) {
    const reduction = this.query_dao_damage_reduction(from, par);
    if (reduction > 0) sh = sh * (100 - reduction) / 100;
    if (sh > 0 && daoRank(this, "force") >= 4 && this.random(100) < 5) {
        this.add_mp(Math.floor((this.max_mp || 0) * 0.03));
    }
    if (sh >= this.hp && this.query_temp && this.query_temp("dao/force/bumie")) {
        sh = Math.max(0, this.hp - 1);
    } else if (sh >= this.hp && this.query_temp && !this.query_temp("dao/force/fatal_cooldown")
        && daoRank(this, "force") >= 5) {
        this.set_temp("dao/force/fatal_cooldown", 1, 120000);
        sh = Math.max(0, this.hp - 1);
    }
    return sh;
};

function registerP2Performs() {
    const C = SKILL.DAO_CONFIG;
    C.force.performByRank[1] = [daoPerform("force", "naying", {
        name: "纳元", required_dao: 1, use_type: 0,
        use: function (me) {
            me.do_recover(Math.floor(me.max_hp * 0.15));
            me.clear_downside && me.clear_downside(true);
        }, query_desc: function () { return "恢复最大气血15%，清除1个可清除负面状态。"; }
    })];
    C.force.performByRank[3] = [daoPerform("force", "guizhen", {
        name: "归真", required_dao: 3, use_type: 0,
        use: function (me) {
            me.do_recover(Math.floor(me.max_hp * 0.25));
            daoStatus(me, { id: "dao_force_guizhen", name: "归真回元", duration: 1000,
                duration_count: 10, on_interval: function (user) {
                    user.do_recover(Math.floor(user.max_hp * 0.03));
                } }, me, "force");
        }, query_desc: function () { return "恢复最大气血25%，随后10秒内每秒恢复最大气血3%。"; }
    })];
    C.force.performByRank[5] = [daoPerform("force", "bumie", {
        name: "不灭", required_dao: 5, use_type: 0, distime: 30000,
        use: function (me) {
            daoStatus(me, { id: "dao_force_bumie", name: "不灭", duration: 8000,
                on_attach: function (user) { user.set_temp("dao/force/bumie", 1, 8000); },
                on_expire: function (user) {
                    user.remove_temp("dao/force/bumie");
                    user.do_recover(Math.floor(user.max_hp * 0.3));
                } }, me, "force");
        }, query_desc: function () { return "8秒内不会因伤害死亡，结束时恢复最大气血30%。"; }
    })];

    C.dodge.performByRank[1] = [daoPerform("dodge", "lueying", {
        name: "掠影", required_dao: 1, use: function (me) {
            daoStatus(me, { id: "dao_dodge_lueying", name: "掠影", duration: 8000,
                prop: { ds: 1500 } }, me, "dodge");
        }, query_desc: function () { return "8秒内躲闪增加1500。"; }
    })];
    C.dodge.performByRank[3] = [daoPerform("dodge", "tafeng", {
        name: "踏风", required_dao: 3, use: function (me) {
            me.remove_status("busy", true);
            me.remove_status("dao_unarmed_busy", true);
            if (me.remvoe_statuses) {
                me.remvoe_statuses(function (item) {
                    return item && typeof item.id === "string"
                        && item.id.indexOf("dao_") === 0
                        && (item.is_busy || item.is_faint || item.is_miss || item.is_rash);
                });
            }
            daoStatus(me, { id: "dao_dodge_tafeng", name: "踏风", duration: 8000,
                on_attach: function (user) { user.set_temp("dao/dodge/control_immune", 1, 8000); },
                on_expire: function (user) { user.remove_temp("dao/dodge/control_immune"); },
                ig_control: true }, me, "dodge");
        }, query_desc: function () { return "解除自身忙乱和定身，8秒内免疫本系统控制。"; }
    })];
    C.dodge.performByRank[5] = [daoPerform("dodge", "wuhen", {
        name: "无痕", required_dao: 5, use: function (me) {
            daoStatus(me, { id: "dao_dodge_wuhen", name: "无痕", duration: 5000,
                on_attach: function (user) { user.set_temp("dao/dodge/absolute", 1, 5000); },
                on_expire: function (user) { user.remove_temp("dao/dodge/absolute"); } }, me, "dodge");
        }, query_desc: function () { return "5秒内绝对闪避。"; }
    })];

    C.parry.performByRank[1] = [daoPerform("parry", "tiebi", {
        name: "铁壁", required_dao: 1,
        use: function (me) {
            daoStatus(me, { id: "dao_parry_tiebi", name: "铁壁", duration: 10000,
                prop: { fy: 2000, zj: 1000 } }, me, "parry");
        }, query_desc: function () { return "10秒内防御增加2000、招架增加1000。"; }
    })];
    C.parry.performByRank[3] = [daoPerform("parry", "fanzhen", {
        name: "反震", required_dao: 3,
        use: function (me) { me.set_temp("dao/parry/counter", 1, 8000); },
        query_desc: function () { return "8秒内招架成功时，对攻击者造成自身防御50%的伤害。"; }
    })];
    C.parry.performByRank[5] = [daoPerform("parry", "bupo", {
        name: "不破", required_dao: 5,
        use: function (me) { daoStatus(me, { id: "dao_parry_bupo", name: "不破", duration: 6000,
            prop: { diff_sh_per: 40 } }, me, "parry"); },
        query_desc: function () { return "6秒内伤害减免增加40%。"; }
    })];

    C.unarmed.performByRank[1] = [simpleAttack("unarmed", "bengshan", "崩山", 150, "造成150%攻击伤害，目标忙乱3秒。", {
        required_dao: 1, attack: { no_weapon: true }, onHit: function (me, target) {
            daoStatus(target, { id: "dao_unarmed_bengshan", name: "崩山劲", duration: 3000,
                is_busy: true, downside: true }, me, "unarmed");
        }
    })];
    C.unarmed.performByRank[3] = [simpleAttack("unarmed", "suixu", "碎虚", 180, "造成180%攻击伤害，目标昏迷4秒。", {
        required_dao: 3, attack: { no_weapon: true }, onHit: function (me, target) {
            daoStatus(target, { id: "dao_unarmed_suixu", name: "碎虚", duration: 4000,
                is_faint: true, downside: true }, me, "unarmed");
        }
    })];
    C.unarmed.performByRank[5] = [simpleAttack("unarmed", "qinlong", "擒龙", 250, "造成250%攻击伤害，目标7秒内不可移动、不可闪避。", {
        required_dao: 5, attack: { no_weapon: true }, onHit: function (me, target) {
            daoStatus(target, { id: "dao_unarmed_qinlong", name: "擒龙", duration: 7000,
                is_rash: true, downside: true }, me, "unarmed");
        }
    })];

    C.whip.performByRank[1] = [simpleAttack("whip", "chansi", "缠丝", 120, "造成120%攻击伤害，目标躲闪降低800，持续6秒。", {
        required_dao: 1, onHit: function (me, target) {
            daoStatus(target, { id: "dao_whip_chansi", name: "缠丝", duration: 6000,
                prop: { ds: -800 }, downside: true }, me, "whip");
        }
    })];
    C.whip.performByRank[3] = [simpleAttack("whip", "suohou", "锁喉", 150, "造成150%攻击伤害，目标4秒内不可释放绝招。", {
        required_dao: 3, onHit: function (me, target) {
            daoStatus(target, { id: "dao_whip_suohou", name: "锁喉", duration: 4000,
                prop: { no_pfm: 1 }, downside: true }, me, "whip");
        }
    })];
    C.whip.performByRank[5] = [simpleAttack("whip", "fulong", "缚龙", 200, "造成200%攻击伤害，目标定身5秒、防御降低20%。", {
        required_dao: 5, onHit: function (me, target) {
            daoStatus(target, { id: "dao_whip_fulong", name: "缚龙", duration: 5000,
                is_rash: true, prop: { fy_per: -20 }, downside: true }, me, "whip");
        }
    })];

    C.throwing.performByRank[1] = [simpleAttack("throwing", "zhuihun", "追魂", 130, "造成130%攻击伤害，本次攻击命中判定增加30%。", {
        required_dao: 1, attack: { dao_hit_bonus: 30 }
    })];
    C.throwing.performByRank[3] = [daoPerform("throwing", "liuxing", {
        name: "流星", required_dao: 3, use: function (me, target) {
            const daoContext = {};
            for (let i = 0; i < 3 && target && target.hp > 0; i++) {
                daoAttack(me, target, "throwing", {
                    multiplier: 110, dao_hit_bonus: 0, dao_context: daoContext
                });
            }
            daoEndAttack(me, target);
        }, query_desc: function () { return "连续攻击3次，每次110%攻击伤害；目标死亡后停止。"; }
    })];
    C.throwing.performByRank[5] = [simpleAttack("throwing", "tianluo", "天罗", 200, "造成200%攻击伤害，本次攻击不可躲闪，暴击率翻倍。", {
        required_dao: 5, attack: { no_dodge: true, dao_crit_multiplier: 2 }
    })];

    C.staff.performByRank[1] = [simpleAttack("staff", "pozhang", "破障", 150, "造成150%攻击伤害，忽视目标防御30%。", {
        required_dao: 1, attack: { diff_fy: 30 }
    })];
    C.staff.performByRank[3] = [simpleAttack("staff", "zhenyue", "镇岳", 180, "造成180%攻击伤害，命中后自身防御增加1000，持续8秒。", {
        required_dao: 3, onHit: function (me) {
            daoStatus(me, { id: "dao_staff_zhenyue", name: "镇岳", duration: 8000,
                prop: { fy: 1000 } }, me, "staff");
        }
    })];
    C.staff.performByRank[5] = [simpleAttack("staff", "wanxiang", "万象", 200, "造成200%攻击伤害，实际伤害的20%转化为自身气血。", {
        required_dao: 5, onHit: function (me, target, damage) {
            me.do_recover(Math.floor(damage * 0.2));
        }
    })];

    C.club.performByRank[1] = [simpleAttack("club", "dianxue", "点穴", 130, "造成130%攻击伤害，目标忙乱4秒。", {
        required_dao: 1, onHit: function (me, target) {
            daoStatus(target, { id: "dao_club_dianxue", name: "点穴", duration: 4000,
                is_busy: true, downside: true }, me, "club");
        }
    })];
    C.club.performByRank[3] = [simpleAttack("club", "fenggun", "封棍", 150, "造成150%攻击伤害，卸除目标当前兵器。", {
        required_dao: 3, onHit: function (me, target) {
            const weapon = target.get_equipment && target.get_equipment(EQUIP_TYPE.WEAPON);
            if (weapon && target.unequip) target.unequip(weapon, true);
        }
    })];
    C.club.performByRank[5] = [simpleAttack("club", "pozhen", "破阵", 250, "造成250%攻击伤害，目标8秒内不可招架，防御降低15%。", {
        required_dao: 5, attack: { no_parry: true }, onHit: function (me, target) {
            daoStatus(target, { id: "dao_club_pozhen", name: "破阵", duration: 8000,
                prop: { fy_per: -15 }, downside: true,
                on_attach: function (user) { user.set_temp("dao/no_parry", 1, 8000); },
                on_expire: function (user) { user.remove_temp("dao/no_parry"); } }, me, "club");
        }
    })];

    C.blade.performByRank[1] = [simpleAttack("blade", "zhantie", "斩铁", 140, "造成140%攻击伤害，目标防御降低500，持续6秒。", {
        required_dao: 1, onHit: function (me, target) {
            daoStatus(target, { id: "dao_blade_zhantie", name: "斩铁", duration: 6000,
                prop: { fy: -500 }, downside: true }, me, "blade");
        }
    })];
    C.blade.performByRank[3] = [daoPerform("blade", "duanyue", {
        name: "断岳", required_dao: 3, use: function (me, target) {
            daoAttack(me, target, "blade", { multiplier: 180 });
            for (const enemy of daoEnemies(me, target)) daoAttack(me, enemy, "blade", { multiplier: 180 });
            daoEndAttack(me, target);
        }, query_desc: function () { return "对目标及其周围1个有效敌人造成180%攻击伤害。"; }
    })];
    C.blade.performByRank[5] = [simpleAttack("blade", "lietian", "裂天", 250, "造成250%攻击伤害，目标5秒内不可招架。", {
        required_dao: 5, attack: { no_parry: true }, onHit: function (me, target) {
            daoStatus(target, { id: "dao_blade_lietian", name: "裂天", duration: 5000,
                downside: true, on_attach: function (user) { user.set_temp("dao/no_parry", 1, 5000); },
                on_expire: function (user) { user.remove_temp("dao/no_parry"); } }, me, "blade");
        }
    })];
}

registerP2Performs();
