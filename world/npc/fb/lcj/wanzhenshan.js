this.inherits(NPC);
this.set({
    name: "万震山",
    desc: "他面色阴沉，剑势老辣，举手投足间皆是算计。",
    title: "五云手",
    gender: 1,
    age: 55,
    per: 18,
    mp: 5600,
    max_mp: 9000,
    hp: 22000,
    max_hp: 22000,
    pfm_rate: 1,
    score: 28,
    prop: { gj: 720, mz: 590, ds: 530, fy: 570 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 540],
    ["parry", 600],
    ["force", 540],
    ["sword", 620],
    ["tangshijianfa", 600, ["sword", "parry"]]);
this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 20
}, {
    obj: ["book/bc#tangshijianfa", "sp/lcj/liancheng_canpian"],
    odds: 2800
});
