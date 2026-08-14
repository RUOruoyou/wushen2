
import Util from '../utils/util.js';
import Setting from '../setting.js';
import { GameClient, hide2show, ReceiveMessage } from '../client.js';
import {
    THEME_COLOR_FIELDS,
    THEME_PRESETS,
    getThemeColors,
    parseThemeColors,
    stringifyThemeColors
} from '../theme.js';

const LOOT_FILTER_ACTIONS = [
    ["pick", "拾取"],
    ["sell", "出售"],
    ["fenjie", "分解"],
    ["ignore", "不拾取"]
];
const LOOT_FILTER_TYPES = [
    ["", "全部种类"],
    ["equip", "装备"],
    ["stone", "宝石"],
    ["book", "秘籍"],
    ["res", "资源"],
    ["item", "道具"],
    ["drug", "药品"],
    ["cash", "元宝物品"],
    ["money", "银两"]
];
const LOOT_FILTER_GRADES = [
    ["", "任意品质"],
    ["0", "普通"],
    ["1", "精良"],
    ["2", "高级"],
    ["3", "稀有"],
    ["4", "绝世"],
    ["5", "传说"],
    ["6", "神器"]
];
const LOOT_FILTER_EQS = [
    ["", "任意部位"],
    ["weapon", "武器"],
    ["cloth", "衣服"],
    ["shoes", "鞋"],
    ["head", "头部"],
    ["cape", "披风"],
    ["ring", "戒指"],
    ["necklace", "项链"],
    ["jewels", "饰品"],
    ["wrist", "护腕"],
    ["waist", "腰带"],
    ["throwing", "暗器"]
];
const LOOT_FILTER_OPS = [
    ["", "不限"],
    [">=", "不低于"],
    ["<=", "不高于"],
    ["=", "等于"]
];
const LOOT_FILTER_VALUE_OPS = [
    ["", "不限价值"],
    [">=", "价值不低于"],
    ["<=", "价值不高于"]
];
function escapeLootValue(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (x) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[x];
    });
}
function lootOptions(list, value) {
    var values = Array.isArray(value) ? value.map(String) : [String(value ?? "")];
    var html = [];
    for (var i = 0; i < list.length; i++) {
        html.push('<option value="', escapeLootValue(list[i][0]), '"',
            values.indexOf(String(list[i][0])) >= 0 ? " selected" : "", ">",
            escapeLootValue(list[i][1]), "</option>");
    }
    return html.join("");
}
function lootGradeClass(value) {
    value = String(value ?? "");
    return /^[0-6]$/.test(value) ? "grade" + value : "";
}
function lootGradeOptions(value) {
    var values = Array.isArray(value) ? value.map(String) : [String(value ?? "")];
    var html = [];
    for (var i = 0; i < LOOT_FILTER_GRADES.length; i++) {
        var gradeClass = lootGradeClass(LOOT_FILTER_GRADES[i][0]);
        html.push('<option value="', escapeLootValue(LOOT_FILTER_GRADES[i][0]), '"',
            gradeClass ? ' class="' + gradeClass + '"' : "",
            values.indexOf(String(LOOT_FILTER_GRADES[i][0])) >= 0 ? " selected" : "", ">",
            escapeLootValue(LOOT_FILTER_GRADES[i][1]), "</option>");
    }
    return html.join("");
}
function normalizeLootRule(rule) {
    rule = rule || {};
    return {
        action: rule.action || "pick",
        type: rule.type || "",
        gradeOp: rule.gradeOp || "",
        grade: rule.grade ?? "",
        eq: rule.eq || "",
        name: rule.name || "",
        valueOp: rule.valueOp || "",
        value: rule.value ?? "",
        force: rule.force ? 1 : 0
    };
}
function parseLegacyLootFilter(value) {
    var rules = [];
    var actionMap = {
        "拾取": "pick", "pick": "pick",
        "出售": "sell", "sell": "sell", "卖掉": "sell",
        "分解": "fenjie", "fenjie": "fenjie",
        "忽略": "ignore", "不拾取": "ignore", "ignore": "ignore"
    };
    var typeMap = {
        "装备": "equip", "宝石": "stone", "秘籍": "book", "资源": "res",
        "道具": "item", "药品": "drug", "元宝": "cash", "银两": "money"
    };
    var lines = String(value || "").split(/[\n;；]+/);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        var parts = line.split(/\s+/);
        var rule = normalizeLootRule({ action: actionMap[parts[0]] || actionMap[parts[0]?.toLowerCase()] });
        if (!rule.action) continue;
        var m = /(?:类型|种类|type)=([^ ]+)/i.exec(line);
        if (m) rule.type = typeMap[m[1]] || m[1];
        m = /(?:品质|品阶|grade)(>=|<=|=)(\d+)/i.exec(line);
        if (m) {
            rule.gradeOp = m[1];
            rule.grade = m[2];
        }
        m = /(?:名称|名字|name)=([^ ]+)/i.exec(line);
        if (m) rule.name = m[1];
        m = /(?:价值|value)(>=|<=|=)(\d+)/i.exec(line);
        if (m) {
            rule.valueOp = m[1] === "=" ? ">=" : m[1];
            rule.value = m[2];
        }
        rules.push(rule);
    }
    return rules;
}
function parseLootFilterValue(value) {
    if (!value || value === "0") return [];
    try {
        var parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map(normalizeLootRule);
    } catch (e) {
        return parseLegacyLootFilter(value);
    }
    return [];
}

