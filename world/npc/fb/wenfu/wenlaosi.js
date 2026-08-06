this.inherits(NPC);
this.set({
    name: "温方义",
    desc: "温家长老之一，身法矫健，出手专攻要害。",
    title: "温家长老",
    gender: 1,
    age: 52,
    per: 19,
    mp: 2000,
    max_mp: 5000,
    hp: 11800,
    max_hp: 11800,
    score: 16,
    prop: { gj: 420, mz: 360, fy: 390 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/tiezhang", 1, 1]);
this.skill_map(
    ["dodge", 420],
    ["parry", 420],
    ["force", 400],
    ["unarmed", 430],
    ["baguaquan", 430, "unarmed"]);
this.set_drop({
    obj: "money/silver",
    min: 5,
    max: 14
}, {
    obj: ["book/bc#baguaquan", "st/xuanjing"],
    odds: 3200
});
