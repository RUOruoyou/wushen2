this.inherits(EQUIPMENT);
this.set({
    name: "金鋘钩",
    desc: "何铁手的假手，形似钩状，如纤纤女手",
    unit: "副",
    grade: 2,
    eq_type: EQUIP_TYPE.WRIST,
    value: 30000,
    hole_count: 2,
    prop: {
        gj: 22,
        zj: 22,
        mz: 8
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
