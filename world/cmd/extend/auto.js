this.inherits(COMMAND);
this.command = "auto";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.admin = true;
this.enter = function (me, type) {

}
WORLD.check_user_next = function (me) {

    var type = me.query_setting("auto_work");
    if (!type || !me.hp || me.is_faint || me.is_busy || me.environment.is_fb()) return;
    me.state = null;
    me.send("{type:\"state\"}");

    me.environment.item_changed(me, true);
    if (type == 1) {

        me.do_command("wakuang");

    } else {
        var str = type.split(",");
        for (var i = 0; i < str.length; i++) {
            me.command(str[i]);
        }
    }
    return false;
}
const LOOT_ACTIONS = {
    "pick": "pick", "keep": "pick", "拾取": "pick", "保留": "pick",
    "sell": "sell", "出售": "sell", "卖": "sell", "卖掉": "sell",
    "fenjie": "fenjie", "disassemble": "fenjie", "分解": "fenjie",
    "ignore": "ignore", "skip": "ignore", "drop": "ignore", "不拾取": "ignore", "忽略": "ignore", "丢弃": "ignore", "丢掉": "ignore"
};
const LOOT_TYPES = {
    "0": 0, "item": 0, "misc": 0, "daoju": 0, "道具": 0, "杂物": 0,
    "1": 1, "book": 1, "miji": 1, "秘籍": 1, "书": 1,
    "2": 2, "stone": 2, "baoshi": 2, "宝石": 2,
    "3": 3, "res": 3, "resource": 3, "ziyuan": 3, "资源": 3, "材料": 3,
    "4": 4, "equip": 4, "equipment": 4, "zhuangbei": 4, "装备": 4,
    "money": "money", "银两": "money", "钱": "money",
    "cash": "cash", "元宝": "cash",
    "drug": "drug", "药": "drug", "药品": "drug"
};
const LOOT_EQ_TYPES = {
    "weapon": 0, "武器": 0,
    "cloth": 1, "衣服": 1,
    "shoes": 2, "鞋": 2, "鞋子": 2,
    "head": 3, "头": 3, "头部": 3,
    "cape": 4, "披风": 4,
    "ring": 5, "戒指": 5,
    "necklace": 6, "项链": 6,
    "jewels": 7, "饰品": 7,
    "wrist": 8, "护腕": 8,
    "waist": 9, "腰带": 9,
    "throwing": 10, "暗器": 10
};
function clean_loot_text(text) {
    return (text || "").replace(/<[^>]+>/g, "");
}
function split_loot_values(value) {
    if (Array.isArray(value)) {
        return value.map(function (x) {
            return ("" + x).trim();
        }).filter(Boolean);
    }
    return ("" + value).split(/[,，]/).map(function (x) {
        return x.trim();
    }).filter(Boolean);
}
function has_loot_value(value) {
    return split_loot_values(value).length > 0;
}
function compare_loot_number(cur, op, val) {
    cur = parseFloat(cur || 0);
    val = parseFloat(val);
    if (isNaN(val)) return false;
    switch (op) {
        case ">=": return cur >= val;
        case "<=": return cur <= val;
        case ">": return cur > val;
        case "<": return cur < val;
        case "=": return cur == val;
    }
    return false;
}
function compare_loot_numbers(cur, op, value) {
    var values = split_loot_values(value);
    for (var i = 0; i < values.length; i++) {
        if (compare_loot_number(cur, op, values[i])) return true;
    }
    return false;
}
function normalize_loot_type(value) {
    value = ("" + value).trim();
    return LOOT_TYPES[value] !== undefined ? LOOT_TYPES[value] : LOOT_TYPES[value.toLowerCase()];
}
function normalize_loot_eq(value) {
    value = ("" + value).trim();
    return LOOT_EQ_TYPES[value] !== undefined ? LOOT_EQ_TYPES[value] : LOOT_EQ_TYPES[value.toLowerCase()];
}
function parse_loot_condition(token, rule) {
    if (!token || token === "all" || token === "全部") return;
    var shorthand_type = normalize_loot_type(token);
    if (shorthand_type !== undefined) {
        rule.conditions.push({ key: "type", op: "=", value: token });
        return;
    }
    var m = /^([^<>=:：]+)(>=|<=|>|<|=|:|：)(.+)$/.exec(token);
    if (!m) return;
    var key = m[1].trim().toLowerCase();
    var op = (m[2] === ":" || m[2] === "：") ? "=" : m[2];
    var value = m[3].trim();
    if (key === "force" || key === "confirm" || key === "确认") {
        rule.force = value === "1" || value === "true" || value === "是" || value === "ok";
        return;
    }
    if (key === "类型" || key === "种类" || key === "otype") key = "type";
    if (key === "品质" || key === "品阶" || key === "quality" || key === "pz") key = "grade";
    if (key === "名称" || key === "名字") key = "name";
    if (key === "路径") key = "path";
    if (key === "部位" || key === "装备部位" || key === "equip") key = "eq";
    if (key === "价值" || key === "价格") key = "value";
    if (key === "精炼" || key === "等级") key = "level";
    if (key === "数量") key = "count";
    rule.conditions.push({ key: key, op: op, value: value });
}
function parse_structured_loot_rule(data) {
    if (!data) return null;
    var action = LOOT_ACTIONS[(data.action || "pick").toLowerCase()];
    if (!action) return null;
    var rule = { action: action, conditions: [], force: data.force == 1 || data.force === true };
    if (has_loot_value(data.type)) rule.conditions.push({ key: "type", op: "=", value: data.type });
    if (has_loot_value(data.grade)) {
        rule.conditions.push({ key: "grade", op: data.gradeOp || "=", value: data.grade });
    }
    if (has_loot_value(data.eq)) rule.conditions.push({ key: "eq", op: "=", value: data.eq });
    if (data.name) rule.conditions.push({ key: "name", op: "=", value: data.name });
    if (data.value !== undefined && data.value !== "" && data.valueOp) {
        rule.conditions.push({ key: "value", op: data.valueOp, value: data.value });
    }
    return rule;
}
function parse_loot_filter(text) {
    var rules = [];
    if (!text || text === "0") return rules;
    try {
        var json = JSON.parse(text);
        if (Array.isArray(json)) {
            for (var x = 0; x < json.length; x++) {
                var jsonRule = parse_structured_loot_rule(json[x]);
                if (jsonRule) rules.push(jsonRule);
            }
            return rules;
        }
    } catch (e) {
    }
    var lines = ("" + text).split(/[\n;；]+/);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(/#.*/, "").trim();
        if (!line) continue;
        var parts = line.split(/\s+/);
        var action = LOOT_ACTIONS[parts.shift().toLowerCase()];
        if (!action) continue;
        var rule = { action: action, conditions: [], force: false };
        for (var j = 0; j < parts.length; j++) {
            parse_loot_condition(parts[j], rule);
        }
        rules.push(rule);
    }
    return rules;
}

