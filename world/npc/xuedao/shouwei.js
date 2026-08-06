this.inherits(NPC);
this.set({
    name: "血刀守卫",
    desc: "他是守在望雪楼上的血刀门弟子，眼神警惕，手中戒刀从不离身。",
    title: "血刀门弟子",
    gender: 1,
    age: 28,
    per: 18,
    str: 27,
    con: 25,
    dex: 25,
    int: 20,
    family: FAMILIES.XUEDAO,
    family_level: 4,
    level: 1,
    max_mp: 150000,
    max_hp: 180000,
    prop: {
        gj: 1700,
        mz: 1500,
        ds: 1400
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 180],
    ["parry", 180],
    ["force", 180],
    ["blade", 180],
    ["unarmed", 180],
    ["literate", 100],
    ["xuedaoxinfa", 180, "force"],
    ["xuejiedao", 180, ["blade", "parry"]],
    ["xuelingqinna", 160, ["unarmed", "parry"]],
    ["xuehaimogong", 160, "force"],
    ["xuedunbu", 180, "dodge"],
    ["xuedaodaofa", 180, ["blade", "parry"]]);
this.on_master = function () {
    return true;
}
