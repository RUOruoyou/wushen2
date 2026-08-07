this.inherits(EQUIPMENT);
this.set({
    name: "曲洋的琴环",
    desc: "魔教长老曲洋所制的琴环，环上挂着细小铜铃，出招时铃声与琴音相和，扰人心神。",
    unit: "枚",
    grade: 2,
    eq_type: EQUIP_TYPE.NECKLACE,
    value: 45000,
    hole_count: 1,
    prop: {
        gj: 10,
        mz: 14,
        ds: 8
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
