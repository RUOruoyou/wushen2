this.inherits(EQUIPMENT);
this.set({
    name: "五毒指环",
    desc: "一枚刻着蝎尾纹的银环，指环内侧泛着淡淡青光。",
    unit: "枚",
    grade: 2,
    eq_type: EQUIP_TYPE.RING,
    value: 30000,
    hole_count: 1,
    prop: {
        gj: 10,
        mz: 15,
        ds: 8
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
