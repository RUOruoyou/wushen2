const SKILL_GRADE_COLORS = ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
const MAX_SKILL_GRADE = SKILL_GRADE_COLORS.length - 1;
const COMMON_SLOT_START = 1000;
const PROGRESSION_COSTS = [0, 0, 10, 30, 50, 100, 200];
const PROGRESSION_BASE_BONUS_PER_STEP = 5;
const PROGRESSION_BASE_PROP_KEYS = new Set([
    "gj",
    "fy",
    "mz",
    "zj",
    "ds",
    "max_hp",
    "limit_mp"
]);

const DAO_BASE_IDS = [
    "force", "dodge", "parry", "sword", "unarmed",
    "whip", "throwing", "staff", "club", "blade"
];
const DAO_CONFIG = {
    force: {
        displayName: "气道",
        rankNames: ["基本内功", "气道·初悟", "气道·通明", "气道·归一", "气道·无相", "气道·真解"]
    },
    dodge: {
        displayName: "身道",
        rankNames: ["基本轻功", "身道·初悟", "身道·通明", "身道·归一", "身道·无相", "身道·真解"]
    },
    parry: {
        displayName: "御道",
        rankNames: ["基本招架", "御道·初悟", "御道·通明", "御道·归一", "御道·无相", "御道·真解"]
    },
    sword: {
        displayName: "剑道",
        rankNames: ["基本剑法", "剑道·初悟", "剑道·通明", "剑道·归一", "剑道·无相", "剑道·真解"]
    },
    unarmed: {
        displayName: "拳道",
        rankNames: ["基本拳脚", "拳道·初悟", "拳道·通明", "拳道·归一", "拳道·无相", "拳道·真解"]
    },
    whip: {
        displayName: "鞭道",
        rankNames: ["基本鞭法", "鞭道·初悟", "鞭道·通明", "鞭道·归一", "鞭道·无相", "鞭道·真解"]
    },
    throwing: {
        displayName: "器道",
        rankNames: ["基本暗器", "器道·初悟", "器道·通明", "器道·归一", "器道·无相", "器道·真解"]
    },
    staff: {
        displayName: "杖道",
        rankNames: ["基本杖法", "杖道·初悟", "杖道·通明", "杖道·归一", "杖道·无相", "杖道·真解"]
    },
    club: {
        displayName: "棍道",
        rankNames: ["基本棍法", "棍道·初悟", "棍道·通明", "棍道·归一", "棍道·无相", "棍道·真解"]
    },
    blade: {
        displayName: "刀道",
        rankNames: ["基本刀法", "刀道·初悟", "刀道·通明", "刀道·归一", "刀道·无相", "刀道·真解"]
    }
};
const DAO_REQUIRED_LEVEL = [0, 1000, 1500, 2000, 2500, 3000];
const DAO_COSTS = [0, 1, 10, 20, 50, 100];
const DAO_LEVEL_BONUS = [0, 200, 400, 600, 800, 1000];
const DAO_INVALID_ITEMS = new WeakSet();

for (const skillId of DAO_BASE_IDS) {
    const config = DAO_CONFIG[skillId];
    config.requiredLevel = DAO_REQUIRED_LEVEL;
    config.cost = DAO_COSTS;
    config.levelBonus = DAO_LEVEL_BONUS;
    config.damageBonusByRank = [0, 5, 10, 15, 20, 25];
    config.passiveByRank = config.passiveByRank || {};
    config.performByRank = config.performByRank || {};
}

DAO_CONFIG.sword.passiveByRank[2] = {
    id: "sword_crit",
    desc: "剑法暴击增加3%"
};
DAO_CONFIG.sword.passiveByRank[4] = {
    id: "sword_crit_damage",
    desc: "剑法暴击伤害增加10%"
};

function createDaoPerform(skillId, key, definition) {
    const perform = Object.assign({
        id: skillId + "/dao." + key,
        pid: "dao." + key,
        enable_skill: skillId,
        is_weapon: true,
        auto_allowed: true,
        required_dao: 1
    }, definition);
    Object.setPrototypeOf(perform, PERFORM.prototype);
    return perform;
}

