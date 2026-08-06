this.inherits(NPC);
this.set({
    name: "血刀老祖",
    desc: "他就是血刀门祖师，面容枯瘦，眼神如冰，腰间一柄血刀泛着暗红寒光。",
    title: "血刀门祖师",
    gender: 1,
    age: 72,
    per: 22,
    str: 34,
    con: 34,
    dex: 32,
    int: 28,
    family: FAMILIES.XUEDAO,
    family_level: 1,
    level: 3,
    max_mp: 927400,
    max_hp: 991500,
    prop: {
        gj: 9000,
        mz: 8500,
        ds: 8500
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["blade", 800],
    ["unarmed", 800],
    ["literate", 800],
    ["xuedaoxinfa", 800, "force"],
    ["xuejiedao", 800, ["blade", "parry"]],
    ["xuelingqinna", 800, ["unarmed", "parry"]],
    ["xuehaimogong", 800, "force"],
    ["xuedunbu", 800, "dodge"],
    ["xuedaodaofa", 800, ["blade", "parry"]],
    ["xueyingzhang", 800, ["unarmed", "parry"]],
    ["xuedaojing", 800, ["blade", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("xuehaimogong", 0) < 500) return me.notify_fail("血刀老祖冷笑道：血海魔功未入化境，也敢来见老祖？");
    if (me.query_skill("xuedaodaofa", 0) < 500) return me.notify_fail("血刀老祖说道：你的血刀刀法还差得远。");
    if (me.query_skill("xuedunbu", 0) < 500) return me.notify_fail("血刀老祖说道：神空行不够纯熟，刀再快也只是莽夫。");
    if (me.query_skill("xueyingzhang", 0) < 300) return me.notify_fail("血刀老祖说道：金刚瑜伽母拳未成，血刀经的狂烈变化你悟不透。");
    return true;
}
