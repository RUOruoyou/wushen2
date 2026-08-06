this.inherits(NPC);
this.set({
    name: "宝象",
    desc: "他是血刀门上师，面上带着狞笑，举手投足间都有一股凶横之气。",
    title: "血刀门上师",
    gender: 1,
    age: 45,
    per: 19,
    str: 31,
    con: 30,
    dex: 28,
    int: 24,
    family: FAMILIES.XUEDAO,
    family_level: 2,
    level: 3,
    max_mp: 360000,
    max_hp: 430000,
    prop: {
        gj: 5000,
        mz: 4600,
        ds: 4300
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["blade", 500],
    ["unarmed", 500],
    ["literate", 500],
    ["xuedaoxinfa", 500, "force"],
    ["xuejiedao", 500, ["blade", "parry"]],
    ["xuelingqinna", 500, ["unarmed", "parry"]],
    ["xuehaimogong", 500, "force"],
    ["xuedunbu", 500, "dodge"],
    ["xuedaodaofa", 500, ["blade", "parry"]],
    ["xueyingzhang", 500, ["unarmed", "parry"]],
    ["xuedaojing", 400, ["blade", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("xuehaimogong", 0) < 300) return me.notify_fail("宝象说道：血海魔功未成，怎配学上乘血刀。");
    if (me.query_skill("xuedaodaofa", 0) < 300) return me.notify_fail("宝象说道：你的血刀刀法还不够狠辣。");
    if (me.query_skill("xuelingqinna", 0) < 200) return me.notify_fail("宝象说道：密宗大手印不熟，血刀经中的刚柔换势你领会不了。");
    return true;
}
