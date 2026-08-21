this.inherits(EQUIPMENT);
this.set({
    name: "自制装备",
    desc: "这是一件由铁匠锻造的自制装备。",
    unit: "件",
    grade: 5,
    eq_type: EQUIP_TYPE.CLOTH,
    value: 1000000,
    hole_count: 4,
    prop: {
        fy: 120
    }
});

const EQUIPMENT_SETTINGS = {
    cloth: { name: "自制衣服", unit: "件", eq_type: EQUIP_TYPE.CLOTH },
    shoes: { name: "自制鞋", unit: "双", eq_type: EQUIP_TYPE.SHOES },
    head: { name: "自制头饰", unit: "件", eq_type: EQUIP_TYPE.HEAD },
    cape: { name: "自制披风", unit: "件", eq_type: EQUIP_TYPE.CAPE },
    ring: { name: "自制戒指", unit: "枚", eq_type: EQUIP_TYPE.RING },
    necklace: { name: "自制项链", unit: "条", eq_type: EQUIP_TYPE.NECKLACE },
    jewels: { name: "自制饰品", unit: "件", eq_type: EQUIP_TYPE.JEWELS },
    wrist: { name: "自制护腕", unit: "副", eq_type: EQUIP_TYPE.WRIST },
    waist: { name: "自制腰带", unit: "条", eq_type: EQUIP_TYPE.WAIST },
    throwing: { name: "自制暗器", unit: "件", eq_type: EQUIP_TYPE.THROWING }
};

this.on_create = function (path, par) {
    this.custom_type = par ? par.substr(1) : "cloth";
    this.on_reload();
}

this.on_reload = function () {
    let type = (this.query_temp("type") || this.custom_type || "cloth").toLowerCase();
    let setting = EQUIPMENT_SETTINGS[type] || EQUIPMENT_SETTINGS.cloth;
    this.eq_type = setting.eq_type;
    this.unit = setting.unit;
    this.name = this.query_temp("name", setting.name);
    this.desc = "这是一件由铁匠锻造的自制装备。";
    if (WORLD.CUSTOM_EQUIPMENT) return WORLD.CUSTOM_EQUIPMENT.rebuild(this);
    if (WORLD.COMMANDS.duanzao) WORLD.COMMANDS.duanzao.default_template(this, this.eq_type);
    let cc = this.query_grade_color();
    this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
    this.json = null;
}
