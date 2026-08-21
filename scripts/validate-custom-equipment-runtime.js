"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const JSON5 = require("json5");

const root = path.resolve(__dirname, "..");
const originalExit = process.exit;
const validateDisabledMode = process.env.WSMUD_CUSTOM_EQUIPMENT_ENABLED === "0";
let requestedExit = null;
let settled = false;

process.env.WSMUD_VALIDATE_RESOURCES = "1";
process.argv[2] = "100";
process.exit = code => {
    requestedExit = code || 0;
};
require(path.join(root, "main.js"));

const timeout = setTimeout(() => {
    finish(new Error("真实资源运行时校验等待超时"));
}, 45000);
const poll = setInterval(() => {
    if (requestedExit === null || settled) return;
    if (requestedExit !== 0) return finish(new Error("资源加载失败，退出码 " + requestedExit));
    runValidation().then(() => finish()).catch(finish);
}, 25);

async function finish(error) {
    if (settled) return;
    settled = true;
    clearInterval(poll);
    clearTimeout(timeout);
    try {
        if (globalThis.WORLD && typeof WORLD.close === "function") await WORLD.close();
    } catch (closeError) {
        error = error || closeError;
    }
    process.exit = originalExit;
    if (error) {
        console.error(error.stack || error.message);
        originalExit(1);
        return;
    }
    console.log(validateDisabledMode
        ? "自制装备 3.4 禁用模式校验通过：写入口关闭，已有装备仍可加载和查看。"
        : "自制装备 3.4 运行时校验通过：精炼、技能穿脱、存档、克隆、事务回滚和分解恢复均正常。");
    originalExit(0);
}

async function runValidation() {
    assert.ok(WORLD.CUSTOM_EQUIPMENT);
    assert.ok(WORLD.ITEM_MANAGEMENT);
    assert.ok(WORLD.COMMANDS.zizhi);
    assert.ok(ROOM.Get("yz/jianbaoge"));
    assert.equal(WORLD.CUSTOM_EQUIPMENT.validateConfig().length, 0);

    if (validateDisabledMode) {
        validateDisabledEntries();
        return;
    }

    validateResourcesAndCrafting();
    validateCorruptState();
    validateEquipmentRuntime();
    validateEquippedRollback();
    validateDisassembleTransaction();
}

function validateDisabledEntries() {
    const service = WORLD.CUSTOM_EQUIPMENT;
    const player = createPlayer("validate-custom-disabled");
    player.environment = ROOM.Get("yz/garments");
    player.add_obj("st/yuanjing", 10);
    const yuanjingBefore = player.find_obj_bypath("st/yuanjing").count;

    assert.equal(service.isEnabled(), false);
    assert.equal(service.canCraft(player, "cloth"), false);
    WORLD.COMMANDS.duanzao.enter(player, "cloth");
    assert.equal(player.wait_input, undefined);
    assert.equal(player.find_obj_bypath("st/yuanjing").count, yuanjingBefore);

    const item = service.createItem("cloth", "cloth", "维护衣服");
    player.add_obj(item);
    assert.equal(service.open(player, item.id), true);
    assert.ok(lastJsonMessage(player, data => data.dialog === "customEquipment" && data.phase === "state"));
    assert.equal(service.preview(player, item.id, "wash", []), false);
    assert.equal(player.find_obj_bypath("st/yuanjing").count, yuanjingBefore);
}

function validateResourcesAndCrafting() {
    const service = WORLD.CUSTOM_EQUIPMENT;
    const variants = ["sword", "blade", "club", "staff", "whip", "none"];
    for (const key of Object.keys(service.props)) {
        const material = OBJ.CREATE("st/p#" + key, 1);
        assert.ok(material);
        assert.equal(material.prop_key, key);
    }
    const attachmentPaths = new Set(WORLD.MESSAGE.getAdminAttachmentCatalog().items.map(item => item.path));
    for (const key of Object.keys(service.props)) assert.ok(attachmentPaths.has("st/p#" + key));
    for (const partKey of Object.keys(service.parts)) {
        const variant = partKey === "weapon" ? variants[0] : partKey;
        const item = service.createItem(partKey, variant, "校验装备");
        assert.ok(item);
        assert.equal(item.eq_type, service.parts[partKey].eqType);
    }
    for (const variant of variants) {
        const item = service.createItem("weapon", variant, "校验武器");
        assert.ok(item);
        assert.equal(service.readState(item).variant, variant);
    }
    const yaolin = ROOM.Get("yz/yaolin");
    const jianbaoge = ROOM.Get("yz/jianbaoge");
    assert.equal(yaolin.exits.east, "yz/jianbaoge");
    assert.equal(jianbaoge.exits.west, "yz/yaolin");
    assert.ok(NPC.CLONE("yz/jianbao"));

    const player = createPlayer("validate-custom-crafting");
    player.environment = ROOM.Get("yz/garments");
    player.add_obj("st/yuanjing", 10);
    WORLD.COMMANDS.duanzao.enter(player, "cloth");
    assert.equal(typeof player.wait_input, "function");
    player.wait_input(player, "say 校验衣服");
    const crafted = player.items.find(item => item.path === "eq/zb#cloth");
    assert.ok(crafted);
    assert.equal(crafted.name, "校验衣服");
    assert.equal(player.find_obj_bypath("st/yuanjing"), undefined);

    player.add_obj("st/yuanjing", 10);
    WORLD.COMMANDS.duanzao.enter(player, "cloth 直造衣服");
    const crafted2 = player.items.find(item => item.name === "直造衣服");
    assert.ok(crafted2);
    assert.equal(player.find_obj_bypath("st/yuanjing"), undefined);
    player.environment = ROOM.Get("yz/datiepu");
    player.add_obj("st/yuanjing", 10);
    const before = player.find_obj_bypath("st/yuanjing").count;
    WORLD.COMMANDS.duanzao.enter(player, "ring");
    assert.equal(player.find_obj_bypath("st/yuanjing").count, before);
}

