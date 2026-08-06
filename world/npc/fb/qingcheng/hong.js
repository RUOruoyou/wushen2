this.inherits(NPC);
this.set({
    name: "洪人雄",
    desc: "青城四秀之一，棍法大开大合，脚下步步踩着八卦方位。",
    title: "青城四秀",
    gender: 1,
    age: 30,
    per: 19,
    mp: 2600,
    max_mp: 5800,
    hp: 13200,
    max_hp: 13200,
    score: 13,
    prop: { gj: 480, mz: 420, fy: 420 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv2/qc_gun", 1, 1]);
this.skill_map(
    ["dodge", 440],
    ["parry", 440],
    ["force", 410],
    ["club", 470],
    ["baguagun", 470, "club"]);
this.set_drop({
    obj: "money/silver",
    min: 4,
    max: 13
}, {
    obj: ["book/bc#baguagun", "eq/lv2/qc_gun"],
    odds: 3600
});
