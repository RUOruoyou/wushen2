this.inherits(EQUIPMENT);
this.set({
    name: "温仪的香囊",
    desc: "金蛇郎君夏雪宜送给温仪的定情信物",
    unit: "个",
    grade: 2,
    eq_type: EQUIP_TYPE.JEWELS,
    value: 30000,
    hole_count: 1,
    prop: {
        ds: 36,
        dex: 6,
        releasetime: 500
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
