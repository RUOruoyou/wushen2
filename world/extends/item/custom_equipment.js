const CUSTOM_EQUIPMENT_CRYPTO = UTIL.require("crypto");

const CUSTOM_VERSION = 1;
const MAX_WASH_COUNT = 150;
const WASH_FIXED_STEP = 5;
const TOKEN_TTL = 60000;
const REPLACE_MONEY = 100 * 10000;
const CUSTOM_EQUIPMENT_ENABLED = typeof process === "undefined" || !process.env ||
    process.env.WSMUD_CUSTOM_EQUIPMENT_ENABLED !== "0";
const CATEGORY_ORDER = ["basic", "acquired", "advanced", "rare", "special"];
const CATEGORY_NAMES = {
    basic: "基础属性",
    acquired: "后天属性",
    advanced: "高级属性",
    rare: "稀有属性",
    special: "特殊属性"
};
const SLOT_LIMITS = {
    basic: [[0, 4]],
    acquired: [[0, 3], [10, 4]],
    advanced: [[0, 2], [10, 3], [50, 4]],
    rare: [[0, 1], [10, 2], [150, 3]],
    special: [[0, 1], [50, 2]]
};

const PARTS = {
    weapon: {
        name: "武器",
        eqType: EQUIP_TYPE.WEAPON,
        path: "eq/cp",
        room: "yz/datiepu",
        source: "扬州城铁匠铺",
        fixedProp: "gj",
        fixedValue: 120
    },
    cloth: {
        name: "衣服",
        eqType: EQUIP_TYPE.CLOTH,
        path: "eq/zb",
        room: "yz/garments",
        source: "扬州城成衣店",
        fixedProp: "fy",
        fixedValue: 120
    },
    shoes: {
        name: "鞋",
        eqType: EQUIP_TYPE.SHOES,
        path: "eq/zb",
        room: "yz/garments",
        source: "扬州城成衣店",
        fixedProp: "fy",
        fixedValue: 120
    },
    head: {
        name: "头部",
        eqType: EQUIP_TYPE.HEAD,
        path: "eq/zb",
        room: "yz/garments",
        source: "扬州城成衣店",
        fixedProp: "fy",
        fixedValue: 120
    },
    cape: {
        name: "披风",
        eqType: EQUIP_TYPE.CAPE,
        path: "eq/zb",
        room: "yz/garments",
        source: "扬州城成衣店",
        fixedProp: "fy",
        fixedValue: 120
    },
    ring: {
        name: "戒指",
        eqType: EQUIP_TYPE.RING,
        path: "eq/zb",
        room: "yz/jianbaoge",
        source: "鉴宝阁",
        fixedProp: "mz",
        fixedValue: 120
    },
    necklace: {
        name: "项链",
        eqType: EQUIP_TYPE.NECKLACE,
        path: "eq/zb",
        room: "yz/jianbaoge",
        source: "鉴宝阁",
        fixedProp: "ds",
        fixedValue: 120
    },
    jewels: {
        name: "饰品",
        eqType: EQUIP_TYPE.JEWELS,
        path: "eq/zb",
        room: "yz/jianbaoge",
        source: "鉴宝阁",
        fixedProp: "fy",
        fixedValue: 120
    },
    wrist: {
        name: "护腕",
        eqType: EQUIP_TYPE.WRIST,
        path: "eq/zb",
        room: "yz/garments",
        source: "扬州城成衣店",
        fixedProp: "zj",
        fixedValue: 120
    },
    waist: {
        name: "腰带",
        eqType: EQUIP_TYPE.WAIST,
        path: "eq/zb",
        room: "yz/garments",
        source: "扬州城成衣店",
        fixedProp: "fy",
        fixedValue: 120
    },
    throwing: {
        name: "暗器",
        eqType: EQUIP_TYPE.THROWING,
        path: "eq/zb",
        room: "yz/jianbaoge",
        source: "鉴宝阁",
        fixedProp: "gj",
        fixedValue: 120
    }
};

