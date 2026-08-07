this.inherits(NPC);
this.set({
    name: "夏雪宜",
    desc: "他便是金蛇郎君夏雪宜，黄衫飘动间，袖中金蛇锥寒芒闪烁。",
    title: "金蛇郎君",
    gender: 1,
    age: 35,
    per: 26,
    mp: 4000,
    max_mp: 7600,
    hp: 17000,
    max_hp: 17000,
    pfm_rate: 1,
    score: 30,
    prop: { gj: 620, mz: 520, ds: 520, fy: 500 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv2/js_zhui", 1, 1], ["eq/lv2/js_ring", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 480],
    ["unarmed", 520],
    ["sword", 500],
    ["throwing", 500],
    ["jinshezhang", 520, "unarmed"],
    ["jinshejianfa", 520, "sword"],
    ["jinsheyoushenbu", 500, "dodge"],
    ["wuduyanluobu", 500, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 8,
    max: 20
}, {
    obj: ["book/bc#jinshezhang", "book/bc#wuduyanluobu", "book/bc#baguaquan", "book/bc#baguagun", "book/bc#jinshejianfa", "book/bc#jinsheyoushenbu"],
    odds: 5200
}, {
    obj: ["eq/lv2/js_zhui", "eq/lv2/js_ring", "eq/lv2/js_pifeng", "eq/lv2/js_nang", "eq/lv3/baguagun", "eq/lv3/jinshejian"],
    odds: 3000
});
