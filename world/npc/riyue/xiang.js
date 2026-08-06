this.inherits(NPC);
this.set({
    name: "向问天",
    desc: "他长须飘动，神情豪迈，手按剑柄立于堂前，周身自有一股不羁狂气。",
    title: "日月神教光明右使",
    gender: 1,
    age: 48,
    per: 32,
    str: 33,
    con: 33,
    dex: 34,
    int: 32,
    family: FAMILIES.RIYUE,
    family_level: 2,
    level: 4,
    max_mp: 720000,
    max_hp: 810000,
    prop: {
        gj: 6400,
        mz: 6800,
        ds: 6600
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 700],
    ["parry", 700],
    ["force", 700],
    ["unarmed", 700],
    ["sword", 700],
    ["whip", 650],
    ["literate", 650],
    ["riyuexinfa", 700, "force"],
    ["piaomiaoshenfa", 650, "dodge"],
    ["riyuejian", 700, "sword"],
    ["liushuibian", 650, "whip"],
    ["huanmolongtianwu", 700, "unarmed"],
    ["tianmojian", 650, ["sword", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("riyuejian", 0) < 300) return me.notify_fail("向问天说道：日月剑法尚未练出明暗变化，谈不上天魔剑意。");
    if (me.query_skill("huanmolongtianwu", 0) < 220) return me.notify_fail("向问天说道：幻魔身手未成，天魔剑法便少了三分诡意。");
    return true;
};
