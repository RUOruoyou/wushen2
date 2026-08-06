this.inherits(NPC);
this.set({
    name: "任盈盈",
    desc: "她容貌清丽，神情沉静，虽少言寡语，举止间却自有令教众敬畏的气度。",
    title: "日月神教圣姑",
    gender: 2,
    age: 22,
    per: 40,
    str: 26,
    con: 30,
    dex: 35,
    int: 35,
    family: FAMILIES.RIYUE,
    family_level: 3,
    level: 3,
    max_mp: 490000,
    max_hp: 520000,
    prop: {
        gj: 4500,
        mz: 5300,
        ds: 5600
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/whip", 1, 1]);
this.skill_map(
    ["dodge", 520],
    ["parry", 520],
    ["force", 520],
    ["unarmed", 500],
    ["sword", 450],
    ["whip", 520],
    ["literate", 520],
    ["riyuexinfa", 520, "force"],
    ["piaomiaoshenfa", 520, "dodge"],
    ["riyuejian", 450, "sword"],
    ["liushuibian", 520, ["whip", "parry"]],
    ["huanmolongtianwu", 500, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("riyuexinfa", 0) < 150) return me.notify_fail("任盈盈说道：你对本教心法领悟尚浅，不宜急进。");
    if (me.query_skill("piaomiaoshenfa", 0) < 120) return me.notify_fail("任盈盈说道：飘渺身法未熟，许多变化便施展不开。");
    return true;
};
