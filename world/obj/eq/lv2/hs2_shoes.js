this.inherits(EQUIPMENT);
this.set({
    name: "回雁履",
    desc: "衡山回雁峰下制成的软履，轻点石阶便能借势转身。",
    unit: "双",
    grade: 2,
    eq_type: EQUIP_TYPE.SHOES,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 20,
        ds: 24,
        dex: 5
    }
});
this.group_name = "hs2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            ds: 10
        };
    } else if (count == 4) {
        return {
            mz: 10,
            add_bjsh_per: 2
        };
    }
}
