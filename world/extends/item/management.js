const MANAGEMENT_CRYPTO = UTIL.require("crypto");

const MANAGEMENT_CATEGORIES = [
    "fragment", "manual", "equipment", "stone", "material",
    "consumable", "misc", "quest", "special"
];
const MANAGEMENT_ACTIONS = ["sell", "store", "disassemble"];
const MANAGEMENT_CATEGORY_NAMES = {
    fragment: "武功残页",
    manual: "武功秘籍",
    equipment: "装备",
    stone: "宝石晶石",
    material: "材料资源",
    consumable: "消耗品",
    misc: "杂物",
    quest: "任务物品",
    special: "特殊物品"
};
const MANAGEMENT_ERROR_MESSAGES = {
    INVALID_REQUEST: "整理请求格式不正确。",
    OWNER_NOT_FOUND: "没有找到要整理的背包。",
    OWNER_NOT_ALLOWED: "你无权整理这个背包。",
    OWNER_NOT_HERE: "侍从不在你身边。",
    OWNER_BUSY: "当前状态无法整理这个背包。",
    ITEM_NOT_FOUND: "物品已经不在背包中。",
    ITEM_CHANGED: "物品状态已经发生变化。",
    ITEM_LOCKED: "物品处于锁定状态。",
    ITEM_EQUIPPED: "已装备物品不能批量处理。",
    ITEM_PROTECTED: "任务、剧情或特殊物品受到保护。",
    NOT_SELLABLE: "物品不可出售。",
    NOT_STORABLE: "物品不可存入仓库。",
    NOT_DISASSEMBLABLE: "物品不可分解。",
    REFINED_PROTECTED: "精炼装备默认不参与批量处理。",
    SOCKETED_PROTECTED: "镶嵌装备不能批量出售或分解。",
    STORAGE_FULL: "仓库容量不足。",
    OUTPUT_CAPACITY_FULL: "背包无法容纳分解产物。",
    PREVIEW_EXPIRED: "整理预览已经过期，请重新预览。",
    PREVIEW_USED: "这次整理已经执行过了。",
    OPERATION_BUSY: "当前已有整理操作正在执行。",
    INTERNAL_ERROR: "整理过程中发生异常，相关物品已保持原状。"
};
const FRAGMENT_PATHS = new Set(["book/bc", "book/up", "book/wd"]);
const QUALITY_CATEGORIES = new Set(["fragment", "manual", "equipment", "stone", "material"]);
const HIGH_GRADE_COUNTS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 6];

function basePath(path) {
    return String(path || "").split("#")[0];
}

function makeError(code, message) {
    return {
        ok: false,
        code: code,
        message: message || MANAGEMENT_ERROR_MESSAGES[code] || MANAGEMENT_ERROR_MESSAGES.INTERNAL_ERROR
    };
}

function makeSuccess(data) {
    data = data || {};
    data.ok = true;
    return data;
}

function isSafeId(value) {
    return typeof value === "string" && value.length > 0 && value.length <= 80 && /^[A-Za-z0-9_]+$/.test(value);
}

function itemCategory(item) {
    if (!item) return "misc";
    if (MANAGEMENT_CATEGORIES.includes(item.manage_category)) return item.manage_category;
    if (item.manage_task || item.task_item || item.is_task_item) return "quest";
    if (item.manage_special) return "special";
    if (item.is_equipment) return "equipment";
    const path = basePath(item.path);
    if (FRAGMENT_PATHS.has(path)) return "fragment";
    if (path.startsWith("book/")) return "manual";
    if (path.startsWith("st/")) return "stone";
    if (path.startsWith("res/")) return "material";
    if (path.startsWith("drug/") || path.startsWith("food/")) return "consumable";
    if (path.startsWith("sp/")) return item.no_drop ? "quest" : "special";
    if (path.startsWith("cash/") || path.startsWith("money/")) return "special";
    if (item.otype === 1) return "manual";
    if (item.otype === 2) return "stone";
    if (item.otype === 3) return "material";
    if (item.otype === 4) return "equipment";
    return "misc";
}

function itemUsesQuality(item, category) {
    if (!item) return false;
    category = category || itemCategory(item);
    if (item.manage_quality === false) return false;
    if (item.manage_quality === true || item.is_equipment || QUALITY_CATEGORIES.has(category)) return true;
    return item.grade > 0;
}

