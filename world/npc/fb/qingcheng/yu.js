this.inherits(NPC);
this.set({
    name: "于人豪",
    desc: "青城四秀之一，剑掌并用，守在松风观正殿前。",
    title: "青城四秀",
    gender: 1,
    age: 31,
    per: 20,
    mp: 2800,
    max_mp: 6000,
    hp: 13800,
    max_hp: 13800,
    score: 13,
    prop: { gj: 500, mz: 440, ds: 420, fy: 430 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 450],
    ["parry", 450],
    ["force", 420],
    ["unarmed", 450],
    ["sword", 450],
    ["baguaquan", 450, "unarmed"],
    ["songfengjianfa", 450, "sword"]);
this.set_drop({
    obj: "money/silver",
    min: 4,
    max: 13
}, {
    obj: ["book/bc#baguaquan", "book/bc#songfengjianfa", "book/book#sword", "eq/lv2/qc_cloth", "eq/lv2/qc_head"],
    odds: 3600
});