function createPlayer(id) {
    const player = new USER();
    player.id = id;
    player.name = "校验角色";
    player.is_player = true;
    player.items = [];
    player.stores = [];
    player.equipment = [];
    player.money = 2000000;
    player.max_item_count = 50;
    player.max_store_count = 50;
    player.eq_group = 0;
    player.skills = {
        sword: { level: 100, enable_skill: "huashanjianfa" },
        huashanjianfa: { level: 100, sword: true }
    };
    player.prop = { gj: 110 };
    player.messages = [];
    player.send = function (message) {
        this.messages.push(message);
    };
    player.notify = player.send;
    player.send_room = function () {};
    player.recount = function () {};
    return player;
}

function lastJsonMessage(player, predicate) {
    for (let index = player.messages.length - 1; index >= 0; index--) {
        const message = player.messages[index];
        if (typeof message !== "string" || message[0] !== "{") continue;
        try {
            const data = JSON5.parse(message);
            if (!predicate || predicate(data)) return data;
        } catch (error) {
            continue;
        }
    }
    return null;
}

function validateCorruptState() {
    const item = OBJ.CREATE("eq/zb#ring");
    item.temp = {
        custom_version: 1,
        custom_state_version: 2,
        type: "ring",
        name: "校验戒指",
        fixed_level: 999,
        affix_mz: 6,
        affix_str: 999,
        ability_skill: "huashanjianfa",
        ability_base: "sword"
    };
    const state = WORLD.CUSTOM_EQUIPMENT.readState(item);
    assert.equal(state.part, "ring");
    assert.equal(state.fixedLevel, 6);
    assert.equal(state.affixes.mz, undefined);
    assert.equal(state.affixes.str.level, 6);
    assert.equal(state.abilitySkill, "");
}

function validateEquipmentRuntime() {
    const service = WORLD.CUSTOM_EQUIPMENT;
    const player = createPlayer("validate-custom-runtime");
    const item = service.createItem("weapon", "sword", "校验长剑");
    const state = service.readState(item);
    state.washCount = 25;
    state.affixes.str = { key: "str", level: 2, legacy: false };
    state.abilitySkill = "huashanjianfa";
    state.abilityBase = "sword";
    service.writeState(item, state, true);
    service.rebuild(item);
    item.level_up(12);

    assert.equal(item.original_prop.str, 32);
    assert.equal(item.prop.skill.huashanjianfa, 1);
    assert.equal(item.prop.str, 246);
    const beforeProp = Object.assign({}, player.prop);
    const beforeSkill = player.query_skill("huashanjianfa", 0);
    item.change_prop(player, true);
    assert.equal(player.query_skill("huashanjianfa", 0), beforeSkill + 1);
    assert.equal(player.query_prop("gj"), beforeProp.gj + item.prop.gj + 1);
    item.change_prop(player, false);
    assert.equal(player.query_prop("gj"), beforeProp.gj);
    assert.equal(player.query_prop("str"), 0);
    assert.equal(player.query_prop("huashanjianfa"), 0);

    const stone = OBJ.CREATE("st/st_gj#0");
    assert.ok(stone && stone.prop);
    // 自制装备模板为 4 个宝石孔，存档加载按模板重建，镶嵌 1 颗后剩余 3 孔
    assert.equal(item.hole_count, 4);
    item.push_stone(stone);
    assert.equal(item.hole_count, 3);
    item.is_locked = true;
    const clone = item.clone(player);
    assert.deepEqual(clone.temp, item.temp);
    assert.equal(clone.level, 12);
    assert.equal(clone.hole_count, item.hole_count);
    assert.deepEqual(clone.st_prop, item.st_prop);
    assert.equal(clone.is_locked, true);

    const ordinary = OBJ.CREATE("eq/lv0/jian");
    ordinary.is_locked = true;
    assert.equal(ordinary.clone(player).is_locked, true);

    const savedText = [];
    item.save_db(savedText);
    const saved = JSON.parse(savedText.join(""));
    const restored = OBJ.CREATE(saved[0]);
    restored.load_db(saved);
    restored.on_load(player);
    assert.deepEqual(service.readState(restored), service.readState(item));
    assert.deepEqual(restored.prop, item.prop);
    assert.equal(restored.level, 12);
    assert.equal(restored.is_locked, true);
    assert.equal(restored.hole_count, item.hole_count);
    assert.deepEqual(restored.st_prop.map(entry => entry.path), item.st_prop.map(entry => entry.path));
}

