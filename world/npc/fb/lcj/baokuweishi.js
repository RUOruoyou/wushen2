this.inherits(NPC);
this.set({
    name: "宝库守卫",
    desc: "他守在天宁寺石门前，双目无神，却仍死死攥着手中兵器。",
    title: "宝库机关人",
    gender: 1,
    age: 40,
    per: 10,
    mp: 4300,
    max_mp: 7000,
    hp: 16500,
    max_hp: 16500,
    score: 14,
    prop: { gj: 590, mz: 490, ds: 420, fy: 540 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 420],
    ["parry", 500],
    ["force", 430],
    ["blade", 520],
    ["wuhuduanmendao", 500, ["blade", "parry"]]);
this.set_drop({
    obj: "sp/lcj/baozang_suipian",
    min: 1,
    max: 1,
    odds: 1800
});
