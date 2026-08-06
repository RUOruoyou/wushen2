this.inherits(EQUIPMENT);
this.set({
    name: "疤面面具",
    desc: "何红药的疤面面具，狰狞恐怖",
    unit: "件",
    grade:2,
    eq_type: EQUIP_TYPE.HEAD,
    value: 30000,
    hole_count: 2,
    prop: {
        per: -10,
        ds: 20,
        add_sh_per: 5
    }
});
this.group_name = "wd2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            zj: 10,
            ds: 10
        };
    } else if (count == 4) {
        return {
            add_sh_per: 1
        };
    }
}
