this.inherits(EQUIPMENT);
this.set({
    name: "金蛇披风",
    desc: "一件暗金色的披风，",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.CAPE,
    value: 20000,
    hole_count:1,
    prop: {
        fy: 35,
        max_hp: 350
    }
});
this.group_name = "js2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            mz: 10
        };
    } else if (count == 4) {
        return {
            dex: 3,
            add_sh_per: 1
        };
    }
}
