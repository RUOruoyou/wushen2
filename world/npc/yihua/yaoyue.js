this.inherits(NPC);
this.set({
    name: "邀月",
    desc: "她是移花宫大宫主，神情冷若寒玉，目光中自有迫人锋芒。她静坐殿中，已令人不敢直视。",
    title: "移花宫大宫主",
    gender: 2,
    age: 38,
    per: 42,
    str: 31,
    con: 34,
    dex: 38,
    int: 36,
    family: FAMILIES.YIHUA,
    family_level: 1,
    level: 5,
    max_mp: 1120000,
    max_hp: 1240000,
    prop: {
        gj: 9000,
        mz: 9800,
        ds: 10200
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["throwing", 800],
    ["literate", 800],
    ["yihuaxinfa", 800],
    ["huayuebu", 800, "dodge"],
    ["lianhuazhang", 800, ["unarmed", "parry"]],
    ["suiyuzhi", 800, ["unarmed", "parry"]],
    ["feihuazhaiye", 800, ["sword", "parry"]],
    ["mingyugong", 800, "force"],
    ["yihuajieyu", 800, ["parry", "dodge"]]);
this.on_master = function (me) {
    if (me.query_skill("mingyugong", 0) < 500) return me.notify_fail("邀月说道：明玉神功不到火候，也配入我门下？");
    if (me.query_skill("yihuajieyu", 0) < 500) return me.notify_fail("邀月说道：移花接木未臻化境，仍需再练。");
    return true;
}