DAO_CONFIG.sword.performByRank[1] = [createDaoPerform("sword", "pofeng", {
    name: "破锋",
    mp: 8,
    release_time: 800,
    distime: 12000,
    weapon_type: WEAPON_TYPE.SWORD,
    required_dao: 1,
    use: function (me, target) {
        me.send_room("<hic>$N剑锋一转，使出破锋直刺$n。</hic>", target);
        me.do_attack({
            target: target,
            dao_base_id: "sword",
            dao_multiplier: 125,
            diff_fy: 20,
            attack_msg: ""
        });
        me.end_attack(target);
    },
    query_desc: function () {
        return "造成125%攻击伤害，忽视目标20%防御。";
    }
})];

DAO_CONFIG.sword.performByRank[3] = [createDaoPerform("sword", "lingxu", {
    name: "凌虚",
    mp: 12,
    release_time: 900,
    distime: 18000,
    weapon_type: WEAPON_TYPE.SWORD,
    required_dao: 3,
    use: function (me, target) {
        me.send_room("<hiy>$N身随剑走，一式凌虚攻向$n。</hiy>", target);
        const damage = me.do_attack({
            target: target,
            dao_base_id: "sword",
            dao_multiplier: 200,
            attack_msg: ""
        });
        if (damage > 0) {
            me.add_status({
                id: "dao_sword_lingxu",
                name: "凌虚",
                desc: "躲闪增加800",
                duration: 8000,
                override: 2,
                prop: { ds: 800 }
            }, me);
        }
        me.end_attack(target);
    },
    query_desc: function () {
        return "造成200%攻击伤害，命中后自身躲闪增加800，持续8秒。";
    }
})];

DAO_CONFIG.sword.performByRank[5] = [createDaoPerform("sword", "zhenjie", {
    name: "真解",
    mp: 18,
    release_time: 1000,
    distime: 24000,
    weapon_type: WEAPON_TYPE.SWORD,
    required_dao: 5,
    use: function (me, target) {
        me.send_room("<hio>$N剑意归真，剑光化作一线斩向$n。</hio>", target);
        me.do_attack({
            target: target,
            dao_base_id: "sword",
            dao_multiplier: 300,
            no_dodge: true,
            no_parry: true,
            attack_msg: ""
        });
        me.end_attack(target);
    },
    query_desc: function () {
        return "造成300%攻击伤害，本次攻击不可被招架或躲闪。";
    }
})];

SKILL.MAX_GRADE = MAX_SKILL_GRADE;
SKILL.COMMON_SLOT_START = COMMON_SLOT_START;
SKILL.PROGRESSION_COSTS = PROGRESSION_COSTS;
SKILL.PROGRESSION_BASE_BONUS_PER_STEP = PROGRESSION_BASE_BONUS_PER_STEP;
SKILL.DAO_BASE_IDS = DAO_BASE_IDS;
SKILL.DAO_CONFIG = DAO_CONFIG;
SKILL.create_dao_perform = createDaoPerform;
SKILL.DAO_REQUIRED_LEVEL = DAO_REQUIRED_LEVEL;
SKILL.DAO_COSTS = DAO_COSTS;
SKILL.DAO_LEVEL_BONUS = DAO_LEVEL_BONUS;
SKILL.COMMON_SLOTS = [
    {
        name: "刚劲",
        prop: "gj",
        value: function (lv, grade) {
            return Math.max(5, parseInt(lv * (grade + 1) / 80));
        },
        format: function (val) {
            return "攻击增加" + val;
        }
    },
    {
        name: "铁壁",
        prop: "fy",
        value: function (lv, grade) {
            return Math.max(5, parseInt(lv * (grade + 1) / 80));
        },
        format: function (val) {
            return "防御增加" + val;
        }
    },
    {
        name: "洞察",
        prop: "mz",
        value: function (lv, grade) {
            return Math.max(5, parseInt(lv * (grade + 1) / 100));
        },
        format: function (val) {
            return "命中增加" + val;
        }
    },
    {
        name: "灵动",
        prop: "ds",
        value: function (lv, grade) {
            return Math.max(5, parseInt(lv * (grade + 1) / 100));
        },
        format: function (val) {
            return "躲闪增加" + val;
        }
    },
    {
        name: "化势",
        prop: "zj",
        value: function (lv, grade) {
            return Math.max(5, parseInt(lv * (grade + 1) / 100));
        },
        format: function (val) {
            return "招架增加" + val;
        }
    },
    {
        name: "养生",
        prop: "max_hp",
        value: function (lv, grade) {
            return Math.max(100, parseInt(lv * (grade + 1)));
        },
        format: function (val) {
            return "气血增加" + val;
        }
    },
    {
        name: "纳气",
        prop: "limit_mp",
        value: function (lv, grade) {
            return Math.max(300, parseInt(lv * (grade + 1) * 3));
        },
        format: function (val) {
            return "内力上限增加" + val;
        }
    },
    {
        name: "会心",
        prop: "bj_per",
        value: function (lv, grade) {
            return 1 + parseInt(grade / 3) + parseInt(lv / 2000);
        },
        format: function (val) {
            return "暴击增加" + val + "%";
        }
    },
    {
        name: "破罡",
        prop: "diff_fy_per",
        value: function (lv, grade) {
            return 1 + parseInt(grade / 3) + parseInt(lv / 2500);
        },
        format: function (val) {
            return "忽视防御增加" + val + "%";
        }
    },
    {
        name: "护体",
        prop: "diff_sh_per",
        value: function (lv, grade) {
            return 1 + parseInt(grade / 4) + parseInt(lv / 3000);
        },
        format: function (val) {
            return "伤害减免增加" + val + "%";
        }
    }
];