const ALL_PARTS = Object.keys(PARTS);
const ALL_PART_SET = new Set(ALL_PARTS);
const ALL_PART_MATRIX = ALL_PARTS.slice();
const PROPS = {
    gj: prop("basic", 120, 24, ["cloth", "shoes", "head", "cape", "ring", "necklace", "jewels", "wrist", "waist"]),
    mz: prop("basic", 120, 24, ["weapon", "cloth", "shoes", "head", "cape", "necklace", "jewels", "wrist", "waist", "throwing"]),
    fy: prop("basic", 120, 24, ["weapon", "ring", "necklace", "throwing"]),
    ds: prop("basic", 120, 24, ["weapon", "cloth", "shoes", "head", "cape", "ring", "jewels", "wrist", "throwing"]),
    zj: prop("basic", 120, 24, ["weapon", "cloth", "shoes", "head", "cape", "ring", "necklace", "jewels", "waist", "throwing"]),
    max_hp: prop("basic", 1000, 200, ALL_PART_MATRIX),
    limit_mp: prop("basic", 1000, 200, ALL_PART_MATRIX),

    str: prop("acquired", 30, 2, ALL_PART_MATRIX),
    con: prop("acquired", 30, 2, ALL_PART_MATRIX),
    dex: prop("acquired", 30, 2, ALL_PART_MATRIX),
    int: prop("acquired", 30, 2, ALL_PART_MATRIX),

    gj_per: prop("advanced", 1, 1, ["weapon", "ring", "jewels", "waist", "throwing"]),
    mz_per: prop("advanced", 1, 1, ["weapon", "shoes", "head", "necklace", "jewels", "wrist", "throwing"]),
    fy_per: prop("advanced", 1, 1, ["cloth", "shoes", "head", "cape", "jewels", "waist"]),
    ds_per: prop("advanced", 1, 1, ["cloth", "shoes", "head", "cape", "necklace", "jewels"]),
    zj_per: prop("advanced", 1, 1, ["weapon", "cloth", "cape", "necklace", "jewels", "waist"]),
    hp_per: prop("advanced", 1, 1, ALL_PART_MATRIX),
    lianxi_per: prop("advanced", 1, 1, ALL_PART_MATRIX),
    dazuo_per: prop("advanced", 1, 1, ALL_PART_MATRIX),
    study_per: prop("advanced", 1, 1, ALL_PART_MATRIX),

    add_sh_per: prop("rare", 1, 1, ["weapon", "cape", "ring", "wrist", "throwing"]),
    add_bjsh_per: prop("rare", 1, 1, ["weapon", "wrist", "throwing"]),
    diff_bj: prop("rare", 1, 1, ["cloth", "head", "cape"]),
    diff_sh_per: prop("rare", 1, 1, ["cloth", "shoes", "cape", "ring", "jewels"]),
    expend_mp_per: prop("rare", 1, 1, ["weapon", "head", "ring", "jewels", "wrist"]),
    diff_busy_per: prop("rare", 1, 1, ["cloth", "shoes", "head", "cape", "waist"]),
    gjsd_per: prop("rare", 1, 1, ["weapon", "cloth", "jewels"]),
    diff_fy_per: prop("rare", 1, 1, ["weapon", "ring", "necklace", "wrist", "throwing"]),
    releasetime_per: prop("rare", 1, 1, ["weapon", "cloth", "head", "ring", "wrist", "waist"]),

    per: prop("special", 1, 1, ["cloth", "head", "necklace", "jewels"]),
    bj_per: prop("special", 1, 1, ["weapon", "head", "ring", "jewels", "wrist", "throwing"]),
    gjsd: prop("special", 100, 100, ["ring", "jewels", "wrist"]),
    busy: prop("special", 100, 100, ["weapon", "waist"]),
    busy_per: prop("special", 1, 1, ["wrist", "waist"]),
    diff_busy: prop("special", 100, 100, ["shoes", "waist"]),
    diff_downside_per: prop("special", 1, 1, ["shoes", "head", "cape"]),
    distime: prop("special", 100, 100, ["head", "necklace", "wrist"]),
    distime_per: prop("special", 1, 1, ["weapon", "head", "necklace"]),
    releasetime: prop("special", 100, 100, ["weapon", "ring", "jewels", "wrist"]),
    diff_sh: prop("special", 10, 10, ["cloth", "shoes", "head", "cape", "waist"])
};

const LEGACY_PROPS = {
    gj: 120,
    fy: 120,
    mz: 120,
    ds: 120,
    zj: 120,
    str: 10,
    con: 10,
    dex: 10,
    int: 10,
    max_hp: 1000,
    hp_per: 1,
    gj_per: 1,
    fy_per: 1,
    ds_per: 1,
    mz_per: 1,
    zj_per: 1
};
const ABILITY_PARTS = {
    sword: "weapon",
    blade: "weapon",
    club: "weapon",
    staff: "weapon",
    whip: "weapon",
    unarmed: "weapon",
    throwing: "throwing",
    force: "cloth",
    parry: "wrist",
    dodge: "shoes"
};
const OPERATION_NAMES = {
    add: "添加词条",
    upgrade: "升级词条",
    wash: "洗练装备",
    replace: "替换词条",
    rename: "装备改名",
    ability: "设置能力词条"
};
const TOKENS = new Map();

function prop(category, initial, step, parts) {
    return {
        category: category,
        initial: initial,
        step: step,
        parts: new Set(parts)
    };
}

function basePath(path) {
    return String(path || "").split("#")[0];
}

// 弹窗错误文案不携带颜色标签，避免前端转义后显示 <hio> 之类原文
function plainText(text) {
    return String(text || "").replace(/<[^>]+>/g, "");
}

function positiveInt(value, def) {
    value = parseInt(value);
    return value > 0 ? value : (def || 0);
}

function boundedInt(value, min, max, def) {
    value = parseInt(value);
    if (!(value >= min)) value = def === undefined ? min : def;
    return Math.max(min, Math.min(max, value));
}

function cloneState(state) {
    const affixes = {};
    for (const key of Object.keys(state.affixes || {})) {
        const item = state.affixes[key];
        affixes[key] = {
            key: key,
            level: item.level,
            legacy: !!item.legacy
        };
    }
    return {
        version: state.version,
        stateVersion: state.stateVersion,
        part: state.part,
        variant: state.variant,
        name: state.name,
        washCount: state.washCount,
        fixedLevel: state.fixedLevel,
        affixes: affixes,
        abilitySkill: state.abilitySkill || "",
        abilityBase: state.abilityBase || ""
    };
}