export default {
    footer: [["显示", "setting"], ["<yel>高级</yel>", "custom"]
        , ["快捷键", "keys"], ["扩展", "extend"]
    ],
    selectitem: null,
    init: function () {
        if (this.settingElement) return;
        if (Util.isMobile) this.footer.splice(2, 1);

        this.settingElement = $(setting_template);
        this.extendElement = $(extend_template);
        this.keysElement = $(keys_template);
        this.customElement = $(custom_template);
        this.buildThemeControls();
        Dialog.injectStyle(setting_css);
        this.syncControls();
    },
    syncControls: function () {
        if (!this.settingElement) return;
        var elems = this.settingElement.add(this.customElement).find(".setting-item");
        for (var i = 0; i < elems.length; i++) {
            var item = $(elems[i]);
            var prop = item.attr("for");
            if (!prop) continue;
            var value = Setting[prop];
            var sw = item.find(".switch");
            sw.removeClass("on").find(".switch-text").html("关");
            switch (prop) {
                case "fontsize":
                    this.select_color(item.find(".color-item"), value, "fontSize");
                    break;
                case "font":
                    this.select_color(item.find(".color-item"), value, "fontFamily");
                    break;
                case "combat_size":
                case "menu_size":
                case "dialog_size":
                    this.select_value(item.find(".color-item"), value);
                    break;
                case "theme":
                    this.select_theme(value);
                    this.fillThemeInputs();
                    break;
                case "auto_pfm":
                case "auto_pfm2":
                    if (value) {
                        sw.addClass("on");
                        sw.find(".switch-text").html("开");
                        this.customElement.find("#" + prop).show().val(value);
                    } else {
                        this.customElement.find("#" + prop).hide().val("");
                    }
                    break;
                case "auto_get_filter":
                    this.renderLootFilterRules(value);
                    if (value) {
                        sw.addClass("on");
                        sw.find(".switch-text").html("开");
                        this.customElement.find("#auto_get_filter").show();
                    } else {
                        this.customElement.find("#auto_get_filter").hide();
                    }
                    break;
                case "auto_work":
                    if (value) {
                        sw.addClass("on");
                        sw.find(".switch-text").html("开");
                        this.customElement.find("#" + prop).show().val(value != 1 ? value : "");
                    } else {
                        this.customElement.find("#" + prop).hide().val("");
                    }
                    break;
                default:
                    if (value == 1) {
                        sw.addClass("on");
                        sw.find(".switch-text").html("开");
                    }
                    break;
            }
        }
    },
    show: function () {
        if (this.isShow) return;
        this.footerChanged("setting");
        Dialog.icon("cog");
        Dialog.title("设置");
        Dialog.footerElement.empty();
        for (var i = 0; i < this.footer.length; i++) {
            var elem = $("<span class='footer-item' for='" + this.footer[i][1] + "'>"
                + this.footer[i][0] + "</span>").appendTo(Dialog.footerElement);
            if (i == 0) elem.addClass("select");
        }
        this.isShow = true;
    }, select_color: function (elems, value, style) {
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].style[style] == value) {
                $(elems[i]).addClass("select");
            } else {
                $(elems[i]).removeClass("select");
            }
        }
    }, select_value: function (elems, value) {
        for (var i = 0; i < elems.length; i++) {
            if ($(elems[i]).attr('value') == value) {
                $(elems[i]).addClass("select");
            } else {
                $(elems[i]).removeClass("select");
            }
        }
    },
    footerChanged: function (item) {

        let elem = this[item + "Element"];
        if (!elem || elem === this.selectitem) return this.child?.command(item);
        this.selectitem && this.selectitem.remove();
        this.selectitem = elem;
        if (this.child) this.child.hide();
        this.child = null;

        if (item == "setting") {
            this.syncControls();
            this.selectitem.off(".dialogSetting");
            this.selectitem.on("click.dialogSetting", ".switch", this.switchClick);
            this.selectitem.on("click.dialogSetting", ".color-item", this.colorClick);
            this.selectitem.on("click.dialogSetting", ".theme-option", this.themeClick);
            this.selectitem.on("input.dialogSetting change.dialogSetting", ".theme-color-input", this.themeInputChanged);
            this.selectitem.on("click.dialogSetting", ".theme-custom-save", this.saveThemeCustom);
        } else if (item == "custom") {
            this.syncControls();
            this.selectitem.off(".dialogSetting");
            this.selectitem.on("click.dialogSetting", ".switch", this.switchClick);
            this.selectitem.on("click.dialogSetting", ".setting-ok", this.save_custom);
            this.selectitem.on("click.dialogSetting", ".loot-filter-add", this.addLootFilterRule);
            this.selectitem.on("click.dialogSetting", ".loot-filter-delete", this.deleteLootFilterRule);
            this.selectitem.on("change.dialogSetting", ".loot-filter-grade", function () {
                Dialog.setting.updateLootFilterGradeColor(this);
            });
        } else {
            this.child = Dialog[item];
            this.child.show(this.selectitem);
        }
        this.selectitem.appendTo(Dialog.contentElement);
    }, helpClick: function () {
        var elem = $(this);
        var act = elem.attr("action");
        switch (act) {
            case "tologin":
                break;
            case "torole":
                GameClient.Close();
                hide2show("#role_panel", function () {
                    Process.player = null;
                    Process.clear();
                });
                break;
            case "toserver":
                Process.player = null;
                GameClient.Close();
                break;
            default:

                break;
        }
    },
    close_help: function () {
        if (this.frame) {
            this.frame.remove();
            this.selectitem.removeClass("help-detl");
            this.frame = null;
        }
    }, hide: function () {
        if (this.child && this.child.hide() === false) {
            return false;
        }
        this.close();
    }, close: function () {
        this.child?.close();
        this.selectitem?.remove();
        this.isShow = false;
        this.selectitem = null;
        this.child = null;
    }
    , save_custom: function () {
        if ($(".dialog-custom>.setting-item[for='auto_work']>.switch").is(".on")) {
            var val = $("#auto_work").val();
            if (val && val.length > 400) return ReceiveMessage("<hir>你设置的过长。</hir>");
            Setting.save("auto_work", val || 1);
        }
        if ($(".dialog-custom>.setting-item[for='auto_get_filter']>.switch").is(".on")) {
            var val = Dialog.setting.collectLootFilterRules();
            if (!val.length) return ReceiveMessage("<hir>你没有设置战利品过滤规则。</hir>");
            val = JSON.stringify(val);
            if (val.length > 2000) return ReceiveMessage("<hir>你设置的过滤规则过长。</hir>");
            Setting.save("auto_get_filter", val);
        }
        ReceiveMessage("<hic>设置已保存。</hic>");

    }, get_pfms: function (id) {
        if (!Combat.Skills) {
            return ReceiveMessage("<hir>你没有可用的绝招设置。</hir>");
        }
        var str = [];
        for (var i = 0; i < Combat.Skills.length; i++) {
            if (str.length > 0) str.push(",");
            str.push(Combat.Skills[i].id);

        }
        $("#" + id).val(str.join(""));
        ReceiveMessage("已预设置为你默认的绝招(未保存)，你可以修改为适合你的出招顺序后点击保存");


    }, createLootFilterRule: function (rule) {
        rule = normalizeLootRule(rule);
        var gradeClass = lootGradeClass(rule.grade);
        var html = [];
        html.push('<div class="loot-filter-rule">');
        html.push('<select data-key="action">', lootOptions(LOOT_FILTER_ACTIONS, rule.action), '</select>');
        html.push('<select data-key="type">', lootOptions(LOOT_FILTER_TYPES, rule.type), '</select>');
        html.push('<select data-key="gradeOp">', lootOptions(LOOT_FILTER_OPS, rule.gradeOp), '</select>');
        html.push('<select data-key="grade" class="loot-filter-grade', gradeClass ? " " + gradeClass : "", '">', lootGradeOptions(rule.grade), '</select>');
        html.push('<select data-key="eq">', lootOptions(LOOT_FILTER_EQS, rule.eq), '</select>');
        html.push('<input data-key="name" type="text" maxlength="20" placeholder="名称包含" value="', escapeLootValue(rule.name), '">');
        html.push('<select data-key="valueOp">', lootOptions(LOOT_FILTER_VALUE_OPS, rule.valueOp), '</select>');
        html.push('<input data-key="value" type="number" min="0" step="1" placeholder="价值" value="', escapeLootValue(rule.value), '">');
        html.push('<label class="loot-filter-force"><input data-key="force" type="checkbox"', rule.force ? ' checked' : '', '>确认高品分解</label>');
        html.push('<button type="button" class="loot-filter-delete">删除</button>');
        html.push('</div>');
        return html.join("");
    }, updateLootFilterGradeColor: function (target) {
        var elem = $(target);
        var gradeClass = lootGradeClass(elem.val());
        elem.removeClass("grade0 grade1 grade2 grade3 grade4 grade5 grade6");
        if (gradeClass) elem.addClass(gradeClass);
    }, renderLootFilterRules: function (value) {
        var editor = this.customElement.find("#auto_get_filter");
        var box = editor.find(".loot-filter-rules");
        if (!box.length) return;
        var rules = parseLootFilterValue(value);
        var html = [];
        for (var i = 0; i < rules.length; i++) {
            html.push(this.createLootFilterRule(rules[i]));
        }
        box.html(html.join(""));
        editor.find(".loot-filter-empty").toggle(!rules.length);
    }, addLootFilterRule: function () {
        var editor = Dialog.setting.customElement.find("#auto_get_filter");
        editor.find(".loot-filter-rules").append(Dialog.setting.createLootFilterRule({ action: "pick" }));
        editor.find(".loot-filter-empty").hide();
        return false;
    }, deleteLootFilterRule: function () {
        var editor = Dialog.setting.customElement.find("#auto_get_filter");
        $(this).closest(".loot-filter-rule").remove();
        editor.find(".loot-filter-empty").toggle(!editor.find(".loot-filter-rule").length);
        return false;
    }, collectLootFilterRules: function () {
        var rules = [];
        this.customElement.find("#auto_get_filter .loot-filter-rule").each(function () {
            var row = $(this);
            var rule = {};
            row.find("[data-key]").each(function () {
                var key = this.getAttribute("data-key");
                if (this.type === "checkbox") rule[key] = this.checked ? 1 : 0;
                else rule[key] = $(this).val();
            });
            rule = normalizeLootRule(rule);
            if (rule.grade && !rule.gradeOp) rule.gradeOp = "=";
            if (rule.value && !rule.valueOp) rule.valueOp = ">=";
            rules.push(rule);
        });
        return rules;
    }, switchClick: function (e) {
        var elem = $(this);
        var forProp = elem.parent().attr("for");
        //if (!forProp) return;
        var value = 0;
        if (elem.is(".on")) {
            elem.removeClass("on");
            elem.find(".switch-text").html("关");
        } else {
            elem.addClass("on");
            elem.find(".switch-text").html("开");
            value = 1;
        }
        switch (forProp) {
            case "auto_pfm":
            case "auto_pfm2":
                if (value) {
                    $("#" + forProp).show();
                    Dialog.setting.get_pfms(forProp);
                    Setting[forProp] = 0;
                } else {
                    $("#" + forProp).hide();
                    Setting.save(forProp, 0);
                }
                break;
            case "auto_work":
                if (value) {
                    $("#" + forProp).show();
                } else {
                    $("#" + forProp).hide();
                    Setting.save(forProp, 0);
                }
                break;
            case "auto_get_filter":
                if (value) {
                    $("#auto_get_filter").show();
                    if (!$("#auto_get_filter .loot-filter-rule").length) {
                        Dialog.setting.addLootFilterRule();
                    }
                } else {
                    $("#auto_get_filter").hide();
                    Setting.save(forProp, 0);
                }
                break;
            default:
                Setting.save(forProp, value);
                break;
        }
        e.cancelable = true;
        return false;
    },
    colorClick: function () {
        var elem = $(this);
        if (elem.is(".select")) return;
        var par = elem.parent();
        par.children().removeClass("select");
        elem.addClass("select");
        var forProp = par.closest(".setting-item").attr("for");
        if (!forProp) return;
        var value = "";
        switch (forProp) {
            case "combat_size":
            case "dialog_size":
            case "menu_size":
                value = elem.attr('value');
                break;
            case "fontsize":
                value = elem[0].style.fontSize;
                break;
            case "font":
                value = elem[0].style.fontFamily;
                if (!value) value = "none";
                break;
        }
        Setting.save(forProp, value);
    },
    buildThemeControls: function () {
        var list = [];
        for (var key in THEME_PRESETS) {
            var item = THEME_PRESETS[key];
            list.push('<span class="theme-option" theme="', key, '">');
            list.push('<span class="theme-swatch" style="background:',
                item.colors.background, '"><i style="background:', item.colors.accent,
                '"></i><i style="background:', item.colors.active,
                '"></i><i style="background:', item.colors.text, '"></i></span>');
            list.push('<span class="theme-name">', item.name, '</span>');
            list.push('</span>');
        }
        this.settingElement.find(".theme-list").html(list.join(""));
        this.settingElement.find(".theme-custom-entry").html(
            '<span class="theme-option theme-custom-option" theme="custom">' +
            '<span class="theme-swatch custom-swatch"><i></i><i></i><i></i></span>' +
            '<span class="theme-name">自定义</span></span>'
        );

        var fields = [];
        for (var i = 0; i < THEME_COLOR_FIELDS.length; i++) {
            var field = THEME_COLOR_FIELDS[i];
            fields.push('<label class="theme-color-field"><span>', field[1], '</span>',
                '<input class="theme-color-input" type="color" theme-field="', field[0], '">',
                '</label>');
        }
        this.settingElement.find(".theme-custom-grid").html(fields.join(""));
    },
    select_theme: function (theme) {
        theme = theme || "moyun";
        this.settingElement.find(".theme-option").removeClass("select");
        this.settingElement.find('.theme-option[theme="' + theme + '"]').addClass("select");
        this.settingElement.find(".theme-custom-panel").toggleClass("hide", theme !== "custom");
    },
    fillThemeInputs: function () {
        var colors = getThemeColors(Setting.theme, Setting.theme_custom);
        this.settingElement.find(".theme-color-input").each(function () {
            var key = this.getAttribute("theme-field");
            this.value = colors[key] || "#000000";
        });
        this.updateCustomSwatch(colors);
    },
    updateCustomSwatch: function (colors) {
        var swatch = this.settingElement.find(".custom-swatch>i");
        if (!swatch.length) return;
        swatch.eq(0).css("background-color", colors.background);
        swatch.eq(1).css("background-color", colors.accent);
        swatch.eq(2).css("background-color", colors.text);
    },
    readThemeInputs: function () {
        var colors = {};
        this.settingElement.find(".theme-color-input").each(function () {
            colors[this.getAttribute("theme-field")] = this.value;
        });
        return {
            ...parseThemeColors(Setting.theme_custom),
            ...colors
        };
    },
    themeClick: function () {
        var theme = $(this).attr("theme");
        if (!theme) return;
        Dialog.setting.select_theme(theme);
        Setting.save("theme", theme);
        Dialog.setting.fillThemeInputs();
    },
    themeInputChanged: function () {
        var colors = Dialog.setting.readThemeInputs();
        Dialog.setting.updateCustomSwatch(colors);
        Setting.theme = "custom";
        Setting.theme_custom = stringifyThemeColors(colors);
        Setting.set_prop("theme", "custom");
        Dialog.setting.select_theme("custom");
    },
    saveThemeCustom: function () {
        var colors = Dialog.setting.readThemeInputs();
        var value = stringifyThemeColors(colors);
        if (value.length > 1000) return ReceiveMessage("<hir>自定义配色数据过长。</hir>");
        Setting.save("theme_custom", value);
        Setting.save("theme", "custom");
        Dialog.setting.select_theme("custom");
        ReceiveMessage("<hic>自定义主题已保存。</hic>");
    }
};


