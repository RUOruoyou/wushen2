this.inherits(COMMAND);
this.command = "packmanage";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.regex = /^(open|preview|execute)(?:\s+([\s\S]+))?$/;

const PACK_MANAGE_MAX_REQUEST = 16384;
const PACK_MANAGE_MAX_ITEMS = 200;
const PACK_MANAGE_TOKEN_TTL = 60000;
const PACK_MANAGE_RESULT_TTL = 120000;
const PACK_MANAGE_DIRECT_SEND_LIMIT = 28000;
const PACK_MANAGE_CHUNK_SIZE = 16000;
const PACK_MANAGE_QUALITY_VALUES = new Set([null, 0, 1, 2, 3, 4, 5, 6]);
const PACK_MANAGE_TRANSPORT_CRYPTO = UTIL.require("crypto");

this.sessions = new Map();

this.enter = function (me, action, payload) {
    const management = WORLD.ITEM_MANAGEMENT;
    if (!management) return me.notify("包裹整理服务尚未加载。");
    this.cleanupSessions();
    if (action === "open") return this.open(me, payload);
    if (action === "preview") return this.preview(me, payload);
    if (action === "execute") return this.execute(me, payload);
    return this.sendError(me, management.makeError("INVALID_REQUEST"));
};

this.cleanupSessions = function () {
    const now = Date.now();
    this.sessions.forEach(function (session, token, sessions) {
        const expires = session.executedAt ? session.executedAt + PACK_MANAGE_RESULT_TTL : session.expiresAt;
        if (expires <= now) sessions.delete(token);
    });
};

this.send = function (me, data) {
    data.type = "dialog";
    data.dialog = "packmanage";
    const text = JSON.stringify(data);
    if (text.length <= PACK_MANAGE_DIRECT_SEND_LIMIT) {
        me.send(text);
        return;
    }
    const payload = Buffer.from(text, "utf8").toString("base64");
    const total = Math.ceil(payload.length / PACK_MANAGE_CHUNK_SIZE);
    const transferId = PACK_MANAGE_TRANSPORT_CRYPTO.randomBytes(8).toString("hex");
    for (let index = 0; index < total; index++) {
        me.send(JSON.stringify({
            type: "dialog",
            dialog: "packmanage",
            phase: "transport",
            targetPhase: data.phase,
            action: data.action || null,
            transferId: transferId,
            index: index,
            total: total,
            payload: payload.slice(index * PACK_MANAGE_CHUNK_SIZE, (index + 1) * PACK_MANAGE_CHUNK_SIZE)
        }));
    }
};

this.sendError = function (me, error, extra) {
    this.send(me, Object.assign({
        phase: "error",
        code: error.code || "INTERNAL_ERROR",
        message: error.message || WORLD.ITEM_MANAGEMENT.errorMessages.INTERNAL_ERROR
    }, extra || {}));
};

this.parseOwner = function (payload) {
    const text = String(payload || "").trim();
    if (text === "self") return { type: "player" };
    const match = /^follower\s+([A-Za-z0-9_]+)$/.exec(text);
    if (!match) return null;
    return { type: "follower", id: match[1] };
};

this.open = function (me, payload) {
    const management = WORLD.ITEM_MANAGEMENT;
    const spec = this.parseOwner(payload);
    if (!spec) return this.sendError(me, management.makeError("INVALID_REQUEST"));
    const context = management.resolveOwner(me, spec, { requireHere: true });
    if (!context.ok) return this.sendError(me, context);
    const items = (context.owner.items || []).filter(Boolean).map(function (item) {
        return management.formatManageItem(context, item);
    });
    this.send(me, {
        phase: "open",
        protocol: 1,
        owner: context.ownerInfo,
        categories: management.categories.map(function (id) {
            return { id: id, name: management.categoryNames[id] };
        }),
        qualities: [
            { id: 0, name: "白色" }, { id: 1, name: "绿色" },
            { id: 2, name: "蓝色" }, { id: 3, name: "黄色" },
            { id: 4, name: "紫色" }, { id: 5, name: "橙色" },
            { id: 6, name: "红色" }, { id: null, name: "无品质" }
        ],
        items: items,
        snapshot: management.createSnapshot(context.owner, context.ownerInfo),
        storage: {
            used: context.storageOwner.stores ? context.storageOwner.stores.length : 0,
            max: context.storageOwner.max_store_count || 0
        }
    });
};

