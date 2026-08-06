this.inherits(EQUIPMENT);
this.set({
    name: "八卦戒",
    desc: "戒面刻着乾坤二卦，出拳运棍时可稳住气机。",
    unit: "枚",
    grade: 2,
    eq_type: EQUIP_TYPE.RING,
    value: 30000,
    hole_count: 1,
    prop: {
        gj: 8,
        mz: 15,
        fy: 8
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