function queryDaoConfig(skillId) {
    return DAO_CONFIG[skillId] || null;
}

function normalizeDao(skillId, skillItem) {
    if (!skillItem || !queryDaoConfig(skillId)) return 0;
    if (skillItem.dao === undefined || skillItem.dao === null) return 0;
    const value = Number(skillItem.dao);
    if (Number.isInteger(value) && value >= 0 && value <= 5) return value;
    if (!DAO_INVALID_ITEMS.has(skillItem)) {
        DAO_INVALID_ITEMS.add(skillItem);
        console.warn("技能道阶字段异常，按0处理", skillId, skillItem.dao);
    }
    return 0;
}

SKILL.prototype.query_dao_config = function () {
    return queryDaoConfig(this.id);
};

SKILL.prototype.query_dao_rank = function (me) {
    if (!me || !me.is_player || !me.skills || this.type !== SKILL_TYPES.BASE) return 0;
    return normalizeDao(this.id, me.skills[this.id]);
};

SKILL.prototype.query_dao_name = function (me, rank) {
    const config = this.query_dao_config();
    if (!config) return this.name;
    if (rank === undefined) rank = this.query_dao_rank(me);
    rank = Number.isInteger(rank) && rank >= 0 && rank <= 5 ? rank : 0;
    return config.rankNames[rank] || this.name;
};

SKILL.prototype.query_dao_next = function (me) {
    const config = this.query_dao_config();
    const rank = this.query_dao_rank(me);
    if (!config || rank >= 5) return null;
    const nextRank = rank + 1;
    return {
        rank: nextRank,
        name: config.rankNames[nextRank],
        requiredLevel: config.requiredLevel[nextRank],
        cost: config.cost[nextRank],
        levelBonus: config.levelBonus[nextRank]
    };
};

SKILL.prototype.query_dao_level_limit = function (me) {
    if (!me || !this.query_dao_config()) return me ? me.skill_limit() : 0;
    return me.skill_limit() + this.query_dao_rank(me) * 200;
};

SKILL.prototype.query_dao_damage_bonus = function (me) {
    const config = this.query_dao_config();
    const rank = this.query_dao_rank(me);
    if (!config || !config.damageBonusByRank) return 0;
    return config.damageBonusByRank[rank] || 0;
};

SKILL.prototype.query_dao_crit_bonus = function (me) {
    if (this.id !== "sword") return 0;
    return this.query_dao_rank(me) >= 2 ? 3 : 0;
};

SKILL.prototype.query_dao_crit_damage_bonus = function (me) {
    if (this.id !== "sword") return 0;
    return this.query_dao_rank(me) >= 4 ? 10 : 0;
};