const setting_template = `
 <div class="setting dialog-setting">

            <h3>房间信息</h3>
            <div class="setting-item" for="hide_roomdesc">
                <span class="title">
                    不显示房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="exits_dir">
                <span class="title">
                    出口描述使用方向描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_command">
                <span class="title">
                    在房间列出NPC或道具的可用命令
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_roomitem">
                <span class="title">
                    在命令栏列出房间内的可用物品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="item_firstme">
                <span class="title">
                    自己始终显示在房间物品第一列
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="keep_msg">
                <span class="title">
                    切换房间时不清空上房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_move">
                <span class="title">
                    不显示玩家进出房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_plist">
                <span class="title">
                    隐藏玩家列表(只显示自己和NPC)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_spmsg">
                <span class="title">
                    聊天信息不分开显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_sortitem">
                <span class="title">
                    按品质自动排列背包和技能
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_message">
                <span class="title">
                    不显示其他玩家或NPC的房间消息(基本忽略所有战斗，动作描述，慎用)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_sa">
                <span class="title">
                    动作栏显示快捷操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <h3>战斗信息</h3>

            <div class="setting-item" for="auto_showcombat">
                <span class="title">
                    战斗时自动打开战斗面板
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_hideroom">
                <span class="title">
                    战斗时自动隐藏房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_combatmsg">
                <span class="title">
                    不显示其他玩家的战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_mcmsg">
                <span class="title">
                    不显示自己的普通战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="action_wrap">
                <span class="title">
                    动作栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="combat_wrap">
                <span class="title">
                    技能栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_hpnum">
                <span class="title">
                    显示血量为数字
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_hp">
                <span class="title">
                    关闭血条显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_damage">
                <span class="title">
                    显示伤害统计
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>基本设置</h3>
            <div class="setting-item" for="fullscreen">
                <span class="title">
                    全屏显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="font">
                <span class="title">
                    字体(仅浏览器)
                </span>
                <span class="color-list">
                    <span class="color-item">默</span>
                    <span class="color-item" style="font-family:宋体;">宋</span>
                    <span class="color-item" style="font-family:楷体;">楷</span>
                    <span class="color-item" style="font-family:隶书;">隶</span>
                </span>
            </div>
            <div class="setting-item" for="fontsize">
                <span class="title">
                    字体大小
                </span>
                <span class="color-list">
                    <span class="color-item" style="font-size:0.75rem;">字</span>
                    <span class="color-item" style="font-size:0.875rem;">字</span>
                    <span class="color-item" style="font-size:1rem;">字</span>
                    <span class="color-item" style="font-size:1.25rem;">字</span>
                </span>
            </div>

            <h3>界面配色</h3>
            <div class="setting-item theme-setting" for="theme">
                <span class="theme-list"></span>
                <span class="theme-custom-entry"></span>
            </div>
            <div class="theme-custom-panel hide">
                <div class="theme-custom-grid"></div>
                <button type="button" class="theme-custom-save">保存自定义主题</button>
            </div>
            <div class="setting-item" for="combat_size">
                <span class="title">
                    底部操作栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="dialog_size">
                <span class="title">
                    顶部窗口大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="menu_size">
                <span class="title">
                    菜单栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <h3>游戏设置</h3>
            <div class="setting-item" for="no_master">
                <span class="title">
                    不接受玩家拜师
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_team">
                <span class="title">
                    不接受玩家组队邀请
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="hide_equip">
                <span class="title">
                    隐藏自己的装备
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_cus">
                <span class="title">
                    允许其他玩家查看自己的自创武功
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fight">
                <span class="title">
                    不接受比试
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="ban_pk">
                <span class="title">
                    PK保护
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>频道设置 </h3>
            <div class="setting-item" for="off_chat">
                <span class="title">
                    屏蔽公共频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fam">
                <span class="title">
                    屏蔽门派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_es">
                <span class="title">
                    屏蔽全区频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_pty">
                <span class="title">
                    屏蔽帮派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
        </div>
`;
const custom_template = `  <div class="setting dialog-custom">

            <div class="setting-item" for="auto_work">
                <span class="title">
                    当你学习，练习，打坐中断后，自动去挖矿或以下操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_work"></textarea>

            <div class="setting-item" for="auto_get">
                <span class="title">
                    当你击杀NPC后自动拾取战利品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_get_filter">
                <span class="title">
                    战利品过滤规则（自动拾取开启后生效，扫荡也会套用）
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="loot-filter-editor hide" id="auto_get_filter">
                <div class="loot-filter-tools">
                    <span class="loot-filter-empty">暂未添加规则</span>
                    <button type="button" class="loot-filter-add">添加规则</button>
                </div>
                <div class="loot-filter-rules"></div>
            </div>
            <div class="setting-help">规则从上到下匹配，命中第一条生效；未命中的战利品默认拾取，需要丢弃时请添加“不拾取”规则。</div>

            <!-- <div class="setting-item" for="extend">
                <span class="title">
                    自定义操作按钮
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="extend"></textarea> -->

            <button class="setting-ok">保存设置</button>
        </div>`;
