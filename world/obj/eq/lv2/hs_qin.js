this.inherits(EQUIPMENT);
this.set({
    unit: "枚",
    name: "琴中剑",
    desc: "衡山掌门莫大的琴中剑，护身用的",
    value: 10000,
    eq_type: EQUIP_TYPE.THROWING,
    grade: 2,
    hole_count: 1
});
this.prop = {
    gj: 40,
    mz: 20,
    fy: 40
};
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
