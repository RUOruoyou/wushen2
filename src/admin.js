import $ from "jquery";
import "./styles/admin.css";

const ADMIN_HEADERS = { "X-WSMUD-Admin": "1" };
const CATEGORY_NAMES = {
    update: "更新公告",
    activity: "活动公告",
    maintenance: "维护公告",
    system: "系统公告"
};
const MAX_ATTACHMENT_COUNT = 100000000;
const PICKER_DROPDOWN_GAP = 6;
const PICKER_VIEWPORT_MARGIN = 8;

let attachmentPlacementFrame = null;

const state = {
    actor: null,
    server: null,
    notices: [],
    campaigns: [],
    attachmentCatalog: { categories: [], items: [] },
    activeTab: "notices",
    noticeFilter: "all",
    mailFilter: "all",
    noticeSearch: "",
    mailSearch: "",
    selectedNoticeId: null,
    selectedMailId: null,
    isNewNotice: true,
    isNewMail: true,
    selectedRoles: new Map(),
    visibleRoles: [],
    selectedAttachments: new Map(),
    attachmentCategory: "all",
    attachmentSearch: "",
    roleTimer: null,
    confirmResolve: null,
    isBusy: false
};

async function request(path, data, isAdmin) {
    const response = await fetch(path, {
        method: "POST",
        credentials: "same-origin",
        headers: Object.assign({ "Content-Type": "application/json" }, isAdmin ? ADMIN_HEADERS : {}),
        body: JSON.stringify(data || {})
    });
    let result;
    try {
        result = await response.json();
    } catch (error) {
        throw new Error("服务器返回了无效数据");
    }
    if (!response.ok) throw new Error(result.error || "请求失败");
    if (result.code !== 1) throw new Error(result.result || "操作失败");
    return result.result;
}

function adminRequest(method, data) {
    return request("/api/admin/" + method, data, true);
}

function setBusy(value) {
    state.isBusy = value;
    $("#app-view").toggleClass("is-busy", value);
    $("button, input, select, textarea").prop("disabled", value);
    if (!value) renderCurrentEditor();
}

function showToast(message, type) {
    const toast = $("#toast");
    toast.stop(true, true)
        .attr("class", "toast " + (type === "error" ? "toast-error" : "toast-success"))
        .text(message)
        .prop("hidden", false)
        .fadeIn(120)
        .delay(2600)
        .fadeOut(180, () => toast.prop("hidden", true));
}

function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    const pad = (number) => number < 10 ? "0" + number : String(number);
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate())
        + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
}

function statusName(status, type) {
    if (status === "withdrawn") return "已撤回";
    return type === "notice" ? "已发布" : "有效";
}

function applyBridgeResult(result) {
    const next = result && result.state ? result.state : result;
    if (!next) return;
    state.server = next.server || state.server;
    state.notices = Array.isArray(next.notices) ? next.notices : [];
    state.campaigns = Array.isArray(next.campaigns) ? next.campaigns : [];
    if (next.attachmentCatalog && Array.isArray(next.attachmentCatalog.items)) {
        state.attachmentCatalog = next.attachmentCatalog;
    }
    if (state.selectedNoticeId && !state.notices.some((item) => item.id === state.selectedNoticeId)) {
        state.selectedNoticeId = null;
    }
    if (state.selectedMailId && !state.campaigns.some((item) => item.id === state.selectedMailId)) {
        state.selectedMailId = null;
    }
    renderAll();
}

async function loadState(showMessage) {
    setBusy(true);
    try {
        const result = await adminRequest("state");
        applyBridgeResult(result);
        if (showMessage) showToast("内容状态已刷新");
    } catch (error) {
        showToast(error.message, "error");
    } finally {
        setBusy(false);
    }
}

function renderAll() {
    $("#actor-name").text(state.actor ? state.actor.name + " · L" + state.actor.level : "");
    const serverName = state.server && state.server.name || "游戏服务";
    const online = state.server && state.server.online !== undefined ? state.server.online : 0;
    $("#server-status").text(serverName + " · 在线 " + online);
    $("#notice-count").text(state.notices.length);
    $("#mail-count").text(state.campaigns.length);
    const activeNotices = state.notices.filter((item) => item.status !== "withdrawn").length;
    const activeMails = state.campaigns.filter((item) => item.status !== "withdrawn").length;
    $("#notice-summary").text(activeNotices + " 条已发布，" + (state.notices.length - activeNotices) + " 条已撤回");
    $("#mail-summary").text(activeMails + " 封有效发送记录，" + (state.campaigns.length - activeMails) + " 封已撤回");
    renderNoticeList();
    renderMailList();
    renderCurrentEditor();
}

