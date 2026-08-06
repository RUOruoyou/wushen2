this.inherits(EQUIPMENT);
this.set({
    name: "白云履",
    desc: "恒山弟子行走山路所穿的软履，鞋底密缝细麻，踏地无声。",
    unit: "双",
    grade: 2,
    eq_type: EQUIP_TYPE.SHOES,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 22,
        ds: 20,
        dex: 4
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
