this.inherits(NPC);
this.set({
    name: "上官云",
    desc: "他身材魁梧，神情精悍，腰间兵刃与拳脚功夫皆有深厚火候。",
    title: "日月神教白虎堂长老",
    gender: 1,
    age: 46,
    per: 25,
    str: 34,
    con: 31,
    dex: 29,
    int: 27,
    family: FAMILIES.RIYUE,
    family_level: 3,
    level: 3,
    max_mp: 410000,
    max_hp: 500000,
    prop: {
        gj: 4800,
        mz: 4400,
        ds: 4200
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["unarmed", 500],
    ["sword", 500],
    ["whip", 400],
    ["literate", 450],
    ["riyuexinfa", 500, "force"],
    ["piaomiaoshenfa", 420, "dodge"],
    ["riyuejian", 500, ["sword", "parry"]],
    ["liushuibian", 400, "whip"],
    ["huanmolongtianwu", 420, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("riyuexinfa", 0) < 100) return me.notify_fail("上官云说道：日月心法根基不足，学什么都是花架子。");
    if (me.query_skill("riyuejian", 0) < 100) return me.notify_fail("上官云说道：剑法尚未入门，先把基本招式练熟。");
    return true;
};