this.parsePreviewRequest = function (payload) {
    const management = WORLD.ITEM_MANAGEMENT;
    if (typeof payload !== "string" || payload.length === 0 || payload.length > PACK_MANAGE_MAX_REQUEST) {
        return management.makeError("INVALID_REQUEST");
    }
    let data;
    try {
        data = JSON.parse(payload);
    } catch (e) {
        return management.makeError("INVALID_REQUEST");
    }
    if (!data || data.version !== 1 || !management.actions.includes(data.action)) {
        return management.makeError("INVALID_REQUEST");
    }
    if (!data.owner || (data.owner.type !== "player" && data.owner.type !== "follower")) {
        return management.makeError("INVALID_REQUEST");
    }
    const owner = data.owner.type === "follower"
        ? { type: "follower", id: data.owner.id }
        : { type: "player" };
    if (owner.type === "follower" && !management.isSafeId(owner.id)) {
        return management.makeError("INVALID_REQUEST");
    }
    const categories = Array.isArray(data.categories) ? data.categories : [];
    if (categories.length > management.categories.length || categories.some(function (value) {
        return !management.categories.includes(value);
    })) return management.makeError("INVALID_REQUEST");
    const qualities = Array.isArray(data.qualities) ? data.qualities : [];
    if (qualities.length > 8 || qualities.some(function (value) {
        return !PACK_MANAGE_QUALITY_VALUES.has(value);
    })) return management.makeError("INVALID_REQUEST");
    const includeIds = Array.isArray(data.includeIds) ? data.includeIds : [];
    const excludeIds = Array.isArray(data.excludeIds) ? data.excludeIds : [];
    if (includeIds.length > PACK_MANAGE_MAX_ITEMS || excludeIds.length > PACK_MANAGE_MAX_ITEMS) {
        return management.makeError("INVALID_REQUEST");
    }
    if (includeIds.some(function (id) { return !management.isSafeId(id); }) ||
        excludeIds.some(function (id) { return !management.isSafeId(id); })) {
        return management.makeError("INVALID_REQUEST");
    }
    return management.makeSuccess({
        request: {
            action: data.action,
            owner: owner,
            categories: Array.from(new Set(categories)),
            qualities: Array.from(new Set(qualities)),
            includeIds: Array.from(new Set(includeIds)),
            excludeIds: Array.from(new Set(excludeIds))
        }
    });
};

this.matchesRequest = function (management, item, request, includeIds, excludeIds) {
    if (excludeIds.has(item.id)) return false;
    if (includeIds.size && !includeIds.has(item.id)) return false;
    const category = management.itemCategory(item);
    if (request.categories.length && !request.categories.includes(category)) return false;
    const quality = management.itemQuality(item, category);
    if (request.qualities.length && !request.qualities.some(function (value) { return value === quality; })) {
        return false;
    }
    return true;
};

this.actionFor = function (management, context, action, item) {
    if (action === "sell") return management.checkSell(item, { bulk: true });
    if (action === "store") return management.checkStore(item, { bulk: true });
    return management.checkDisassemble(context.owner, item, { bulk: true });
};

this.createCapacityState = function (context, action) {
    if (action === "store") {
        const paths = new Set();
        for (const item of context.storageOwner.stores || []) {
            if (item && item.combined) paths.add(item.path);
        }
        return {
            used: context.storageOwner.stores ? context.storageOwner.stores.length : 0,
            max: context.storageOwner.max_store_count || 0,
            paths: paths
        };
    }
    if (action === "disassemble") {
        const paths = new Set();
        for (const item of context.owner.items || []) {
            if (item && item.combined) paths.add(item.path);
        }
        return {
            used: context.owner.items ? context.owner.items.length : 0,
            max: context.owner.max_item_count || 0,
            paths: paths
        };
    }
    return null;
};

this.reserveCapacity = function (management, context, action, item, state) {
    if (!state) return management.makeSuccess();
    if (action === "store") {
        let slots = 1;
        if (item.combined && state.paths.has(item.path)) slots = 0;
        if (state.used + slots > state.max) return management.makeError("STORAGE_FULL");
        state.used += slots;
        if (item.combined) state.paths.add(item.path);
        return management.makeSuccess({ slots: slots });
    }
    const outputs = management.queryDisassembleOutputs(context.owner, item);
    let used = state.used - 1;
    const paths = new Set(state.paths);
    for (const output of outputs) {
        let sample;
        try {
            sample = OBJ.CREATE(output.path, output.count);
        } catch (e) {
            sample = null;
        }
        if (!sample) return management.makeError("INTERNAL_ERROR");
        if (sample.combined) {
            if (!paths.has(sample.path)) {
                paths.add(sample.path);
                used++;
            }
        } else {
            used += sample.count > 0 ? sample.count : 1;
        }
    }
    if (used > state.max) return management.makeError("OUTPUT_CAPACITY_FULL");
    state.used = used;
    state.paths = paths;
    return management.makeSuccess({ outputs: management.describeOutputs(outputs) });
};

