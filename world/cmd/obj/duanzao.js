this.inherits(COMMAND);
this.command = "duanzao";

const WEAPON_NAMES = {
    sword: "剑",
    blade: "刀",
    club: "棍",
    staff: "杖",
    whip: "鞭",
    none: "拳套"
};

this.PROPS = {
    gj: { value: 120 },
    fy: { value: 120 },
    mz: { value: 120 },
    ds: { value: 120 },
    zj: { value: 120 },
    str: { value: 10 },
    con: { value: 10 },
    dex: { value: 10 },
    int: { value: 10 },
    max_hp: { value: 1000 },
    hp_per: { value: 1 },
    gj_per: { value: 1 },
    fy_per: { value: 1 },
    ds_per: { value: 1 },
    mz_per: { value: 1 },
    zj_per: { value: 1 }
};

this.DEFAULT_PROPS = [];
this.DEFAULT_PROPS[EQUIP_TYPE.WEAPON] = "gj";
this.DEFAULT_PROPS[EQUIP_TYPE.CLOTH] = "fy";
this.DEFAULT_PROPS[EQUIP_TYPE.SHOES] = "fy";
this.DEFAULT_PROPS[EQUIP_TYPE.HEAD] = "fy";
this.DEFAULT_PROPS[EQUIP_TYPE.CAPE] = "fy";
this.DEFAULT_PROPS[EQUIP_TYPE.WRIST] = "fy";
this.DEFAULT_PROPS[EQUIP_TYPE.WAIST] = "fy";
this.DEFAULT_PROPS[EQUIP_TYPE.THROWING] = "gj";

this.sum_needs = function (prop, level) {
    level = parseInt(level) || 1;
    return (1 + level) * level / 2;
}

this.prop_value = function (prop, level) {
    let item = this.PROPS[prop];
    if (!item) return 0;
    level = parseInt(level) || 1;
    return item.value * level;
}

this.default_template = function (obj, eq_type) {
    obj.eq_type = eq_type;
    obj.grade = obj.grade || 5;
    obj.value = obj.VALUES ? obj.VALUES[obj.grade] : 1000000;
    if (obj.hole_count === undefined) obj.hole_count = 2;

    let def_prop = this.DEFAULT_PROPS[obj.eq_type];
    let has_temp = Object.prototype.hasOwnProperty.call(obj, "temp") && obj.temp;
    let temp = has_temp ? obj.temp : {};
    if (def_prop && has_temp && !temp[def_prop]) {
        temp[def_prop] = 1;
    }

    let prop = {};
    for (let key in temp) {
        if (!this.PROPS[key]) continue;
        prop[key] = (prop[key] || 0) + this.prop_value(key, temp[key]);
    }
    if (!Object.keys(prop).length && def_prop) {
        prop[def_prop] = this.prop_value(def_prop, 1);
    }
    obj.prop = prop;
    obj.original_prop = Object.assign({}, prop);
    return obj;
}

this.enter = function (me, arg) {
    if (arg == "ok") {
        var item = me.find_obj_bypath("st/yuanjing");
        if (!item || item.count < 10) return me.notify("铁匠说道：材料不够就别来烦我。");

        me.notify("铁匠点头说道：嗯，不错，你想锻造什么武器？");
        me.send_commands("duanzao sword", "剑", "duanzao blade", "刀", "duanzao club", "棍", "duanzao staff", "杖",
            "duanzao whip", "鞭", "duanzao none", "拳套");
        return;
    }

    if (!arg) {
        me.notify("铁匠说道：你能找到10块<hio>元晶</hio>我就免费帮你锻造一把你自己的武器。");
        var yuanjing = me.find_obj_bypath("st/yuanjing");
        if (yuanjing && yuanjing.count >= 10) {
            me.send_commands("duanzao ok", "我要锻造武器");
        }
        return;
    }

    var type = WEAPON_TYPE[arg.toUpperCase()];
    if (!type) return me.notify("铁匠摇头道：我不会锻造这种武器。");
    me.notify("铁匠说道：告诉我你要锻造的武器的名字。(使用房间频道说出2-5个汉字)");
    me.wait_input = this.dzwq.bind(this, arg);
    me.send_commands("cancle", "我不锻造了");
}

this.dzwq = function (arg, me, str) {
    if (str == "cancle") {
        me.notify("铁匠说道：好吧，可惜了。");
        me.wait_input = null;
        return;
    }

    str = (str || "").split(/\s+/)[1];
    if (!arg) {
        me.wait_input = null;
        return me.notify("铁匠说道：你要先告诉我锻造的武器类型。");
    }

    var type = WEAPON_TYPE[arg.toUpperCase()];
    if (!type) {
        me.wait_input = null;
        return me.notify("铁匠摇头道：我不会锻造这种武器。");
    }

    if (!/^[\u4E00-\u9FA5]{2,5}$/.test(str)) {
        return me.send("铁匠说道：武器的名字需要是2-5个汉字。");
    }

    if (!UTIL.check_word(str)) {
        return me.send("铁匠说道：你不能用这个名字。");
    }

    var item = me.find_obj_bypath("st/yuanjing");
    if (!item || item.count < 10) {
        me.wait_input = null;
        return me.notify("铁匠说道：材料不够就别来烦我。");
    }

    me.wait_input = null;
    if (me.remove_obj(item, 10)) {
        var obj = OBJ.CREATE("eq/cp#" + arg);
        obj.set_temp("name", str);
        obj.set_temp("type", arg);
        this.default_template(obj, EQUIP_TYPE.WEAPON);
        obj.on_reload(me);
        me.add_obj(obj);
        me.notify("铁匠说道：不错，这是你要的。");
        me.notify("铁匠给你" + obj.unit_name() + "。");
    }
}
