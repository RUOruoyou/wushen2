"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const propertyKeys = [
    "gj", "mz", "fy", "ds", "zj", "max_hp", "limit_mp",
    "str", "con", "dex", "int", "gj_per", "mz_per", "fy_per",
    "ds_per", "zj_per", "hp_per", "lianxi_per", "dazuo_per",
    "study_per", "add_sh_per", "add_bjsh_per", "diff_bj",
    "diff_sh_per", "expend_mp_per", "diff_busy_per", "gjsd_per",
    "diff_fy_per", "releasetime_per", "per", "bj_per", "gjsd",
    "busy", "busy_per", "diff_busy", "diff_downside_per", "distime",
    "distime_per", "releasetime", "diff_sh"
];
const PROPERTIES = Object.fromEntries(propertyKeys.map((key) => [key, key]));
const skills = {
    test_sword: {
        id: "test_sword",
        name: "测试剑法",
        type: 1,
        can_enables: ["sword", "parry"]
    },
    zero_sword: {
        id: "zero_sword",
        name: "零级剑法",
        type: 1,
        can_enables: ["sword"]
    }
};
let nextId = 1;

function createMaterial(itemPath, count) {
    return {
        id: "mat_" + nextId++,
        path: itemPath,
        count: count || 1,
        combined: true,
        color_name: itemPath,
        name: itemPath,
        unit: "块",
        unit_name(value) {
            return this.path + "×" + (value || this.count);
        }
    };
}

function createEquipment(itemPath) {
    const item = {
        id: "eq_" + nextId++,
        path: itemPath,
        grade: 5,
        level: 0,
        eq_type: 0,
        custom_type: itemPath.split("#")[1],
        temp: {},
        prop: {},
        original_prop: {},
        query_grade_color() {
            return "hio";
        },
        level_up(level) {
            this.level = level;
            this.prop = Object.assign({}, this.original_prop);
            this.color_name = "<hio>" + this.name + "</hio>";
        },
        change_prop() {},
        unit_name() {
            return this.name;
        }
    };
    return item;
}

const context = vm.createContext({
    console,
    Set,
    Map,
    Date,
    JSON,
    Math,
    Object,
    Array,
    String,
    Number,
    parseInt,
    EQUIP_TYPE: {
        WEAPON: 0,
        CLOTH: 1,
        SHOES: 2,
        HEAD: 3,
        CAPE: 4,
        RING: 5,
        NECKLACE: 6,
        JEWELS: 7,
        WRIST: 8,
        WAIST: 9,
        THROWING: 10
    },
    PROPERTIES,
    SKILL_TYPES: { BASE: 0, SKILL: 1, KNOWLEDGE: 2 },
    SKILL: { get: (id) => skills[id] },
    UTIL: {
        require: (name) => name === "crypto" ? crypto : require(name),
        check_word: () => true
    },
    OBJ: {
        CREATE(itemPath, count) {
            return itemPath.startsWith("eq/")
                ? createEquipment(itemPath)
                : createMaterial(itemPath, count);
        }
    },
    WORLD: {
        STATS: { updateWeapon() {} }
    }
});

const source = fs.readFileSync(path.join(root, "world/extends/item/custom_equipment.js"), "utf8");
vm.runInContext(source, context, { filename: "custom_equipment.js" });
const service = context.WORLD.CUSTOM_EQUIPMENT;

function createPlayer() {
    return {
        id: "player_1",
        name: "测试角色",
        money: 2000000,
        max_item_count: 50,
        items: [],
        stores: [],
        equipment: [],
        skills: { test_sword: { level: 100 }, zero_sword: { level: 0 } },
        messages: [],
        find_obj(id) {
            return this.items.find((item) => item.id === id);
        },
        find_obj_bypath(itemPath) {
            return this.items.find((item) => item.path === itemPath);
        },
        find_obj_byid(items, id) {
            return (items || []).find((item) => item.id === id);
        },
        can_add_obj() {
            return this.items.length < this.max_item_count;
        },
        add_obj(itemOrPath, count) {
            const item = typeof itemOrPath === "string"
                ? createMaterial(itemOrPath, count)
                : itemOrPath;
            const existing = item.combined && this.find_obj_bypath(item.path);
            if (existing) {
                existing.count += item.count;
                return existing;
            }
            if (!this.can_add_obj(item)) return null;
            this.items.push(item);
            return item;
        },
        remove_obj(item, count) {
            if (!item || item.count < count) return null;
            item.count -= count;
            if (!item.count) this.items.splice(this.items.indexOf(item), 1);
            return item;
        },
        add_money(value) {
            if (this.money + value < 0) return false;
            this.money += value;
            return true;
        },
        send(message) {
            this.messages.push(message);
        },
        notify(message) {
            this.messages.push(message);
        },
        recount() {}
    };
}

function lastPayload(player) {
    for (let index = player.messages.length - 1; index >= 0; index--) {
        const message = player.messages[index];
        if (typeof message === "string" && message.startsWith("{")) return JSON.parse(message);
    }
    return null;
}

assert.deepEqual(Array.from(service.validateConfig()), []);
assert.equal(service.partsForRoom("yz/garments").length, 6);
assert.equal(service.partsForRoom("yz/jianbaoge").length, 4);
assert.equal(service.slotLimit("advanced", 0), 2);
assert.equal(service.slotLimit("advanced", 10), 3);
assert.equal(service.slotLimit("rare", 150), 3);
assert.equal(service.levelLimit(0), 1);
assert.equal(service.levelLimit(50), 6);

const legacy = createEquipment("eq/cp#sword");
legacy.temp = { name: "旧剑存档", type: "sword", gj: 1, str: 2 };
service.rebuild(legacy);
assert.equal(legacy.original_prop.gj, 120);
assert.equal(legacy.original_prop.str, 20);
assert.equal(service.readState(legacy).affixes.str.legacy, true);