function itemQuality(item, category) {
    if (!item) return null;
    category = category || itemCategory(item);
    if (!itemUsesQuality(item, category)) return null;
    const grade = parseInt(item.grade);
    return grade >= 0 && grade <= 6 ? grade : null;
}

function isProtectedItem(item, category) {
    if (!item) return true;
    category = category || itemCategory(item);
    if (item.manage_protected || item.manage_task || item.task_item || item.is_task_item ||
        item.manage_special || item.no_batch || item.no_drop) return true;
    return category === "quest" || category === "special";
}

function actionResult(allowed, code, extra) {
    const result = Object.assign({ allowed: !!allowed }, extra || {});
    if (!allowed) {
        result.reason = code;
        result.message = MANAGEMENT_ERROR_MESSAGES[code] || MANAGEMENT_ERROR_MESSAGES.INVALID_REQUEST;
    }
    return result;
}

function checkSell(item, options) {
    options = options || {};
    const category = itemCategory(item);
    if (!item) return actionResult(false, "ITEM_NOT_FOUND");
    if (item.is_locked) return actionResult(false, "ITEM_LOCKED");
    if (isProtectedItem(item, category) || item.no_sell) return actionResult(false, "ITEM_PROTECTED");
    if (item.st_prop && item.st_prop.length) return actionResult(false, "SOCKETED_PROTECTED");
    if (item.is_equipment && options.bulk && item.level > 0) return actionResult(false, "REFINED_PROTECTED");
    if (item.is_equipment && item.level > 3) return actionResult(false, "REFINED_PROTECTED");
    const itemPath = basePath(item.path);
    const isBasicManual = category === "manual" &&
        (itemPath === "book/book" || itemPath === "book/bk") && parseInt(item.grade) === 0;
    if ((!item.transable && !isBasicManual) || !(item.value > 0)) {
        return actionResult(false, "NOT_SELLABLE");
    }
    const count = item.count > 0 ? item.count : 1;
    return actionResult(true, null, { value: Math.floor(item.value * count) });
}

function checkStore(item, options) {
    options = options || {};
    const category = itemCategory(item);
    if (!item) return actionResult(false, "ITEM_NOT_FOUND");
    if (options.bulk && item.is_locked) return actionResult(false, "ITEM_LOCKED");
    if (item.no_store || (options.bulk && isProtectedItem(item, category))) {
        return actionResult(false, "NOT_STORABLE");
    }
    return actionResult(true);
}

function aggregateOutputs(outputs) {
    const values = new Map();
    for (const output of outputs || []) {
        if (!output || !output.path || !(output.count > 0)) continue;
        const old = values.get(output.path);
        if (old) {
            old.count += output.count;
        } else {
            values.set(output.path, { path: output.path, count: output.count });
        }
    }
    return Array.from(values.values());
}

function describeOutputs(outputs) {
    const result = [];
    for (const output of aggregateOutputs(outputs)) {
        let sample;
        try {
            sample = OBJ.CREATE(output.path, output.count);
        } catch (e) {
            sample = null;
        }
        result.push({
            path: output.path,
            count: output.count,
            name: sample ? sample.color_name : output.path,
            unit: sample ? sample.unit : "个",
            grade: sample ? sample.grade : 0
        });
    }
    return result;
}

function queryDisassembleOutputs(owner, item) {
    if (item.grade < 5) {
        let count = Math.floor(item.value / 1000);
        if (item.level > 0) count += (Math.pow(2, item.level + 1) - 2) * item.grade;
        count += owner.query_prop ? owner.query_prop("fenjie") : 0;
        return count > 0 ? [{ path: "st/xuanjing", count: count }] : [];
    }

    const command = WORLD.COMMANDS.duanzao;
    if (!command || !command.PROPS || !command.DEFAULT_PROPS) return [];
    const index = Math.max(0, Math.min(HIGH_GRADE_COUNTS.length - 1, parseInt(item.level) || 0));
    let count = HIGH_GRADE_COUNTS[index];
    const outputs = [];
    const path = basePath(item.path);
    if (path === "eq/cp" || path === "eq/zb") {
        const temp = item.temp || {};
        for (const key in temp) {
            const level = temp[key];
            const prop = command.PROPS[key];
            if (!level || !prop) continue;
            outputs.push({ path: "st/p#" + key, count: command.sum_needs(prop, level) });
        }
        count += 8 + (item.query_temp ? item.query_temp("sc", 0) : 0);
    } else {
        const props = item.prop;
        if (!props) return [];
        const defaultProp = command.DEFAULT_PROPS[item.eq_type];
        for (const prop in props) {
            if (!command.PROPS[prop] || (defaultProp && defaultProp === prop)) continue;
            outputs.push({ path: "st/p#" + prop, count: item.query_temp ? item.query_temp(prop, 1) : 1 });
        }
    }
    outputs.unshift({ path: "st/yuanjing", count: count });
    return aggregateOutputs(outputs);
}

