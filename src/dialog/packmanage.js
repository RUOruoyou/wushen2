import Util from "../utils/util.js";

const ACTION_NAMES = {
    sell: "一键出售",
    store: "一键存仓",
    disassemble: "一键分解"
};

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function qualityKey(value) {
    return value === null ? "none" : String(value);
}

function qualityName(value) {
    return value === null ? "无品质" : ["白色", "绿色", "蓝色", "黄色", "紫色", "橙色", "红色"][value] || "无品质";
}

function ownerCommand(owner) {
    return owner && owner.type === "follower" ? "follower " + owner.id : "self";
}

export default {
    action: "sell",
    items: [],
    categories: [],
    qualities: [],
    selectedIds: new Set(),
    excludedIds: new Set(),
    categoryFilters: new Set(),
    qualityFilters: new Set(),
    searchText: "",
    previewData: null,
    token: null,
    executing: false,
    actionStates: null,
    loading: false,
    pendingOpen: false,
    openError: null,
    openTimer: null,
    transportTransfers: new Map(),

    init: function () {
        Dialog.injectStyle(packManageCss);
        this.element = $("<div class='dialog-packmanage'></div>");
        this.element.on("click", ".packmanage-tab", this.onTabClick.bind(this));
        this.element.on("change", ".packmanage-category input", this.onCategoryChange.bind(this));
        this.element.on("change", ".packmanage-quality input", this.onQualityChange.bind(this));
        this.element.on("input", ".packmanage-search", this.onSearch.bind(this));
        this.element.on("change", ".packmanage-item-check", this.onItemChange.bind(this));
        this.element.on("change", ".packmanage-item-exclude", this.onExcludeChange.bind(this));
        this.element.on("click", ".packmanage-select-all", this.selectVisible.bind(this));
        this.element.on("click", ".packmanage-clear", this.clearSelection.bind(this));
        this.element.on("click", ".packmanage-preview-btn", this.requestPreview.bind(this));
        this.element.on("click", ".packmanage-execute-btn", this.confirmExecute.bind(this));
        this.element.on("click", ".packmanage-refresh-btn", this.refresh.bind(this));
    },

    requestOpen: function (owner) {
        owner = owner && owner.type === "follower"
            ? { type: "follower", id: owner.id, name: owner.name || "侍从" }
            : { type: "player" };
        if (!this.created) {
            this.init();
            this.created = true;
        }
        this.owner = owner;
        this.loading = true;
        this.pendingOpen = true;
        this.openError = null;
        this.previewData = null;
        this.token = null;
        this.executing = false;
        this.clearTransportTransfers();
        this.startOpenTimer();
        this.ensureOpen();
        SendCommand("packmanage open " + ownerCommand(owner));
    },

    startOpenTimer: function () {
        if (this.openTimer) clearTimeout(this.openTimer);
        this.openTimer = setTimeout(function () {
            if (!this.pendingOpen) return;
            this.openTimer = null;
            this.clearTransportTransfers();
            this.pendingOpen = false;
            this.loading = false;
            this.openError = "背包读取超时，请检查连接后重试。";
            this.render();
        }.bind(this), 10000);
    },

    clearOpenTimer: function () {
        if (!this.openTimer) return;
        clearTimeout(this.openTimer);
        this.openTimer = null;
    },

    clearTransportTransfers: function () {
        for (const transfer of this.transportTransfers.values()) {
            if (transfer.timer) clearTimeout(transfer.timer);
        }
        this.transportTransfers.clear();
    },

    startTransportTimer: function (transferId) {
        const transfer = this.transportTransfers.get(transferId);
        if (!transfer) return;
        if (transfer.timer) clearTimeout(transfer.timer);
        transfer.timer = setTimeout(function () {
            this.onTransportError(transferId);
        }.bind(this), 10000);
    },

    removeTransport: function (transferId) {
        const transfer = this.transportTransfers.get(transferId);
        if (transfer && transfer.timer) clearTimeout(transfer.timer);
        this.transportTransfers.delete(transferId);
        return transfer;
    },

    onTransport: function (data) {
        const transferId = String(data.transferId || "");
        const index = parseInt(data.index);
        const total = parseInt(data.total);
        const targetPhase = String(data.targetPhase || "");
        const action = data.action === null || data.action === undefined ? null : String(data.action);
        if (!/^[a-f0-9]{16}$/.test(transferId) || !(total > 0 && total <= 256) ||
            !(index >= 0 && index < total) || typeof data.payload !== "string" ||
            !["open", "preview", "result", "error"].includes(targetPhase)) {
            return this.onTransportError(null, targetPhase, action);
        }
        const now = Date.now();
        for (const [id, transfer] of this.transportTransfers) {
            if (now - transfer.createdAt > 30000) this.onTransportError(id);
        }
        let transfer = this.transportTransfers.get(transferId);
        if (!transfer) {
            transfer = {
                createdAt: now,
                total: total,
                targetPhase: targetPhase,
                action: action,
                parts: new Array(total),
                received: 0,
                timer: null
            };
            this.transportTransfers.set(transferId, transfer);
        }
        if (transfer.total !== total || transfer.targetPhase !== targetPhase || transfer.action !== action) {
            return this.onTransportError(transferId);
        }
        if (transfer.parts[index] === undefined) {
            transfer.parts[index] = data.payload;
            transfer.received++;
        }
        this.startTransportTimer(transferId);
        if (this.pendingOpen) this.startOpenTimer();
        if (transfer.received !== transfer.total) return;
        this.removeTransport(transferId);
        try {
            const binary = atob(transfer.parts.join(""));
            const bytes = new Uint8Array(binary.length);
            for (let offset = 0; offset < binary.length; offset++) bytes[offset] = binary.charCodeAt(offset);
            const payload = JSON.parse(new TextDecoder().decode(bytes));
            if (!payload || payload.dialog !== "packmanage" || payload.phase === "transport") {
                return this.onTransportError();
            }
            this.onData(payload);
        } catch (error) {
            this.onTransportError();
        }
    },

    onTransportError: function (transferId, targetPhase, action) {
        const transfer = transferId ? this.removeTransport(transferId) : null;
        targetPhase = transfer ? transfer.targetPhase : targetPhase;
        action = transfer ? transfer.action : action;
        if (this.pendingOpen || targetPhase === "open") {
            this.clearOpenTimer();
            this.pendingOpen = false;
            this.loading = false;
            this.openError = "背包数据传输失败，请重试。";
            this.render();
            return;
        }
        const errorData = { error: "整理数据传输失败，请重新操作。" };
        this.updateActionResponse(action, errorData, null);
        if (this.isShow) this.render();
        ReceiveMessage("<red>" + errorData.error + "</red>");
    },

    ensureOpen: function () {
        if (!Dialog.isShow || Dialog.curItem !== "packmanage") Dialog.select("packmanage");
        this.show();
    },

    show: function () {
        if (!Dialog.isShow) Dialog.init();
        Dialog.element.addClass("dialog-packmanage-dialog");
        this.element.detach();
        Dialog.contentElement.empty().append(this.element);
        Dialog.footer("");
        Dialog.icon("tasks");
        this.isShow = true;
        this.render();
    },

    hide: function () {
        if (Dialog.element) Dialog.element.removeClass("dialog-packmanage-dialog");
        if (this.element) this.element.detach();
        this.isShow = false;
    },

    close: function () {
        this.hide();
    },

    onData: function (data) {
        if (data.phase === "transport") return this.onTransport(data);
        if (data.phase === "error") {
            const errorData = { error: data.message || "整理失败。" };
            if (this.pendingOpen) {
                this.clearOpenTimer();
                this.loading = false;
                this.pendingOpen = false;
                this.openError = errorData.error;
                this.previewData = null;
                this.token = null;
                this.executing = false;
                this.ensureOpen();
                return;
            }
            if (data.action && data.action !== this.action) {
                this.updateActionResponse(data.action, errorData, null);
                ReceiveMessage("<red>" + errorData.error + "</red>");
                return;
            }
            this.previewData = errorData;
            this.token = null;
            this.executing = false;
            this.saveActionState();
            if (this.isShow) {
                this.render();
            } else {
                ReceiveMessage("<red>" + errorData.error + "</red>");
            }
            return;
        }
        if (data.phase === "open") {
            this.clearOpenTimer();
            this.loading = false;
            this.pendingOpen = false;
            this.openError = null;
            this.owner = data.owner;
            this.items = data.items || [];
            this.categories = data.categories || [];
            this.qualities = data.qualities || [];
            this.storage = data.storage;
            this.action = "sell";
            this.resetActionStates();
            this.restoreActionState(this.action);
            this.applySnapshot(data.snapshot);
            this.ensureOpen();
            return;
        }
        if (data.phase === "preview") {
            this.updateActionResponse(data.action, data, data.token);
            this.ensureOpen();
            return;
        }
        if (data.phase === "result") {
            this.applySnapshot(data.snapshot);
            const removed = new Set((data.succeeded || []).map(function (item) { return item.id; }));
            this.items = this.items.filter(function (item) { return !removed.has(item.id); });
            this.removeIdsFromActionStates(removed);
            this.updateActionResponse(data.action, data, null);
            this.storage = data.storage;
            this.ensureOpen();
        }
    },

    createActionState: function () {
        return {
            selectedIds: new Set(),
            excludedIds: new Set(),
            categoryFilters: new Set(),
            qualityFilters: new Set(),
            searchText: "",
            previewData: null,
            token: null,
            executing: false
        };
    },

    resetActionStates: function () {
        this.actionStates = {};
        for (const action of Object.keys(ACTION_NAMES)) this.actionStates[action] = this.createActionState();
    },

    saveActionState: function () {
        if (!this.actionStates) this.resetActionStates();
        this.actionStates[this.action] = {
            selectedIds: new Set(this.selectedIds),
            excludedIds: new Set(this.excludedIds),
            categoryFilters: new Set(this.categoryFilters),
            qualityFilters: new Set(this.qualityFilters),
            searchText: this.searchText,
            previewData: this.previewData,
            token: this.token,
            executing: this.executing
        };
    },

    restoreActionState: function (action) {
        if (!this.actionStates) this.resetActionStates();
        const state = this.actionStates[action] || this.createActionState();
        this.actionStates[action] = state;
        this.selectedIds = new Set(state.selectedIds);
        this.excludedIds = new Set(state.excludedIds);
        this.categoryFilters = new Set(state.categoryFilters);
        this.qualityFilters = new Set(state.qualityFilters);
        this.searchText = state.searchText || "";
        this.previewData = state.previewData;
        this.token = state.token;
        this.executing = !!state.executing;
    },

    updateActionResponse: function (action, previewData, token) {
        action = ACTION_NAMES[action] ? action : this.action;
        if (action === this.action) {
            this.previewData = previewData;
            this.token = token;
            this.executing = false;
            this.saveActionState();
            return;
        }
        if (!this.actionStates) this.resetActionStates();
        const state = this.actionStates[action] || this.createActionState();
        state.previewData = previewData;
        state.token = token;
        state.executing = false;
        this.actionStates[action] = state;
    },

    removeIdsFromActionStates: function (removed) {
        if (!removed || !removed.size) return;
        for (const id of removed) {
            this.selectedIds.delete(id);
            this.excludedIds.delete(id);
        }
        if (!this.actionStates) return;
        for (const action of Object.keys(this.actionStates)) {
            const state = this.actionStates[action];
            for (const id of removed) {
                state.selectedIds.delete(id);
                state.excludedIds.delete(id);
            }
        }
    },

    applySnapshot: function (snapshot) {
        if (!snapshot || !snapshot.owner) return;
        const target = snapshot.owner.type === "follower" ? Dialog.pack2 : Dialog.pack;
        target.items = snapshot.items || [];
        target.eqs = snapshot.equipment || [];
        target.money = snapshot.money || 0;
        target.max_count = snapshot.capacity ? snapshot.capacity.max : target.max_count;
        if (snapshot.owner.type === "follower") {
            target.id = snapshot.owner.id;
            target.target_name = snapshot.owner.name;
            target.command_before = "dc " + snapshot.owner.id + " ";
        }
    },

    onTabClick: function (event) {
        const action = $(event.currentTarget).attr("data-action");
        if (!ACTION_NAMES[action] || action === this.action) return;
        this.saveActionState();
        this.action = action;
        this.restoreActionState(action);
        this.render();
    },

    onCategoryChange: function (event) {
        const input = $(event.currentTarget);
        const value = input.val();
        input.prop("checked") ? this.categoryFilters.add(value) : this.categoryFilters.delete(value);
        this.invalidatePreview();
    },

    onQualityChange: function (event) {
        const input = $(event.currentTarget);
        const value = input.val();
        input.prop("checked") ? this.qualityFilters.add(value) : this.qualityFilters.delete(value);
        this.invalidatePreview();
    },

    onSearch: function (event) {
        this.searchText = String($(event.currentTarget).val() || "").trim().toLowerCase();
        this.invalidatePreview();
    },

    onItemChange: function (event) {
        const input = $(event.currentTarget);
        const id = input.val();
        if (input.prop("checked")) {
            this.selectedIds.add(id);
            this.excludedIds.delete(id);
            input.closest(".packmanage-item").find(".packmanage-item-exclude").prop("checked", false);
        } else {
            this.selectedIds.delete(id);
        }
        this.previewData = null;
        this.token = null;
        this.updateSelectionSummary();
    },

    onExcludeChange: function (event) {
        const input = $(event.currentTarget);
        const id = input.val();
        if (input.prop("checked")) {
            this.excludedIds.add(id);
            this.selectedIds.delete(id);
            input.closest(".packmanage-item").find(".packmanage-item-check").prop("checked", false);
        } else {
            this.excludedIds.delete(id);
        }
        this.previewData = null;
        this.token = null;
        this.updateSelectionSummary();
    },

    invalidatePreview: function () {
        this.previewData = null;
        this.token = null;
        this.render();
    },

    filteredItems: function () {
        const categoryFilters = this.categoryFilters;
        const qualityFilters = this.qualityFilters;
        const search = this.searchText;
        return this.items.filter(function (item) {
            if (categoryFilters.size && !categoryFilters.has(item.category)) return false;
            if (qualityFilters.size && !qualityFilters.has(qualityKey(item.quality))) return false;
            if (search) {
                const text = String(item.plainName || item.name || "").toLowerCase();
                if (text.indexOf(search) === -1) return false;
            }
            return true;
        });
    },

    selectVisible: function () {
        for (const item of this.filteredItems()) {
            const action = item.actions && item.actions[this.action];
            if (action && action.allowed && !this.excludedIds.has(item.id)) this.selectedIds.add(item.id);
        }
        this.previewData = null;
        this.token = null;
        this.render();
    },

    clearSelection: function () {
        this.selectedIds = new Set();
        this.excludedIds = new Set();
        this.previewData = null;
        this.token = null;
        this.render();
    },

    requestPreview: function () {
        if (!this.selectedIds.size) {
            ReceiveMessage("<yel>请先选择需要整理的物品。</yel>");
            return;
        }
        const payload = {
            version: 1,
            action: this.action,
            owner: this.owner && this.owner.type === "follower"
                ? { type: "follower", id: this.owner.id }
                : { type: "player" },
            categories: [],
            qualities: [],
            includeIds: Array.from(this.selectedIds),
            excludeIds: Array.from(this.excludedIds)
        };
        this.previewData = { loading: true };
        this.token = null;
        this.render();
        SendCommand("packmanage preview " + JSON.stringify(payload));
    },

    confirmExecute: function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!this.token || !this.previewData || this.previewData.phase !== "preview") return;
        const summary = this.previewData.summary || {};
        const highRisk = summary.highRiskCount || 0;
        const content = $("<div class='packmanage-confirm'></div>");
        content.append("<div>确认执行" + ACTION_NAMES[this.action] + "？</div>");
        content.append("<div>将处理 " + (summary.itemKinds || 0) + " 种物品，共 " + (summary.itemCount || 0) + " 件。</div>");
        if (highRisk > 0) {
            content.append("<div class='packmanage-danger'>其中包含 " + highRisk + " 件紫色及以上高品质物品，请确认无误。</div>");
        }
        const token = this.token;
        const sendExecute = function () {
            this.executing = true;
            this.token = null;
            this.render();
            this.saveActionState();
            SendCommand("packmanage execute " + token);
        }.bind(this);
        const showCriticalConfirm = function () {
            const criticalItems = (summary.highRiskItems || []).filter(function (item) { return item.grade >= 5; });
            const warning = $("<div class='packmanage-confirm'></div>");
            warning.append("<div class='packmanage-danger'>橙色或红色装备分解后无法撤回，请再次确认。</div>");
            if (criticalItems.length) {
                const list = $("<div class='packmanage-critical-list'></div>");
                for (const item of criticalItems) list.append($("<div></div>").html(item.name));
                warning.append(list);
            }
            Confirm.Show({ content: warning, btn_text: "再次确认分解", onOK: sendExecute });
        };
        Confirm.Show({
            content: content,
            btn_text: "确认执行",
            onOK: function () {
                if (this.action === "disassemble" && summary.criticalRiskCount > 0) {
                    setTimeout(showCriticalConfirm, 0);
                    return;
                }
                sendExecute();
            }.bind(this)
        });
    },

    refresh: function () {
        if (!this.owner) return;
        this.requestOpen(this.owner);
    },

    updateSelectionSummary: function () {
        if (!this.element) return;
        this.element.find(".packmanage-selected-count").text("已选择 " + this.selectedIds.size +
            " 项，排除 " + this.excludedIds.size + " 项");
        this.element.find(".packmanage-preview-btn").prop("disabled", !this.selectedIds.size || this.executing);
    },

    render: function () {
        if (!this.element) return;
        const ownerName = this.owner && this.owner.type === "follower" ? this.owner.name : "你";
        Dialog.title("整理" + ownerName + "的背包");
        if (this.loading) {
            this.element.html("<div class='packmanage-loading'><span class='glyphicon glyphicon-refresh'></span> 正在读取背包...</div>");
            return;
        }
        if (this.openError) {
            this.element.html("<div class='packmanage-open-error'><div>" + escapeHtml(this.openError) +
                "</div><button type='button' class='packmanage-refresh-btn'><span class='glyphicon glyphicon-repeat'></span> 重试</button></div>");
            return;
        }
        const html = [];
        html.push("<div class='packmanage-tabs'>");
        for (const action of Object.keys(ACTION_NAMES)) {
            html.push("<button type='button' class='packmanage-tab", action === this.action ? " active" : "",
                "' data-action='", action, "'>", ACTION_NAMES[action], "</button>");
        }
        html.push("</div><div class='packmanage-body'>");
        html.push("<aside class='packmanage-filters'>");
        html.push("<div class='packmanage-filter-title'>道具分类</div><div class='packmanage-filter-list'>");
        for (const category of this.categories) {
            html.push("<label class='packmanage-category'><input type='checkbox' value='", category.id, "'",
                this.categoryFilters.has(category.id) ? " checked" : "", "><span>", category.name, "</span></label>");
        }
        html.push("</div><div class='packmanage-filter-title'>品质</div><div class='packmanage-filter-list qualities'>");
        for (const quality of this.qualities) {
            const key = qualityKey(quality.id);
            html.push("<label class='packmanage-quality grade", quality.id === null ? "-none" : quality.id,
                "'><input type='checkbox' value='", key, "'", this.qualityFilters.has(key) ? " checked" : "",
                "><span>", quality.name, "</span></label>");
        }
        html.push("</div></aside>");
        html.push("<section class='packmanage-items-panel'><div class='packmanage-toolbar'>",
            "<div class='packmanage-search-wrap'><span class='glyphicon glyphicon-search'></span>",
            "<input class='packmanage-search' type='search' placeholder='搜索背包物品' value='", escapeHtml(this.searchText), "'></div>",
            "<button type='button' class='packmanage-select-all'><span class='glyphicon glyphicon-check'></span> 全选当前</button>",
            "<button type='button' class='packmanage-clear'><span class='glyphicon glyphicon-unchecked'></span> 清空</button></div>");
        html.push("<div class='packmanage-item-list'>", this.renderItems(), "</div></section>");
        html.push("<aside class='packmanage-preview'>", this.renderPreview(), "</aside></div>");
        html.push("<div class='packmanage-actions'><span class='packmanage-selected-count'>已选择 ", this.selectedIds.size,
            " 项，排除 ", this.excludedIds.size, " 项</span><button type='button' class='packmanage-refresh-btn'><span class='glyphicon glyphicon-refresh'></span> 刷新</button>",
            "<button type='button' class='packmanage-preview-btn'", this.selectedIds.size && !this.executing ? "" : " disabled",
            "><span class='glyphicon glyphicon-list-alt'></span> 生成预览</button></div>");
        this.element.html(html.join(""));
    },

    renderItems: function () {
        const items = this.filteredItems();
        if (!items.length) return "<div class='packmanage-empty'>没有符合当前筛选条件的物品</div>";
        const html = [];
        for (const item of items) {
            const action = item.actions && item.actions[this.action];
            const allowed = action && action.allowed;
            html.push("<div class='packmanage-item", allowed ? "" : " disabled", " grade", item.grade, "'>",
                "<label class='packmanage-item-select'><input class='packmanage-item-check' type='checkbox' value='", item.id, "'",
                this.selectedIds.has(item.id) ? " checked" : "", allowed ? "" : " disabled", ">",
                "<span class='packmanage-item-main'><span class='packmanage-item-name'>", item.name,
                "</span><span class='packmanage-item-meta'>", item.categoryName, " · ", qualityName(item.quality),
                item.count > 1 ? " · " + item.count + escapeHtml(item.unit) : "", "</span></span></label>");
            if (allowed) {
                html.push("<label class='packmanage-item-exclude-label'><input class='packmanage-item-exclude' type='checkbox' value='",
                    item.id, "'", this.excludedIds.has(item.id) ? " checked" : "", "><span>排除</span></label>");
            } else {
                html.push("<span class='packmanage-item-reason'>", escapeHtml(action ? action.message : "当前不可操作"), "</span>");
            }
            html.push("</div>");
        }
        return html.join("");
    },

    renderPreview: function () {
        const data = this.previewData;
        if (!data) {
            return "<div class='packmanage-preview-title'>操作预览</div><div class='packmanage-preview-empty'>选择物品后生成预览</div>";
        }
        if (data.loading) {
            return "<div class='packmanage-preview-title'>操作预览</div><div class='packmanage-preview-empty'>正在校验物品...</div>";
        }
        if (this.executing) {
            return "<div class='packmanage-preview-title'>正在执行</div><div class='packmanage-preview-empty'>正在逐件核验并整理物品...</div>";
        }
        if (data.error) {
            return "<div class='packmanage-preview-title'>操作失败</div><div class='packmanage-error'>" + escapeHtml(data.error) + "</div>";
        }
        if (data.phase === "result") return this.renderResult(data);
        const summary = data.summary || {};
        const html = ["<div class='packmanage-preview-title'>操作预览</div>"];
        html.push("<div class='packmanage-summary-row'><span>物品种类</span><strong>", summary.itemKinds || 0, "</strong></div>",
            "<div class='packmanage-summary-row'><span>物品数量</span><strong>", summary.itemCount || 0, "</strong></div>");
        if (this.action === "sell") {
            html.push("<div class='packmanage-summary-row'><span>预计获得</span><strong>", Util.moneyToStr(summary.money || 0), "</strong></div>");
        } else if (this.action === "store") {
            html.push("<div class='packmanage-summary-row'><span>新增仓库格</span><strong>", summary.requiredSlots || 0, "</strong></div>",
                "<div class='packmanage-summary-row'><span>合并物品数</span><strong>", summary.mergedCount || 0, "</strong></div>",
                "<div class='packmanage-summary-row'><span>执行后剩余</span><strong>", summary.storageRemaining || 0, " 格</strong></div>");
        } else {
            html.push(this.renderOutputs(summary.outputs || []));
        }
        if (summary.highRiskCount > 0) {
            html.push("<div class='packmanage-danger'>包含 ", summary.highRiskCount, " 件紫色及以上高品质物品</div>");
        }
        if (data.skipped && data.skipped.length) {
            html.push("<details class='packmanage-skipped'><summary>跳过 ", data.skipped.length, " 项</summary>");
            for (const item of data.skipped) html.push("<div>", item.name || item.id, "：", escapeHtml(item.message), "</div>");
            html.push("</details>");
        }
        html.push("<button type='button' class='packmanage-execute-btn'><span class='glyphicon glyphicon-ok'></span> 确认执行</button>");
        return html.join("");
    },

    renderOutputs: function (outputs) {
        const html = ["<div class='packmanage-output-title'>预计产物</div>"];
        if (!outputs.length) return html.concat("<div class='packmanage-preview-empty'>无可预览产物</div>").join("");
        for (const output of outputs) {
            html.push("<div class='packmanage-output grade", output.grade || 0, "'><span>", output.name,
                "</span><strong>", output.count, output.unit || "个", "</strong></div>");
        }
        return html.join("");
    },

    renderResult: function (data) {
        const summary = data.summary || {};
        const html = ["<div class='packmanage-preview-title'>整理完成</div>"];
        html.push("<div class='packmanage-result-ok'><span class='glyphicon glyphicon-ok-circle'></span> 成功处理 ", summary.succeeded || 0, " 项</div>");
        if (this.action === "sell") html.push("<div class='packmanage-summary-row'><span>实际获得</span><strong>", Util.moneyToStr(summary.money || 0), "</strong></div>");
        if (this.action === "store") {
            html.push("<div class='packmanage-summary-row'><span>新增仓库格</span><strong>", summary.requiredSlots || 0, "</strong></div>",
                "<div class='packmanage-summary-row'><span>合并物品数</span><strong>", summary.mergedCount || 0, "</strong></div>",
                "<div class='packmanage-summary-row'><span>仓库剩余</span><strong>", summary.storageRemaining || 0, " 格</strong></div>");
        }
        if (this.action === "disassemble") html.push(this.renderOutputs(summary.outputs || []));
        if (data.skipped && data.skipped.length) {
            html.push("<details class='packmanage-skipped' open><summary>跳过 ", data.skipped.length, " 项</summary>");
            for (const item of data.skipped) html.push("<div>", item.name || item.id, "：", escapeHtml(item.message), "</div>");
            html.push("</details>");
        }
        if (data.failed && data.failed.length) {
            html.push("<details class='packmanage-failed' open><summary>失败 ", data.failed.length, " 项</summary>");
            for (const item of data.failed) html.push("<div>", item.name || item.id, "：", escapeHtml(item.message), "</div>");
            html.push("</details>");
        }
        html.push("<button type='button' class='packmanage-refresh-btn result'><span class='glyphicon glyphicon-repeat'></span> 继续整理</button>");
        return html.join("");
    }
};

