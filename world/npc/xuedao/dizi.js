this.inherits(NPC);
this.set({
    name: "血刀弟子",
    desc: "他是血刀门的入门弟子，脸色阴沉，腰间斜挎一柄戒刀。",
    title: "血刀门入门弟子",
    gender: 1,
    age: 23,
    per: 20,
    str: 26,
    con: 24,
    dex: 24,
    int: 20,
    family: FAMILIES.XUEDAO,
    family_level: 4,
    level: 1,
    max_mp: 120000,
    max_hp: 150000,
    prop: {
        gj: 1400,
        mz: 1200,
        ds: 1200
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/dao", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["blade", 100],
    ["unarmed", 100],
    ["literate", 100],
    ["xuedaoxinfa", 100, "force"],
    ["xuejiedao", 100, ["blade", "parry"]],
    ["xuelingqinna", 80, "unarmed"],
    ["xuedunbu", 100, "dodge"]);
this.on_master = function () {
    return true;
}