function createRecordButton(item, type) {
    const isNotice = type === "notice";
    const selectedId = isNotice ? state.selectedNoticeId : state.selectedMailId;
    const button = $("<button>", {
        type: "button",
        class: "record-item" + (item.id === selectedId ? " selected" : ""),
        "data-id": item.id
    });
    const heading = $("<span>", { class: "record-heading" });
    heading.append($("<strong>").text(item.title || (isNotice ? "未命名公告" : "未命名邮件")));
    heading.append($("<span>", {
        class: "status-badge " + (item.status === "withdrawn" ? "status-withdrawn" : "status-active")
    }).text(statusName(item.status, type)));
    button.append(heading);
    button.append($("<span>", { class: "record-summary" }).text(item.summary || "暂无摘要"));
    const meta = $("<span>", { class: "record-meta" });
    if (isNotice) {
        meta.append($("<span>").text(CATEGORY_NAMES[item.category] || "更新公告"));
        meta.append($("<span>").text(formatDateTime(item.time)));
    } else {
        const target = campaignTargetName(item);
        meta.append($("<span>").text(target));
        meta.append($("<span>").text("收件 " + (item.recipientCount || 0)));
        meta.append($("<span>").text(formatDateTime(item.sentAt)));
    }
    button.append(meta);
    return button;
}

function campaignTargetRoles(item) {
    if (Array.isArray(item && item.targetRoles) && item.targetRoles.length) return item.targetRoles;
    if (item && item.targetRoleId) {
        return [{ id: item.targetRoleId, name: item.targetRoleName || item.targetRoleId }];
    }
    return [];
}

function campaignTargetName(item) {
    if (!item || item.targetType === "all") return "全部角色";
    const roles = campaignTargetRoles(item);
    if (roles.length === 1) return roles[0].name || roles[0].id;
    return roles.length + " 名指定角色";
}

function renderNoticeList() {
    const keyword = state.noticeSearch.toLowerCase();
    const items = state.notices.filter((item) => {
        if (state.noticeFilter !== "all" && item.status !== state.noticeFilter) return false;
        return !keyword || String(item.title || "").toLowerCase().includes(keyword)
            || String(item.summary || "").toLowerCase().includes(keyword);
    });
    const list = $("#notice-list").empty();
    for (const item of items) list.append(createRecordButton(item, "notice"));
    if (!items.length) list.append($("<div>", { class: "empty-state" }).text("没有符合条件的公告"));
}

function renderMailList() {
    const keyword = state.mailSearch.toLowerCase();
    const items = state.campaigns.filter((item) => {
        if (state.mailFilter !== "all" && item.status !== state.mailFilter) return false;
        return !keyword || String(item.title || "").toLowerCase().includes(keyword)
            || String(item.summary || "").toLowerCase().includes(keyword)
            || campaignTargetRoles(item).some((role) => String(role.name || "").toLowerCase().includes(keyword)
                || String(role.id || "").toLowerCase().includes(keyword));
    });
    const list = $("#mail-list").empty();
    for (const item of items) list.append(createRecordButton(item, "mail"));
    if (!items.length) list.append($("<div>", { class: "empty-state" }).text("没有符合条件的邮件"));
}

function currentNotice() {
    return state.notices.find((item) => item.id === state.selectedNoticeId) || null;
}

function currentMail() {
    return state.campaigns.find((item) => item.id === state.selectedMailId) || null;
}

function setStatusBadge(element, status, draftText, type) {
    const badge = $(element);
    if (!status) {
        badge.attr("class", "status-badge status-draft").text(draftText || "草稿");
        return;
    }
    badge.attr("class", "status-badge " + (status === "withdrawn" ? "status-withdrawn" : "status-active"))
        .text(statusName(status, type));
}

