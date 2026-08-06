this.inherits(EQUIPMENT);
this.set({
    name: "白云念珠",
    desc: "一串温润木珠，珠上刻着恒山心法中的静字诀。",
    unit: "串",
    grade: 2,
    eq_type: EQUIP_TYPE.NECKLACE,
    value: 30000,
    hole_count: 1,
    prop: {
        fy: 15,
        max_hp: 120,
        dazuo_per: 5
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