const packManageCss = `
.dialog.dialog-packmanage-dialog {
    width: min(46rem, calc(100% - 1rem));
    height: min(38rem, calc(100% - 1rem));
    max-height: calc(100% - 1rem);
}

.dialog.dialog-packmanage-dialog>.dialog-content {
    overflow: hidden;
}

.dialog-packmanage {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    color: var(--theme-text);
}

.packmanage-loading,
.packmanage-open-error {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: var(--theme-muted);
    text-align: center;
}

.packmanage-loading .glyphicon {
    animation: packmanage-spin 1s linear infinite;
}

.packmanage-open-error button {
    border: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
    color: var(--theme-text);
    padding: 7px 14px;
}

@keyframes packmanage-spin {
    to { transform: rotate(360deg); }
}

.packmanage-tabs {
    flex: 0 0 2.6rem;
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
}

.packmanage-tab {
    min-width: 6rem;
    padding: 0 0.8rem;
    border: 0;
    border-right: 1px solid var(--theme-border);
    border-radius: 0;
    background: transparent;
    color: var(--theme-muted);
    cursor: pointer;
}

.packmanage-tab.active {
    background: var(--theme-active);
    color: var(--theme-button-text);
}

.packmanage-body {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-columns: 9rem minmax(16rem, 1fr) 13rem;
    overflow: hidden;
}

.packmanage-filters,
.packmanage-preview {
    min-width: 0;
    overflow-y: auto;
    padding: 0.65rem;
    background: var(--theme-surface);
    box-sizing: border-box;
}

.packmanage-filters {
    border-right: 1px solid var(--theme-border);
}

.packmanage-preview {
    border-left: 1px solid var(--theme-border);
}

.packmanage-filter-title,
.packmanage-preview-title,
.packmanage-output-title {
    margin-bottom: 0.45rem;
    color: var(--theme-accent);
    font-weight: bold;
}

.packmanage-filter-title:not(:first-child) {
    margin-top: 0.8rem;
}

.packmanage-filter-list {
    display: grid;
    gap: 0.25rem;
}

.packmanage-category,
.packmanage-quality {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 1.8rem;
    cursor: pointer;
}

.packmanage-category input,
.packmanage-quality input,
.packmanage-item-check,
.packmanage-item-exclude {
    flex: 0 0 auto;
    margin: 0;
}

.packmanage-items-panel {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.packmanage-toolbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem;
    border-bottom: 1px solid var(--theme-border);
}

.packmanage-search-wrap {
    flex: 1 1 auto;
    min-width: 7rem;
    height: 2rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0 0.55rem;
    border: 1px solid var(--theme-border);
    background: var(--theme-panel);
    box-sizing: border-box;
}

.packmanage-search {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--theme-text);
}

.packmanage-toolbar button,
.packmanage-actions button,
.packmanage-execute-btn,
.packmanage-refresh-btn.result {
    min-height: 2rem;
    padding: 0 0.65rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-surface-2);
    color: var(--theme-text);
    cursor: pointer;
    white-space: nowrap;
}

.packmanage-item-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0.45rem;
}

.packmanage-item {
    min-height: 3rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 0.55rem;
    margin-bottom: 0.35rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-panel);
    box-sizing: border-box;
    cursor: pointer;
}

.packmanage-item-select {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    cursor: pointer;
}

.packmanage-item.disabled {
    cursor: not-allowed;
    opacity: 0.62;
}

.packmanage-item.disabled .packmanage-item-select {
    cursor: not-allowed;
}

.packmanage-item-exclude-label {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--theme-muted);
    cursor: pointer;
    white-space: nowrap;
}

.packmanage-item-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.18rem;
}

.packmanage-item-name,
.packmanage-item-meta,
.packmanage-item-reason {
    overflow-wrap: anywhere;
}

.packmanage-item-meta,
.packmanage-item-reason,
.packmanage-preview-empty {
    color: var(--theme-muted);
    font-size: 0.9em;
}

.packmanage-item-reason {
    flex: 0 0 8rem;
    text-align: right;
}

.packmanage-summary-row,
.packmanage-output {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--theme-border);
}

.packmanage-danger,
.packmanage-error {
    margin-top: 0.65rem;
    padding: 0.55rem;
    border: 1px solid var(--theme-grade-5);
    color: var(--theme-grade-5);
    background: var(--theme-panel);
}

.packmanage-skipped {
    margin-top: 0.65rem;
    color: var(--theme-muted);
}

.packmanage-failed {
    margin-top: 0.65rem;
    color: var(--theme-grade-5);
}

.packmanage-skipped div,
.packmanage-failed div,
.packmanage-critical-list div {
    padding: 0.25rem 0;
    overflow-wrap: anywhere;
}

.packmanage-execute-btn,
.packmanage-refresh-btn.result {
    width: 100%;
    margin-top: 0.8rem;
    color: var(--theme-button-text);
    background: var(--theme-active);
}

.packmanage-result-ok {
    margin-bottom: 0.65rem;
    color: var(--theme-grade-1);
}

.packmanage-actions {
    flex: 0 0 2.8rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.45rem;
    padding: 0 0.55rem;
    border-top: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
}

.packmanage-selected-count {
    margin-right: auto;
    color: var(--theme-muted);
}

.packmanage-actions button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.packmanage-empty {
    padding: 2rem 0.8rem;
    text-align: center;
    color: var(--theme-muted);
}

@media (max-width: 640px) {
    .dialog.dialog-packmanage-dialog {
        width: calc(100% - 0.5rem);
        height: calc(100% - 0.5rem);
        max-height: calc(100% - 0.5rem);
    }

    .packmanage-body {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .packmanage-filters {
        flex: 0 0 auto;
        border-right: 0;
        border-bottom: 1px solid var(--theme-border);
        overflow: visible;
    }

    .packmanage-filter-list {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .packmanage-filter-list.qualities {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .packmanage-items-panel {
        flex: 0 0 19rem;
        min-height: 19rem;
    }

    .packmanage-preview {
        flex: 0 0 auto;
        min-height: 10rem;
        border-left: 0;
        border-top: 1px solid var(--theme-border);
        overflow: visible;
    }

    .packmanage-toolbar {
        flex-wrap: wrap;
    }

    .packmanage-search-wrap {
        flex-basis: 100%;
    }

    .packmanage-item-reason {
        flex-basis: 6.5rem;
    }

    .packmanage-actions {
        flex-wrap: wrap;
        min-height: 3.2rem;
        height: auto;
        padding: 0.35rem;
    }
}
`;