function checkDisassemble(owner, item, options) {
    options = options || {};
    const category = itemCategory(item);
    if (!item) return actionResult(false, "ITEM_NOT_FOUND");
    if (item.is_locked) return actionResult(false, "ITEM_LOCKED");
    if (isProtectedItem(item, category)) return actionResult(false, "ITEM_PROTECTED");
    if (!item.is_equipment || item.no_fenjie || !(item.grade > 0)) {
        return actionResult(false, "NOT_DISASSEMBLABLE");
    }
    if (item.st_prop && item.st_prop.length) return actionResult(false, "SOCKETED_PROTECTED");
    if (options.bulk && item.level > 0) return actionResult(false, "REFINED_PROTECTED");
    const outputs = queryDisassembleOutputs(owner, item);
    if (!outputs.length) return actionResult(false, "NOT_DISASSEMBLABLE");
    return actionResult(true, null, {
        outputs: describeOutputs(outputs),
        highRisk: item.grade >= 4
    });
}

function findStoreItem(storageOwner, item) {
    if (!item || !item.combined || !storageOwner.stores) return null;
    for (const stored of storageOwner.stores) {
        if (stored && stored.path === item.path) return stored;
    }
    return null;
}

function queryStoreSlots(storageOwner, item, virtualPaths) {
    if (!item) return 0;
    if (!item.combined) return 1;
    const path = item.path;
    if (virtualPaths && virtualPaths.has(path)) return 0;
    return findStoreItem(storageOwner, item) ? 0 : 1;
}

function createOutputObjects(outputs) {
    const result = [];
    for (const output of aggregateOutputs(outputs)) {
        let item;
        try {
            item = OBJ.CREATE(output.path, output.count);
        } catch (e) {
            item = null;
        }
        if (!item) return null;
        result.push(item);
    }
    return result;
}

function snapshotCounts(items) {
    const counts = new Map();
    for (const item of items || []) {
        if (item) counts.set(item, item.count);
    }
    return counts;
}

function restoreCounts(counts) {
    counts.forEach(function (count, item) {
        item.count = count;
    });
}

function notifyRemovedAction(owner, original, removed) {
    if (removed === original && removed && typeof removed.notify_action === "function") {
        removed.notify_action(owner, false);
    }
}

function notifyAddedAction(owner, item) {
    if (item && typeof item.notify_action === "function") item.notify_action(owner, true);
}

function canReceiveOutputs(owner, sourceItem, outputs) {
    const max = parseInt(owner.max_item_count) || 0;
    let used = owner.items ? owner.items.length : 0;
    const paths = new Set();
    for (const item of owner.items || []) {
        if (!item || item === sourceItem || !item.combined) continue;
        paths.add(item.path);
    }
    if ((owner.items || []).includes(sourceItem)) used--;
    const created = createOutputObjects(outputs);
    if (!created) return false;
    for (const item of created) {
        if (item.combined) {
            if (!paths.has(item.path)) {
                paths.add(item.path);
                used++;
            }
        } else {
            used += item.count > 0 ? item.count : 1;
        }
    }
    return used <= max;
}