this.preview = function (me, payload) {
    const management = WORLD.ITEM_MANAGEMENT;
    if (me._packManageLastPreview && Date.now() - me._packManageLastPreview < 250) {
        return this.sendError(me, management.makeError("OPERATION_BUSY", "操作过于频繁，请稍后再试。"));
    }
    me._packManageLastPreview = Date.now();
    const parsed = this.parsePreviewRequest(payload);
    if (!parsed.ok) return this.sendError(me, parsed);
    const request = parsed.request;
    const context = management.resolveOwner(me, request.owner, { requireHere: true, requireReady: true });
    if (!context.ok) return this.sendError(me, context, { action: request.action });
    const includeIds = new Set(request.includeIds);
    const excludeIds = new Set(request.excludeIds);
    const matched = [];
    const skipped = [];
    const entries = [];
    const capacityState = this.createCapacityState(context, request.action);
    const summary = {
        itemKinds: 0,
        itemCount: 0,
        money: 0,
        requiredSlots: 0,
        mergedCount: 0,
        storageUsed: capacityState && request.action === "store" ? capacityState.used : 0,
        storageMax: capacityState && request.action === "store" ? capacityState.max : 0,
        storageRemaining: capacityState && request.action === "store"
            ? Math.max(0, capacityState.max - capacityState.used)
            : 0,
        outputs: [],
        highRiskCount: 0,
        criticalRiskCount: 0,
        highRiskItems: []
    };
    const outputMap = new Map();
    const kindPaths = new Set();

    for (const item of context.owner.items || []) {
        if (!item || !this.matchesRequest(management, item, request, includeIds, excludeIds)) continue;
        const formatted = management.formatManageItem(context, item);
        const action = this.actionFor(management, context, request.action, item);
        if (!action.allowed) {
            skipped.push({ id: item.id, name: item.color_name, code: action.reason, message: action.message });
            continue;
        }
        const reserved = this.reserveCapacity(management, context, request.action, item, capacityState);
        if (!reserved.ok) {
            skipped.push({ id: item.id, name: item.color_name, code: reserved.code, message: reserved.message });
            continue;
        }
        if (reserved.slots) summary.requiredSlots += reserved.slots;
        const count = item.count > 0 ? item.count : 1;
        if (request.action === "store" && !reserved.slots) summary.mergedCount += count;
        if (request.action === "sell") summary.money += Math.floor(item.value * count);
        if (request.action === "disassemble") {
            const outputs = reserved.outputs || action.outputs || [];
            for (const output of outputs) {
                const old = outputMap.get(output.path);
                if (old) old.count += output.count;
                else outputMap.set(output.path, Object.assign({}, output));
            }
        }
        if (item.grade >= 4 && (request.action === "sell" || request.action === "disassemble")) {
            summary.highRiskCount++;
            if (item.grade >= 5) summary.criticalRiskCount++;
            summary.highRiskItems.push({ id: item.id, name: item.color_name, grade: item.grade });
        }
        kindPaths.add(item.path);
        summary.itemCount += count;
        matched.push(formatted);
        entries.push({
            id: item.id,
            fingerprint: management.itemFingerprint(item, request.action, context.owner)
        });
        if (entries.length >= PACK_MANAGE_MAX_ITEMS) break;
    }
    summary.itemKinds = kindPaths.size;
    if (request.action === "store" && capacityState) {
        summary.storageRemaining = Math.max(0, capacityState.max - capacityState.used);
    }
    summary.outputs = Array.from(outputMap.values());
    if (!entries.length) {
        return this.sendError(me, management.makeError("INVALID_REQUEST", "没有符合条件且可以执行的物品。"), {
            action: request.action
        });
    }
    const token = management.crypto.randomBytes(16).toString("hex");
    const now = Date.now();
    this.sessions.forEach(function (session, oldToken, sessions) {
        if (session.status !== "pending" || session.playerId !== me.id) return;
        if (session.request.action !== request.action) return;
        if (session.request.owner.type !== request.owner.type) return;
        if ((session.request.owner.id || "") !== (request.owner.id || "")) return;
        sessions.delete(oldToken);
    });
    this.sessions.set(token, {
        token: token,
        playerId: me.id,
        request: request,
        ownerInfo: context.ownerInfo,
        entries: entries,
        createdAt: now,
        expiresAt: now + PACK_MANAGE_TOKEN_TTL,
        status: "pending"
    });
    this.send(me, {
        phase: "preview",
        token: token,
        expiresAt: now + PACK_MANAGE_TOKEN_TTL,
        owner: context.ownerInfo,
        action: request.action,
        matched: matched,
        skipped: skipped,
        summary: summary
    });
};

