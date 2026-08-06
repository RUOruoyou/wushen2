this.inherits(NPC);
this.set({
    name: "马钰",
    desc: "他就是王重阳的大弟子，全真七子之首，丹阳子马真人。他慈眉善目，正微笑着看着你。",
    title: "全真七子之首 丹阳子",
    gender: 1,
    age: 42,
    per: 31,
    str: 28,
    con: 31,
    dex: 30,
    int: 32,
    family: FAMILIES.QUANZHEN,
    family_level: 2,
    level: 2,
    max_mp: 560000,
    max_hp: 620000,
    prop: {
        gj: 4300,
        mz: 4300,
        ds: 4300
    }
});
this.set_objects(["eq/lv1/qz_cloth", 1, 1], ["eq/lv1/qz_jian", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["unarmed", 500],
    ["sword", 500],
    ["literate", 500],
    ["quanzhenxinfa", 500, "force"],
    ["quanzhenjian", 500, ["sword", "parry"]],
    ["qixingjian", 500, ["sword", "parry"]],
    ["beidouzhen", 500, "parry"],
    ["jinyangong", 500, "dodge"],
    ["haotianzhang", 500, "unarmed"],
    ["zhongnanzhi", 500, "unarmed"],
    ["xiantiangong", 500, "force"]);
this.on_master = function (me) {
    if (me.query_skill("quanzhenxinfa", 0) < 100) return me.notify_fail("马钰说道：你的全真心法火候不足，难以领略更高深的武功。");
    if (me.query_skill("jinyangong", 0) < 100) return me.notify_fail("马钰说道：金雁功是本教根基之一，你还需多练。");
    return true;
}