function validateEquippedRollback() {
    const service = WORLD.CUSTOM_EQUIPMENT;
    const player = createPlayer("validate-custom-rollback");
    const item = service.createItem("weapon", "sword", "回滚长剑");
    player.equipment[item.eq_type] = item;
    item.change_prop(player, true);
    player.add_obj("st/yuanjing", 2);

    const stateBefore = service.readState(item);
    const propBefore = Object.assign({}, player.prop);
    const materialBefore = player.find_obj_bypath("st/yuanjing").count;
    assert.equal(service.preview(player, item.id, "wash", []), true);
    const preview = lastJsonMessage(player, data => data.dialog === "customEquipment" && data.phase === "preview");
    assert.ok(preview && preview.token);

    const updateWeapon = WORLD.STATS.updateWeapon;
    WORLD.STATS.updateWeapon = function () {
        throw new Error("intentional validation failure");
    };
    try {
        assert.equal(service.commit(player, preview.token), false);
    } finally {
        WORLD.STATS.updateWeapon = updateWeapon;
    }
    assert.deepEqual(service.readState(item), stateBefore);
    assert.deepEqual(player.prop, propBefore);
    assert.equal(player.find_obj_bypath("st/yuanjing").count, materialBefore);
    assert.equal(player.equipment[item.eq_type], item);
}

function validateDisassembleTransaction() {
    const service = WORLD.CUSTOM_EQUIPMENT;
    const management = WORLD.ITEM_MANAGEMENT;
    const player = createPlayer("validate-custom-disassemble");
    player.prop = {};
    const item = service.createItem("weapon", "sword", "分解长剑");
    const state = service.readState(item);
    state.washCount = 10;
    state.affixes.str = { key: "str", level: 2, legacy: false };
    service.writeState(item, state, true);
    service.rebuild(item);
    player.add_obj(item);
    player.add_obj("st/yuanjing", 5);

    const context = management.resolveOwner(player, { type: "player" }, { requireReady: true });
    const outputs = management.queryDisassembleOutputs(player, item);
    assert.deepEqual(outputs.map(output => [output.path, output.count]), [
        ["st/yuanjing", 17],
        ["st/p#str", 2]
    ]);

    const originalItems = player.items.slice();
    const yuanjingBefore = player.find_obj_bypath("st/yuanjing").count;
    const pushItem = player.push_item;
    let pushCount = 0;
    player.push_item = function (output) {
        pushCount++;
        if (pushCount === 2) return null;
        return pushItem.call(this, output);
    };
    const failed = management.executeDisassemble(context, item, { bulk: false });
    player.push_item = pushItem;
    assert.equal(failed.ok, false);
    assert.equal(failed.code, "INTERNAL_ERROR");
    assert.deepEqual(player.items, originalItems);
    assert.equal(player.find_obj_bypath("st/yuanjing").count, yuanjingBefore);
    assert.ok(player.find_obj(item.id));

    const recover = WORLD.add_recover_obj;
    let recovery;
    WORLD.add_recover_obj = function (owner, removed, type, resources) {
        recovery = { owner, removed, type, resources };
        return true;
    };
    let result;
    try {
        result = management.executeDisassemble(context, item, { bulk: false });
    } finally {
        WORLD.add_recover_obj = recover;
    }
    assert.equal(result.ok, true);
    assert.equal(player.find_obj(item.id), undefined);
    assert.equal(player.find_obj_bypath("st/yuanjing").count, yuanjingBefore + 17);
    assert.equal(player.find_obj_bypath("st/p#str").count, 2);
    assert.deepEqual(recovery.resources, ["st/yuanjing", 17, "st/p#str", 2]);
    assert.ok(lastJsonMessage(player, data => data.dialog === "pack" && data.id === item.id && data.remove === 1));
}
