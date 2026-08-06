this.inherits(EQUIPMENT);
this.set({
    name: "五毒披风",
    desc: "五毒教护法披在身后的黑绿披风，边缘缀着细小银铃，可扰敌心神。",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.CAPE,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 28,
        ds: 20,
        diff_sh: 15
    }
});
this.group_name = "wd2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            zj: 10,
            ds: 10
        };
    } else if (count == 4) {
        return {
            add_sh_per: 1
        };
    }
}
