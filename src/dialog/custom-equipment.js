function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function moneyToText(value) {
    value = Math.max(0, parseInt(value) || 0);
    const result = [];
    if (value >= 10000) {
        result.push(Math.floor(value / 10000) + " 两黄金");
        value %= 10000;
    }
    if (value >= 100) {
        result.push(Math.floor(value / 100) + " 两白银");
        value %= 100;
    }
    if (value) result.push(value + " 个铜板");
    return result.join(" ") || "0 个铜板";
}

function valueText(key, value) {
    const percentKeys = new Set([
        "gj_per", "mz_per", "fy_per", "ds_per", "zj_per", "hp_per",
        "lianxi_per", "dazuo_per", "study_per", "add_sh_per",
        "add_bjsh_per", "diff_bj", "diff_sh_per", "expend_mp_per",
        "diff_busy_per", "gjsd_per", "diff_fy_per", "releasetime_per",
        "bj_per", "busy_per", "diff_downside_per", "distime_per"
    ]);
    const timeKeys = new Set(["gjsd", "busy", "diff_busy", "distime", "releasetime"]);
    if (percentKeys.has(key)) return "+" + value + "%";
    if (timeKeys.has(key)) return "+" + (value / 1000) + " 秒";
    return "+" + value;
}

function resourceText(resource) {
    const name = String(resource.name || "").replace(/<[^>]+>/g, "");
    return escapeHtml(name) + "×" + resource.count;
}

// 服务端历史消息可能携带游戏颜色标签，弹窗内以纯文本展示
function plainText(value) {
    return String(value ?? "").replace(/<[^>]+>/g, "");
}

