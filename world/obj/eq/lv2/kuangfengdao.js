this.inherits(EQUIPMENT);
this.set({
    name: "狂风刀",
    desc: "采花大盗田伯光成名的快刀，刀身轻薄，挥动时刀风如狂风骤雨。",
    unit: "把",
    grade: 2,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.BLADE,
    value: 60000,
    hole_count: 1,
    prop: {
        gj: 56,
        mz: 12,
        dex: 5,
        gjsd_per: 3
    }
});
this.group_name = "hsn2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            max_hp: 100
        };
    } else if (count == 3) {
        return {
            fy: 15
        };
    }
}
