this.inherits(NPC);
this.set({
    name: "东方不败",
    desc: "其人红衣如火，神情淡漠，指间一枚细针若隐若现。明明静坐不动，却令人感觉残影遍布大殿。",
    title: "日月神教教主",
    gender: 2,
    age: 36,
    per: 42,
    str: 29,
    con: 32,
    dex: 42,
    int: 37,
    family: FAMILIES.RIYUE,
    family_level: 1,
    level: 5,
    max_mp: 1200000,
    max_hp: 1210000,
    prop: {
        gj: 9200,
        mz: 10400,
        ds: 10800
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 750],
    ["sword", 800],
    ["literate", 800],
    ["riyuexinfa", 800],
    ["piaomiaoshenfa", 800, "dodge"],
    ["riyuejian", 800, "sword"],
    ["huanmolongtianwu", 700, "unarmed"],
    ["riyueguanghua", 800, "force"],
    ["pixiejian", 800, ["sword", "dodge", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("riyueguanghua", 0) < 500) return me.notify_fail("东方不败淡淡说道：日月光华未至极处，如何追得上辟邪剑影？");
    if (me.query_skill("piaomiaoshenfa", 0) < 500) return me.notify_fail("东方不败说道：身法尚有烟火气，再练。");
    if (me.query_skill("riyuejian", 0) < 300) return me.notify_fail("东方不败说道：剑理未明，速度再快也只是乱舞。");
    return true;
};