export default {
    state: null,
    previewData: null,
    pickerData: null,
    error: "",
    message: "",
    pending: false,

    init: function () {
        Dialog.injectStyle(customEquipmentCss);
        this.element = $("<div class='custom-equipment'></div>");
        this.element.on("click", ".custom-refresh", this.refresh.bind(this));
        this.element.on("click", ".custom-wash", this.washNow.bind(this));
        this.element.on("click", ".custom-open-add", this.openAddPicker.bind(this));
        this.element.on("click", ".custom-upgrade", this.previewUpgrade.bind(this));
        this.element.on("click", ".custom-open-replace", this.openReplacePicker.bind(this));
        this.element.on("click", ".custom-open-ability", this.openAbilityPicker.bind(this));
        this.element.on("click", ".custom-picker-item", this.onPickerSelect.bind(this));
        this.element.on("click", ".custom-picker-cancel", this.closePicker.bind(this));
        this.element.on("click", ".custom-rename", this.previewRename.bind(this));
        this.element.on("click", ".custom-confirm", this.commit.bind(this));
        this.element.on("click", ".custom-preview-cancel", this.cancelPreview.bind(this));
    },
    ensureOpen: function () {
        if (!Dialog.isShow || Dialog.curItem !== "customEquipment") Dialog.select("customEquipment");
        this.show();
    },

    show: function () {
        if (!Dialog.isShow) Dialog.init();
        Dialog.element.addClass("dialog-custom-equipment");
        this.element.detach();
        Dialog.contentElement.empty().append(this.element);
        Dialog.footer("");
        Dialog.icon("wrench");
        this.isShow = true;
        this.render();
    },

    hide: function () {
        if (Dialog.element) Dialog.element.removeClass("dialog-custom-equipment");
        if (this.element) this.element.detach();
        this.isShow = false;
    },

    close: function () {
        this.hide();
        this.previewData = null;
        this.pickerData = null;
        this.pending = false;
    },
    onData: function (data) {
        this.pending = false;
        if (data.phase === "error") {
            this.error = data.message || "自制装备操作失败。";
            this.message = "";
            this.ensureOpen();
            return;
        }
        this.error = "";
        if (data.phase === "preview") {
            this.previewData = data;
            this.ensureOpen();
            return;
        }
        if (data.phase === "state" || data.phase === "result") {
            this.state = data;
            this.previewData = null;
            this.pickerData = null;
            this.message = data.message || "";
            this.ensureOpen();
        }
    },
    sendPreview: function (operation, args) {
        if (this.pending || !this.state) return;
        this.pending = true;
        this.error = "";
        this.message = "";
        this.render();
        const suffix = args && args.length ? " " + args.join(" ") : "";
        SendCommand("zizhi preview " + this.state.itemId + " " + operation + suffix);
    },

    refresh: function () {
        if (this.pending || !this.state) return;
        this.pending = true;
        this.render();
        SendCommand("zizhi open " + this.state.itemId);
    },

    washNow: function () {
        if (this.pending || !this.state) return;
        this.pending = true;
        this.error = "";
        this.message = "";
        this.render();
        SendCommand("zizhi wash " + this.state.itemId);
    },

    openAddPicker: function () {
        if (this.pending || !this.state) return;
        const groups = [];
        for (const category of this.state.categories || []) {
            if (category.remaining > 0 && category.available.length) {
                groups.push({
                    name: category.name,
                    hint: "已用 " + category.used + "/" + category.limit,
                    options: category.available
                });
            }
        }
        if (!groups.length) return;
        this.pickerData = {
            mode: "add",
            title: "添加词条",
            subtitle: "选择要添加的词条属性（消耗 1 块对应属性晶石）：",
            groups: groups
        };
        this.render();
    },

    openReplacePicker: function (event) {
        if (this.pending || !this.state) return;
        const oldKey = $(event.currentTarget).attr("data-key");
        let targetAffix = null;
        for (const cat of (this.state.categories || [])) {
            const found = (cat.affixes || []).find(a => a.key === oldKey);
            if (found) {
                targetAffix = found;
                break;
            }
        }
        if (!targetAffix || !targetAffix.replacements || !targetAffix.replacements.length) return;
        this.pickerData = {
            mode: "replace",
            oldKey: targetAffix.key,
            title: "替换【" + targetAffix.name + "】",
            subtitle: "选择新的词条属性（消耗 100 两黄金，返还旧词条全部晶石）：",
            groups: [{ name: "", hint: "", options: targetAffix.replacements }]
        };
        this.render();
    },

    openAbilityPicker: function () {
        if (this.pending || !this.state) return;
        const ability = this.state.ability || {};
        if (!ability.unlocked || !ability.options || !ability.options.length) return;
        this.pickerData = {
            mode: "ability",
            title: "设置能力词条",
            subtitle: "选择要强化的已学武学，穿戴时有效等级 +1（消耗 1 个元晶）：",
            groups: [{
                name: "",
                hint: "",
                options: ability.options.map(option => ({
                    key: option.id,
                    name: option.name + "强化",
                    ability: true
                }))
            }]
        };
        this.render();
    },

    onPickerSelect: function (event) {
        const itemElem = $(event.currentTarget);
        if (itemElem.hasClass("disabled") || this.pending || !this.pickerData) return;
        const selectedKey = itemElem.attr("data-key");
        if (!selectedKey) return;
        const picker = this.pickerData;
        this.pickerData = null;
        if (picker.mode === "add") {
            this.sendPreview("add", [selectedKey]);
        } else if (picker.mode === "replace") {
            this.sendPreview("replace", [picker.oldKey, selectedKey]);
        } else if (picker.mode === "ability") {
            this.sendPreview("ability", [selectedKey]);
        }
    },

    closePicker: function () {
        if (this.pending) return;
        this.pickerData = null;
        this.render();
    },

    previewUpgrade: function (event) {
        this.sendPreview("upgrade", [$(event.currentTarget).attr("data-key")]);
    },

    previewRename: function () {
        const name = String(this.element.find(".custom-rename-input").val() || "").trim();
        if (name) this.sendPreview("rename", [name]);
    },

    commit: function () {
        if (this.pending || !this.previewData || !this.previewData.token) return;
        this.pending = true;
        this.render();
        SendCommand("zizhi commit " + this.previewData.token);
    },

    cancelPreview: function () {
        if (this.pending) return;
        this.previewData = null;
        this.render();
    },

    render: function () {
        if (!this.element) return;
        if (!this.state) {
            this.element.html("<div class='custom-empty'>" + escapeHtml(this.error || "正在读取装备状态……") + "</div>");
            return;
        }
        const state = this.state;
        Dialog.title((state.plainName || "自制装备") + " - 重铸");
        const washDisabled = this.pending || state.locked || state.socketed || state.washCount >= state.maxWashCount;
        const html = [];
        html.push("<div class='custom-head'>",
            "<div class='custom-head-main'><span class='custom-name'>", state.itemName,
            "<i>", escapeHtml(state.partName), "</i></span>",
            "<button type='button' class='custom-icon-button custom-refresh' title='刷新' aria-label='刷新'",
            this.pending ? " disabled" : "", "><span class='glyphicon glyphicon-refresh'></span></button></div>",
            "<div class='custom-meta'>洗练 <b>", state.washCount, "/", state.maxWashCount,
            "</b> · 词条上限 <b>", state.levelLimit, " 级</b> · 固定", escapeHtml(state.fixed.name),
            " <b>+", state.fixed.value, "</b></div>",
            "<div class='custom-res'><button type='button' class='custom-button custom-primary custom-wash'",
            washDisabled ? " disabled" : "", " title='消耗 1 个元晶，立即洗练'>洗练</button>",
            "<span>元晶 ", state.resources.yuanjing, "</span>",
            "<span>黄金 ", escapeHtml(moneyToText(state.resources.money)), "</span>",
            "<span>改名符 ", state.resources.rename, "</span></div>",
            "</div>");
        if (state.locked) html.push("<div class='custom-alert'>装备已锁定，解锁后才能修改。</div>");
        if (state.socketed) html.push("<div class='custom-alert'>装备已镶嵌宝石，清理宝石后才能修改。</div>");
        if (this.error) html.push("<div class='custom-alert custom-error'>", escapeHtml(plainText(this.error)), "</div>");
        if (this.message) html.push("<div class='custom-success'>", escapeHtml(plainText(this.message)), "</div>");
        if (this.pending) html.push("<div class='custom-pending'>正在核对装备和材料……</div>");

        html.push("<div class='custom-scroll'>");
        html.push(this.renderAffixes(state));
        html.push(this.renderRename(state));
        html.push("</div>");
        if (this.pickerData) html.push(this.renderPicker(this.pickerData));
        if (this.previewData) html.push(this.renderPreview(this.previewData));
        this.element.html(html.join(""));
        if (state.focus === "rename") {
            const scroll = this.element.find(".custom-scroll")[0];
            if (scroll) scroll.scrollTop = scroll.scrollHeight;
            state.focus = "";
        }
    },

    renderAffixes: function (state) {
        const disabled = this.pending || state.locked || state.socketed;
        const categories = state.categories || [];
        let used = 0;
        let total = 0;
        let canAdd = false;
        for (const category of categories) {
            used += category.used;
            total += category.limit;
            if (category.remaining > 0 && category.available.length) canAdd = true;
        }
        const html = [];
        html.push("<section class='custom-affixes'><div class='custom-affixes-head'><h3>词条 <span>",
            used, "/", total, "</span></h3>",
            "<button type='button' class='custom-button custom-open-add'",
            disabled || !canAdd ? " disabled" : "", ">+ 添加词条</button></div>");
        let empty = true;
        for (const category of categories) {
            if (!category.affixes.length) continue;
            empty = false;
            html.push("<div class='custom-group'><div class='custom-group-head'>", escapeHtml(category.name),
                "<span>", category.used, "/", category.limit, "</span></div>");
            for (const affix of category.affixes) html.push(this.renderAffixRow(affix, disabled));
            html.push("</div>");
        }
        if (empty) html.push("<div class='custom-none'>暂无词条，点击右上方添加。</div>");
        html.push(this.renderAbility(state));
        html.push("</section>");
        return html.join("");
    },

    renderAffixRow: function (affix, disabled) {
        const material = affix.material || {};
        const upgradeTitle = affix.canUpgrade
            ? "升至 " + (affix.level + 1) + " 级，消耗 " + affix.nextCost + " 块" + material.name + "（持有 " + material.count + "）"
            : "已达当前洗练次数的升级上限";
        const html = [];
        html.push("<div class='custom-affix-row'><div class='custom-affix-info'><strong>", escapeHtml(affix.name),
            "</strong><em>", escapeHtml(valueText(affix.key, affix.value)), "</em><span>", affix.level, "/", affix.levelLimit,
            " 级", affix.legacy ? " · 旧" : "", "</span></div><div class='custom-affix-actions'>");
        html.push("<button type='button' class='custom-button custom-upgrade' data-key='", affix.key, "' title='",
            escapeHtml(upgradeTitle), "'", disabled || !affix.canUpgrade ? " disabled" : "", ">升级</button>");
        if (affix.replacements && affix.replacements.length) {
            html.push("<button type='button' class='custom-button custom-open-replace' data-key='", affix.key,
                "' title='消耗 100 两黄金，返还旧词条全部晶石'", disabled ? " disabled" : "", ">替换</button>");
        }
        html.push("</div></div>");
        return html.join("");
    },

    renderAbility: function (state) {
        const ability = state.ability || {};
        if (!ability.unlocked) {
            return "<div class='custom-ability-tip'>能力词条：洗练 25 次后解锁</div>";
        }
        const disabled = this.pending || state.locked || state.socketed;
        const html = [];
        html.push("<div class='custom-group custom-group-ability'><div class='custom-group-head'>能力词条<span>",
            ability.skillId ? "1/1" : "0/1", "</span></div>");
        if (ability.skillId) {
            html.push("<div class='custom-affix-row'><div class='custom-affix-info'><strong>", escapeHtml(ability.name),
                "强化</strong><em>有效等级 +1</em></div><div class='custom-affix-actions'>",
                "<button type='button' class='custom-button custom-open-ability'",
                disabled ? " disabled" : "", ">更换</button></div></div>");
        } else if (ability.options && ability.options.length) {
            html.push("<div class='custom-affix-row'><div class='custom-affix-info'><strong>未设置</strong>",
                "<em>穿戴时武学有效等级 +1</em></div><div class='custom-affix-actions'>",
                "<button type='button' class='custom-button custom-open-ability'",
                disabled ? " disabled" : "", ">设置</button></div></div>");
        } else {
            html.push("<div class='custom-none'>当前没有与该部位匹配的已学武学</div>");
        }
        html.push("</div>");
        return html.join("");
    },

    renderRename: function (state) {
        const disabled = this.pending || state.locked || state.socketed || state.resources.rename < 1;
        return "<div class='custom-rename-row'><span>改名</span>" +
            "<input class='custom-input custom-rename-input' maxlength='5' value='" +
            escapeHtml(state.plainName) + "'" + (disabled ? " disabled" : "") + ">" +
            "<button type='button' class='custom-button custom-rename'" + (disabled ? " disabled" : "") + ">确定</button></div>";
    },

    renderPicker: function (picker) {
        const html = [];
        html.push("<div class='custom-picker-mask'><div class='custom-picker-dialog'>");
        html.push("<div class='custom-picker-header'><h3>", escapeHtml(picker.title), "</h3>");
        html.push("<button type='button' class='custom-icon-button custom-picker-cancel' aria-label='关闭'>✕</button></div>");
        html.push("<div class='custom-picker-subtitle'>", escapeHtml(picker.subtitle || ""), "</div>");
        html.push("<div class='custom-picker-list'>");
        for (const group of picker.groups || []) {
            if (group.name) html.push("<div class='custom-picker-group'>", escapeHtml(group.name),
                group.hint ? "<span>" + escapeHtml(group.hint) + "</span>" : "", "</div>");
            for (const option of group.options) html.push(this.renderPickerItem(option));
        }
        html.push("</div>");
        html.push("<div class='custom-picker-footer'><button type='button' class='custom-button custom-picker-cancel'>取消</button></div>");
        html.push("</div></div>");
        return html.join("");
    },

    renderPickerItem: function (option) {
        if (option.ability) {
            return "<div class='custom-picker-item' data-key='" + option.key + "'>" +
                "<div class='custom-picker-item-main'><div class='custom-picker-item-title'><strong>" +
                escapeHtml(option.name) + "</strong></div>" +
                "<div class='custom-picker-item-mat'>穿戴时该武学有效等级 +1 · 消耗 1 个元晶</div></div>" +
                "<button type='button' class='custom-button custom-primary'>选择</button></div>";
        }
        const count = option.material ? (option.material.count || 0) : 0;
        const hasMaterial = count >= 1;
        return "<div class='custom-picker-item" + (hasMaterial ? "" : " disabled") + "' data-key='" + option.key + "'>" +
            "<div class='custom-picker-item-main'>" +
            "<div class='custom-picker-item-title'><strong>" + escapeHtml(option.name) + "</strong>" +
            "<span class='custom-picker-item-val'>" + escapeHtml(valueText(option.key, option.value)) + "</span></div>" +
            "<div class='custom-picker-item-mat'>材料：" + escapeHtml(option.material ? option.material.name : "晶石") +
            "（持有 <span class='" + (hasMaterial ? "text-success" : "text-danger") + "'>" + count + "</span> 块）</div>" +
            "</div>" +
            "<button type='button' class='custom-button" + (hasMaterial ? " custom-primary" : "") + "'" +
            (hasMaterial ? "" : " disabled") + ">选择</button></div>";
    },

    renderPreview: function (preview) {
        const costs = (preview.costs || []).map(resourceText);
        if (preview.money) costs.push(escapeHtml(moneyToText(preview.money)));
        const refunds = (preview.refunds || []).map(resourceText);
        return "<div class='custom-preview'><div class='custom-preview-dialog'><h3>" +
            escapeHtml(preview.operationName || "确认操作") + "</h3><p>" + escapeHtml(preview.summary) + "</p>" +
            "<dl><dt>消耗</dt><dd>" + (costs.join("、") || "无") + "</dd>" +
            (refunds.length ? "<dt>返还</dt><dd>" + refunds.join("、") + "</dd>" : "") + "</dl>" +
            "<div class='custom-preview-actions'><button type='button' class='custom-button custom-preview-cancel'" +
            (this.pending ? " disabled" : "") + ">取消</button><button type='button' class='custom-button custom-primary custom-confirm'" +
            (this.pending ? " disabled" : "") + ">确认</button></div></div></div>";
    }
};

