this.inherits(NPC);
this.set({
    name: "持刀僧",
    desc: "他是血刀门中负责看守戒刀堂的僧人，面色阴沉，手臂粗壮有力。",
    title: "血刀门弟子",
    gender: 1,
    age: 34,
    per: 18,
    str: 29,
    con: 27,
    dex: 24,
    int: 21,
    family: FAMILIES.XUEDAO,
    family_level: 3,
    level: 2,
    max_mp: 210000,
    max_hp: 260000,
    prop: {
        gj: 2600,
        mz: 2200,
        ds: 2100
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 260],
    ["parry", 260],
    ["force", 260],
    ["blade", 260],
    ["unarmed", 200],
    ["literate", 160],
    ["xuedaoxinfa", 260, "force"],
    ["xuejiedao", 260, ["blade", "parry"]],
    ["xuelingqinna", 220, ["unarmed", "parry"]],
    ["xuehaimogong", 260, "force"],
    ["xuedunbu", 260, "dodge"],
    ["xuedaodaofa", 260, ["blade", "parry"]],
    ["xueyingzhang", 200, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("xuedaoxinfa", 0) < 80) return me.notify_fail("持刀僧说道：血刀心法不稳，刀路便没有根基。");
    if (me.query_skill("xuejiedao", 0) < 100) return me.notify_fail("持刀僧说道：先把血戒刀法练稳，再来问我。");
    return true;
}
