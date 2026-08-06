this.inherits(NPC);
this.set({
    name: "丘处机",
    desc: "他就是江湖上人称长春子的丘处机丘真人，方面大耳，剑眉如刀，平生疾恶如仇。",
    title: "全真七子之四 长春子",
    gender: 1,
    age: 36,
    per: 29,
    str: 32,
    con: 30,
    dex: 30,
    int: 30,
    family: FAMILIES.QUANZHEN,
    family_level: 2,
    level: 3,
    max_mp: 680000,
    max_hp: 760000,
    prop: {
        gj: 5600,
        mz: 5600,
        ds: 5600
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
    if (me.query_skill("quanzhenxinfa", 0) < 100) return me.notify_fail("丘处机说道：你的全真心法火候不足，难以领略更高深的武功。");
    if (me.query_skill("quanzhenjian", 0) < 100) return me.notify_fail("丘处机说道：你的全真剑法还需多加磨练。");
    return true;
}
