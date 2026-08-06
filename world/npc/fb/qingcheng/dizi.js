this.inherits(NPC);
this.set({
    name: "青城弟子",
    desc: "一名青城派弟子，手中长棍按八卦方位变招。",
    title: "青城派",
    gender: 1,
    age: 24,
    per: 18,
    mp: 1200,
    max_mp: 3600,
    hp: 9200,
    max_hp: 9200,
    score: 6,
    prop: { gj: 320, mz: 320, fy: 300 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/mugun", 1, 1]);
this.skill_map(
    ["dodge", 360],
    ["parry", 360],
    ["force", 340],
    ["unarmed", 340],
    ["club", 360],
    ["baguagun", 360, "club"],
    ["baguaquan", 340, "unarmed"]);
this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 8
}, {
    obj: ["book/bc#baguaquan", "book/bc#baguagun"],
    odds: 3200
});
