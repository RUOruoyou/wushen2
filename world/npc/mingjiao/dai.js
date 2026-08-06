this.inherits(NPC);
this.set({
    name: "黛绮丝",
    desc: "她眉目如画，气质冷艳，举手投足间隐约带着波斯武学的奇诡节奏。",
    title: "明教紫衫龙王",
    gender: 2,
    age: 41,
    per: 40,
    str: 27,
    con: 30,
    dex: 35,
    int: 34,
    family: FAMILIES.MINGJIAO,
    family_level: 2,
    level: 4,
    max_mp: 650000,
    max_hp: 700000,
    prop: {
        gj: 5700,
        mz: 6500,
        ds: 6800
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 650],
    ["parry", 650],
    ["force", 650],
    ["sword", 650],
    ["unarmed", 500],
    ["literate", 650],
    ["mingjiaoxinfa", 650, "force"],
    ["qingfushenfa", 550, "dodge"],
    ["liehuojian", 500, "sword"],
    ["hanbingmianzhang", 450, "unarmed"],
    ["shenghuoling", 600, ["sword", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("liehuojian", 0) < 300) return me.notify_fail("黛绮丝说道：中土剑法尚未纯熟，如何领悟圣火令中的奇变？");
    if (me.query_skill("qingfushenfa", 0) < 250) return me.notify_fail("黛绮丝说道：身法不够轻灵，圣火令只会缚住自己。");
    return true;
};
