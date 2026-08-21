this.inherits(EQUIPMENT);
this.set({
    name: "自制武器",
    desc: "这是一件由铁匠锻造的自制武器。",
    unit: "件",
    grade: 5,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.SWORD,
    value: 1000000,
    hole_count: 4,
    prop: {
        gj: 120
    }
});

const WEAPON_SETTINGS = {
    sword: { name: "自制剑", unit: "柄", weapon_type: WEAPON_TYPE.SWORD },
    blade: { name: "自制刀", unit: "把", weapon_type: WEAPON_TYPE.BLADE },
    club: { name: "自制棍", unit: "根", weapon_type: WEAPON_TYPE.CLUB },
    staff: { name: "自制杖", unit: "把", weapon_type: WEAPON_TYPE.STAFF },
    whip: { name: "自制鞭", unit: "条", weapon_type: WEAPON_TYPE.WHIP },
    none: { name: "自制拳套", unit: "副", weapon_type: WEAPON_TYPE.NONE }
};

this.on_create = function (path, par) {
    this.custom_type = par ? par.substr(1) : "sword";
    this.on_reload();
}

this.on_reload = function () {
    let type = (this.query_temp("type") || this.custom_type || "sword").toLowerCase();
    let setting = WEAPON_SETTINGS[type] || WEAPON_SETTINGS.sword;
    this.weapon_type = setting.weapon_type;
    this.unit = setting.unit;
    this.name = this.query_temp("name", setting.name);
    this.desc = "这是一件由铁匠锻造的自制武器。";
    if (WORLD.CUSTOM_EQUIPMENT) return WORLD.CUSTOM_EQUIPMENT.rebuild(this);
    if (WORLD.COMMANDS.duanzao) WORLD.COMMANDS.duanzao.default_template(this, EQUIP_TYPE.WEAPON);
    let cc = this.query_grade_color();
    this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
    this.json = null;
}
