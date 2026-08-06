this.inherits(NPC);
this.set({
    name: "善勇",
    desc: "他是血刀门护法之一，身材魁梧，手中戒刀沾着未干的雪水。",
    title: "血刀门护法",
    gender: 1,
    age: 38,
    per: 18,
    str: 30,
    con: 28,
    dex: 26,
    int: 22,
    family: FAMILIES.XUEDAO,
    family_level: 3,
    level: 2,
    max_mp: 240000,
    max_hp: 300000,
    prop: {
        gj: 3000,
        mz: 2800,
        ds: 2600
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["blade", 300],
    ["unarmed", 300],
    ["literate", 300],
    ["xuedaoxinfa", 300, "force"],
    ["xuejiedao", 300, ["blade", "parry"]],
    ["xuelingqinna", 300, ["unarmed", "parry"]],
    ["xuehaimogong", 300, "force"],
    ["xuedunbu", 300, "dodge"],
    ["xuedaodaofa", 300, ["blade", "parry"]],
    ["xueyingzhang", 300, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("xuedaoxinfa", 0) < 100) return me.notify_fail("善勇说道：你的血刀心法火候还浅，血气不稳。");
    if (me.query_skill("xuedaodaofa", 0) < 100) return me.notify_fail("善勇说道：你的血刀刀法火候还浅，先去多练几刀。");
    if (me.query_skill("xuedunbu", 0) < 100) return me.notify_fail("善勇说道：神空行不熟，遇敌只会白白送命。");
    return true;
}