function partFromItem(item) {
    const path = basePath(item && item.path);
    const temp = item && item.temp || {};
    if (path === "eq/cp") return "weapon";
    if (path !== "eq/zb") return null;
    const type = String(temp.type || item.custom_type || "").toLowerCase();
    if (type && PARTS[type] && type !== "weapon") return type;
    for (const key of ALL_PARTS) {
        if (key !== "weapon" && item.eq_type === PARTS[key].eqType) return key;
    }
    return null;
}

function isCustom(item) {
    const path = basePath(item && item.path);
    return path === "eq/cp" || path === "eq/zb";
}

function readState(item) {
    if (!isCustom(item)) return null;
    const temp = item.temp || {};
    const part = partFromItem(item) || "weapon";
    const partConfig = PARTS[part];
    const version = positiveInt(temp.custom_version, 0);
    const affixes = {};
    let fixedLevel = boundedInt(temp.fixed_level, 1, 6, 1);

    if (version >= CUSTOM_VERSION) {
        for (const key of Object.keys(PROPS)) {
            const level = positiveInt(temp["affix_" + key], 0);
            if (!level || !PROPS[key].parts.has(part)) continue;
            affixes[key] = {
                key: key,
                level: boundedInt(level, 1, 6, 1),
                legacy: !!temp["affix_legacy_" + key]
            };
        }
    } else {
        for (const key of Object.keys(LEGACY_PROPS)) {
            const level = positiveInt(temp[key], 0);
            if (!level) continue;
            if (partConfig.fixedProp === key) {
                fixedLevel = boundedInt(level, 1, 6, 1);
            } else if (PROPS[key]) {
                affixes[key] = {
                    key: key,
                    level: boundedInt(level, 1, 6, 1),
                    legacy: true
                };
            }
        }
    }

    const variant = part === "weapon"
        ? String(temp.type || item.custom_type || "sword").toLowerCase()
        : part;
    let abilitySkill = String(temp.ability_skill || "");
    const ability = abilityInfo(abilitySkill);
    if (!ability || ability.part !== part) abilitySkill = "";
    return {
        version: version,
        stateVersion: positiveInt(temp.custom_state_version, 0),
        part: part,
        variant: variant,
        name: String(temp.name || item.name || "自制" + partConfig.name),
        washCount: boundedInt(temp.wash_count !== undefined ? temp.wash_count : temp.sc, 0, MAX_WASH_COUNT, 0),
        fixedLevel: fixedLevel,
        affixes: affixes,
        abilitySkill: abilitySkill,
        abilityBase: abilitySkill ? ability.base : ""
    };
}

function writeState(item, state, bumpVersion) {
    const temp = Object.assign({}, item.temp || {});
    for (const key of Object.keys(temp)) {
        if (key.startsWith("affix_") || key === "custom_version" ||
            key === "custom_state_version" || key === "wash_count" ||
            key === "fixed_level" || key === "ability_skill" ||
            key === "ability_base" || key === "sc" || LEGACY_PROPS[key]) {
            delete temp[key];
        }
    }
    temp.custom_version = CUSTOM_VERSION;
    temp.custom_state_version = Math.max(1, positiveInt(state.stateVersion, 0) + (bumpVersion === false ? 0 : 1));
    temp.type = state.part === "weapon" ? state.variant : state.part;
    temp.name = state.name;
    temp.wash_count = boundedInt(state.washCount, 0, MAX_WASH_COUNT, 0);
    temp.fixed_level = boundedInt(state.fixedLevel, 1, 6, 1);
    for (const key of Object.keys(state.affixes || {}).sort()) {
        const affix = state.affixes[key];
        if (!PROPS[key] || !affix) continue;
        temp["affix_" + key] = boundedInt(affix.level, 1, 6, 1);
        if (affix.legacy) temp["affix_legacy_" + key] = 1;
    }
    if (state.abilitySkill) {
        temp.ability_skill = state.abilitySkill;
        temp.ability_base = state.abilityBase;
    }
    item.temp = temp;
    state.version = CUSTOM_VERSION;
    state.stateVersion = temp.custom_state_version;
    return state;
}

function affixValue(key, level, legacy) {
    level = boundedInt(level, 1, 6, 1);
    if (legacy && LEGACY_PROPS[key]) return LEGACY_PROPS[key] * level;
    const config = PROPS[key];
    return config ? config.initial + config.step * (level - 1) : 0;
}

function buildOriginalProp(item, state) {
    const part = PARTS[state.part];
    const result = {};
    result[part.fixedProp] = part.fixedValue * positiveInt(state.fixedLevel, 1) + state.washCount * WASH_FIXED_STEP;
    for (const key of Object.keys(state.affixes)) {
        const affix = state.affixes[key];
        const value = affixValue(key, affix.level, affix.legacy);
        if (value) result[key] = (result[key] || 0) + value;
    }
    if (state.abilitySkill) result.skill = { [state.abilitySkill]: 1 };
    return result;
}

function attachActions(item) {
    item.actions = item.actions || {};
    item.actions.custom_equipment = {
        name: "重铸",
        command: function (obj) {
            return "zizhi open " + obj.id;
        },
        action: function (player) {
            return open(player, item.id);
        }
    };
    item.actions.custom_equipment_rename = {
        name: "改名",
        command: function (obj) {
            return "zizhi open " + obj.id + " rename";
        },
        action: function (player) {
            return open(player, item.id, "rename");
        }
    };
}

