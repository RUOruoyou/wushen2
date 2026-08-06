this.inherits(EQUIPMENT);
this.set({
    name: "金蛇秘锥",
    desc: "夏雪宜藏在金蛇秘匣中的暗器，锥身细长，出手时如金蛇吐信。",
    unit: "枚",
    grade: 2,
    eq_type: EQUIP_TYPE.THROWING,
    value: 30000,
    hole_count: 1,
    prop: {
        gj: 30,
        mz: 25,
        bj_per: 1
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
