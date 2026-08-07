this.inherits(NPC);
this.set({
    name: "五毒护法",
    desc: "五毒护法守在毒幡之间，步法飘忽，掌风腥臭。",
    title: "五毒教护法",
    gender: 1,
    age: 41,
    per: 19,
    mp: 3200,
    max_mp: 6500,
    hp: 15000,
    max_hp: 15000,
    score: 20,
    prop: { gj: 520, mz: 470, ds: 470, fy: 450 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 460],
    ["parry", 460],
    ["sword", 440],
    ["force", 440],
    ["wudushengong", 440, "force"],
    ["unarmed", 480],
    ["wudugoufa", 480, "sword"],
    ["qianzhuwandushou", 480, ["unarmed", "parry"]],
    ["wuduyanluobu", 460, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 6,
    max: 16
}, {
    obj: ["book/bc#qianzhuwandushou", "book/bc#wuduyanluobu", "book/bc#wudushengong", "book/bc#wudugoufa", "st/xuanjing", "eq/lv2/wd_pifeng"],
    odds: 4200
});
