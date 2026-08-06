this.inherits(NPC);
this.set({
    name: "王重阳",
    desc: "他就是全真教开山祖师、首代掌教王重阳王真人。白须飘飘，宽袍缓袖，眉目清癯，颇有仙风道骨。",
    title: "全真教首代掌教",
    gender: 1,
    age: 66,
    per: 35,
    str: 32,
    con: 33,
    dex: 31,
    int: 35,
    family: FAMILIES.QUANZHEN,
    family_level: 1,
    level: 5,
    max_mp: 1100000,
    max_hp: 1260000,
    prop: {
        gj: 9000,
        mz: 9000,
        ds: 9000
    }
});
this.set_objects(["eq/lv1/qz_cloth", 1, 1], ["eq/lv1/qz_jian", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["quanzhenxinfa", 800],
    ["quanzhenjian", 800, ["sword", "parry"]],
    ["qixingjian", 800, ["sword", "parry"]],
    ["beidouzhen", 800, "parry"],
    ["jinyangong", 800, "dodge"],
    ["haotianzhang", 800, "unarmed"],
    ["zhongnanzhi", 800, "unarmed"],
    ["xiantiangong", 800, "force"],
    ["chongyangshenzhang", 800, ["unarmed", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("xiantiangong", 0) < 500) return me.notify_fail("王重阳说道：你的先天功火候不足，只怕难以领略更高深的武功。");
    if (me.query_skill("quanzhenjian", 0) < 500) return me.notify_fail("王重阳说道：你的全真剑法还需再磨练。");
    if (me.query_skill("zhongnanzhi", 0) < 300) return me.notify_fail("王重阳说道：终南指火候未到，重阳神掌中的虚实变化还难体会。");
    return true;
}
