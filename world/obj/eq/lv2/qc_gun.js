this.inherits(EQUIPMENT);
this.set({
    name: "松风棍",
    desc: "青城松风观中传下的长棍，棍身刻着八卦方位。",
    unit: "根",
    grade: 2,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.CLUB,
    value: 30000,
    hole_count: 1,
    prop: {
        gj: 52,
        mz: 10,
        zj: 8
    }
});
this.group_name = "qc2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            mz: 10
        };
    } else if (count == 3) {
        return {
            gj: 8
        };
    }
}
