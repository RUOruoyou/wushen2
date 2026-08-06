this.inherits(NPC);
this.set({
    name: "殷天正",
    desc: "他白眉垂目，身形高大，十指骨节突出，举手投足自有鹰扬之势。",
    title: "明教白眉鹰王",
    gender: 1,
    age: 63,
    per: 28,
    str: 35,
    con: 33,
    dex: 31,
    int: 29,
    family: FAMILIES.MINGJIAO,
    family_level: 3,
    level: 3,
    max_mp: 470000,
    max_hp: 560000,
    prop: {
        gj: 5200,
        mz: 5200,
        ds: 4500
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
    ["qingfushenfa", 350, "dodge"],
    ["yingzhuagong", 500, ["unarmed", "parry"]],
    ["qishangquan", 350, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("yingzhuagong", 0) < 100) return me.notify_fail("殷天正说道：鹰爪功的擒拿变化尚未纯熟，再练一练。");
    if (me.query_skill("mingjiaoxinfa", 0) < 100) return me.notify_fail("殷天正说道：内功根基不足，爪力难以收发由心。");
    return true;
};