const ring = service.createItem("ring", "ring", "试炼戒指");
assert.equal(ring.eq_type, 5);
assert.equal(ring.original_prop.mz, 120);
assert.equal(service.readState(ring).version, 1);

const player = createPlayer();
const sword = service.createItem("weapon", "sword", "试炼长剑");
player.items.push(sword);
player.add_obj("st/p#str", 3);
player.add_obj("st/yuanjing", 30);
player.add_obj("cash/gaiming", 1);

assert.equal(service.preview(player, sword.id, "add", ["str"]), true);
const addPreview = lastPayload(player);
assert.equal(addPreview.phase, "preview");
assert.equal(addPreview.costs[0].count, 1);
assert.equal(service.commit(player, addPreview.token), true);
assert.equal(service.readState(sword).affixes.str.level, 1);
assert.equal(player.find_obj_bypath("st/p#str").count, 2);

const afterFirstCommit = player.find_obj_bypath("st/p#str").count;
assert.equal(service.commit(player, addPreview.token), false);
assert.equal(player.find_obj_bypath("st/p#str").count, afterFirstCommit);
assert.equal(service.preview(player, sword.id, "upgrade", ["str"]), false);

const state = service.readState(sword);
state.washCount = 10;
service.writeState(sword, state, true);
service.rebuild(sword);
assert.equal(service.preview(player, sword.id, "upgrade", ["str"]), true);
const upgradePreview = lastPayload(player);
assert.equal(service.commit(player, upgradePreview.token), true);
assert.equal(service.readState(sword).affixes.str.level, 2);
assert.equal(sword.original_prop.str, 32);

player.add_obj("st/p#con", 1);
const moneyBeforeReplace = player.money;
assert.equal(service.preview(player, sword.id, "replace", ["str", "con"]), true);
const replacePreview = lastPayload(player);
assert.equal(replacePreview.refunds[0].count, 3);
assert.equal(service.commit(player, replacePreview.token), true);
assert.equal(service.readState(sword).affixes.str, undefined);
assert.equal(service.readState(sword).affixes.con.level, 1);
assert.equal(player.money, moneyBeforeReplace - service.replaceMoney);
assert.equal(player.find_obj_bypath("st/p#str").count, 3);

assert.equal(service.preview(player, sword.id, "rename", ["试炼新剑"]), true);
const renamePreview = lastPayload(player);
assert.equal(service.commit(player, renamePreview.token), true);
assert.equal(sword.name, "试炼新剑");
assert.equal(player.find_obj_bypath("cash/gaiming"), undefined);

assert.equal(service.preview(player, sword.id, "wash", []), true);
const stalePreview = lastPayload(player);
const staleState = service.readState(sword);
staleState.washCount++;
service.writeState(sword, staleState, true);
service.rebuild(sword);
const yuanjingBeforeStaleCommit = player.find_obj_bypath("st/yuanjing").count;
assert.equal(service.commit(player, stalePreview.token), false);
assert.equal(player.find_obj_bypath("st/yuanjing").count, yuanjingBeforeStaleCommit);

// 洗练直接执行：不再走预览确认，扣 1 元晶、次数 +1、固定属性按每次 5 点成长
const washBefore = service.readState(sword).washCount;
const yuanjingBeforeWash = player.find_obj_bypath("st/yuanjing").count;
assert.equal(service.washDirect(player, sword.id), true);
assert.equal(service.readState(sword).washCount, washBefore + 1);
assert.equal(player.find_obj_bypath("st/yuanjing").count, yuanjingBeforeWash - 1);
const washResult = lastPayload(player);
assert.equal(washResult.phase, "result");
assert.equal(washResult.message.includes("消耗 1 个元晶"), true);
assert.equal(washResult.message.includes("<"), false);
assert.equal(sword.original_prop.gj, 120 + service.readState(sword).washCount * 5);

const yuanjingItem = player.find_obj_bypath("st/yuanjing");
const yuanjingCountForShortage = yuanjingItem.count;
yuanjingItem.count = 0;
assert.equal(service.washDirect(player, sword.id), false);
const washError = lastPayload(player);
assert.equal(washError.phase, "error");
assert.equal(washError.message, "元晶不足，每次洗练需要 1 个元晶。");
assert.equal(washError.message.includes("<"), false);
yuanjingItem.count = yuanjingCountForShortage;

sword.is_locked = true;
assert.equal(service.preview(player, sword.id, "wash", []), false);
sword.is_locked = false;
sword.st_prop = [{ path: "st/test" }];
assert.equal(service.preview(player, sword.id, "wash", []), false);
sword.st_prop = [];

const abilityState = service.readState(sword);
abilityState.washCount = 25;
service.writeState(sword, abilityState, true);
service.rebuild(sword);
assert.equal(service.makeView(player, sword).ability.options.some(option => option.id === "zero_sword"), false);
assert.equal(service.preview(player, sword.id, "ability", ["zero_sword"]), false);
assert.equal(service.preview(player, sword.id, "ability", ["test_sword"]), true);
const abilityPreview = lastPayload(player);
assert.equal(service.commit(player, abilityPreview.token), true);
assert.equal(sword.original_prop.skill.test_sword, 1);

const outputs = service.queryDisassembleOutputs(sword);
assert.equal(outputs.yuanjing, 28);
assert.deepEqual(JSON.parse(JSON.stringify(outputs.materials)), [{ path: "st/p#con", count: 1 }]);

console.log("自制装备 3.4 领域校验通过：配置、旧存档、槽位、材料、令牌和分解规则均符合首版契约。");
