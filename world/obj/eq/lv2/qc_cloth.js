this.inherits(EQUIPMENT);
this.set({
    name: "松风道袍",
    desc: "青城弟子常穿的青色道袍，袖摆轻窄，便于施展八卦身法。",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.CLOTH,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 32,
        max_hp: 160,
        ds: 10
    }
});
this.group_name = "qc2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            mz: 10
        };
    } else if (count == 3) {
        return {
            gj: 8
        };
    }
}