function renderNoticeEditor() {
    const notice = state.isNewNotice ? null : currentNotice();
    if (!notice && !state.isNewNotice) state.isNewNotice = true;
    const isNew = state.isNewNotice;
    $("#notice-editor-title").text(isNew ? "新建公告" : notice.title || "公告详情");
    $("#notice-editor-meta").text(isNew ? "" : "发布时间 " + formatDateTime(notice.time));
    setStatusBadge("#notice-editor-status", isNew ? null : notice.status, "草稿", "notice");
    $("#notice-title").val(isNew ? "" : notice.title || "");
    $("#notice-category").val(isNew ? "update" : notice.category || "update");
    $("#notice-summary-input").val(isNew ? "" : notice.summary || "");
    $("#notice-content").val(isNew ? "" : notice.content || "");
    $("#notice-save-button span:last").text(isNew ? "发布公告" : "保存修改");
    $("#notice-save-button .glyphicon").attr("class", "glyphicon " + (isNew ? "glyphicon-send" : "glyphicon-saved"));
    $("#notice-withdraw-button").prop("hidden", isNew || notice.status === "withdrawn");
    $("#notice-publish-button").prop("hidden", isNew || notice.status !== "withdrawn");
}

function renderSelectedRoles(isReadOnly) {
    const roles = Array.from(state.selectedRoles.values());
    $("#role-picker-label").text(roles.length ? "已选择 " + roles.length + " 名玩家" : "请选择收件玩家");
    const selected = $("#selected-roles").empty().prop("hidden", !roles.length);
    for (const role of roles.slice(0, 20)) {
        const chip = $("<span>", { class: "selected-chip" })
            .append($("<span>").text(role.name || role.id));
        if (!isReadOnly) {
            chip.append($("<button>", {
                type: "button",
                class: "remove-selected-role",
                "data-id": role.id,
                title: "移除 " + (role.name || role.id),
                "aria-label": "移除 " + (role.name || role.id)
            }).append($("<span>", { class: "glyphicon glyphicon-remove", "aria-hidden": "true" })));
        }
        selected.append(chip);
    }
    if (roles.length > 20) selected.append($("<span>", { class: "selected-chip selected-chip-more" }).text("另有 " + (roles.length - 20) + " 名"));
}

function renderRoleOptions() {
    const results = $("#role-results").empty();
    $("#role-result-summary").text(state.visibleRoles.length + " 名玩家");
    for (const role of state.visibleRoles) {
        const id = String(role.id);
        const option = $("<label>", { class: "picker-option" });
        option.append($("<input>", {
            type: "checkbox",
            class: "role-option-checkbox",
            "data-id": id,
            checked: state.selectedRoles.has(id)
        }));
        option.append($("<span>", { class: "picker-option-main" })
            .append($("<strong>").text(role.name || id))
            .append($("<small>").text(id + " · " + (role.title || "无称号") + " · L" + (role.level || 0))));
        results.append(option);
    }
    if (!state.visibleRoles.length) results.append($("<div>", { class: "empty-state" }).text("没有匹配角色"));
}

function renderRolePicker(isReadOnly) {
    $("#role-picker-toggle").prop("disabled", isReadOnly || state.isBusy);
    $("#role-search, #select-visible-roles, #clear-selected-roles").prop("disabled", isReadOnly || state.isBusy);
    if (isReadOnly) {
        $("#role-dropdown").prop("hidden", true);
        $("#role-picker-toggle").attr("aria-expanded", "false");
    }
    renderSelectedRoles(isReadOnly);
    renderRoleOptions();
}

function attachmentCatalogItem(path) {
    return state.attachmentCatalog.items.find((item) => item.path === path) || null;
}

function renderAttachmentCategories() {
    const select = $("#attachment-category").empty();
    select.append($("<option>", { value: "all" }).text("全部分类"));
    for (const category of state.attachmentCatalog.categories || []) {
        select.append($("<option>", { value: category.id }).text(category.name));
    }
    select.val(state.attachmentCategory);
}

function filteredAttachmentItems() {
    const keyword = state.attachmentSearch.toLowerCase();
    return (state.attachmentCatalog.items || []).filter((item) => {
        if (state.attachmentCategory !== "all" && item.category !== state.attachmentCategory) return false;
        return !keyword || String(item.name || "").toLowerCase().includes(keyword)
            || String(item.path || "").toLowerCase().includes(keyword);
    });
}

