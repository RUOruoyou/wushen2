const ADMIN_MESSAGE = WORLD.MESSAGE;
const ADMIN_CRYPTO = UTIL.require("crypto");
const ADMIN_CATEGORIES = ["update", "activity", "maintenance", "system"];
const ADMIN_ALLOWED_TAGS = /^(?:\/?(?:hiy|hic|hig|hio|hir|hiw|hiz|him|red|wht|yel|cyn|mag|blu|blk|ora|ord|mem|nor)|br\s*\/?)$/i;
const ADMIN_ATTACHMENT_CATEGORIES = [
    { id: "currency", name: "货币资源" },
    { id: "consumable", name: "丹药消耗品" },
    { id: "book", name: "武学书籍与残页" },
    { id: "material", name: "材料与晶石" },
    { id: "equipment", name: "武器装备" },
    { id: "special", name: "活动与特殊物品" }
];
const ADMIN_ATTACHMENT_PREFIXES = ["cash/", "drug/", "eq/", "food/", "money/", "res/", "st/", "book/"];
const ADMIN_MAX_ATTACHMENT_COUNT = 100000000;
const ADMIN_ATTACHMENT_EXCLUDES = new Set([
    "book/bc", "book/bk", "book/book", "book/ts",
    "cash/box_sm", "cash/new_box", "cash/sm", "cash/tool_box2",
    "eq/cp", "eq/zb", "eq/family", "food/desk", "food/desk2", "money/bp"
]);
const ADMIN_PARAMETERIZED_ATTACHMENTS = new Set([
    "book/bc", "book/bk", "book/book", "book/ts", "cash/jing", "cash/tool",
    "drug/buff", "drug/exp", "drug/limit_mp", "drug/max_mp", "drug/pot", "drug/sdrug",
    "drug/skill2", "drug/yao", "eq/cp", "eq/zb", "eq/family", "food/desk", "food/drink", "food/food",
    "food/marry", "res/cao", "res/yu", "st/p", "st/st_blu", "st/st_ds", "st/st_fy",
    "st/st_gj", "st/st_gre", "st/st_mz", "st/st_red", "st/st_s2", "st/st_sc", "st/st_yel"
]);
let adminAttachmentCatalogCache = null;

function createAdminId(prefix) {
    return prefix + "_" + ADMIN_CRYPTO.randomBytes(12).toString("hex");
}

