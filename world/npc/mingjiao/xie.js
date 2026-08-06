this.inherits(NPC);
this.set({
    name: "谢逊",
    desc: "他满头金发，双目虽不能视物，周身气势却如怒狮盘踞，令人不敢逼近。",
    title: "明教金毛狮王",
    gender: 1,
    age: 52,
    per: 25,
    str: 36,
    con: 35,
    dex: 29,
    int: 31,
    family: FAMILIES.MINGJIAO,
    family_level: 2,
    level: 4,
    max_mp: 690000,
    max_hp: 790000,
    prop: {
        gj: 6500,
        mz: 5900,
        ds: 5200
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 650],
    ["parry", 650],
    ["force", 650],
    ["unarmed", 650],
    ["literate", 650],
    ["mingjiaoxinfa", 650, "force"],
    ["qingfushenfa", 450, "dodge"],
    ["yingzhuagong", 450, "parry"],
    ["qishangquan", 650, "unarmed"],
    ["jiuyangshengong", 500, "force"]);
this.on_master = function (me) {
    if (me.query_skill("mingjiaoxinfa", 0) < 300) return me.notify_fail("谢逊说道：你的圣火心法还承受不住七伤拳劲。");
    if (me.query_skill("yingzhuagong", 0) < 200) return me.notify_fail("谢逊说道：拳脚筋骨尚未练开，七股劲力无处着落。");
    return true;
};