function updateAttachmentDropdownPlacement() {
    const dropdown = $("#attachment-dropdown");
    const toggle = $("#attachment-picker-toggle");
    if (dropdown.prop("hidden") || !dropdown.length || !toggle.length) return;

    const picker = dropdown.closest(".attachment-picker");
    dropdown.removeClass("picker-dropdown-up").css("--picker-available-height", "");
    picker.removeClass("picker-open-up");

    const toggleRect = toggle[0].getBoundingClientRect();
    const spaceBelow = Math.max(0, window.innerHeight - toggleRect.bottom
        - PICKER_DROPDOWN_GAP - PICKER_VIEWPORT_MARGIN);
    const spaceAbove = Math.max(0, toggleRect.top
        - PICKER_DROPDOWN_GAP - PICKER_VIEWPORT_MARGIN);
    const shouldOpenUp = spaceBelow < dropdown[0].scrollHeight && spaceAbove > spaceBelow;
    const availableHeight = Math.floor(shouldOpenUp ? spaceAbove : spaceBelow);

    dropdown.toggleClass("picker-dropdown-up", shouldOpenUp)
        .css("--picker-available-height", availableHeight + "px");
    picker.toggleClass("picker-open-up", shouldOpenUp);
}

function queueAttachmentDropdownPlacement() {
    if (attachmentPlacementFrame !== null) return;
    attachmentPlacementFrame = window.requestAnimationFrame(function () {
        attachmentPlacementFrame = null;
        updateAttachmentDropdownPlacement();
    });
}

function renderAttachmentOptions(isReadOnly) {
    const items = filteredAttachmentItems();
    const options = $("#attachment-options").empty();
    $("#attachment-result-summary").text(items.length + " 种物品");
    for (const item of items) {
        const option = $("<label>", { class: "picker-option attachment-option grade-" + item.grade });
        option.append($("<input>", {
            type: "checkbox",
            class: "attachment-option-checkbox",
            "data-path": item.path,
            checked: state.selectedAttachments.has(item.path),
            disabled: isReadOnly
        }));
        option.append($("<span>", { class: "picker-option-main" })
            .append($("<strong>").text(item.name))
            .append($("<small>").text(item.path)));
        options.append(option);
    }
    if (!items.length) options.append($("<div>", { class: "empty-state" }).text("没有匹配附件"));
    queueAttachmentDropdownPlacement();
}

function renderSelectedAttachments(isReadOnly) {
    const list = $("#attachment-list").empty();
    for (const item of state.selectedAttachments.values()) {
        const row = $("<div>", { class: "attachment-row", "data-path": item.obj });
        row.append($("<div>", { class: "attachment-identity" })
            .append($("<strong>").text(item.name || item.obj))
            .append($("<span>").text(item.obj)));
        row.append($("<input>", {
            type: "number",
            class: "attachment-count",
            min: 1,
            max: MAX_ATTACHMENT_COUNT,
            value: item.count || 1,
            disabled: isReadOnly,
            "aria-label": (item.name || item.obj) + "数量"
        }));
        row.append($("<button>", {
            type: "button",
            class: "icon-button icon-button-small remove-attachment",
            title: "移除附件",
            "aria-label": "移除附件",
            disabled: isReadOnly
        }).append($("<span>", { class: "glyphicon glyphicon-trash", "aria-hidden": "true" })));
        list.append(row);
    }
    if (!state.selectedAttachments.size) list.append($("<div>", { class: "attachment-empty" }).text("无附件"));
}

function renderAttachmentPicker(isReadOnly) {
    renderAttachmentCategories();
    $("#attachment-picker-label").text(state.selectedAttachments.size
        ? "已选择 " + state.selectedAttachments.size + " 种附件" : "选择附件");
    $("#attachment-picker-toggle, #attachment-category, #attachment-search, #clear-selected-attachments")
        .prop("disabled", isReadOnly || state.isBusy);
    if (isReadOnly) {
        $("#attachment-dropdown").prop("hidden", true);
        $("#attachment-picker-toggle").attr("aria-expanded", "false");
    }
    if ($("#attachment-dropdown").prop("hidden")) $("#attachment-options").empty();
    else renderAttachmentOptions(isReadOnly);
    renderSelectedAttachments(isReadOnly);
}

function loadMailSelections(mail) {
    state.selectedRoles.clear();
    for (const role of campaignTargetRoles(mail)) state.selectedRoles.set(String(role.id), role);
    state.selectedAttachments.clear();
    for (const attachment of Array.isArray(mail.attach) ? mail.attach : []) {
        const catalogItem = attachmentCatalogItem(attachment.obj);
        state.selectedAttachments.set(attachment.obj, {
            obj: attachment.obj,
            count: attachment.count || 1,
            name: catalogItem && catalogItem.name || attachment.name || attachment.obj
        });
    }
}

