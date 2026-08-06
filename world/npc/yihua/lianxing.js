this.inherits(NPC);
this.set({
    name: "怜星",
    desc: "她是移花宫二宫主，容貌清丽，神情温婉，举手投足间却藏着深不可测的武功。",
    title: "移花宫二宫主",
    gender: 2,
    age: 35,
    per: 40,
    str: 28,
    con: 31,
    dex: 35,
    int: 33,
    family: FAMILIES.YIHUA,
    family_level: 2,
    level: 4,
    max_mp: 760000,
    max_hp: 880000,
    prop: {
        gj: 5600,
        mz: 6500,
        ds: 6900
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 600],
    ["parry", 600],
    ["force", 600],
    ["unarmed", 600],
    ["sword", 600],
    ["throwing", 600],
    ["literate", 600],
    ["yihuaxinfa", 600],
    ["huayuebu", 600, "dodge"],
    ["lianhuazhang", 600, ["unarmed", "parry"]],
    ["suiyuzhi", 600, ["unarmed", "parry"]],
    ["feihuazhaiye", 600, ["sword", "parry"]],
    ["mingyugong", 600, "force"],
    ["yihuajieyu", 600, ["parry", "dodge"]]);
this.on_master = function (me) {
    if (me.query_skill("mingyugong", 0) < 300) return me.notify_fail("怜星说道：明玉神功未成，移花宫上乘武学便难以融会贯通。");
    if (me.query_skill("huayuebu", 0) < 300) return me.notify_fail("怜星说道：你的移风换影仍显滞涩，先把身法练到轻灵圆转。");
    return true;
}
