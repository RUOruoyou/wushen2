this.inherits(NPC);
this.set({
    name: "周伯通",
    desc: "他须眉皆白，看上去一副得道模样，眼神却透着一股狡黠，正是老顽童周伯通。",
    title: "全真教第一代弟子 老顽童",
    gender: 1,
    age: 62,
    per: 30,
    str: 31,
    con: 32,
    dex: 29,
    int: 36,
    family: FAMILIES.QUANZHEN,
    family_level: 1,
    level: 4,
    max_mp: 860000,
    max_hp: 940000,
    prop: {
        gj: 7200,
        mz: 7200,
        ds: 7200
    }
});
this.set_objects(["eq/lv1/qz_cloth", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["quanzhenxinfa", 800],
    ["quanzhenjian", 800, "sword"],
    ["qixingjian", 800, ["sword", "parry"]],
    ["beidouzhen", 800, "parry"],
    ["jinyangong", 800, "dodge"],
    ["haotianzhang", 800, "unarmed"],
    ["zhongnanzhi", 800, "unarmed"],
    ["xiantiangong", 800, "force"],
    ["kongmingquan", 800, ["unarmed", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("xiantiangong", 0) < 500) return me.notify_fail("周伯通笑道：你的先天功还不到火候，陪我玩也学不了真本事。");
    if (me.query_skill("unarmed", 0) < 500) return me.notify_fail("周伯通笑道：你的拳脚基本功还不够，空明两个字还早得很。");
    return true;
}