function renderMailEditor() {
    const mail = state.isNewMail ? null : currentMail();
    if (!mail && !state.isNewMail) state.isNewMail = true;
    const isNew = state.isNewMail;
    const isWithdrawn = !isNew && mail.status === "withdrawn";
    const isAttachmentLocked = !isNew && (mail.claimedCount || 0) > 0;
    const targetType = isNew ? ($("input[name='target-type']:checked").val() || "all")
        : mail.targetType === "all" ? "all" : "role";

    if (!isNew) loadMailSelections(mail);

    $("#mail-editor-title").text(isNew ? "新建邮件" : mail.title || "邮件详情");
    $("#mail-editor-meta").text(isNew ? "" : "发送时间 " + formatDateTime(mail.sentAt));
    setStatusBadge("#mail-editor-status", isNew ? null : mail.status);
    $("input[name='target-type'][value='" + targetType + "']").prop("checked", true);
    $("input[name='target-type']").prop("disabled", !isNew || state.isBusy);
    $("#role-field").prop("hidden", targetType !== "role");
    renderRolePicker(!isNew || isWithdrawn);
    $("#mail-from").val(isNew ? "系统" : mail.fromName || "系统").prop("disabled", isWithdrawn || state.isBusy);
    $("#mail-title").val(isNew ? "" : mail.title || "").prop("disabled", isWithdrawn || state.isBusy);
    $("#mail-summary-input").val(isNew ? "" : mail.summary || "").prop("disabled", isWithdrawn || state.isBusy);
    $("#mail-content").val(isNew ? "" : mail.content || "").prop("disabled", isWithdrawn || state.isBusy);
    renderAttachmentPicker(isAttachmentLocked || isWithdrawn);
    $("#attachment-lock").prop("hidden", !isAttachmentLocked)
        .text(isAttachmentLocked ? "已有玩家领取附件，附件内容已锁定" : "");
    $("#mail-withdraw-button").prop("hidden", isNew || isWithdrawn);
    $("#mail-save-button").prop("hidden", isWithdrawn);
    $("#mail-save-button span:last").text(isNew ? "发送邮件" : "保存修改");
    $("#mail-save-button .glyphicon").attr("class", "glyphicon " + (isNew ? "glyphicon-send" : "glyphicon-saved"));

    if (isNew) {
        $("#mail-stats").prop("hidden", true).empty();
    } else {
        const currentCount = mail.status === "withdrawn" ? mail.withdrawnCount || 0 : mail.currentCount || 0;
        const claimedCount = mail.status === "withdrawn" ? mail.claimedAtWithdraw || 0 : mail.claimedCount || 0;
        $("#mail-stats").prop("hidden", false).empty()
            .append($("<span>").text("发送 " + (mail.recipientCount || 0)))
            .append($("<span>").text("当前 " + currentCount))
            .append($("<span>").text("未读 " + (mail.unreadCount || 0)))
            .append($("<span>").text("已领取 " + claimedCount));
    }
}

function renderCurrentEditor() {
    if (state.activeTab === "notices") renderNoticeEditor();
    else renderMailEditor();
}

function selectTab(tab) {
    state.activeTab = tab;
    window.history.replaceState(null, "", "#" + tab);
    $(".nav-item").removeClass("active").filter("[data-tab='" + tab + "']").addClass("active");
    $("#notice-module").prop("hidden", tab !== "notices");
    $("#mail-module").prop("hidden", tab !== "mails");
    renderCurrentEditor();
}

function startNewNotice() {
    state.isNewNotice = true;
    state.selectedNoticeId = null;
    renderNoticeList();
    renderNoticeEditor();
    $("#notice-title").trigger("focus");
}

function startNewMail() {
    state.isNewMail = true;
    state.selectedMailId = null;
    state.selectedRoles.clear();
    state.visibleRoles = [];
    state.selectedAttachments.clear();
    state.attachmentCategory = "all";
    state.attachmentSearch = "";
    $("input[name='target-type'][value='all']").prop("checked", true);
    $("#role-dropdown, #attachment-dropdown").prop("hidden", true);
    $("#role-picker-toggle, #attachment-picker-toggle").attr("aria-expanded", "false");
    $("#role-search, #attachment-search").val("");
    renderMailList();
    renderMailEditor();
    $("#mail-title").trigger("focus");
}

function collectAttachments() {
    return Array.from(state.selectedAttachments.values()).map((item) => ({
        obj: item.obj,
        count: parseInt(item.count || 0)
    }));
}