function rebuild(item) {
    const state = readState(item);
    if (!state) return item;
    const part = PARTS[state.part];
    item.eq_type = part.eqType;
    item.name = state.name;
    item.desc = "这是一件由" + part.source + "打造的自制" + part.name + "。";
    item.original_prop = buildOriginalProp(item, state);
    item.prop = Object.assign({}, item.original_prop);
    attachActions(item);
    if (typeof item.level_up === "function") {
        item.level_up(boundedInt(item.level, 0, 12, 0));
    } else {
        const color = item.query_grade_color ? item.query_grade_color() : "hio";
        item.color_name = "<" + color + ">" + item.name + "</" + color + ">";
    }
    item.json = null;
    return item;
}

function stateFingerprint(item) {
    const state = readState(item);
    if (!state) return "";
    return JSON.stringify({
        id: item.id,
        path: item.path,
        level: item.level || 0,
        locked: !!item.is_locked,
        stones: (item.st_prop || []).map(function (stone) {
            return stone && (stone.path || stone.id || "stone");
        }),
        stateVersion: state.stateVersion,
        part: state.part,
        variant: state.variant,
        name: state.name,
        washCount: state.washCount,
        fixedLevel: state.fixedLevel,
        affixes: Object.keys(state.affixes).sort().map(function (key) {
            const affix = state.affixes[key];
            return [key, affix.level, affix.legacy ? 1 : 0];
        }),
        abilitySkill: state.abilitySkill,
        abilityBase: state.abilityBase
    });
}

function slotLimit(category, washCount) {
    let limit = 0;
    for (const row of SLOT_LIMITS[category] || []) {
        if (washCount >= row[0]) limit = row[1];
    }
    return limit;
}

function levelLimit(washCount) {
    return Math.min(6, 1 + Math.floor(boundedInt(washCount, 0, MAX_WASH_COUNT, 0) / 10));
}

function sumNeeds(level) {
    level = boundedInt(level, 1, 6, 1);
    return level * (level + 1) / 2;
}

function findOwnedItem(player, itemId) {
    if (!player || !itemId) return null;
    let item = player.find_obj ? player.find_obj(itemId) : null;
    if (item) return item;
    for (const equipped of player.equipment || []) {
        if (equipped && equipped.id === itemId) return equipped;
    }
    if (player.find_obj_byid) {
        item = player.find_obj_byid(player.stores, itemId);
        if (item) return item;
    }
    return null;
}

function resourceCount(player, path) {
    const item = player.find_obj_bypath ? player.find_obj_bypath(path) : null;
    // 默认值取 0：数量为 0 的残留记录必须按“没有材料”处理，不能默认成 1
    return item ? positiveInt(item.count, 0) : 0;
}

function abilityInfo(skillId) {
    const skill = skillId && SKILL.get(skillId);
    if (!skill || skill.type !== SKILL_TYPES.SKILL || !Array.isArray(skill.can_enables) || !skill.can_enables.length) {
        return null;
    }
    const base = skill.can_enables[0];
    const part = ABILITY_PARTS[base];
    if (!part) return null;
    return {
        id: skill.id,
        name: skill.name,
        base: base,
        part: part
    };
}

function hasLearnedSkill(player, skillId) {
    const learned = player && player.skills && player.skills[skillId];
    return !!(learned && positiveInt(learned.level, 0));
}

function abilityOptions(player, part) {
    const result = [];
    for (const skillId of Object.keys(player.skills || {})) {
        if (!hasLearnedSkill(player, skillId)) continue;
        const info = abilityInfo(skillId);
        if (!info || info.part !== part) continue;
        result.push(info);
    }
    result.sort(function (a, b) {
        return a.name.localeCompare(b.name, "zh-CN");
    });
    return result;
}

function materialView(player, key) {
    const path = "st/p#" + key;
    return {
        path: path,
        count: resourceCount(player, path),
        name: (PROPERTIES[key] || key) + "晶石"
    };
}

function affixView(player, state, key) {
    const affix = state.affixes[key];
    const config = PROPS[key];
    const limit = levelLimit(state.washCount);
    return {
        key: key,
        name: PROPERTIES[key] || key,
        level: affix.level,
        value: affixValue(key, affix.level, affix.legacy),
        levelLimit: limit,
        canUpgrade: affix.level < limit,
        nextCost: affix.level < limit ? affix.level + 1 : 0,
        material: materialView(player, key),
        legacy: !!affix.legacy,
        replacements: Object.keys(PROPS).filter(function (candidate) {
            return candidate !== key && !state.affixes[candidate] &&
                PROPS[candidate].category === config.category &&
                PROPS[candidate].parts.has(state.part);
        }).map(function (candidate) {
            return {
                key: candidate,
                name: PROPERTIES[candidate] || candidate,
                value: affixValue(candidate, 1, false),
                material: materialView(player, candidate)
            };
        })
    };
}

