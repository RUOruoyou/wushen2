this.inherits(EQUIPMENT);
this.set({
    name: "血刀",
    desc: "一柄狭长弯刀，刀锋泛着暗红寒光。刀身轻薄而锋利，最宜贴身疾斩、反手削刺。",
    unit: "柄",
    grade: 3,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.BLADE,
    value: 120000,
    hole_count: 1,
    condition: {
        skill: {
            blade: 180
        }
    },
    prop: {
        gj: 42,
        mz: 10,
        str: 6,
        max_hp: 360,
        bj_per: 3
    }
});
