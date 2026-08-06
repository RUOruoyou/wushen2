this.inherits(NPC);
this.set({
    name: "余沧海",
    desc: "青城派掌门余沧海身形矮小，双目精光四射，掌棍变化极快。",
    title: "青城掌门",
    gender: 1,
    age: 48,
    per: 22,
    mp: 5600,
    max_mp: 9000,
    hp: 21500,
    max_hp: 21500,
    pfm_rate: 1,
    score: 35,
    prop: { gj: 760, mz: 600, ds: 560, fy: 620 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv2/qc_gun", 1, 1]);
this.skill_map(
    ["dodge", 580],
    ["parry", 580],
    ["force", 540],
    ["unarmed", 580],
    ["club", 580],
    ["baguaquan", 580, "unarmed"],
    ["baguagun", 580, "club"]);
this.set_drop({
    obj: "money/silver",
    min: 8,
    max: 24
}, {
    obj: ["book/bc#baguaquan", "book/bc#baguagun"],
    odds: 5200
}, {
    obj: ["eq/lv2/qc_gun", "eq/lv2/qc_cloth", "eq/lv2/qc_ring", "book/book#club", "book/book#unarmed"],
    odds: 2600
});
