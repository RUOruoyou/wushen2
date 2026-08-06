this.inherits(NPC);
this.set({
    name: "戚长发",
    desc: "他衣衫褴褛，眼神却贪狠如狼，手中长剑招招阴毒。",
    title: "铁锁横江",
    gender: 1,
    age: 58,
    per: 15,
    mp: 8600,
    max_mp: 14000,
    hp: 38000,
    max_hp: 38000,
    pfm_rate: 1,
    score: 45,
    prop: { gj: 1020, mz: 820, ds: 720, fy: 790 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 740],
    ["parry", 820],
    ["force", 780],
    ["sword", 840],
    ["tangshijianfa", 820, ["sword", "parry"]]);
this.set_drop({
    obj: "money/silver",
    min: 20,
    max: 40
}, {
    obj: "sp/lcj/liancheng_canpian",
    odds: 3600
}, {
    obj: ["book/bc#tangshijianfa", "book/bc#shenzhaojing"],
    odds: 2400
}, {
    obj: "sp/lcj/baozang_suipian",
    min: 1,
    max: 3,
    odds: 5000
});