SKILL.prototype.can_dao = function (me) {
    if (!me || !me.is_player || !me.skills || this.type !== SKILL_TYPES.BASE) return false;
    const skillItem = me.skills[this.id];
    const next = this.query_dao_next(me);
    if (!skillItem || !next) return false;
    return skillItem.level >= next.requiredLevel;
};

SKILL.prototype.query_dao_passives = function (me) {
    const config = this.query_dao_config();
    const rank = this.query_dao_rank(me);
    if (!config || !config.passiveByRank) return [];
    const passives = [];
    for (let index = 1; index <= rank; index++) {
        if (config.passiveByRank[index]) passives.push(config.passiveByRank[index]);
    }
    return passives;
};

SKILL.prototype.query_dao_performs = function (me) {
    const config = this.query_dao_config();
    const rank = this.query_dao_rank(me);
    if (!config || !config.performByRank) return [];
    const performs = [];
    for (let index = 1; index <= rank; index++) {
        const rankPerforms = config.performByRank[index] || [];
        for (const perform of rankPerforms) performs.push(perform);
    }
    return performs;
};

SKILL.prototype.get_dao_pfm = function (pid, me) {
    const performs = this.query_dao_performs(me);
    for (const perform of performs) {
        if (perform.pid === pid || perform.id === pid) return perform;
    }
    return null;
};

CHARACTER.prototype.query_skill_limit = function (skillId) {
    const limit = this.skill_limit();
    const skill = SKILL.get(skillId);
    if (!skill || !skill.query_dao_config || !skill.query_dao_config()) return limit;
    return skill.query_dao_level_limit(this);
};

SKILL.prototype.query_grade = function (me) {
    const skillItem = me && me.skills ? me.skills[this.id] : null;
    let grade = this.grade || 0;
    if (skillItem) {
        if (Array.isArray(skillItem.addin)) grade += skillItem.addin.length;
        if (skillItem.ref) grade++;
    }
    return Math.max(0, Math.min(MAX_SKILL_GRADE, grade));
};

SKILL.prototype.query_dao_color_grade = function (me) {
    const grade = this.query_grade(me);
    if (!this.query_dao_config()) return grade;
    return Math.max(grade, this.query_dao_rank(me));
};

SKILL.prototype.query_progression_steps = function (me) {
    if (this.type !== SKILL_TYPES.SKILL || !me || !me.skills) return 0;
    const skillItem = me.skills[this.id];
    if (!skillItem || !Array.isArray(skillItem.addin)) return 0;
    return Math.min(5, skillItem.addin.length);
};

SKILL.prototype.query_progression_base_bonus = function (me) {
    return this.query_progression_steps(me) * PROGRESSION_BASE_BONUS_PER_STEP;
};

SKILL.prototype.apply_progression_base_bonus = function (prop, me) {
    const bonus = this.query_progression_base_bonus(me);
    if (!prop || !bonus) return prop;

    const result = {};
    const multiplier = 100 + bonus;
    for (const enableType in prop) {
        const enableProp = prop[enableType];
        if (!enableProp || typeof enableProp !== "object" || Array.isArray(enableProp)) {
            result[enableType] = enableProp;
            continue;
        }

        const scaledProp = {};
        for (const key in enableProp) {
            const value = enableProp[key];
            if (PROGRESSION_BASE_PROP_KEYS.has(key)
                && typeof value === "number" && Number.isFinite(value) && value > 0) {
                scaledProp[key] = Math.floor(value * multiplier / 100);
            } else {
                scaledProp[key] = value;
            }
        }
        result[enableType] = scaledProp;
    }
    return result;
};

SKILL.prototype.wrap_progression_base_prop = function () {
    const queryEnableProp = this.query_enable_prop;
    if (typeof queryEnableProp !== "function" || queryEnableProp.isProgressionBaseWrapper) return;

    const wrappedQueryEnableProp = function (lv, me) {
        const prop = queryEnableProp.call(this, lv, me);
        return this.apply_progression_base_bonus(prop, me);
    };
    wrappedQueryEnableProp.isProgressionBaseWrapper = true;
    this.query_enable_prop = wrappedQueryEnableProp;
};