function confirmAction(title, message, confirmText) {
    $("#confirm-title").text(title);
    $("#confirm-message").text(message);
    $("#confirm-submit").text(confirmText || "确认");
    $("#confirm-backdrop").prop("hidden", false);
    return new Promise((resolve) => {
        state.confirmResolve = resolve;
        $("#confirm-cancel").trigger("focus");
    });
}

function closeConfirm(value) {
    $("#confirm-backdrop").prop("hidden", true);
    if (state.confirmResolve) state.confirmResolve(value);
    state.confirmResolve = null;
}

async function runWrite(method, data, successMessage) {
    setBusy(true);
    try {
        const result = await adminRequest(method, data);
        if (result.item && method.startsWith("notice")) {
            state.isNewNotice = false;
            state.selectedNoticeId = result.item.id;
        }
        if (result.item && method.startsWith("mail")) {
            state.isNewMail = false;
            state.selectedMailId = result.item.id;
        }
        applyBridgeResult(result);
        showToast(successMessage);
        return true;
    } catch (error) {
        showToast(error.message, "error");
        return false;
    } finally {
        setBusy(false);
    }
}

async function submitNotice(event) {
    event.preventDefault();
    const data = {
        title: $("#notice-title").val().trim(),
        category: $("#notice-category").val(),
        summary: $("#notice-summary-input").val().trim(),
        content: $("#notice-content").val().trim()
    };
    if (!data.title || !data.content) return showToast("请填写公告标题和正文", "error");
    if (state.isNewNotice) {
        const confirmed = await confirmAction("发布公告", "公告会立即向在线玩家发布。", "发布");
        if (!confirmed) return;
        await runWrite("noticeCreate", data, "公告已发布");
        return;
    }
    data.id = state.selectedNoticeId;
    await runWrite("noticeUpdate", data, "公告修改已保存");
}

async function submitMail(event) {
    event.preventDefault();
    const mail = currentMail();
    const targetType = $("input[name='target-type']:checked").val() || "all";
    const data = {
        targetType: targetType === "role" ? "roles" : "all",
        roleIds: Array.from(state.selectedRoles.keys()),
        fromName: $("#mail-from").val().trim(),
        title: $("#mail-title").val().trim(),
        summary: $("#mail-summary-input").val().trim(),
        content: $("#mail-content").val().trim()
    };
    if (!data.fromName || !data.title || !data.content) {
        return showToast("请填写发件人、邮件标题和正文", "error");
    }
    if (state.isNewMail && targetType === "role" && !data.roleIds.length) {
        return showToast("请至少选择一名收件玩家", "error");
    }
    if (state.isNewMail || !mail || (mail.claimedCount || 0) === 0) data.attach = collectAttachments();
    if (data.attach && data.attach.some((item) => !(item.count > 0) || item.count > MAX_ATTACHMENT_COUNT)) {
        return showToast("附件数量必须在 1 至 " + MAX_ATTACHMENT_COUNT + " 之间", "error");
    }
    if (state.isNewMail) {
        const selectedRoles = Array.from(state.selectedRoles.values());
        const target = targetType === "all" ? "全部角色"
            : selectedRoles.length === 1 ? selectedRoles[0].name : selectedRoles.length + " 名指定玩家";
        const confirmed = await confirmAction("发送系统邮件", "确认向“" + target + "”发送这封邮件？", "发送");
        if (!confirmed) return;
        await runWrite("mailSend", data, "系统邮件已发送");
        return;
    }
    data.id = state.selectedMailId;
    await runWrite("mailUpdate", data, "邮件修改已同步");
}

async function searchRoles() {
    const query = $("#role-search").val().trim();
    try {
        const roles = await adminRequest("roles", { query: query });
        if ($("#role-search").val().trim() !== query) return;
        state.visibleRoles = Array.isArray(roles) ? roles : [];
        renderRoleOptions();
    } catch (error) {
        showToast(error.message, "error");
    }
}