function makeView(player, item, focus) {
    const state = readState(item);
    const part = PARTS[state.part];
    const categories = CATEGORY_ORDER.map(function (category) {
        const affixKeys = Object.keys(state.affixes).filter(function (key) {
            return PROPS[key] && PROPS[key].category === category;
        }).sort();
        const available = Object.keys(PROPS).filter(function (key) {
            const config = PROPS[key];
            return config.category === category && config.parts.has(state.part) && !state.affixes[key];
        }).map(function (key) {
            return {
                key: key,
                name: PROPERTIES[key] || key,
                value: affixValue(key, 1, false),
                material: materialView(player, key)
            };
        });
        const limit = slotLimit(category, state.washCount);
        return {
            id: category,
            name: CATEGORY_NAMES[category],
            used: affixKeys.length,
            limit: limit,
            remaining: Math.max(0, limit - affixKeys.length),
            affixes: affixKeys.map(function (key) {
                return affixView(player, state, key);
            }),
            available: available
        };
    });
    const ability = state.abilitySkill ? abilityInfo(state.abilitySkill) : null;
    return {
        type: "dialog",
        dialog: "customEquipment",
        phase: "state",
        focus: focus || "",
        itemId: item.id,
        itemName: item.color_name || item.name,
        plainName: item.name,
        part: state.part,
        partName: part.name,
        washCount: state.washCount,
        maxWashCount: MAX_WASH_COUNT,
        levelLimit: levelLimit(state.washCount),
        fixed: {
            key: part.fixedProp,
            name: PROPERTIES[part.fixedProp] || part.fixedProp,
            value: buildOriginalProp(item, state)[part.fixedProp]
        },
        categories: categories,
        ability: {
            unlocked: state.washCount >= 25,
            skillId: state.abilitySkill,
            name: ability ? ability.name : "",
            base: state.abilityBase,
            options: abilityOptions(player, state.part)
        },
        resources: {
            yuanjing: resourceCount(player, "st/yuanjing"),
            rename: resourceCount(player, "cash/gaiming"),
            money: player.money || 0
        },
        stateVersion: state.stateVersion,
        locked: !!item.is_locked,
        socketed: !!(item.st_prop && item.st_prop.length),
        equipped: !!(player.equipment && player.equipment[item.eq_type] === item)
    };
}

function sendError(player, message, item) {
    const data = {
        type: "dialog",
        dialog: "customEquipment",
        phase: "error",
        message: message || "自制装备操作失败。"
    };
    if (item) data.itemId = item.id;
    player.send(JSON.stringify(data));
    return false;
}

function open(player, itemId, focus) {
    const item = findOwnedItem(player, itemId);
    if (!isCustom(item)) return sendError(player, "没有找到这件自制装备。", item);
    player.send(JSON.stringify(makeView(player, item, focus)));
    return true;
}

function checkMutable(item) {
    if (item.is_locked) return "装备处于锁定状态，请先解锁。";
    if (item.st_prop && item.st_prop.length) return "已镶嵌宝石的装备不能重铸，请先清理宝石。";
    return "";
}

