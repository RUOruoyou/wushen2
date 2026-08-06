this.inherits(NPC);
this.set({
    name: "刘处玄",
    desc: "他就是全真七子之一的长生子刘处玄，身材瘦小，但顾盼间自有威严。",
    title: "全真七子之三 长生子",
    gender: 1,
    age: 38,
    per: 27,
    str: 30,
    con: 28,
    dex: 30,
    int: 30,
    family: FAMILIES.QUANZHEN,
    family_level: 2,
    level: 2,
    max_mp: 470000,
    max_hp: 520000,
    prop: {
        gj: 3600,
        mz: 3600,
        ds: 3600
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
    ["zhongnanzhi", 500, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("quanzhenxinfa", 0) < 100) return me.notify_fail("刘处玄说道：你的全真心法火候不足，难以领略更高深的武功。");
    if (me.query_skill("quanzhenjian", 0) < 100) return me.notify_fail("刘处玄说道：你的全真剑法还需多加练习。");
    return true;
}