if (!SKILL.PROGRESSION_BASE_UPDATE) {
    SKILL.PROGRESSION_BASE_UPDATE = SKILL.prototype.update;
}
SKILL.prototype.update = function (fname) {
    this.wrap_progression_base_prop();
    return SKILL.PROGRESSION_BASE_UPDATE.call(this, fname);
};

SKILL.prototype.enable = function (me, type) {
    if (!this.can_enables || !this.can_enables.contain(type)) return false;
    if (this.on_enable && this.on_enable(me, type) === false) return false;
    const lv = me.query_skill(this.id);
    let prop = this.query_enable_prop(lv, me);
    if (prop && prop[type]) me.change_prop(prop[type], true);

    prop = this.query_addin_prop(me, lv);
    if (prop && !this.is_enable(me)) me.change_prop(prop, true);
    return true;
};

SKILL.prototype.disenable = function (me, type) {
    if (this.on_disenable) this.on_disenable(me, type);
    const lv = me.query_skill(this.id);
    let prop = this.query_enable_prop(lv, me);
    if (prop && prop[type]) me.change_prop(prop[type], false);

    prop = this.query_addin_prop(me, lv);
    if (prop && !this.is_enable(me)) me.change_prop(prop, false);
    return true;
};

if (!SKILL.DAO_QUERY_COLOR_NAME) {
    SKILL.DAO_QUERY_COLOR_NAME = SKILL.prototype.query_color_name;
}
SKILL.prototype.query_color_name = function (me) {
    const daoName = this.query_dao_name(me);
    if (daoName === this.name && !this.query_dao_config()) return SKILL.DAO_QUERY_COLOR_NAME.call(this, me);
    const grade = Math.max(0, Math.min(SKILL_GRADE_COLORS.length - 1, this.query_dao_color_grade(me)));
    return "<" + SKILL_GRADE_COLORS[grade] + ">" + daoName + "</" + SKILL_GRADE_COLORS[grade] + ">";
};

if (!SKILL.PROGRESSION_BASE_QUERY_DESC) {
    SKILL.PROGRESSION_BASE_QUERY_DESC = SKILL.prototype.query_desc;
}
SKILL.prototype.query_desc = function (me, lv) {
    let desc = SKILL.PROGRESSION_BASE_QUERY_DESC.call(this, me, lv);
    const daoName = this.query_dao_name(me);
    if (daoName !== this.name) {
        const oldGrade = Math.max(0, Math.min(SKILL_GRADE_COLORS.length - 1, this.query_grade(me)));
        const newGrade = Math.max(0, Math.min(SKILL_GRADE_COLORS.length - 1, this.query_dao_color_grade(me)));
        const oldName = "<" + SKILL_GRADE_COLORS[oldGrade] + ">" + this.name
            + "</" + SKILL_GRADE_COLORS[oldGrade] + ">";
        const newName = "<" + SKILL_GRADE_COLORS[newGrade] + ">" + daoName
            + "</" + SKILL_GRADE_COLORS[newGrade] + ">";
        if (desc.indexOf(oldName) === 0) desc = newName + desc.substr(oldName.length);
    }
    const bonus = this.query_progression_base_bonus(me);
    const daoRank = this.query_dao_rank(me);
    if (daoRank > 0) {
        desc += "\n<hic>武道参悟：" + daoName + "（" + daoRank + "/5阶）</hic>\n";
    }
    if (bonus) desc += "\n<hic>进阶基础属性加成：+" + bonus + "%</hic>\n";
    const daoPerforms = this.query_dao_performs(me);
    if (daoPerforms.length) {
        desc += "\n<line>道招式</line>\n";
        for (const perform of daoPerforms) {
            const performDesc = [];
            this.query_pfm_desc(me, perform, performDesc, lv);
            desc += performDesc.join("") + "\n\n";
        }
    }
    return desc;
};

