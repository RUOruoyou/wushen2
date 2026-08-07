this.inherits(EQUIPMENT);
this.set({
    name: "白云戒",
    desc: "恒山白云庵中传下的素银戒指，戒面隐隐泛着云纹，能助佩戴者凝神静气。",
    unit: "枚",
    grade: 2,
    eq_type: EQUIP_TYPE.RING,
    value: 30000,
    hole_count: 1,
    prop: {
        gj: 8,
        fy: 10,
        mz: 10
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