function get_loot_rules(me) {
    var text = me.query_setting("auto_get_filter");
    if (!text || text === "0") return null;
    if (me._loot_filter_text === text) return me._loot_filter_rules;
    me._loot_filter_text = text;
    me._loot_filter_rules = parse_loot_filter(text);
    return me._loot_filter_rules;
}
function match_loot_type(item, value) {
    var type = normalize_loot_type(value);
    if (type === undefined) return false;
    if (type === "money") return !!item.is_money;
    if (type === "cash") return item.path && item.path.indexOf("cash/") === 0;
    if (type === "drug") return item.path && item.path.indexOf("drug/") === 0;
    return item.otype === type;
}
function match_loot_condition(item, c) {
    var values = split_loot_values(c.value);
    switch (c.key) {
        case "type":
            for (var i = 0; i < values.length; i++) {
                if (match_loot_type(item, values[i])) return true;
            }
            return false;
        case "name":
            var name = clean_loot_text(item.name || item.color_name || "");
            for (var i = 0; i < values.length; i++) {
                if (name.indexOf(values[i]) >= 0) return true;
            }
            return false;
        case "path":
            for (var i = 0; i < values.length; i++) {
                if (item.path && item.path.indexOf(values[i]) === 0) return true;
            }
            return false;
        case "eq":
            if (!item.is_equipment) return false;
            for (var i = 0; i < values.length; i++) {
                if (item.eq_type === normalize_loot_eq(values[i])) return true;
            }
            return false;
        case "grade":
            return compare_loot_numbers(item.grade, c.op, c.value);
        case "value":
            return compare_loot_numbers(item.value, c.op, c.value);
        case "level":
            return compare_loot_numbers(item.level, c.op, c.value);
        case "count":
            return compare_loot_numbers(item.count, c.op, c.value);
        case "transable":
            return compare_loot_numbers(item.transable ? 1 : 0, c.op, c.value);
    }
    return false;
}
function match_loot_rule(item, rule) {
    for (var i = 0; i < rule.conditions.length; i++) {
        if (!match_loot_condition(item, rule.conditions[i])) return false;
    }
    return true;
}
function can_auto_sell_loot(item) {
    if (!item || item.is_locked || !item.transable || !(item.value > 0)) return false;
    if (item.is_equipment) {
        if (item.level > 3) return false;
        if (item.st_prop && item.st_prop.length > 0) return false;
    }
    return true;
}
function sell_loot_direct(me, item) {
    if (!can_auto_sell_loot(item)) return null;
    var count = item.count || 1;
    var money = Math.floor(item.value * count);
    if (!(money > 0)) return null;
    me.add_money(money);
    me.send('{"type":"dialog","dialog":"pack","money":' + me.money + '}');
    me.send("你卖掉了" + item.unit_name(count) + "。");
    if (WORLD.add_recover_obj) WORLD.add_recover_obj(me, item, 1);
    return item;
}
function can_auto_fenjie_loot(item, action) {
    if (!item || item.is_locked || !item.is_equipment || item.no_fenjie || !item.grade) return false;
    if (item.st_prop && item.st_prop.length > 0) return false;
    if (item.grade >= 5 && !action.force) return false;
    return item.grade <= 5;
}
WORLD.has_loot_filter = function (me) {
    var rules = get_loot_rules(me);
    return !!(rules && rules.length);
}
WORLD.query_loot_action = function (me, item) {
    var rules = get_loot_rules(me);
    if (!rules || !rules.length) return { action: "pick" };
    for (var i = 0; i < rules.length; i++) {
        if (match_loot_rule(item, rules[i])) return rules[i];
    }
    return { action: "pick" };
}
WORLD.accept_loot_item = function (me, item, options) {
    if (!me || !item) return null;
    options = options || {};
    var result = options.result;
    var action = options.action;
    if (typeof action === "string") action = { action: action };
    if (!action && options.useFilter && me.query_setting("auto_get")) {
        action = WORLD.query_loot_action(me, item);
    }
    action = action || { action: "pick" };
    if (action.action === "ignore") {
        if (result) result.action = "ignore";
        return null;
    }
    if (action.action === "sell" && !can_auto_sell_loot(item)) {
        action = { action: "pick" };
    }
    if (action.action === "sell" && (options.allowDirectSell === true || !me.can_add_obj(item))) {
        if (result) result.action = "sell";
        return sell_loot_direct(me, item);
    }
    if (action.action === "fenjie" && !can_auto_fenjie_loot(item, action)) {
        action = { action: "pick" };
    }
    if (result) result.action = action.action;
    var picked = me.add_obj(item, null, true);
    if (!picked) {
        me.notify("你身上东西太多了，无法获得" + (item.color_name || item.name || "物品") + "。");
        return null;
    }
    if (action.action === "sell") {
        var sell_count = item.count || 1;
        WORLD.COMMANDS["sell"].enter(me, sell_count > 1 ? sell_count : "", picked.id);
    } else if (action.action === "fenjie") {
        WORLD.COMMANDS["fenjie"].enter(me, picked.id, action.force ? "ok" : undefined);
    }
    return picked;
}
function run_auto_get(me, corpse) {
    if (!me || !me.is_player) return;
    if (!me.is_here(corpse) || !me.query_setting("auto_get") || me.state || !me.hp) return;
    if (WORLD.has_loot_filter(me)) me.set_temp("auto_get_filtering", 1, 1000);
    WORLD.COMMANDS['get'].enter(me, "", "all", corpse.id);
    me.remove_temp("auto_get_filtering");
}
WORLD.auto_get = function (me, corpse, npc) {
    if (npc && npc.damages) {
        for (var i = 0; i < npc.die_room.items.length; i++) {
            var item = npc.die_room.items[i];
            if (item.is_player && item.query_setting("auto_get") && npc.damages[item.id]) {
                run_auto_get(item, corpse);

            }
        }
    } else if (me && me.is_player) {
        run_auto_get(me, corpse);
    }
    //if (me && me.is_player) {
    //    me.add_temp('killed', 1, UTIL.diff_time());
    //}
}
WORLD.auto_pfm = function (me, target) {
    if (me.hp <= 0 || target.hp <= 0) return;
    if (!me.is_player && me.query_setting("auto_pfm")) {
        var setting = me.query_setting("auto_pfm");
        if (!setting.split) return WORLD.log(me, 'auto', setting);
        var str = setting.split(",");
        for (var i = 0; i < str.length; i++) {
            var ps = str[i].split(".");

            WORLD.COMMANDS["perform"].enter(me, ps[0], ps[1]);
        }
    }

    if (!target.is_player && target.query_setting("auto_pfm2")) {
        var str = target.query_setting("auto_pfm2").split(",");
        for (var i = 0; i < str.length; i++) {
            var ps = str[i].split(".");
            WORLD.COMMANDS["perform"].enter(target, ps[0], ps[1]);
        }
    }
}