SKILL.prototype.query_addin_prop = function (me, lv) {
    const skillItem = me.skills[this.id];
    if (!skillItem || !Array.isArray(skillItem.addin) || !skillItem.addin.length) return null;
    const prop = {};
    const grade = Math.min(MAX_SKILL_GRADE, this.grade + skillItem.addin.length);
    var cleaned = false;
    for (var i = skillItem.addin.length - 1; i >= 0; i--) {
        const slotId = skillItem.addin[i];
        const slot = this.query_slot(slotId);
        if (!slot || !slot.prop) {
            skillItem.addin.splice(i, 1);
            cleaned = true;
            continue;
        }
        prop[slot.prop] = (prop[slot.prop] || 0) + parseInt(slot.value(lv, grade));
    }
    if (cleaned && !skillItem.addin.length) delete skillItem.addin;
    return prop;
};

SKILL.prototype.query_progression_cost = function (me) {
    const steps = this.query_progression_steps(me);
    if (steps >= 5) return 0;
    const targetGrade = Math.min(MAX_SKILL_GRADE, this.grade + steps + 1);
    return PROGRESSION_COSTS[targetGrade] || 0;
};

SKILL.prototype.query_progression_slots = function (me) {
    const skillItem = me.skills && me.skills[this.id];
    const usedSlots = skillItem && Array.isArray(skillItem.addin)
        ? skillItem.addin.map(function (slot) { return parseInt(slot); })
        : [];
    const slots = [];

    if (Array.isArray(this.slots)) {
        for (let i = 0; i < this.slots.length; i++) {
            const slotId = 500 + i;
            if (this.slots[i] && usedSlots.indexOf(slotId) < 0) slots.push(slotId);
        }
    }
    for (let i = 0; i < SKILL.COMMON_SLOTS.length; i++) {
        const slotId = COMMON_SLOT_START + i;
        if (usedSlots.indexOf(slotId) < 0) slots.push(slotId);
    }
    return slots;
};

SKILL.prototype.query_progression_required_level = function (me) {
    const steps = this.query_progression_steps(me);
    return 500 + steps * 300;
};

SKILL.prototype.can_progress = function (me, ignoreLevel) {
    if (!me || !me.skills || !me.skills[this.id]) return false;
    if (this.type !== SKILL_TYPES.SKILL || this.grade < 1) return false;
    if (this.query_progression_steps(me) >= 5) return false;
    if (!ignoreLevel && me.query_skill(this.id, 0) < this.query_progression_required_level(me)) return false;
    return this.query_progression_slots(me).length >= 3;
};

SKILL.prototype.can_fusion = function (me) {
    if (!me || !me.skills || !me.skills[this.id]) return false;
    if (this.type !== SKILL_TYPES.SKILL || this.grade < 1) return false;
    var skillItem = me.skills[this.id];
    if (skillItem.ref) return false;
    if (!skillItem.enable_skill) return false;
    if (this.query_grade(me) >= MAX_SKILL_GRADE) return false;
    var baseType = skillItem.enable_skill;
    for (var skId in me.skills) {
        if (skId === this.id) continue;
        var sp = SKILL.get(skId);
        if (!sp || !sp.pfm || sp.type !== SKILL_TYPES.SKILL) continue;
        if (!me.skills[skId] || me.skills[skId].disable) continue;
        for (var key in sp.pfm) {
            var p = sp.pfm[key];
            if (p.enable_skill === baseType && !p.no_copy) return true;
        }
    }
    return false;
};

SKILL.prototype.query_progression_slot_desc = function (me, slotId, nextStep) {
    const slot = this.query_slot(slotId);
    if (!slot) return "未知词条";
    const skillItem = me.skills[this.id];
    const addinCount = skillItem && Array.isArray(skillItem.addin) ? skillItem.addin.length : 0;
    const grade = Math.min(MAX_SKILL_GRADE, this.grade + addinCount + (nextStep ? 1 : 0));
    const value = parseInt(slot.value(me.query_skill(this.id, 0), grade));
    return (slot.name ? slot.name + "：" : "") + slot.format(value);
};

SKILL.prototype.query_slot = function (index) {
    index = parseInt(index);
    if (!(index >= 0)) return null;
    if (index >= COMMON_SLOT_START) {
        return SKILL.COMMON_SLOTS[index - COMMON_SLOT_START] || null;
    }
    if (index < 500) {
        return SKILL.PROPERTIES ? SKILL.PROPERTIES[index] : null;
    }
    return this.slots ? this.slots[index - 500] : null;
};