const customEquipmentCss = `
.dialog.dialog-custom-equipment {
    width: min(37.5rem, calc(100% - 1rem));
    max-height: calc(100% - 1rem);
}

.dialog.dialog-custom-equipment>.dialog-footer:empty {
    display: none;
}

.custom-equipment {
    position: relative;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    color: var(--theme-text);
}

.custom-head {
    padding: 0.6rem 0.75rem 0.5rem;
    border-bottom: 1px solid var(--theme-border);
}

.custom-head-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.custom-name {
    flex: 1 1 auto;
    min-width: 0;
    font-weight: bold;
    overflow-wrap: anywhere;
}

.custom-name>i {
    margin-left: 0.4rem;
    font-style: normal;
    font-weight: normal;
    font-size: 0.85rem;
    color: var(--theme-muted);
}

.custom-meta {
    margin-top: 0.3rem;
    color: var(--theme-muted);
    font-size: 0.88rem;
    overflow-wrap: anywhere;
}

.custom-meta>b {
    color: var(--theme-accent);
}

.custom-res {
    margin-top: 0.45rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    color: var(--theme-muted);
    font-size: 0.88rem;
}

.custom-icon-button,
.custom-button,
.custom-select,
.custom-input {
    min-height: 2rem;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-surface);
    color: var(--theme-text);
    box-sizing: border-box;
}

.custom-icon-button {
    width: 2rem;
    flex: 0 0 2rem;
    padding: 0;
}

.custom-button {
    padding: 0.25rem 0.8rem;
    white-space: normal;
    cursor: pointer;
}

.custom-button:disabled,
.custom-icon-button:disabled,
.custom-select:disabled,
.custom-input:disabled {
    opacity: 0.5;
    cursor: default;
}

.custom-primary {
    background: var(--theme-accent);
    border-color: var(--theme-accent);
    color: var(--theme-button-text);
}

.custom-alert,
.custom-success,
.custom-pending {
    padding: 0.45rem 0.75rem;
    border-left: 3px solid var(--theme-active);
    background: var(--theme-surface-2);
    overflow-wrap: anywhere;
}

.custom-error {
    border-left-color: #c33;
}

.custom-success {
    border-left-color: #29945f;
}

.custom-pending {
    border-left-color: var(--theme-accent);
    color: var(--theme-muted);
}

.custom-scroll {
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.25rem 0.75rem 0.75rem;
}

.custom-affixes-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.4rem 0;
}

.custom-affixes-head h3 {
    margin: 0;
    font-size: 1rem;
    color: var(--theme-accent);
}

.custom-affixes-head h3>span {
    margin-left: 0.3rem;
    font-size: 0.85rem;
    font-weight: normal;
    color: var(--theme-muted);
}

.custom-group {
    border-top: 1px dotted var(--theme-border);
}

.custom-group-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.45rem;
    color: var(--theme-muted);
    font-size: 0.85rem;
}

.custom-affix-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 0.75rem;
    flex-wrap: wrap;
    padding: 0.45rem 0;
}

.custom-affix-info {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.custom-affix-info strong {
    overflow-wrap: anywhere;
}

.custom-affix-info em {
    font-style: normal;
    color: var(--theme-accent);
}

.custom-affix-info span {
    color: var(--theme-muted);
    font-size: 0.85rem;
}

.custom-affix-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-left: auto;
}

.custom-none,
.custom-ability-tip {
    padding: 0.45rem 0;
    color: var(--theme-muted);
    font-size: 0.88rem;
}

.custom-ability-tip {
    margin-top: 0.4rem;
    border-top: 1px dotted var(--theme-border);
}

.custom-rename-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.6rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--theme-border);
}

.custom-rename-row>span {
    flex: 0 0 auto;
    color: var(--theme-muted);
    font-size: 0.88rem;
}

.custom-rename-row>.custom-input {
    flex: 1 1 8rem;
    min-width: 0;
    width: auto;
    padding: 0.25rem 0.4rem;
}

.custom-input {
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-surface);
    color: var(--theme-text);
    box-sizing: border-box;
    min-height: 2rem;
}

.custom-picker-mask {
    position: absolute;
    inset: 0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.72);
}

.custom-picker-dialog {
    width: min(28rem, 100%);
    max-height: 90%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-panel);
    box-sizing: border-box;
}

.custom-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.custom-picker-header h3 {
    margin: 0;
    font-size: 1.05rem;
    color: var(--theme-accent);
}

.custom-picker-subtitle {
    margin-bottom: 0.75rem;
    color: var(--theme-muted);
    font-size: 0.85rem;
}

.custom-picker-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 0.25rem;
}

.custom-picker-group {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    color: var(--theme-muted);
    font-size: 0.85rem;
    border-bottom: 1px dotted var(--theme-border);
    padding-bottom: 0.2rem;
}

.custom-picker-group:first-child {
    padding-top: 0.2rem;
}

.custom-picker-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-surface);
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
}

.custom-picker-item:hover:not(.disabled) {
    border-color: var(--theme-accent);
    background: var(--theme-surface-2);
}

.custom-picker-item.disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.custom-picker-item-main {
    flex: 1 1 auto;
    min-width: 0;
}

.custom-picker-item-title {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.2rem;
}

.custom-picker-item-title strong {
    color: var(--theme-text);
    font-size: 0.95rem;
}

.custom-picker-item-val {
    color: var(--theme-accent);
    font-size: 0.85rem;
}

.custom-picker-item-mat {
    color: var(--theme-muted);
    font-size: 0.8rem;
}

.text-success {
    color: #29945f !important;
}

.text-danger {
    color: #c33 !important;
}

.custom-picker-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.75rem;
}

.custom-preview {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.72);
}

.custom-preview-dialog {
    width: min(26rem, 100%);
    max-height: 100%;
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-panel);
    box-sizing: border-box;
}

.custom-preview-dialog h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: var(--theme-accent);
}

.custom-preview-dialog p,
.custom-preview-dialog dd {
    overflow-wrap: anywhere;
}

.custom-preview-dialog dl {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 0.35rem 0.5rem;
}

.custom-preview-dialog dt,
.custom-preview-dialog dd {
    margin: 0;
}

.custom-preview-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

.custom-preview-actions>.custom-button {
    min-width: 5rem;
}

.custom-empty {
    padding: 2rem 1rem;
    text-align: center;
    color: var(--theme-muted);
}

@media (max-width: 600px) {
    .dialog.dialog-custom-equipment {
        width: calc(100% - 0.5rem);
        max-height: calc(100% - 0.5rem);
    }

    .custom-affix-actions {
        margin-left: 0;
    }

    .custom-rename-row {
        flex-wrap: wrap;
    }
}
`;