function prepareOperation(player, item, operation, args) {
    const blocked = checkMutable(item);
    if (blocked) return { error: blocked };
    const state = readState(item);
    const next = cloneState(state);
    const costs = [];
    const refunds = [];
    let money = 0;
    let summary = "";
    args = args || [];

    if (operation === "add") {
        const key = String(args[0] || "");
        const config = PROPS[key];
        if (!config || !config.parts.has(state.part)) return { error: "这个部位不能添加所选词条。" };
        if (state.affixes[key]) return { error: "这条属性已经存在。" };
        const used = Object.keys(state.affixes).filter(function (itemKey) {
            return PROPS[itemKey] && PROPS[itemKey].category === config.category;
        }).length;
        if (used >= slotLimit(config.category, state.washCount)) return { error: CATEGORY_NAMES[config.category] + "槽位已经用完。" };
        costs.push({ path: "st/p#" + key, count: 1 });
        next.affixes[key] = { key: key, level: 1, legacy: false };
        summary = "添加" + (PROPERTIES[key] || key) + " +" + affixValue(key, 1, false);
    } else if (operation === "upgrade") {
        const key = String(args[0] || "");
        const affix = state.affixes[key];
        if (!affix || !PROPS[key]) return { error: "没有找到要升级的词条。" };
        const limit = levelLimit(state.washCount);
        if (affix.level >= limit) return { error: "当前洗练次数下，这条属性已经达到升级上限。" };
        const nextLevel = affix.level + 1;
        costs.push({ path: "st/p#" + key, count: nextLevel });
        next.affixes[key].level = nextLevel;
        summary = (PROPERTIES[key] || key) + "提升至 " + nextLevel + " 级，数值变为 +" +
            affixValue(key, nextLevel, affix.legacy);
    } else if (operation === "wash") {
        if (state.washCount >= MAX_WASH_COUNT) return { error: "这件装备已经洗练至最高次数。" };
        costs.push({ path: "st/yuanjing", count: 1 });
        next.washCount++;
        summary = "洗练次数提升至 " + next.washCount + "，" +
            (PROPERTIES[PARTS[state.part].fixedProp] || PARTS[state.part].fixedProp) + "固定属性 +" + WASH_FIXED_STEP;
    } else if (operation === "replace") {
        const oldKey = String(args[0] || "");
        const newKey = String(args[1] || "");
        const oldAffix = state.affixes[oldKey];
        const oldConfig = PROPS[oldKey];
        const newConfig = PROPS[newKey];
        if (!oldAffix || !oldConfig) return { error: "没有找到要替换的词条。" };
        if (!newConfig || !newConfig.parts.has(state.part) || newConfig.category !== oldConfig.category) {
            return { error: "只能替换为这个部位同类别的可选词条。" };
        }
        if (state.affixes[newKey]) return { error: "新词条已经存在。" };
        costs.push({ path: "st/p#" + newKey, count: 1 });
        refunds.push({ path: "st/p#" + oldKey, count: sumNeeds(oldAffix.level) });
        money = REPLACE_MONEY;
        delete next.affixes[oldKey];
        next.affixes[newKey] = { key: newKey, level: 1, legacy: false };
        summary = "将" + (PROPERTIES[oldKey] || oldKey) + "替换为" + (PROPERTIES[newKey] || newKey) +
            "，返还旧词条投入的全部晶石";
    } else if (operation === "rename") {
        const name = String(args[0] || "");
        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(name)) return { error: "装备名称需要是 2-5 个汉字。" };
        if (!UTIL.check_word(name)) return { error: "这个名称不能使用。" };
        if (name === state.name) return { error: "新名称与当前名称相同。" };
        costs.push({ path: "cash/gaiming", count: 1 });
        next.name = name;
        summary = "将装备改名为“" + name + "”";
    } else if (operation === "ability") {
        const skillId = String(args[0] || "");
        if (state.washCount < 25) return { error: "洗练达到 25 次后才能设置能力词条。" };
        if (!hasLearnedSkill(player, skillId)) return { error: "你尚未学会这门武学。" };
        const ability = abilityInfo(skillId);
        if (!ability || ability.part !== state.part) return { error: "这门武学不能强化在当前部位。" };
        if (state.abilitySkill === skillId) return { error: "当前已经是这条能力词条。" };
        costs.push({ path: "st/yuanjing", count: 1 });
        next.abilitySkill = skillId;
        next.abilityBase = ability.base;
        summary = "设置“" + ability.name + "强化”，穿戴时该武学有效等级 +1";
    } else {
        return { error: "未知的自制装备操作。" };
    }

    for (const cost of costs) {
        if (resourceCount(player, cost.path) < cost.count) {
            let sample;
            try {
                sample = OBJ.CREATE(cost.path, cost.count);
            } catch (e) {
                sample = null;
            }
            return { error: "材料不足，还需要" + (sample ? plainText(sample.unit_name(cost.count)) : cost.path) + "。" };
        }
    }
    if (money > (player.money || 0)) return { error: "黄金不足，替换词条需要 100 两黄金。" };
    return {
        state: state,
        next: next,
        costs: costs,
        refunds: refunds,
        money: money,
        summary: summary
    };
}

function describeResources(resources) {
    return (resources || []).map(function (resource) {
        let item;
        try {
            item = OBJ.CREATE(resource.path, resource.count);
        } catch (e) {
            item = null;
        }
        const name = item ? (item.name || "").replace(/<[^>]+>/g, "") : resource.path;
        return {
            path: resource.path,
            count: resource.count,
            name: name || resource.path,
            unit: item ? item.unit : "个"
        };
    });
}

function cleanTokens() {
    const now = Date.now();
    for (const [token, preview] of TOKENS) {
        if (preview.expires <= now || preview.used) TOKENS.delete(token);
    }
}

function preview(player, itemId, operation, args) {
    cleanTokens();
    const item = findOwnedItem(player, itemId);
    if (!isCustom(item)) return sendError(player, "没有找到这件自制装备。", item);
    if (!CUSTOM_EQUIPMENT_ENABLED) return sendError(player, "自制装备养成入口正在维护，请稍后再试。", item);
    const prepared = prepareOperation(player, item, operation, args);
    if (prepared.error) return sendError(player, prepared.error, item);
    const token = CUSTOM_EQUIPMENT_CRYPTO.randomBytes(16).toString("hex");
    TOKENS.set(token, {
        token: token,
        playerId: player.id,
        itemId: item.id,
        operation: operation,
        args: (args || []).map(String),
        fingerprint: stateFingerprint(item),
        expires: Date.now() + TOKEN_TTL,
        used: false
    });
    player.send(JSON.stringify({
        type: "dialog",
        dialog: "customEquipment",
        phase: "preview",
        itemId: item.id,
        operation: operation,
        operationName: OPERATION_NAMES[operation],
        summary: prepared.summary,
        costs: describeResources(prepared.costs),
        refunds: describeResources(prepared.refunds),
        money: prepared.money,
        token: token,
        expiresIn: TOKEN_TTL
    }));
    return true;
}

function snapshotTransaction(player, item) {
    const counts = new Map();
    for (const carried of player.items || []) {
        if (carried) counts.set(carried, carried.count);
    }
    return {
        items: (player.items || []).slice(),
        counts: counts,
        money: player.money || 0,
        temp: Object.assign({}, item.temp || {}),
        prop: Object.assign({}, item.prop || {}),
        originalProp: Object.assign({}, item.original_prop || {}),
        name: item.name,
        desc: item.desc,
        colorName: item.color_name,
        json: item.json,
        equipped: !!(player.equipment && player.equipment[item.eq_type] === item),
        playerProp: Object.assign({}, player.prop || {})
    };
}