const keys_template = ` <div class="setting dialog-skeys"></div>`;
const extend_template = ` <div class="setting dialog-extend"></div>`;


const setting_css = `
.setting {
    padding-bottom: 0.625em;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
}

.setting-item {
    line-height: 2em;
    min-height: 2.4em;
    padding: 0.25em 0.6em 0.25em 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-border);
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.setting-item>.title {
    margin-right: 0.625em;
    flex: 1;
    text-align: left;
    white-space: initial;
    line-height: 1.35em;
}

.setting-item>.color-list {

    margin-right: 1em;
}
.color-list>.color-item {
    width: 3em;
    height: 1.25em;
    display: inline-block;
    border: 2px solid var(--theme-border);
    line-height: 1.25em;
    text-align: center;
    border-radius: 1em;
    box-sizing: content-box;
}

.color-list>.select {
    border-color: var(--theme-danger);
}
.setting-item>.button {
    flex: 0;
    background-color: var(--theme-surface-2);
    padding-left: 1em;
    padding-right: 1em;
    border-left: 1px solid gray;
}

.setting-item>.button:active {
    background-color: var(--theme-panel);
}


.setting>h3 {
    color: var(--theme-muted);
    border-bottom: 1px solid var(--theme-border);
    padding-bottom: 0.5em;
}

.setting>.settingbox {
    margin-left: 0.625em;
    border: 1px solid var(--theme-border);
    background-color: transparent;
    color: unset;
    resize: none;
    width: 98%;
    height: 3rem;
}
.setting>.loot-filter-editor {
    margin: 0 0.625em 0.65em;
    border: 1px solid var(--theme-border);
    background-color: var(--theme-surface-2);
    padding: 0.5em;
    border-radius: 4px;
}
.loot-filter-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    margin-bottom: 0.45em;
}
.loot-filter-empty {
    color: var(--theme-muted);
    font-size: 0.9em;
}
.loot-filter-add, .loot-filter-delete {
    border: 1px solid var(--theme-border);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    border-radius: 4px;
    padding: 0.2em 0.55em;
}
.loot-filter-rules {
    display: flex;
    flex-direction: column;
    gap: 0.45em;
}
.loot-filter-rule {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.4em 0.45em;
    align-items: center;
    padding: 0.45em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-panel);
}
.loot-filter-rule select, .loot-filter-rule input {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--theme-border);
    background-color: var(--theme-surface-2);
    color: var(--theme-text);
    border-radius: 3px;
    height: 1.75em;
}
.loot-filter-rule select {
    appearance: none;
    -webkit-appearance: none;
    padding: 0 1.7em 0 0.45em;
    background-image:
        linear-gradient(45deg, transparent 50%, var(--theme-muted) 50%),
        linear-gradient(135deg, var(--theme-muted) 50%, transparent 50%),
        linear-gradient(to bottom, var(--theme-border), var(--theme-border));
    background-position:
        calc(100% - 0.78em) 50%,
        calc(100% - 0.48em) 50%,
        calc(100% - 1.45em) 50%;
    background-size: 0.34em 0.34em, 0.34em 0.34em, 1px 65%;
    background-repeat: no-repeat;
}
.loot-filter-rule select:hover, .loot-filter-rule input:hover {
    background-color: var(--theme-surface);
}
.loot-filter-rule select:focus, .loot-filter-rule input:focus {
    outline: none;
    border-color: var(--theme-accent);
    box-shadow: 0 0 0 1px var(--theme-accent);
}
.loot-filter-rule select option {
    background-color: var(--theme-panel);
    color: var(--theme-text);
}
.loot-filter-rule .loot-filter-grade.grade0,
.loot-filter-rule .loot-filter-grade option.grade0 {
    color: var(--theme-grade-0);
}
.loot-filter-rule .loot-filter-grade.grade1,
.loot-filter-rule .loot-filter-grade option.grade1 {
    color: var(--theme-grade-1);
}
.loot-filter-rule .loot-filter-grade.grade2,
.loot-filter-rule .loot-filter-grade option.grade2 {
    color: var(--theme-grade-2);
}
.loot-filter-rule .loot-filter-grade.grade3,
.loot-filter-rule .loot-filter-grade option.grade3 {
    color: var(--theme-grade-3);
}
.loot-filter-rule .loot-filter-grade.grade4,
.loot-filter-rule .loot-filter-grade option.grade4 {
    color: var(--theme-grade-4);
}
.loot-filter-rule .loot-filter-grade.grade5,
.loot-filter-rule .loot-filter-grade option.grade5 {
    color: var(--theme-grade-5);
}
.loot-filter-rule .loot-filter-grade.grade6,
.loot-filter-rule .loot-filter-grade option.grade6 {
    color: var(--theme-grade-6);
}
.loot-filter-force {
    color: var(--theme-muted);
    font-size: 0.9em;
    white-space: nowrap;
    grid-column: 1 / 4;
    display: flex;
    align-items: center;
}
.loot-filter-delete {
    grid-column: 4;
    justify-self: end;
    min-width: 4em;
}
.loot-filter-force>input {
    width: auto;
    height: auto;
    margin-right: 0.25em;
}
@media (max-width: 760px) {
    .loot-filter-rule {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loot-filter-force, .loot-filter-delete {
        grid-column: auto;
    }
    .loot-filter-delete {
        justify-self: stretch;
    }
}
.setting>.setting-help {
    margin: -0.2em 0.625em 0.7em;
    color: var(--theme-muted);
    font-size: 0.85em;
    line-height: 1.45em;
}

.setting>.setting-ok {
    border: 1px solid var(--theme-border);
    background-color: transparent;
    color: unset;
    width: 5rem;
    height: 1.7rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
}

.theme-setting {
    display: block;
    padding: 0.75em;
    overflow-x: visible;
    cursor: default;
}

.theme-list {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(3.4em, auto));
    gap: 0.4em;
    margin: 0;
}

.theme-option {
    border: 1px solid var(--theme-border);
    border-radius: 0.35em;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
    min-height: 3.4em;
    padding: 0.32em 0.2em;
    background-color: var(--theme-surface);
    color: var(--theme-muted);
    line-height: 1.2em;
}

.theme-option.select {
    border-color: var(--theme-active);
    color: var(--theme-text);
    background-color: var(--theme-surface-2);
}

.theme-swatch {
    width: 2.8em;
    height: 1.1em;
    border-radius: 0.25em;
    border: 1px solid var(--theme-border);
    display: flex;
    overflow: hidden;
    flex: none;
}

.theme-swatch>i {
    flex: 1;
    display: block;
}

.theme-name {
    white-space: nowrap;
    font-size: 0.78em;
}

.theme-custom-entry {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5em;
}

.theme-custom-entry>.theme-option {
    flex-direction: row;
    min-height: 2em;
    padding: 0.2em 0.6em;
    width: auto;
}

.theme-custom-entry .theme-swatch {
    width: 2.6em;
    height: 1em;
}

.theme-custom-panel {
    margin: 0 0 0.5em 0;
    padding: 0.75em;
    border-left: 2px solid var(--theme-active);
    border-radius: 4px;
    background-color: var(--theme-panel);
}

.theme-custom-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(8em, 1fr));
    gap: 0.55em;
}

.theme-color-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    color: var(--theme-muted);
}

.theme-color-field>input {
    width: 3.5em;
    height: 2em;
    border: none;
    background-color: transparent;
    cursor: pointer;
}

.theme-custom-save {
    border: 1px solid var(--theme-border);
    background-color: var(--theme-surface-2);
    color: var(--theme-text);
    height: 2em;
    margin-top: 0.75em;
    border-radius: 0.25em;
    cursor: pointer;
}

.theme-custom-save:active {
    background-color: var(--theme-active);
    color: var(--theme-button-text);
}

.dialog-skeys {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
}


.dialog-skeys>.selected {
    border-left-color: var(--theme-active);
    color: var(--theme-active);
}



.extend-list {
    margin-top: 0.5em;
    height: calc(100% - 0.5em);
    min-height: 0;
    text-align: center;
}

.auto-recovery-settings {
    margin-bottom: 0.75em;
    text-align: left;
}

.auto-recovery-settings>.setting-item {
    margin-bottom: 0.4em;
}

.auto-recovery-thresholds {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5em;
}

.auto-recovery-thresholds>label {
    display: grid;
    grid-template-columns: 3em minmax(3.5em, 1fr) 1.5em;
    align-items: center;
    gap: 0.35em;
    min-height: 2.4em;
    padding: 0.25em 0.6em;
    border-left: 2px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-panel);
    color: var(--theme-text);
}

.auto-recovery-input {
    width: 100%;
    min-width: 0;
    height: 1.8em;
    box-sizing: border-box;
    border: 1px solid var(--theme-border);
    border-radius: 3px;
    background-color: var(--theme-surface-2);
    color: var(--theme-text);
    text-align: center;
}

.auto-recovery-input:focus {
    outline: none;
    border-color: var(--theme-accent);
    box-shadow: 0 0 0 1px var(--theme-accent);
}

.extend-section-title {
    margin: 0.5em 0;
    color: var(--theme-muted);
    text-align: left;
}

@media (max-width: 480px) {
    .auto-recovery-thresholds {
        grid-template-columns: 1fr;
    }
}

.extend-list>.buttons {
    text-align: center;
}

.extend-list>.buttons>button {
    margin: 0.5em;
    color: var(--theme-muted);
    background-color: var(--theme-panel);
    line-height: 2em;
}


.extend-add {
    display: flex;
    flex-direction: column;
    margin-top: 0.5em;
    height: calc(100% - 0.5em);
    min-height: 0;
}


.extend-row {
    line-height: 2em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-border);
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border-top: 1px solid var(--theme-surface-2);
    border-bottom: 1px solid var(--theme-surface-2);
    border-right: 1px solid transparent;
}

.extend-row>.extend-input {
    flex: 1;
    border: none;
    outline: none;
    background-color: var(--theme-bg);
    color: var(--theme-text);
    padding-left: 1em;
}

.extend-row>input {
    height: 2em;
}

.extend-row>textarea {
    height: 100%;
    resize: none
}

.extend-row>.extend-menus {
    display: flex;
    flex-direction: column;
}

.extend-row>.extend-row-header {
    width: 8em;
    text-align: center;
}

.extend-help {
    padding-inline-start: 0.5em;
    width: 100%;
    text-align: center;
    color: var(--theme-muted);
    flex: 1;
    overflow: auto;
    list-style-position: inside;
    text-align: left;
    white-space: normal;
    line-height: 1.5em;
}

.extend-menus>.switch {
    margin-top: 1em;
    width: 7em;
    margin-left: 0.5em;
}

.extend-menus>button {
    margin: 1em 0px;
    color: var(--theme-muted);
    background-color: var(--theme-panel);
}

.skey-item {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-border);
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.skey-item>.skey-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--theme-muted);
    overflow: hidden;
}

.skey-item>.skey-key {
    background-color: var(--theme-surface-2);
    width: 7em;
    text-align: center;
}

.switch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 0 0 auto;
    height: 1.45em;
    width: 4em;
    line-height: 1;
    border-radius: 0.8em;
    background: var(--theme-surface-2);
    cursor: pointer;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    vertical-align: middle;
    text-align: center;
}

.switch>.switch-button {
    position: absolute;
    left: 0px;
    height: 1.45em;
    width: 1.45em;
    border-radius: 0.8em;
    background: var(--theme-muted);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
    transition: 0.3s;
    -webkit-transition: 0.3s;
    left: 0px;
}

.switch>.switch-text {
    color: var(--theme-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85em;
    height: 100%;
    line-height: 1;
    margin-left: 0.55em;
}

.on {
    background-color: var(--theme-active);
}

.on>.switch-button {
    right: 0px;
    left: auto;
    background-color: var(--theme-text);
}

.on>.switch-text {
    margin-right: 0.55em;
    margin-left: 0px;
    color: var(--theme-button-text);
}
`;
