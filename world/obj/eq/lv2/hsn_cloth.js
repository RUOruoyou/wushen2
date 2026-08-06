this.inherits(EQUIPMENT);
this.set({
    name: "白云僧衣",
    desc: "恒山白云庵中收藏的素色僧衣，衣料轻薄却极耐刀剑。",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.CLOTH,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 38,
        max_hp: 220,
        con: 4
    }
});
this.group_name = "hsn2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            max_hp: 100
        };
    } else if (count == 3) {
        return {
            fy: 15
        };
    }
}