function resolveOwner(player, spec, options) {
    options = options || {};
    const type = spec && spec.type === "follower" ? "follower" : "player";
    if (type === "player") {
        return makeSuccess({
            owner: player,
            storageOwner: player,
            moneyOwner: player,
            ownerInfo: { type: "player", id: player.id, name: player.name }
        });
    }
    const id = spec && spec.id;
    if (!isSafeId(id)) return makeError("INVALID_REQUEST");
    const owner = FOLLOWER.STORES.get(player.id + "_" + id);
    if (!owner) return makeError("OWNER_NOT_FOUND");
    if (owner.master !== player.id) return makeError("OWNER_NOT_ALLOWED");
    if (options.requireHere !== false && owner.environment !== player.environment) {
        return makeError("OWNER_NOT_HERE");
    }
    if (!(owner.hp > 0)) return makeError("OWNER_BUSY", "侍从当前无法整理背包。");
    if (options.requireReady && (owner.fight_type || owner.is_busy || owner.is_faint)) {
        return makeError("OWNER_BUSY");
    }
    return makeSuccess({
        owner: owner,
        storageOwner: player,
        moneyOwner: player,
        ownerInfo: { type: "follower", id: owner.id, name: owner.name, masterId: player.id }
    });
}

function formatPackItem(item) {
    return {
        name: item.color_name,
        id: item.id,
        count: item.count,
        grade: item.grade,
        unit: item.unit,
        value: item.transable ? item.value : 0,
        can_eq: item.is_equipment ? 1 : 0,
        can_use: item.on_use ? 1 : 0,
        can_study: item.on_study ? 1 : 0,
        can_open: item.on_open ? 1 : 0,
        can_combine: item.combine_count || 0,
        is_lock: item.is_locked ? 1 : 0,
        otype: item.otype
    };
}

function formatEquipment(item) {
    if (!item) return null;
    return {
        name: item.color_name,
        id: item.id,
        grade: item.grade,
        can_use: item.on_use ? 1 : 0,
        is_lock: item.is_locked ? 1 : 0
    };
}

function createSnapshot(owner, ownerInfo) {
    return {
        owner: ownerInfo,
        money: owner.money || 0,
        capacity: {
            used: owner.items ? owner.items.length : 0,
            max: owner.max_item_count || 0
        },
        items: (owner.items || []).filter(Boolean).map(formatPackItem),
        equipment: (owner.equipment || []).map(formatEquipment)
    };
}

function formatManageItem(context, item) {
    const category = itemCategory(item);
    const quality = itemQuality(item, category);
    const sell = checkSell(item, { bulk: true });
    const store = checkStore(item, { bulk: true });
    if (store.allowed) store.slots = queryStoreSlots(context.storageOwner, item);
    const disassemble = checkDisassemble(context.owner, item, { bulk: true });
    return {
        id: item.id,
        path: item.path,
        name: item.color_name,
        plainName: item.name,
        category: category,
        categoryName: MANAGEMENT_CATEGORY_NAMES[category],
        quality: quality,
        qualityApplies: itemUsesQuality(item, category),
        grade: item.grade,
        count: item.count,
        unit: item.unit,
        value: item.value || 0,
        flags: {
            locked: !!item.is_locked,
            equipped: false,
            refined: !!(item.is_equipment && item.level > 0),
            socketed: !!(item.st_prop && item.st_prop.length),
            task: category === "quest",
            special: category === "special"
        },
        actions: {
            sell: sell,
            store: store,
            disassemble: disassemble
        }
    };
}

function itemFingerprint(item, action, owner) {
    const outputs = action === "disassemble" && owner
        ? queryDisassembleOutputs(owner, item).map(function (output) {
            return { path: output.path, count: output.count };
        })
        : [];
    return JSON.stringify({
        id: item.id,
        path: item.path,
        count: item.count,
        grade: item.grade,
        level: item.level || 0,
        locked: !!item.is_locked,
        stones: (item.st_prop || []).map(function (stone) {
            return stone && (stone.path || stone.id || stone.prop || "stone");
        }),
        category: itemCategory(item),
        value: item.value || 0,
        transable: !!item.transable,
        noSell: !!item.no_sell,
        noStore: !!item.no_store,
        noDisassemble: !!item.no_fenjie,
        protected: isProtectedItem(item),
        combined: !!item.combined,
        outputs: outputs
    });
}

