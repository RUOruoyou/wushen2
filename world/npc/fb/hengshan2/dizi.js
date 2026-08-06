this.inherits(NPC);
this.set({
    name: "衡山弟子",
    desc: "一名衡山派弟子，剑法轻灵，掌势如流云。",
    title: "衡山派",
    gender: 1,
    age: 24,
    per: 18,
    mp: 1300,
    max_mp: 3800,
    hp: 9500,
    max_hp: 9500,
    score: 8,
    prop: { gj: 330, mz: 340, ds: 330 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 370],
    ["parry", 370],
    ["force", 340],
    ["unarmed", 360],
    ["sword", 360],
    ["liuyunzhang", 360, "unarmed"],
    ["huashanjianfa", 360, "sword"]);
this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 8
}, {
    obj: ["book/bc#liuyunzhang", "book/book#sword"],
    odds: 3200
});
