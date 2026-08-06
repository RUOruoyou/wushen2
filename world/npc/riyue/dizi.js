this.inherits(NPC);
this.set({
    name: "神教弟子",
    desc: "他身穿黑衣，腰悬日月令牌，正守在黑木崖山门前盘查来客。",
    title: "日月神教弟子",
    gender: 1,
    age: 24,
    per: 23,
    str: 25,
    con: 24,
    dex: 26,
    int: 24,
    family: FAMILIES.RIYUE,
    family_level: 4,
    level: 1,
    max_mp: 130000,
    max_hp: 155000,
    prop: {
        gj: 1400,
        mz: 1450,
        ds: 1500
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
    ["riyuexinfa", 120, "force"],
    ["piaomiaoshenfa", 120, "dodge"],
    ["riyuejian", 120, ["sword", "parry"]]);
this.on_master = function () {
    return true;
};