function bindEvents() {
    $("#login-form").on("submit", async function (event) {
        event.preventDefault();
        const button = $(this).find("button[type='submit']").prop("disabled", true);
        $("#login-error").text("");
        try {
            await request("/api/user/login", {
                code: $("#login-name").val().trim(),
                pwd: $("#login-password").val()
            }, false);
            state.actor = await adminRequest("me");
            $("#login-view").prop("hidden", true);
            $("#app-view").prop("hidden", false);
            await loadState(false);
        } catch (error) {
            $("#login-error").text(error.message);
        } finally {
            button.prop("disabled", false);
        }
    });

    $("#logout-button").on("click", async function () {
        try {
            await adminRequest("logout");
        } catch (error) {
            // Cookies are cleared by a successful response; a stale session can still return to login locally.
        }
        state.actor = null;
        $("#app-view").prop("hidden", true);
        $("#login-view").prop("hidden", false);
        $("#login-password").val("");
    });

    $(".nav-item").on("click", function () { selectTab($(this).data("tab")); });
    $("[data-action='refresh']").on("click", function () { loadState(true); });
    $("#new-notice-button").on("click", startNewNotice);
    $("#new-mail-button").on("click", startNewMail);
    $("#notice-form").on("submit", submitNotice);
    $("#mail-form").on("submit", submitMail);

    $("#notice-filter, #mail-filter").on("click", "button", function () {
        const container = $(this).parent();
        container.find("button").removeClass("active");
        $(this).addClass("active");
        if (container.attr("id") === "notice-filter") {
            state.noticeFilter = $(this).data("filter");
            renderNoticeList();
        } else {
            state.mailFilter = $(this).data("filter");
            renderMailList();
        }
    });

    $("#notice-search").on("input", function () {
        state.noticeSearch = $(this).val().trim();
        renderNoticeList();
    });
    $("#mail-search").on("input", function () {
        state.mailSearch = $(this).val().trim();
        renderMailList();
    });

    $("#notice-list").on("click", ".record-item", function () {
        state.isNewNotice = false;
        state.selectedNoticeId = $(this).data("id");
        renderNoticeList();
        renderNoticeEditor();
    });
    $("#mail-list").on("click", ".record-item", function () {
        state.isNewMail = false;
        state.selectedMailId = $(this).data("id");
        $("#role-dropdown, #attachment-dropdown").prop("hidden", true);
        $("#role-picker-toggle, #attachment-picker-toggle").attr("aria-expanded", "false");
        renderMailList();
        renderMailEditor();
    });

    $("#notice-withdraw-button").on("click", async function () {
        const confirmed = await confirmAction("撤回公告", "撤回后玩家将不再看到这条公告。", "撤回");
        if (confirmed) await runWrite("noticeWithdraw", { id: state.selectedNoticeId }, "公告已撤回");
    });
    $("#notice-publish-button").on("click", async function () {
        const confirmed = await confirmAction("重新发布公告", "公告会更新发布时间并立即向在线玩家提示。", "重新发布");
        if (confirmed) await runWrite("noticePublish", { id: state.selectedNoticeId }, "公告已重新发布");
    });
    $("#mail-withdraw-button").on("click", async function () {
        const mail = currentMail();
        const claimed = mail && mail.claimedCount || 0;
        const message = "撤回会移除所有玩家邮箱中的邮件副本"
            + (claimed > 0 ? "，已有 " + claimed + " 名玩家领取的奖励无法追回。" : "。")
        const confirmed = await confirmAction("撤回系统邮件", message, "撤回");
        if (confirmed) await runWrite("mailWithdraw", { id: state.selectedMailId }, "系统邮件已撤回");
    });

    $("#mail-target-type").on("change", "input", function () {
        const isRole = $(this).val() === "role";
        $("#role-field").prop("hidden", !isRole);
        if (!isRole) {
            $("#role-dropdown").prop("hidden", true);
            $("#role-picker-toggle").attr("aria-expanded", "false");
        }
        renderRolePicker(false);
    });
    $("#role-picker-toggle").on("click", function () {
        const isOpening = $("#role-dropdown").prop("hidden");
        $("#attachment-dropdown").prop("hidden", true);
        $("#attachment-picker-toggle").attr("aria-expanded", "false");
        $("#role-dropdown").prop("hidden", !isOpening);
        $(this).attr("aria-expanded", String(isOpening));
        if (isOpening) {
            searchRoles();
            $("#role-search").trigger("focus");
        }
    });
    $("#role-search").on("input", function () {
        clearTimeout(state.roleTimer);
        state.roleTimer = setTimeout(searchRoles, 260);
    });
    $("#role-results").on("change", ".role-option-checkbox", function () {
        const id = String($(this).data("id"));
        if (this.checked) {
            if (state.selectedRoles.size >= 500) {
                this.checked = false;
                return showToast("单次最多选择 500 名玩家", "error");
            }
            const role = state.visibleRoles.find((item) => String(item.id) === id);
            if (role) state.selectedRoles.set(id, role);
        } else {
            state.selectedRoles.delete(id);
        }
        renderSelectedRoles(false);
    });
    $("#select-visible-roles").on("click", function () {
        for (const role of state.visibleRoles) {
            if (state.selectedRoles.size >= 500) break;
            state.selectedRoles.set(String(role.id), role);
        }
        renderRolePicker(false);
    });
    $("#clear-selected-roles").on("click", function () {
        state.selectedRoles.clear();
        renderRolePicker(false);
    });
    $("#selected-roles").on("click", ".remove-selected-role", function () {
        state.selectedRoles.delete(String($(this).data("id")));
        renderRolePicker(false);
    });

    $("#attachment-picker-toggle").on("click", function () {
        const isOpening = $("#attachment-dropdown").prop("hidden");
        $("#role-dropdown").prop("hidden", true);
        $("#role-picker-toggle").attr("aria-expanded", "false");
        $("#attachment-dropdown").prop("hidden", !isOpening);
        $(this).attr("aria-expanded", String(isOpening));
        if (isOpening) {
            renderAttachmentOptions(false);
            updateAttachmentDropdownPlacement();
            $("#attachment-search").trigger("focus");
        }
    });
    $("#attachment-category").on("change", function () {
        state.attachmentCategory = $(this).val() || "all";
        renderAttachmentOptions(false);
    });
    $("#attachment-search").on("input", function () {
        state.attachmentSearch = $(this).val().trim();
        renderAttachmentOptions(false);
    });
    $("#attachment-options").on("change", ".attachment-option-checkbox", function () {
        const path = String($(this).data("path"));
        if (this.checked) {
            if (state.selectedAttachments.size >= 10) {
                this.checked = false;
                return showToast("单封邮件最多添加 10 种附件", "error");
            }
            const item = attachmentCatalogItem(path);
            if (item) state.selectedAttachments.set(path, { obj: path, count: 1, name: item.name });
        } else {
            state.selectedAttachments.delete(path);
        }
        renderAttachmentPicker(false);
    });
    $("#clear-selected-attachments").on("click", function () {
        state.selectedAttachments.clear();
        renderAttachmentPicker(false);
    });
    $("#attachment-list").on("input", ".attachment-count", function () {
        const path = String($(this).closest(".attachment-row").data("path"));
        const item = state.selectedAttachments.get(path);
        if (item) item.count = parseInt($(this).val() || 0);
    });
    $("#attachment-list").on("click", ".remove-attachment", function () {
        const path = String($(this).closest(".attachment-row").data("path"));
        state.selectedAttachments.delete(path);
        renderAttachmentPicker(false);
    });

    $("#confirm-cancel").on("click", function () { closeConfirm(false); });
    $("#confirm-submit").on("click", function () { closeConfirm(true); });
    $("#confirm-backdrop").on("click", function (event) {
        if (event.target === this) closeConfirm(false);
    });
    $(document).on("click", function (event) {
        if (!$(event.target).closest("#role-field").length) {
            $("#role-dropdown").prop("hidden", true);
            $("#role-picker-toggle").attr("aria-expanded", "false");
        }
        if (!$(event.target).closest(".attachment-picker").length) {
            $("#attachment-dropdown").prop("hidden", true);
            $("#attachment-picker-toggle").attr("aria-expanded", "false");
        }
    });
    $(document).on("keydown", function (event) {
        if (event.key !== "Escape") return;
        if (!$("#confirm-backdrop").prop("hidden")) return closeConfirm(false);
        $("#role-dropdown, #attachment-dropdown").prop("hidden", true);
        $("#role-picker-toggle, #attachment-picker-toggle").attr("aria-expanded", "false");
    });
    $(window).on("resize", queueAttachmentDropdownPlacement);
    document.addEventListener("scroll", queueAttachmentDropdownPlacement, true);
}

async function startup() {
    bindEvents();
    selectTab(window.location.hash === "#mails" ? "mails" : "notices");
    try {
        state.actor = await adminRequest("me");
        $("#login-view").prop("hidden", true);
        $("#app-view").prop("hidden", false);
        await loadState(false);
    } catch (error) {
        $("#login-view").prop("hidden", false);
        $("#app-view").prop("hidden", true);
        $("#login-name").trigger("focus");
    }
}

$(startup);
