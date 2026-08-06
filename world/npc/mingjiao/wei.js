this.inherits(NPC);
this.set({
    name: "韦一笑",
    desc: "他面色青白，身形瘦削，静立时也似一道随时会消失的青影。",
    title: "明教青翼蝠王",
    gender: 1,
    age: 47,
    per: 25,
    str: 28,
    con: 29,
    dex: 36,
    int: 29,
    family: FAMILIES.MINGJIAO,
    family_level: 3,
    level: 3,
    max_mp: 440000,
    max_hp: 480000,
    prop: {
        gj: 4300,
        mz: 5100,
        ds: 6000
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["unarmed", 500],
    ["literate", 500],
    ["mingjiaoxinfa", 500, "force"],
    ["qingfushenfa", 500, "dodge"],
    ["yingzhuagong", 300, "parry"],
    ["hanbingmianzhang", 500, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("qingfushenfa", 0) < 100) return me.notify_fail("韦一笑说道：青蝠身法尚未入门，先把脚下功夫练稳。");
    if (me.query_skill("mingjiaoxinfa", 0) < 100) return me.notify_fail("韦一笑说道：心法根基不稳，寒冰掌力反会伤了自己。");
    return true;
};