function restoreTransaction(player, item, snapshot) {
    player.items = snapshot.items;
    snapshot.counts.forEach(function (count, carried) {
        carried.count = count;
    });
    player.money = snapshot.money;
    item.temp = snapshot.temp;
    item.prop = snapshot.prop;
    item.original_prop = snapshot.originalProp;
    item.name = snapshot.name;
    item.desc = snapshot.desc;
    item.color_name = snapshot.colorName;
    item.json = snapshot.json;
    player.prop = Object.assign({}, snapshot.playerProp);
    if (player.recount) {
        try {
            player.recount();
        } catch (error) {
            console.error("恢复自制装备事务后重算角色属性失败:", error);
        }
    }
}

function takeResource(player, cost) {
    const item = player.find_obj_bypath(cost.path);
    if (!item || item.count < cost.count) return false;
    return !!player.remove_obj(item, cost.count);
}

function commit(player, token) {
    cleanTokens();
    const previewData = TOKENS.get(String(token || ""));
    if (!previewData || previewData.playerId !== player.id) {
        return sendError(player, "本次操作已完成、已失效或不存在。");
    }
    if (previewData.used || previewData.expires <= Date.now()) {
        TOKENS.delete(previewData.token);
        return sendError(player, "本次操作已经失效，请重新预览。");
    }
    if (!CUSTOM_EQUIPMENT_ENABLED) {
        TOKENS.delete(previewData.token);
        return sendError(player, "自制装备养成入口正在维护，请稍后再试。");
    }
    const item = findOwnedItem(player, previewData.itemId);
    if (!isCustom(item)) {
        TOKENS.delete(previewData.token);
        return sendError(player, "装备已经不在你的物品中。", item);
    }
    if (stateFingerprint(item) !== previewData.fingerprint) {
        TOKENS.delete(previewData.token);
        return sendError(player, "装备状态已经变化，请重新预览。", item);
    }
    const prepared = prepareOperation(player, item, previewData.operation, previewData.args);
    if (prepared.error) return sendError(player, prepared.error, item);

    const snapshot = snapshotTransaction(player, item);
    try {
        if (snapshot.equipped) {
            item.change_prop(player, false);
        }
        for (const cost of prepared.costs) {
            if (!takeResource(player, cost)) throw new Error("resource changed");
        }
        if (prepared.money) {
            if ((player.money || 0) < prepared.money) throw new Error("money changed");
            if (!player.add_money(-prepared.money)) throw new Error("money update failed");
        }
        for (const refund of prepared.refunds) {
            if (!player.add_obj(refund.path, refund.count)) throw new Error("refund capacity changed");
        }
        writeState(item, prepared.next, true);
        rebuild(item);
        if (snapshot.equipped) {
            item.change_prop(player, true);
        }
        if (player.recount) player.recount();
        if (WORLD.STATS && WORLD.STATS.updateWeapon) WORLD.STATS.updateWeapon(player, item);
        previewData.used = true;
        TOKENS.delete(previewData.token);
        player.notify("<hig>" + prepared.summary + "。</hig>");
        const view = makeView(player, item);
        view.phase = "result";
        view.message = prepared.summary + "。";
        player.send(JSON.stringify(view));
        if (WORLD.COMMANDS && WORLD.COMMANDS.pack) WORLD.COMMANDS.pack.enter(player);
        return true;
    } catch (error) {
        restoreTransaction(player, item, snapshot);
        return sendError(player, "操作未完成，装备和材料已恢复，请重新尝试。", item);
    }
}

function washUnlockNotes(before, after) {
    const notes = [];
    const levelBefore = levelLimit(before);
    const levelAfter = levelLimit(after);
    if (levelAfter > levelBefore) notes.push("词条等级上限提升至 " + levelAfter + " 级");
    if (before < 25 && after >= 25) notes.push("能力词条已解锁");
    for (const category of CATEGORY_ORDER) {
        const limit = slotLimit(category, after);
        if (limit > slotLimit(category, before)) notes.push(CATEGORY_NAMES[category] + "槽位增至 " + limit + " 条");
    }
    return notes;
}