function executeSell(context, item) {
    const allowed = checkSell(item, { bulk: true });
    if (!allowed.allowed) return makeError(allowed.reason, allowed.message);
    const count = item.count > 0 ? item.count : 1;
    const value = Math.floor(item.value * count);
    const removed = context.owner.remove_item(item, count);
    if (!removed) return makeError("ITEM_CHANGED");
    if (!context.moneyOwner.add_money(value)) {
        context.owner.push_item(removed);
        return makeError("INTERNAL_ERROR");
    }
    notifyRemovedAction(context.owner, item, removed);
    return makeSuccess({
        item: { id: item.id, name: item.color_name, count: count },
        money: value
    });
}

function executeStore(context, item) {
    const allowed = checkStore(item, { bulk: true });
    if (!allowed.allowed) return makeError(allowed.reason, allowed.message);
    const storage = context.storageOwner;
    storage.stores = storage.stores || [];
    const stored = findStoreItem(storage, item);
    if (!stored && storage.stores.length >= storage.max_store_count) return makeError("STORAGE_FULL");
    const ownerItems = context.owner.items.slice();
    const storeItems = storage.stores.slice();
    const ownerCounts = snapshotCounts(ownerItems);
    const storeCounts = snapshotCounts(storeItems);
    try {
        const count = item.count > 0 ? item.count : 1;
        const moved = context.owner.remove_item(item, count);
        if (!moved) return makeError("ITEM_CHANGED");
        let target = stored;
        if (moved.combined && target) {
            target.count += moved.count;
        } else {
            storage.stores.push(moved);
            target = moved;
        }
        notifyRemovedAction(context.owner, item, moved);
        return makeSuccess({
            item: { id: item.id, name: item.color_name, count: count },
            storeId: target.id,
            slots: stored ? 0 : 1,
            merged: stored ? count : 0
        });
    } catch (e) {
        context.owner.items = ownerItems;
        storage.stores = storeItems;
        restoreCounts(ownerCounts);
        restoreCounts(storeCounts);
        return makeError("INTERNAL_ERROR");
    }
}

function executeDisassemble(context, item) {
    const allowed = checkDisassemble(context.owner, item, { bulk: true });
    if (!allowed.allowed) return makeError(allowed.reason, allowed.message);
    const outputs = queryDisassembleOutputs(context.owner, item);
    if (!canReceiveOutputs(context.owner, item, outputs)) return makeError("OUTPUT_CAPACITY_FULL");
    const created = createOutputObjects(outputs);
    if (!created) return makeError("INTERNAL_ERROR");
    const ownerItems = context.owner.items.slice();
    const ownerCounts = snapshotCounts(ownerItems);
    try {
        const removed = context.owner.remove_item(item, item.count || 1);
        if (!removed) return makeError("ITEM_CHANGED");
        const added = [];
        for (const output of created) {
            const target = context.owner.push_item(output);
            if (!target) throw new Error("failed to add disassemble output");
            added.push(target);
        }
        notifyRemovedAction(context.owner, item, removed);
        for (const output of added) notifyAddedAction(context.owner, output);
        return makeSuccess({
            item: { id: item.id, name: item.color_name, count: 1 },
            outputs: describeOutputs(outputs)
        });
    } catch (e) {
        context.owner.items = ownerItems;
        restoreCounts(ownerCounts);
        return makeError("INTERNAL_ERROR");
    }
}

WORLD.ITEM_MANAGEMENT = {
    actions: MANAGEMENT_ACTIONS,
    categories: MANAGEMENT_CATEGORIES,
    categoryNames: MANAGEMENT_CATEGORY_NAMES,
    errorMessages: MANAGEMENT_ERROR_MESSAGES,
    crypto: MANAGEMENT_CRYPTO,
    makeError: makeError,
    makeSuccess: makeSuccess,
    isSafeId: isSafeId,
    resolveOwner: resolveOwner,
    itemCategory: itemCategory,
    itemUsesQuality: itemUsesQuality,
    itemQuality: itemQuality,
    formatManageItem: formatManageItem,
    formatPackItem: formatPackItem,
    createSnapshot: createSnapshot,
    itemFingerprint: itemFingerprint,
    checkSell: checkSell,
    checkStore: checkStore,
    checkDisassemble: checkDisassemble,
    queryDisassembleOutputs: queryDisassembleOutputs,
    queryStoreSlots: queryStoreSlots,
    canReceiveOutputs: canReceiveOutputs,
    executeSell: executeSell,
    executeStore: executeStore,
    executeDisassemble: executeDisassemble,
    describeOutputs: describeOutputs
};
