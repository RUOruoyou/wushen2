this.inherits(EQUIPMENT);
this.set({
    name: "菊花玉佩",
    desc: "一枚温润玉佩，佩面刻着一朵淡淡菊纹。握在掌中时，似有一缕清和之气护住心脉。",
    unit: "枚",
    grade: 3,
    eq_type: EQUIP_TYPE.JEWELS,
    value: 60000,
    hole_count: 1,
    prop: {
        con: 5,
        max_hp: 300,
        fy: 24,
        diff_downside_per: 6
    }
});
