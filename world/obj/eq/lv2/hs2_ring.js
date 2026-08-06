this.inherits(EQUIPMENT);
this.set({
    name: "琴心戒",
    desc: "一枚素银戒指，戒面细刻半阕琴谱，似能帮助佩戴者凝神出招。",
    unit: "枚",
    grade: 2,
    eq_type: EQUIP_TYPE.RING,
    value: 30000,
    hole_count: 1,
    prop: {
        gj: 8,
        mz: 12,
        bj_per: 1
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