SKILL.prototype.query_base_color_name = function (me) {
    const grade = Math.max(0, Math.min(SKILL_GRADE_COLORS.length - 1, this.query_dao_color_grade(me)));
    const color = SKILL_GRADE_COLORS[grade];
    return "<" + color + ">" + this.query_dao_name(me) + "</" + color + ">";
};

SKILL.prototype.item_to_json = function (str, skill_item, me) {
    const effectiveGrade = this.query_grade(me);
    const daoConfig = this.query_dao_config();
    const daoRank = this.query_dao_rank(me);
    const daoNext = this.query_dao_next(me);
    str.push('{"id":"');
    str.push(this.id);
    str.push('","name":"');
    str.push(this.query_base_color_name(me));
    str.push('",grade:', this.grade);
    str.push(',effective_grade:', effectiveGrade);
    if (daoConfig) {
        str.push(',dao_base:1');
        str.push(',dao:', daoRank);
        str.push(',dao_name:"', this.query_dao_name(me), '"');
        str.push(',dao_next:', daoNext ? daoNext.rank : "null");
        str.push(',dao_cost:', daoNext ? daoNext.cost : 0);
        str.push(',dao_required_level:', daoNext ? daoNext.requiredLevel : 0);
        str.push(',dao_level_limit:', this.query_dao_level_limit(me));
        str.push(',can_dao:', this.can_dao(me) ? 1 : 0);
    }
    str.push(',"level":');
    str.push(me.query_skill(this.id));
    str.push(',"exp":');
    skill_item.exp = skill_item.exp || 0;
    str.push(parseInt(skill_item.exp * 100 / this.level_exp(skill_item.level, me)));
    if (this.can_enables) {
        str.push(',"can_enables":[');
        for (let i = 0; i < this.can_enables.length; i++) {
            if (i > 0) str.push(",");
            str.push('"');
            str.push(this.can_enables[i]);
            str.push('"');
        }
        str.push(']');
    }
    if (skill_item.enable_skill) {
        str.push(',"enable_skill":"');
        str.push(skill_item.enable_skill);
        str.push('"');
    }
    str.push('}');
};

PERFORM.prototype.query_releasetime = function (me, lv) {
    var rtime = this.release_time;
    if (!(rtime >= 0)) rtime = me.gjsd;

    if (this.releasetime_key) {
        rtime = rtime - me.query_prop("releasetime") - me.query_prop(this.releasetime_key);
    } else {
        rtime = rtime - me.query_prop("releasetime");
    }

    if (this.releasetime_per_key) {
        rtime = rtime - rtime * (me.query_prop("releasetime_per") + me.query_prop(this.releasetime_per_key)) / 100;
    } else {
        rtime = rtime - rtime * (me.query_prop("releasetime_per")) / 100;
    }
    if (rtime < 500) return 500;
    return parseInt(rtime);
}

PERFORM.prototype.query_distime = function (me, lv, isref) {
    var dis = this.distime;
    if (!dis) dis = me.gjsd;
    if (isref) dis = dis * 2;
    if (this.distime_key) {
        dis = dis - me.query_prop("distime") - me.query_prop(this.distime_key);
    } else {
        dis = dis - me.query_prop("distime");
    }
    if (this.distime_per_key) {
        dis = dis - dis * (me.query_prop("distime_per") + me.query_prop(this.distime_per_key)) / 100;
    } else {
        dis = dis - dis * (me.query_prop("distime_per")) / 100;
    }


    if (dis < 3000) return 3000;
    return parseInt(dis);
}
PERFORM.prototype.query_mp = function (me, lv) {
    var mp = this.mp || 0;

    mp = mp + lv * mp / 20;
    if (this.expend_mp_per_key) {
        mp = mp - mp * (me.query_prop("expend_mp_per")
            + me.query_prop(this.expend_mp_per_key)) / 100;
    } else {
        mp = mp - mp * me.query_prop("expend_mp_per") / 100;
    }
    const forceSkill = SKILL.get("force");
    if (forceSkill && forceSkill.query_dao_expend_mp_bonus) {
        mp = mp - mp * forceSkill.query_dao_expend_mp_bonus(me) / 100;
    }
    if (mp < 0) mp = 0;
    return parseInt(mp);
}
