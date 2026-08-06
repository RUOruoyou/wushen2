this.inherits(NPC);
this.set({
    name: "花无缺",
    desc: "他风度翩翩，温润如玉，却又自有一身清冷气度，是移花宫中极出色的年轻高手。",
    title: "移花宫内门弟子",
    gender: 1,
    age: 22,
    per: 38,
    str: 25,
    con: 27,
    dex: 31,
    int: 28,
    family: FAMILIES.YIHUA,
    family_level: 3,
    level: 2,
    max_mp: 360000,
    max_hp: 420000,
    prop: {
        gj: 2600,
        mz: 3000,
        ds: 3200
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["throwing", 300],
    ["literate", 300],
    ["yihuaxinfa", 300],
    ["huayuebu", 300, "dodge"],
    ["lianhuazhang", 300, ["unarmed", "parry"]],
    ["suiyuzhi", 300, ["unarmed", "parry"]],
    ["feihuazhaiye", 300, ["sword", "parry"]],
    ["mingyugong", 300, "force"],
    ["yihuajieyu", 300, ["parry", "dodge"]]);
this.on_master = function (me) {
    if (me.query_skill("yihuaxinfa", 0) < 100) return me.notify_fail("花无缺说道：你的移花心法火候还浅，还需静心修习。");
    if (me.query_skill("lianhuazhang", 0) < 100) return me.notify_fail("花无缺说道：你的绝情掌尚未入门，先把掌法练稳。");
    return true;
}
