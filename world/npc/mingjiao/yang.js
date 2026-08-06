this.inherits(NPC);
this.set({
    name: "杨逍",
    desc: "他一袭白袍，神情潇洒从容，双目开阖之间似已看透来人的劲力流转。",
    title: "明教光明左使",
    gender: 1,
    age: 46,
    per: 36,
    str: 31,
    con: 33,
    dex: 35,
    int: 36,
    family: FAMILIES.MINGJIAO,
    family_level: 2,
    level: 4,
    max_mp: 760000,
    max_hp: 820000,
    prop: {
        gj: 6500,
        mz: 7000,
        ds: 7100
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 700],
    ["parry", 700],
    ["force", 700],
    ["unarmed", 650],
    ["sword", 700],
    ["literate", 700],
    ["mingjiaoxinfa", 700, "force"],
    ["qingfushenfa", 600, "dodge"],
    ["yingzhuagong", 500, "unarmed"],
    ["liehuojian", 700, "sword"],
    ["qishangquan", 550, "unarmed"],
    ["jiuyangshengong", 600, "force"],
    ["qiankundanuoyi", 650, ["dodge", "parry"]],
    ["shenghuoling", 500, "sword"]);
this.on_master = function (me) {
    if (me.query_skill("mingjiaoxinfa", 0) < 300) return me.notify_fail("杨逍说道：心法未成，强练乾坤挪移只会走火入魔。");
    if (me.query_skill("liehuojian", 0) < 250) return me.notify_fail("杨逍说道：你的运劲变化还嫌直拙，再把烈火剑法练熟。");
    return true;
};