function plainText(value, maxLength, fieldName, required) {
    let text = String(value || "").replace(/<[^>]*>/g, "").trim();
    if (required && !text) throw new Error(fieldName + "不能为空");
    if (text.length > maxLength) throw new Error(fieldName + "不能超过" + maxLength + "个字符");
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function richText(value, maxLength, fieldName, required) {
    let text = String(value || "").trim();
    if (required && !text) throw new Error(fieldName + "不能为空");
    if (text.length > maxLength) throw new Error(fieldName + "不能超过" + maxLength + "个字符");
    return text.replace(/<([^>]+)>/g, function (match, tag) {
        if (ADMIN_ALLOWED_TAGS.test(tag.trim())) return match;
        return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
}

function actorInfo(actor) {
    return actor ? { id: actor.id, name: actor.name } : null;
}

function normalizeCategory(value) {
    return ADMIN_CATEGORIES.includes(value) ? value : "update";
}

function cloneAttachments(items) {
    return (items || []).map((item) => ({
        obj: item.obj,
        count: item.count,
        name: item.name
    }));
}

function cloneTargetRoles(items) {
    return (items || []).map((item) => ({ id: item.id, name: item.name }));
}

function stripGameText(value, maxLength) {
    return String(value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function addNumberedPaths(paths, basePath, first, last) {
    for (let value = first; value <= last; value++) paths.add(basePath + "#" + value);
}

function collectAttachmentPaths() {
    const paths = new Set();
    WORLD.OBJ_STROE.forEach((obj, path) => {
        const basePath = String(path || "").split("#")[0];
        if (!ADMIN_ATTACHMENT_PREFIXES.some((prefix) => basePath.startsWith(prefix))) return;
        if (ADMIN_ATTACHMENT_EXCLUDES.has(basePath) || ADMIN_PARAMETERIZED_ATTACHMENTS.has(basePath)) return;
        paths.add(path);
    });

    for (const path of ["money/cash", "money/coin", "money/exp", "money/g100", "money/gold",
        "money/gongji", "money/hua", "money/p1w", "money/pot", "money/silver"]) paths.add(path);

    addNumberedPaths(paths, "cash/jing", 2, 4);
    addNumberedPaths(paths, "cash/tool", 1, 5);
    for (const basePath of ["drug/exp", "drug/limit_mp", "drug/max_mp", "drug/pot"]) {
        addNumberedPaths(paths, basePath, 0, 4);
    }
    addNumberedPaths(paths, "drug/skill2", 1, 5);
    addNumberedPaths(paths, "drug/sdrug", 0, 4);
    addNumberedPaths(paths, "drug/yao", 0, 3);
    for (const level of [1, 2, 3, 4]) {
        paths.add("drug/buff#" + level + "0");
        paths.add("drug/buff#" + level + "1");
    }
    for (const basePath of ["food/drink", "food/food"]) addNumberedPaths(paths, basePath, 0, 4);
    addNumberedPaths(paths, "food/marry", 0, 14);
    addNumberedPaths(paths, "res/cao", 0, 22);
    addNumberedPaths(paths, "res/yu", 0, 17);
    for (const basePath of ["st/st_blu", "st/st_gre", "st/st_red", "st/st_yel"]) {
        addNumberedPaths(paths, basePath, 0, 4);
    }
    for (const basePath of ["st/st_ds", "st/st_fy", "st/st_gj", "st/st_mz"]) {
        addNumberedPaths(paths, basePath, 0, 5);
    }
    addNumberedPaths(paths, "st/st_sc", 0, 7);
    addNumberedPaths(paths, "st/st_s2", 0, 3);

    const forgeCommand = WORLD.COMMANDS.duanzao;
    for (const prop of Object.keys(forgeCommand && forgeCommand.PROPS || {})) paths.add("st/p#" + prop);
    for (const type of ["sword", "blade", "club", "staff", "whip", "none"]) paths.add("eq/cp#" + type);
    for (const type of ["cloth", "shoes", "head", "cape", "ring", "necklace", "jewels", "wrist", "waist", "throwing"]) {
        paths.add("eq/zb#" + type);
    }

    for (const skillId of Object.keys(WORLD.SKILLS || {})) {
        const skill = WORLD.SKILLS[skillId];
        if (!skill || !skill.id || skill.is_hidden || !BASE.PATH_REG.test("book/book#" + skill.id)) continue;
        if (skill.type !== SKILL_TYPES.KNOWLEDGE) paths.add("book/book#" + skill.id);
        if (skill.type === SKILL_TYPES.SKILL && skill.grade > 0) paths.add("book/bc#" + skill.id);
    }

    for (const basePath of ["sp/tool/chu", "sp/tool/diao", "sp/tool/yao"]) addNumberedPaths(paths, basePath, 1, 6);
    for (const basePath of ["sp/tool/er", "sp/tool/er2", "sp/tool/exp", "sp/tool/sm", "sp/tool/zhuisha"]) {
        addNumberedPaths(paths, basePath, 1, 5);
    }
    paths.add("sp/tool/summon");
    return paths;
}

function attachmentCategory(path) {
    if (path.startsWith("money/")) return "currency";
    if (path.startsWith("drug/") || path.startsWith("food/")) return "consumable";
    if (path.startsWith("book/")) return "book";
    if (path.startsWith("res/") || path.startsWith("st/")) return "material";
    if (path.startsWith("eq/") || path.startsWith("sp/tool/chu")
        || path.startsWith("sp/tool/diao") || path.startsWith("sp/tool/yao")) return "equipment";
    return "special";
}

function buildAttachmentCatalog() {
    const items = [];
    const index = new Map();
    for (const path of collectAttachmentPaths()) {
        try {
            const obj = OBJ.CREATE(path, 1);
            if (!obj || obj.no_get || obj.no_alloc) continue;
            const name = stripGameText(obj.name, 80);
            if (!name || name.includes("undefined") || name === "无效武功") continue;
            const item = {
                path: path,
                name: name,
                unit: stripGameText(obj.unit || "个", 12),
                description: stripGameText(obj.desc, 140),
                category: attachmentCategory(path),
                grade: Math.max(0, Math.min(6, parseInt(obj.grade || 0)))
            };
            items.push(item);
            index.set(path, item);
        } catch (error) {
            // Invalid legacy templates are deliberately omitted from the administrator catalog.
        }
    }
    const categoryOrder = new Map(ADMIN_ATTACHMENT_CATEGORIES.map((item, index) => [item.id, index]));
    items.sort((left, right) => {
        const categoryDiff = categoryOrder.get(left.category) - categoryOrder.get(right.category);
        if (categoryDiff) return categoryDiff;
        const nameDiff = left.name.localeCompare(right.name, "zh-CN");
        return nameDiff || left.path.localeCompare(right.path);
    });
    return { categories: ADMIN_ATTACHMENT_CATEGORIES, items: items, index: index };
}

function getAttachmentCatalogData() {
    if (!adminAttachmentCatalogCache) adminAttachmentCatalogCache = buildAttachmentCatalog();
    return adminAttachmentCatalogCache;
}

function validateAttachments(items, legacyItems) {
    if (items === undefined || items === null) return [];
    if (!Array.isArray(items)) throw new Error("附件格式错误");
    if (items.length > 10) throw new Error("单封邮件最多添加10种附件");
    const result = [];
    const seen = new Set();
    const legacyPaths = new Set((legacyItems || []).map((item) => item && item.obj).filter(Boolean));
    const catalog = getAttachmentCatalogData();
    for (const value of items) {
        const path = String(value && (value.obj || value.path) || "").trim();
        const count = parseInt(value && value.count || 0);
        if (!BASE.PATH_REG.test(path)) throw new Error("附件路径格式错误：" + path);
        if (!catalog.index.has(path) && !legacyPaths.has(path)) throw new Error("附件不在可发送目录中：" + path);
        if (seen.has(path)) throw new Error("不能重复添加同一种附件：" + path);
        if (!(count > 0) || count > ADMIN_MAX_ATTACHMENT_COUNT) {
            throw new Error("附件数量必须在1至" + ADMIN_MAX_ATTACHMENT_COUNT + "之间");
        }
        const obj = OBJ.CREATE(path, count);
        if (!obj) throw new Error("不存在的附件对象：" + path);
        result.push({ obj: path, count: count, name: obj.unit_name(count) });
        seen.add(path);
    }
    return result;
}

function findNotice(id) {
    return ADMIN_MESSAGE.NOTICES.find((item) => item && item.id === id);
}

function findCampaign(id) {
    return ADMIN_MESSAGE.MAIL_CAMPAIGNS.find((item) => item && item.id === id);
}

function broadcastNotices(notice, shouldAnnounce) {
    WORLD.sendAll(JSON.stringify({
        type: "dialog",
        dialog: "message",
        notices: ADMIN_MESSAGE.getNotices()
    }));
    if (!notice || !shouldAnnounce) return;
    const index = ADMIN_MESSAGE.NOTICES.indexOf(notice);
    WORLD.sendAll(JSON.stringify({
        type: "dialog",
        dialog: "message",
        notice: Object.assign({ index: index }, notice),
        message: {
            time: notice.time,
            content: notice.content,
            id: "notice",
            name: notice.title
        }
    }));
}

function refreshMailboxes(userIds) {
    const command = WORLD.COMMANDS["message"];
    if (!command || !command.send_state) return;
    for (const userId of userIds) {
        const user = WORLD.getUser(userId);
        if (user && user.socket) command.send_state(user, true);
    }
}

ADMIN_MESSAGE.getAdminNotices = function () {
    return this.NOTICES.slice().reverse().map((notice) => ({
        id: notice.id,
        title: notice.title,
        summary: notice.summary,
        content: notice.content,
        category: notice.category,
        status: notice.status || "active",
        time: notice.time,
        createdAt: notice.createdAt || notice.time,
        updatedAt: notice.updatedAt,
        withdrawnAt: notice.withdrawnAt,
        createdBy: notice.createdBy,
        updatedBy: notice.updatedBy,
        withdrawnBy: notice.withdrawnBy
    }));
}

ADMIN_MESSAGE.createAdminNotice = function (data, actor) {
    const now = Date.now();
    const notice = {
        id: createAdminId("notice"),
        title: plainText(data.title, 80, "公告标题", true),
        summary: plainText(data.summary, 200, "公告摘要", false),
        content: richText(data.content, 20000, "公告正文", true),
        category: normalizeCategory(data.category),
        status: "active",
        time: now,
        createdAt: now,
        createdBy: actorInfo(actor)
    };
    notice.summary = notice.summary || this.createSummary(notice.content);
    this.NOTICES.push(notice);
    return notice;
}

ADMIN_MESSAGE.updateAdminNotice = function (data, actor) {
    const notice = findNotice(String(data.id || ""));
    if (!notice) throw new Error("公告不存在");
    notice.title = plainText(data.title, 80, "公告标题", true);
    notice.summary = plainText(data.summary, 200, "公告摘要", false);
    notice.content = richText(data.content, 20000, "公告正文", true);
    notice.category = normalizeCategory(data.category);
    notice.summary = notice.summary || this.createSummary(notice.content);
    notice.updatedAt = Date.now();
    notice.updatedBy = actorInfo(actor);
    return notice;
}

ADMIN_MESSAGE.withdrawAdminNotice = function (id, actor) {
    const notice = findNotice(String(id || ""));
    if (!notice) throw new Error("公告不存在");
    if (notice.status === "withdrawn") return notice;
    notice.status = "withdrawn";
    notice.withdrawnAt = Date.now();
    notice.withdrawnBy = actorInfo(actor);
    return notice;
}

ADMIN_MESSAGE.publishAdminNotice = function (id, actor) {
    const notice = findNotice(String(id || ""));
    if (!notice) throw new Error("公告不存在");
    const index = this.NOTICES.indexOf(notice);
    if (index >= 0) this.NOTICES.splice(index, 1);
    notice.status = "active";
    notice.time = Date.now();
    notice.updatedAt = notice.time;
    notice.updatedBy = actorInfo(actor);
    notice.withdrawnAt = null;
    notice.withdrawnBy = null;
    this.NOTICES.push(notice);
    return notice;
}

ADMIN_MESSAGE.getCampaignStats = function (campaignId) {
    let currentCount = 0;
    let claimedCount = 0;
    let unreadCount = 0;
    this.stores.forEach((stores) => {
        stores.forEach((store) => {
            for (const item of store.items) {
                if (item.adminId !== campaignId) continue;
                currentCount++;
                if (item.rec === true) claimedCount++;
                if (item.read === false) unreadCount++;
            }
        });
    });
    return { currentCount: currentCount, claimedCount: claimedCount, unreadCount: unreadCount };
}

ADMIN_MESSAGE.getAdminCampaigns = function () {
    return this.MAIL_CAMPAIGNS.slice().reverse().map((campaign) => Object.assign({}, campaign,
        this.getCampaignStats(campaign.id), {
            attach: cloneAttachments(campaign.attach),
            targetRoles: cloneTargetRoles(campaign.targetRoles)
        }));
}

ADMIN_MESSAGE.getAdminAttachmentCatalog = function () {
    const catalog = getAttachmentCatalogData();
    return {
        categories: catalog.categories.map((item) => ({ id: item.id, name: item.name })),
        items: catalog.items.map((item) => Object.assign({}, item))
    };
}

ADMIN_MESSAGE.sendAdminMail = async function (data, actor) {
    const targetType = data.targetType === "role" ? "role" : data.targetType === "roles" ? "roles" : "all";
    let roles;
    if (targetType === "role" || targetType === "roles") {
        const requestedIds = targetType === "role" ? [data.roleId] : data.roleIds;
        if (!Array.isArray(requestedIds)) throw new Error("收件角色格式错误");
        const roleIds = Array.from(new Set(requestedIds.map((id) => String(id || "").trim()).filter(Boolean)));
        if (!roleIds.length) throw new Error("请选择收件角色");
        if (roleIds.length > 500) throw new Error("单次最多选择500名角色");
        const foundRoles = await WORLD.DB.getRolesByIds(roleIds, WORLD.SERVERID);
        const roleMap = new Map(foundRoles.map((role) => [String(role.id), role]));
        const missingIds = roleIds.filter((id) => !roleMap.has(id));
        if (missingIds.length) throw new Error("有" + missingIds.length + "名收件角色不存在，请重新选择");
        roles = roleIds.map((id) => roleMap.get(id));
    } else {
        roles = await WORLD.DB.getAllRoles(WORLD.SERVERID);
    }
    if (!roles || !roles.length) throw new Error("没有可接收邮件的角色");

    const now = Date.now();
    const campaign = {
        id: createAdminId("mail"),
        title: plainText(data.title, 80, "邮件标题", true),
        summary: plainText(data.summary, 200, "邮件摘要", false),
        content: richText(data.content, 20000, "邮件正文", true),
        fromName: plainText(data.fromName || "系统", 30, "发件人", true),
        attach: validateAttachments(data.attach),
        targetType: targetType,
        targetRoles: targetType === "all" ? [] : roles.map((role) => ({ id: role.id, name: role.name })),
        targetRoleId: targetType !== "all" && roles.length === 1 ? roles[0].id : null,
        targetRoleName: targetType !== "all" && roles.length === 1 ? roles[0].name : null,
        recipientCount: 0,
        status: "active",
        sentAt: now,
        createdAt: now,
        createdBy: actorInfo(actor)
    };
    campaign.summary = campaign.summary || this.createSummary(campaign.content);

    const affected = [];
    for (const role of roles) {
        const item = this.pushUserMessage(role.id, {
            id: campaign.id,
            name: campaign.fromName
        }, {
            adminId: campaign.id,
            title: campaign.title,
            summary: campaign.summary,
            content: campaign.content,
            attach: cloneAttachments(campaign.attach),
            dedupe: "admin:" + campaign.id,
            time: now
        });
        if (!item) continue;
        campaign.recipientCount++;
        affected.push(role.id);
    }
    this.MAIL_CAMPAIGNS.push(campaign);
    return {
        item: Object.assign({}, campaign, this.getCampaignStats(campaign.id)),
        affectedUserIds: affected
    };
}

ADMIN_MESSAGE.updateAdminMail = function (data, actor) {
    const campaign = findCampaign(String(data.id || ""));
    if (!campaign) throw new Error("邮件发送记录不存在");
    if (campaign.status !== "active") throw new Error("已撤回的邮件不能修改");

    const stats = this.getCampaignStats(campaign.id);
    const shouldUpdateAttachments = data.attach !== undefined;
    let attachments = campaign.attach;
    if (shouldUpdateAttachments) {
        if (stats.claimedCount > 0) throw new Error("已有玩家领取附件，不能再修改附件");
        attachments = validateAttachments(data.attach, campaign.attach);
    }

    campaign.title = plainText(data.title, 80, "邮件标题", true);
    campaign.summary = plainText(data.summary, 200, "邮件摘要", false);
    campaign.content = richText(data.content, 20000, "邮件正文", true);
    campaign.fromName = plainText(data.fromName || "系统", 30, "发件人", true);
    campaign.summary = campaign.summary || this.createSummary(campaign.content);
    campaign.attach = attachments;
    campaign.updatedAt = Date.now();
    campaign.updatedBy = actorInfo(actor);

    const affected = new Set();
    this.stores.forEach((stores, userId) => {
        stores.forEach((store) => {
            let changed = false;
            for (const item of store.items) {
                if (item.adminId !== campaign.id) continue;
                item.title = campaign.title;
                item.summary = campaign.summary;
                item.content = campaign.content;
                if (shouldUpdateAttachments) item.attach = cloneAttachments(attachments);
                changed = true;
            }
            if (changed) {
                store.name = campaign.fromName;
                affected.add(userId);
            }
        });
    });
    return {
        item: Object.assign({}, campaign, this.getCampaignStats(campaign.id)),
        affectedUserIds: Array.from(affected)
    };
}

ADMIN_MESSAGE.withdrawAdminMail = function (id, actor) {
    const campaign = findCampaign(String(id || ""));
    if (!campaign) throw new Error("邮件发送记录不存在");
    if (campaign.status === "withdrawn") {
        return {
            item: Object.assign({}, campaign, this.getCampaignStats(campaign.id)),
            affectedUserIds: []
        };
    }

    const before = this.getCampaignStats(campaign.id);
    const affected = new Set();
    this.stores.forEach((stores, userId) => {
        stores.forEach((store, from) => {
            const oldLength = store.items.length;
            for (let i = store.items.length - 1; i >= 0; i--) {
                if (store.items[i].adminId === campaign.id) store.items.splice(i, 1);
            }
            if (store.items.length !== oldLength) {
                this.reindexStore(store);
                affected.add(userId);
            }
            if (!store.items.length) stores.delete(from);
        });
        if (!stores.size) this.stores.delete(userId);
    });
    campaign.status = "withdrawn";
    campaign.withdrawnAt = Date.now();
    campaign.withdrawnBy = actorInfo(actor);
    campaign.withdrawnCount = before.currentCount;
    campaign.claimedAtWithdraw = before.claimedCount;
    return {
        item: Object.assign({}, campaign, this.getCampaignStats(campaign.id)),
        affectedUserIds: Array.from(affected)
    };
}

ADMIN_MESSAGE.saveCampaigns = function () {
    if (this.MAIL_CAMPAIGNS.length > 500) {
        this.MAIL_CAMPAIGNS.splice(0, this.MAIL_CAMPAIGNS.length - 500);
    }
    return JSON.stringify(this.MAIL_CAMPAIGNS);
}

ADMIN_MESSAGE.loadCampaigns = function (value) {
    let saved = value || [];
    for (let i = 0; i < 2 && typeof saved === "string"; i++) {
        try {
            saved = JSON.toObject(saved);
        } catch (error) {
            saved = [];
        }
    }
    if (!Array.isArray(saved)) saved = [];
    this.MAIL_CAMPAIGNS = saved.map((item) => {
        const roleMap = new Map();
        for (const role of Array.isArray(item.targetRoles) ? item.targetRoles : []) {
            const id = String(role && role.id || "").trim();
            if (id) roleMap.set(id, { id: id, name: String(role.name || id) });
        }
        const legacyRoleId = String(item.targetRoleId || "").trim();
        if (legacyRoleId && !roleMap.has(legacyRoleId)) {
            roleMap.set(legacyRoleId, { id: legacyRoleId, name: String(item.targetRoleName || legacyRoleId) });
        }
        const targetRoles = Array.from(roleMap.values());
        let targetType = "all";
        if (item.targetType === "all") targetRoles.length = 0;
        else if (item.targetType === "roles" || targetRoles.length > 1) targetType = "roles";
        else if (item.targetType === "role" || targetRoles.length === 1) targetType = "role";
        return {
            id: item.id || createAdminId("mail"),
            title: item.title || "系统邮件",
            summary: item.summary || "",
            content: item.content || "",
            fromName: item.fromName || "系统",
            attach: cloneAttachments(item.attach),
            targetType: targetType,
            targetRoles: targetRoles,
            targetRoleId: targetRoles.length === 1 ? targetRoles[0].id : null,
            targetRoleName: targetRoles.length === 1 ? targetRoles[0].name : null,
            recipientCount: parseInt(item.recipientCount || 0),
            status: item.status === "withdrawn" ? "withdrawn" : "active",
            sentAt: item.sentAt || item.createdAt || Date.now(),
            createdAt: item.createdAt || item.sentAt || Date.now(),
            updatedAt: item.updatedAt || null,
            withdrawnAt: item.withdrawnAt || null,
            withdrawnCount: parseInt(item.withdrawnCount || 0),
            claimedAtWithdraw: parseInt(item.claimedAtWithdraw || 0),
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            withdrawnBy: item.withdrawnBy
        };
    });
}

ADMIN_MESSAGE.broadcastAdminNotices = broadcastNotices;
ADMIN_MESSAGE.refreshAdminMailboxes = refreshMailboxes;