this.executeItem = function (management, context, action, item) {
    if (action === "sell") return management.executeSell(context, item);
    if (action === "store") return management.executeStore(context, item);
    return management.executeDisassemble(context, item);
};

this.execute = function (me, payload) {
    const management = WORLD.ITEM_MANAGEMENT;
    const token = String(payload || "").trim();
    if (!/^[a-f0-9]{32}$/.test(token)) return this.sendError(me, management.makeError("INVALID_REQUEST"));
    const session = this.sessions.get(token);
    if (!session || session.playerId !== me.id) return this.sendError(me, management.makeError("PREVIEW_EXPIRED"));
    if (session.status === "executed") return this.send(me, session.result);
    if (session.expiresAt <= Date.now()) {
        this.sessions.delete(token);
        return this.sendError(me, management.makeError("PREVIEW_EXPIRED"), { action: session.request.action });
    }
    if (me._packManageRunning) {
        return this.sendError(me, management.makeError("OPERATION_BUSY"), { action: session.request.action });
    }
    if (!(me.hp > 0) || me.is_faint || me.fight_type > 0 || me.is_busy) {
        return this.sendError(me, management.makeError("OWNER_BUSY", "你当前正忙，无法执行包裹整理。"), {
            action: session.request.action
        });
    }
    const context = management.resolveOwner(me, session.request.owner, { requireHere: true, requireReady: true });
    if (!context.ok) return this.sendError(me, context, { action: session.request.action });

    me._packManageRunning = token;
    const succeeded = [];
    const skipped = [];
    const failed = [];
    let money = 0;
    let requiredSlots = 0;
    let mergedCount = 0;
    const outputMap = new Map();
    try {
        for (const entry of session.entries) {
            const item = context.owner.find_obj(entry.id);
            if (!item) {
                skipped.push({ id: entry.id, code: "ITEM_NOT_FOUND", message: management.errorMessages.ITEM_NOT_FOUND });
                continue;
            }
            if (management.itemFingerprint(item, session.request.action, context.owner) !== entry.fingerprint) {
                skipped.push({ id: item.id, name: item.color_name, code: "ITEM_CHANGED", message: management.errorMessages.ITEM_CHANGED });
                continue;
            }
            const result = this.executeItem(management, context, session.request.action, item);
            if (!result.ok) {
                const target = result.code === "INTERNAL_ERROR" ? failed : skipped;
                target.push({ id: item.id, name: item.color_name, code: result.code, message: result.message });
                continue;
            }
            succeeded.push(result.item);
            money += result.money || 0;
            requiredSlots += result.slots || 0;
            mergedCount += result.merged || 0;
            for (const output of result.outputs || []) {
                const old = outputMap.get(output.path);
                if (old) old.count += output.count;
                else outputMap.set(output.path, Object.assign({}, output));
            }
        }
        const result = {
            phase: "result",
            operationId: "pack_" + token,
            owner: context.ownerInfo,
            action: session.request.action,
            succeeded: succeeded,
            skipped: skipped,
            failed: failed,
            summary: {
                succeeded: succeeded.length,
                skipped: skipped.length,
                failed: failed.length,
                money: money,
                requiredSlots: requiredSlots,
                mergedCount: mergedCount,
                storageRemaining: Math.max(0, (context.storageOwner.max_store_count || 0) -
                    (context.storageOwner.stores ? context.storageOwner.stores.length : 0)),
                outputs: Array.from(outputMap.values())
            },
            snapshot: management.createSnapshot(context.owner, context.ownerInfo),
            storage: {
                used: context.storageOwner.stores ? context.storageOwner.stores.length : 0,
                max: context.storageOwner.max_store_count || 0
            }
        };
        session.status = "executed";
        session.executedAt = Date.now();
        session.result = result;
        WORLD.log(me, result.operationId, "包裹整理" + session.request.action + "成功" + succeeded.length +
            "项，跳过" + skipped.length + "项，失败" + failed.length + "项");
        this.send(me, result);
    } catch (e) {
        WORLD.log(me, "packmanage", e.message + e.stack);
        this.sendError(me, management.makeError("INTERNAL_ERROR"), { action: session.request.action });
    } finally {
        me._packManageRunning = null;
    }
};
