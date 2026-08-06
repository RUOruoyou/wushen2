this.inherits(NPC);
this.set({
    name: "凌退思",
    desc: "他官服整肃，目光冷硬，袖中似藏着淬毒暗器。",
    title: "荆州知府",
    gender: 1,
    age: 50,
    per: 17,
    mp: 5800,
    max_mp: 9400,
    hp: 22500,
    max_hp: 22500,
    pfm_rate: 1,
    score: 30,
    prop: { gj: 730, mz: 610, ds: 560, fy: 590 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv2/anqi", 1, 1]);
this.skill_map(
    ["dodge", 560],
    ["parry", 590],
    ["force", 570],
    ["throwing", 600],
    ["unarmed", 590],
    ["qianzhuwandushou", 590, ["unarmed", "parry"]]);
this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 22
}, {
    obj: ["book/bc#shenzhaojing", "eq/lv3/juhua_yupei"],
    odds: 1800
});
