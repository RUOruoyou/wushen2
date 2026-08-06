const MESSAGE = WORLD.MESSAGE;
const MAIL_EXPIRE_TIME = 30 * 24 * 3600000;
const MAIL_LIST_LIMIT = 200;
const NOTICE_LIST_LIMIT = 50;

MESSAGE.createSummary = function (content, maxLength) {
    const text = String(content || "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const limit = maxLength || 60;
    return text.length > limit ? text.substring(0, limit) + "..." : text;
}

MESSAGE.pushUserMessage = function (toid, from, msg) {
    if (!toid || !from || !from.id || !msg) return;
    let user = this.stores.get(toid);
    if (!user) {
        user = new Map();
        this.stores.set(toid, user);
    }
    let store = user.get(from.id);
    if (!store) {
        store = { name: from.name, items: [] };
        user.set(from.id, store);
    }
    if (msg.dedupe) {
        for (let item of store.items) {
            if (item.dedupe === msg.dedupe) return;
        }
    }
    msg.time = msg.time || Date.now();
    msg.content = msg.content || "";
    msg.title = msg.title || from.name || "系统邮件";
    msg.read = msg.read === true;
    msg.index = store.items.length;
    store.items.push(msg);
    return msg;
}

MESSAGE.hasUnclaimedAttachment = function (item) {
    return !!(item && item.attach && item.attach.length && !item.rec);
}

MESSAGE.getMailSummary = function (from, store, item, index) {
    const attach = item.attach || [];
    return {
        from: from,
        index: index,
        name: store.name || "系统",
        title: item.title || store.name || "系统邮件",
        summary: item.summary || this.createSummary(item.content),
        time: item.time,
        read: item.read !== false,
        hasAttach: attach.length > 0,
        claimable: this.hasUnclaimedAttachment(item),
        attachCount: attach.length
    };
}

MESSAGE.getUserMessages = function (me) {
    const stores = this.stores.get(me.id);
    const messages = [];
    const now = Date.now();
    if (!stores) return messages;
    stores.forEach((store, from) => {
        for (let i = 0; i < store.items.length; i++) {
            const item = store.items[i];
            if (!item || now - item.time >= MAIL_EXPIRE_TIME) continue;
            messages.push(this.getMailSummary(from, store, item, i));
        }
    });
    messages.sort((a, b) => b.time - a.time);
    return messages.slice(0, MAIL_LIST_LIMIT);
}

MESSAGE.getUnreadCount = function (me) {
    const stores = this.stores.get(me.id);
    let count = 0;
    const now = Date.now();
    if (!stores) return count;
    stores.forEach((store) => {
        for (let item of store.items) {
            if (item && now - item.time < MAIL_EXPIRE_TIME && item.read === false) count++;
        }
    });
    return count;
}

MESSAGE.getNotices = function () {
    const notices = [];
    for (let i = this.NOTICES.length - 1; i >= 0 && notices.length < NOTICE_LIST_LIMIT; i--) {
        const notice = this.NOTICES[i];
        if (!notice || notice.status === "withdrawn") continue;
        notices.push({
            index: i,
            id: notice.id,
            title: notice.title || "系统公告",
            summary: notice.summary || this.createSummary(notice.content),
            content: notice.content || "",
            time: notice.time,
            category: notice.category || "update",
            updatedAt: notice.updatedAt
        });
    }
    return notices;
}

MESSAGE.getMessageByIndex = function (me, from, index) {
    const stores = this.stores.get(me.id);
    if (!stores) return;
    const store = stores.get(from);
    return store && store.items[parseInt(index)];
}

MESSAGE.getMailDetail = function (me, from, index) {
    const stores = this.stores.get(me.id);
    if (!stores) return;
    const store = stores.get(from);
    if (!store) return;
    const mailIndex = parseInt(index);
    const item = store.items[mailIndex];
    if (!item) return;
    item.read = true;
    const detail = this.getMailSummary(from, store, item, mailIndex);
    detail.content = item.content || "";
    detail.attach = item.attach || [];
    detail.rec = item.rec === true;
    detail.detail = true;
    return detail;
}

MESSAGE.getMessageFromID = function (me, from, count) {
    let items = [];
    if (from === "notice") {
        items = this.NOTICES;
    } else {
        const stores = this.stores.get(me.id);
        if (!stores) return [];
        const store = stores.get(from);
        if (!store) return [];
        items = store.items;
    }
    const result = [];
    const offset = count || 0;
    const now = Date.now();
    for (let i = 0; i < 13; i++) {
        const index = items.length - offset - i - 1;
        if (index < 0) break;
        if (now - items[index].time < MAIL_EXPIRE_TIME) result.push(items[index]);
    }
    return result;
}

MESSAGE.markAllRead = function (me) {
    const stores = this.stores.get(me.id);
    let count = 0;
    if (!stores) return count;
    stores.forEach((store) => {
        for (let item of store.items) {
            if (item && item.read === false) {
                item.read = true;
                count++;
            }
        }
    });
    return count;
}

MESSAGE.reindexStore = function (store) {
    if (!store) return;
    for (let i = 0; i < store.items.length; i++) store.items[i].index = i;
}

MESSAGE.deleteMail = function (me, from, index) {
    const stores = this.stores.get(me.id);
    if (!stores) return { error: "你没有邮件。" };
    const store = stores.get(from);
    if (!store) return { error: "你没有这封邮件。" };
    const mailIndex = parseInt(index);
    const item = store.items[mailIndex];
    if (!item) return { error: "你没有这封邮件。" };
    if (this.hasUnclaimedAttachment(item)) {
        return { error: "这封邮件还有未领取附件，无法删除。" };
    }
    store.items.splice(mailIndex, 1);
    this.reindexStore(store);
    if (!store.items.length) stores.delete(from);
    if (!stores.size) this.stores.delete(me.id);
    return { count: 1 };
}

MESSAGE.deleteFrom = function (me, from) {
    const stores = this.stores.get(me.id);
    if (!stores) return { error: "你没有邮件。" };
    const store = stores.get(from);
    if (!store) return { error: "你没有这个类型的邮件。" };
    for (let item of store.items) {
        if (this.hasUnclaimedAttachment(item)) {
            return { error: "该类型邮件还有未领取附件，无法删除。" };
        }
    }
    const count = store.items.length;
    stores.delete(from);
    if (!stores.size) this.stores.delete(me.id);
    return { count: count };
}

MESSAGE.deleteEligible = function (me) {
    const stores = this.stores.get(me.id);
    let count = 0;
    if (!stores) return count;
    stores.forEach((store, from) => {
        for (let i = store.items.length - 1; i >= 0; i--) {
            const item = store.items[i];
            if (item.read === true && !this.hasUnclaimedAttachment(item)) {
                store.items.splice(i, 1);
                count++;
            }
        }
        this.reindexStore(store);
        if (!store.items.length) stores.delete(from);
    });
    if (!stores.size) this.stores.delete(me.id);
    return count;
}

MESSAGE.save = function () {
    const result = [];
    const now = Date.now();
    this.stores.forEach((stores, userId) => {
        const user = { id: userId, items: [] };
        stores.forEach((store, from) => {
            const savedStore = { uid: from, name: store.name, items: [] };
            for (let item of store.items) {
                if (!item || now - item.time >= MAIL_EXPIRE_TIME) continue;
                savedStore.items.push({
                    adminId: item.adminId,
                    time: item.time,
                    title: item.title,
                    summary: item.summary,
                    content: item.content || "",
                    attach: item.attach,
                    rec: item.rec === true,
                    read: item.read !== false,
                    dedupe: item.dedupe
                });
            }
            if (savedStore.items.length) user.items.push(savedStore);
        });
        if (user.items.length) result.push(user);
    });
    return JSON.stringify(result);
}

MESSAGE.saveNotice = function () {
    if (this.NOTICES.length > 500) this.NOTICES.splice(0, this.NOTICES.length - 500);
    return JSON.stringify(this.NOTICES);
}

function parseSavedValue(value, fallback) {
    let parsed = value;
    for (let i = 0; i < 2 && typeof parsed === "string"; i++) {
        if (!parsed.trim()) return fallback;
        try {
            parsed = JSON.toObject(parsed);
        } catch (error) {
            return fallback;
        }
    }
    return parsed === undefined || parsed === null ? fallback : parsed;
}

function normalizeSavedTime(value) {
    let time = Number(value);
    if (!(time > 0) && value) time = Date.parse(value);
    return time > 0 ? time : Date.now();
}

function normalizeAttachments(value) {
    const attach = parseSavedValue(value, []);
    if (Array.isArray(attach)) return attach;
    if (!attach || typeof attach !== "object") return [];
    if (attach.obj || attach.path || attach.name) return [attach];
    return Object.keys(attach).map((key) => attach[key]).filter(Boolean);
}

function isSavedMail(value) {
    return !!(value && typeof value === "object" && (
        value.content !== undefined || value.msg !== undefined || value.text !== undefined
        || value.title !== undefined || value.subject !== undefined || value.attach !== undefined
        || value.attachments !== undefined || value.time !== undefined || value.read !== undefined
        || value.rec !== undefined
    ));
}

function normalizeSavedMail(value, storeName) {
    const saved = parseSavedValue(value, value);
    const item = saved && typeof saved === "object" ? saved : { content: String(saved || "") };
    const content = item.content !== undefined ? item.content
        : item.msg !== undefined ? item.msg
            : item.text !== undefined ? item.text : "";
    return {
        title: item.title || item.subject || storeName || "系统邮件",
        summary: item.summary,
        content: String(content || ""),
        time: normalizeSavedTime(item.time || item.date || item.create_time),
        rec: item.rec === true || item.rec === 1 || item.received === true || item.claimed === true,
        read: item.read === undefined ? true : item.read === true || item.read === 1,
        attach: normalizeAttachments(item.attach !== undefined ? item.attach
            : item.attachments !== undefined ? item.attachments
                : item.objs !== undefined ? item.objs : item.items),
        dedupe: item.dedupe,
        adminId: item.adminId
    };
}

function pushSavedMail(stores, from, storeName, value) {
    from = String(from || "system");
    let store = stores.get(from);
    if (!store) {
        store = { name: storeName || "系统", items: [] };
        stores.set(from, store);
    } else if (!store.name && storeName) {
        store.name = storeName;
    }
    const mail = normalizeSavedMail(value, store.name);
    mail.index = store.items.length;
    store.items.push(mail);
}

function loadSavedStore(stores, from, value, fallbackName) {
    const savedStore = parseSavedValue(value, value);
    if (Array.isArray(savedStore)) {
        for (const item of savedStore) pushSavedMail(stores, from, fallbackName, item);
        return;
    }
    if (!savedStore || typeof savedStore !== "object" || isSavedMail(savedStore)) {
        pushSavedMail(stores, from, fallbackName, savedStore);
        return;
    }
    const storeName = savedStore.name || fallbackName;
    const items = parseSavedValue(savedStore.items !== undefined ? savedStore.items
        : savedStore.messages, []);
    if (Array.isArray(items)) {
        for (const item of items) pushSavedMail(stores, from, storeName, item);
    } else if (items && typeof items === "object") {
        for (const key of Object.keys(items)) pushSavedMail(stores, from, storeName, items[key]);
    }
}

function loadSavedStores(savedUser) {
    const stores = new Map();
    const rawStores = parseSavedValue(savedUser.items !== undefined ? savedUser.items
        : savedUser.stores !== undefined ? savedUser.stores
            : savedUser.messages !== undefined ? savedUser.messages : savedUser, []);
    if (Array.isArray(rawStores)) {
        for (const entryValue of rawStores) {
            const entry = parseSavedValue(entryValue, entryValue);
            if (Array.isArray(entry) && entry.length === 2) {
                loadSavedStore(stores, entry[0], entry[1]);
            } else if (entry && typeof entry === "object" && !isSavedMail(entry)
                && (entry.items !== undefined || entry.messages !== undefined)) {
                loadSavedStore(stores, entry.uid || entry.from || entry.id || "system",
                    entry, entry.name);
            } else {
                const from = entry && typeof entry === "object"
                    ? entry.uid || entry.from || entry.sender || "system" : "system";
                pushSavedMail(stores, from, entry && entry.name, entry);
            }
        }
    } else if (rawStores && typeof rawStores === "object") {
        for (const from of Object.keys(rawStores)) {
            if (from === "id" || from === "uid" || from === "userid") continue;
            loadSavedStore(stores, from, rawStores[from]);
        }
    }
    return stores;
}

function getSavedUsers(value) {
    const saved = parseSavedValue(value, []);
    if (Array.isArray(saved)) {
        return saved.map((entry) => {
            if (Array.isArray(entry) && entry.length === 2) return [entry[0], entry[1]];
            return [entry && (entry.id || entry.uid || entry.userid), entry];
        });
    }
    if (!saved || typeof saved !== "object") return [];
    if (saved.id || saved.uid || saved.userid) {
        return [[saved.id || saved.uid || saved.userid, saved]];
    }
    return Object.keys(saved).map((userId) => [userId, saved[userId]]);
}

function getSavedNotices(value) {
    const saved = parseSavedValue(value, []);
    if (Array.isArray(saved)) return saved;
    if (!saved || typeof saved !== "object") return [];
    if (saved.title !== undefined || saved.content !== undefined
        || saved.msg !== undefined || saved.text !== undefined) return [saved];
    return Object.keys(saved).map((key) => saved[key]);
}

MESSAGE.load = function (data) {
    data = data || {};
    this.stores.clear();
    this.NOTICES = getSavedNotices(data.notices).map((value, index) => {
        const notice = parseSavedValue(value, value);
        const item = notice && typeof notice === "object"
            ? notice : { content: String(notice || "") };
        const content = item.content !== undefined ? item.content
            : item.msg !== undefined ? item.msg : item.text || "";
        const time = normalizeSavedTime(item.time || item.date || item.create_time);
        return {
            id: item.id || "notice_" + time + "_" + index,
            title: item.title || "系统公告",
            summary: item.summary || this.createSummary(content),
            content: String(content || ""),
            time: time,
            category: item.category || "update",
            status: item.status === "withdrawn" ? "withdrawn" : "active",
            createdAt: normalizeSavedTime(item.createdAt || time),
            updatedAt: item.updatedAt ? normalizeSavedTime(item.updatedAt) : null,
            withdrawnAt: item.withdrawnAt ? normalizeSavedTime(item.withdrawnAt) : null,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            withdrawnBy: item.withdrawnBy
        };
    });
    let mailCount = 0;
    for (const [userId, savedUserValue] of getSavedUsers(data.messages)) {
        if (!userId) continue;
        const savedUser = parseSavedValue(savedUserValue, savedUserValue) || {};
        const stores = loadSavedStores(savedUser);
        stores.forEach((store) => { mailCount += store.items.length; });
        if (stores.size) this.stores.set(String(userId), stores);
    }
    console.log("邮箱与公告数据已加载，共" + mailCount + "封邮件、" + this.NOTICES.length + "条公告");
}