// 洗练为高频低风险操作，跳过预览确认直接执行；费用与解锁结果经消息返回
function washDirect(player, itemId) {
    const item = findOwnedItem(player, itemId);
    if (!isCustom(item)) return sendError(player, "没有找到这件自制装备。", item);
    if (!CUSTOM_EQUIPMENT_ENABLED) return sendError(player, "自制装备养成入口正在维护，请稍后再试。", item);
    const blocked = checkMutable(item);
    if (blocked) return sendError(player, blocked, item);
    const state = readState(item);
    if (state.washCount >= MAX_WASH_COUNT) return sendError(player, "这件装备已经洗练至最高次数。", item);
    if (resourceCount(player, "st/yuanjing") < 1) return sendError(player, "元晶不足，每次洗练需要 1 个元晶。", item);

    const snapshot = snapshotTransaction(player, item);
    try {
        if (snapshot.equipped) item.change_prop(player, false);
        if (!takeResource(player, { path: "st/yuanjing", count: 1 })) throw new Error("resource changed");
        const next = cloneState(state);
        next.washCount++;
        writeState(item, next, true);
        rebuild(item);
        if (snapshot.equipped) item.change_prop(player, true);
        if (player.recount) player.recount();
        if (WORLD.STATS && WORLD.STATS.updateWeapon) WORLD.STATS.updateWeapon(player, item);
        const view = makeView(player, item);
        const propName = view.fixed.name;
        const notes = washUnlockNotes(state.washCount, next.washCount);
        const detail = "洗练 " + view.washCount + "/" + MAX_WASH_COUNT + "，消耗 1 个元晶，" +
            propName + "固定属性 +" + WASH_FIXED_STEP + "（当前 " + view.fixed.value + "）" +
            (notes.length ? "。" + notes.join("，") : "");
        player.notify("<hig>" + detail + "。</hig>");
        view.phase = "result";
        view.message = detail + "。";
        player.send(JSON.stringify(view));
        if (WORLD.COMMANDS && WORLD.COMMANDS.pack) WORLD.COMMANDS.pack.enter(player);
        return true;
    } catch (error) {
        restoreTransaction(player, item, snapshot);
        return sendError(player, "操作未完成，装备和材料已恢复，请重新尝试。", item);
    }
}

function createItem(partKey, variant, name) {
    const part = PARTS[partKey];
    if (!part) return null;
    const path = part.path + "#" + (partKey === "weapon" ? variant : partKey);
    const item = OBJ.CREATE(path);
    if (!item) return null;
    const state = {
        version: CUSTOM_VERSION,
        stateVersion: 0,
        part: partKey,
        variant: partKey === "weapon" ? variant : partKey,
        name: name,
        washCount: 0,
        fixedLevel: 1,
        affixes: {},
        abilitySkill: "",
        abilityBase: ""
    };
    writeState(item, state, true);
    rebuild(item);
    return item;
}

function partsForRoom(roomPath) {
    return ALL_PARTS.filter(function (key) {
        return PARTS[key].room === roomPath;
    });
}

function canCraft(player, partKey) {
    if (!CUSTOM_EQUIPMENT_ENABLED) return false;
    const part = PARTS[partKey];
    if (!part) return false;
    return !!(player && player.environment && player.environment.path === part.room);
}

function queryDisassembleOutputs(item) {
    const state = readState(item);
    if (!state) return [];
    const outputs = [];
    for (const key of Object.keys(state.affixes)) {
        const invested = sumNeeds(state.affixes[key].level);
        outputs.push({
            path: "st/p#" + key,
            count: Math.max(1, Math.floor(invested * 0.8))
        });
    }
    return {
        yuanjing: 8 + Math.floor(state.washCount * 0.8),
        materials: outputs
    };
}

function queryScore(item) {
    const state = readState(item);
    if (!state) return 0;
    const weights = { basic: 1, acquired: 2, advanced: 3, rare: 5, special: 8 };
    let score = Math.floor(state.washCount / 10) * 5;
    for (const key of Object.keys(state.affixes)) {
        const config = PROPS[key];
        if (config) score += weights[config.category] * state.affixes[key].level * 10;
    }
    if (state.abilitySkill) score += 50;
    return score;
}

function validateConfig() {
    const errors = [];
    for (const key of Object.keys(PROPS)) {
        const config = PROPS[key];
        if (!PROPERTIES[key]) errors.push("属性缺少显示名: " + key);
        if (!CATEGORY_ORDER.includes(config.category)) errors.push("属性类别无效: " + key);
        if (!(config.initial > 0) || !(config.step >= 0)) errors.push("属性数值无效: " + key);
        for (const part of config.parts) {
            if (!ALL_PART_SET.has(part)) errors.push("属性部位无效: " + key + " -> " + part);
        }
    }
    for (const part of ALL_PARTS) {
        const config = PARTS[part];
        if (!PROPERTIES[config.fixedProp]) errors.push("固定属性缺少显示名: " + part);
        if (!(config.fixedValue > 0)) errors.push("固定属性初始值无效: " + part);
    }
    return errors;
}

WORLD.CUSTOM_EQUIPMENT = {
    version: CUSTOM_VERSION,
    maxWashCount: MAX_WASH_COUNT,
    replaceMoney: REPLACE_MONEY,
    isEnabled: function () { return CUSTOM_EQUIPMENT_ENABLED; },
    parts: PARTS,
    props: PROPS,
    categories: CATEGORY_ORDER,
    categoryNames: CATEGORY_NAMES,
    legacyProps: LEGACY_PROPS,
    isCustom: isCustom,
    partFromItem: partFromItem,
    readState: readState,
    writeState: writeState,
    rebuild: rebuild,
    createItem: createItem,
    attachActions: attachActions,
    fingerprint: stateFingerprint,
    slotLimit: slotLimit,
    levelLimit: levelLimit,
    affixValue: affixValue,
    sumNeeds: sumNeeds,
    findOwnedItem: findOwnedItem,
    makeView: makeView,
    open: open,
    preview: preview,
    commit: commit,
    washDirect: washDirect,
    partsForRoom: partsForRoom,
    canCraft: canCraft,
    queryDisassembleOutputs: queryDisassembleOutputs,
    queryScore: queryScore,
    validateConfig: validateConfig
};
