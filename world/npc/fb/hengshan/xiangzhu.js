this.inherits(NPC);
this.set({
    name: "魔教香主",
    desc: "魔教香主翻找经卷时仍戒备森严，掌中短剑随时会刺出。",
    title: "魔教香主",
    gender: 1,
    age: 38,
    per: 20,
    mp: 2600,
    max_mp: 5600,
    hp: 12800,
    max_hp: 12800,
    score: 14,
    prop: { gj: 450, mz: 420, ds: 420, fy: 390 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 430],
    ["parry", 430],
    ["force", 400],
    ["sword", 430],
    ["huashanjianfa", 430, "sword"]);
this.set_drop({
    obj: "money/silver",
    min: 4,
    max: 12
}, {
    obj: ["book/book#sword", "st/xuanjing", "eq/lv2/hsn_shoes"],
    odds: 3600
});
