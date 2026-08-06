this.inherits(NPC);
this.set({
    name: "明教弟子",
    desc: "他身穿白袍，胸前绣着一簇火焰，正在山门前迎送新入教的弟子。",
    title: "明教弟子",
    gender: 1,
    age: 24,
    per: 24,
    str: 25,
    con: 25,
    dex: 25,
    int: 24,
    family: FAMILIES.MINGJIAO,
    family_level: 4,
    level: 1,
    max_mp: 130000,
    max_hp: 160000,
    prop: {
        gj: 1400,
        mz: 1400,
        ds: 1400
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 120],
    ["parry", 120],
    ["force", 120],
    ["unarmed", 120],
    ["sword", 120],
    ["literate", 120],
    ["mingjiaoxinfa", 120, "force"],
    ["qingfushenfa", 120, "dodge"],
    ["yingzhuagong", 120, "unarmed"],
    ["liehuojian", 120, ["sword", "parry"]]);
this.on_master = function () {
    return true;
};
