this.inherits(EQUIPMENT);
this.set({
    unit: "枚",
    name: "金蛇戒",
    desc: "一个暗金色戒指，一条小蛇蜿蜒而上，择人而嗜",
    value: 10000,
    eq_type: EQUIP_TYPE.RING,
    grade: 2,
    hole_count:1
});
this.prop = {
    gj: 16,
    bj_per: 2
};
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
