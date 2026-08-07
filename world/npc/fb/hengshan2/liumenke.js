this.inherits(NPC);
this.set({
    name: "刘门客",
    desc: "刘门旧客守在流云峰前，剑掌皆带衡山旧法。",
    title: "衡山旧客",
    gender: 1,
    age: 42,
    per: 20,
    mp: 2800,
    max_mp: 6000,
    hp: 13500,
    max_hp: 13500,
    score: 14,
    prop: { gj: 500, mz: 460, fy: 430 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 460],
    ["parry", 460],
    ["force", 430],
    ["unarmed", 470],
    ["sword", 450],
    ["liuyunzhang", 470, "unarmed"],
    ["chuanyunzong", 460, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 4,
    max: 13
}, {
    obj: ["book/bc#liuyunzhang", "book/bc#chuanyunzong", "book/book#unarmed", "eq/lv2/hs2_cloth"],
    odds: 3600
});
