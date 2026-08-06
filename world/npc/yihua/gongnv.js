this.inherits(NPC);
this.set({
    name: "移花宫女",
    desc: "她是移花宫中负责迎送弟子的宫女，眉目清秀，举止冷静。",
    title: "移花宫外门弟子",
    gender: 2,
    age: 18,
    per: 30,
    str: 22,
    con: 24,
    dex: 28,
    int: 24,
    family: FAMILIES.YIHUA,
    family_level: 4,
    level: 1,
    max_mp: 120000,
    max_hp: 140000,
    prop: {
        gj: 1200,
        mz: 1400,
        ds: 1500
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100],
    ["literate", 100],
    ["yihuaxinfa", 100, "force"],
    ["huayuebu", 100, "dodge"],
    ["lianhuazhang", 100, "unarmed"]);
this.on_master = function () {
    return true;
}
