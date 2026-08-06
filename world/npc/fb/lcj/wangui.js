this.inherits(NPC);
this.set({
    name: "万圭",
    desc: "他衣饰华贵，手中长剑轻颤，脸上满是怨毒之色。",
    title: "万家少爷",
    gender: 1,
    age: 28,
    per: 20,
    mp: 4200,
    max_mp: 7000,
    hp: 15000,
    max_hp: 15000,
    pfm_rate: 1,
    score: 18,
    prop: { gj: 540, mz: 470, ds: 430, fy: 430 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 430],
    ["parry", 460],
    ["force", 430],
    ["sword", 470],
    ["tangshijianfa", 460, ["sword", "parry"]]);
this.set_drop({
    obj: "money/silver",
    min: 5,
    max: 12
}, {
    obj: "book/bc#tangshijianfa",
    odds: 1800
});
