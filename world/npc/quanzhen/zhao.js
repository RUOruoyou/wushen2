this.inherits(NPC);
this.set({
    name: "赵志敬",
    desc: "他是全真教第三代弟子中的好手，相貌端正，眉宇间却藏着几分锐气。",
    title: "全真教第三代弟子",
    gender: 1,
    age: 26,
    per: 25,
    str: 25,
    con: 26,
    dex: 25,
    int: 26,
    family: FAMILIES.QUANZHEN,
    family_level: 3,
    level: 1,
    max_mp: 240000,
    max_hp: 280000,
    prop: {
        gj: 1800,
        mz: 1800,
        ds: 1800
    }
});
this.set_objects(["eq/lv1/qz_cloth", 1, 1], ["eq/lv1/qz_jian", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["sword", 100],
    ["literate", 100],
    ["quanzhenxinfa", 100, "force"],
    ["quanzhenjian", 100, ["sword", "parry"]],
    ["beidouzhen", 100, "parry"],
    ["jinyangong", 100, "dodge"],
    ["zhongnanzhi", 100, "unarmed"]);
this.on_master = function () {
    return true;
}
