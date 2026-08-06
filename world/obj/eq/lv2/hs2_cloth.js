this.inherits(EQUIPMENT);
this.set({
    name: "流云衫",
    desc: "衡山琴台旁收藏的轻衫，衣摆如云，适合配合流云掌法腾挪。",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.CLOTH,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 34,
        ds: 12,
        max_hp: 180
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
