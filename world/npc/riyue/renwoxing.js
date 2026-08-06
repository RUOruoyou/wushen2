this.inherits(NPC);
this.set({
    name: "任我行",
    desc: "他须发虬张，双目精光逼人，纵处囚室仍有睥睨天下之势，周身气机如深渊旋涡。",
    title: "日月神教前教主",
    gender: 1,
    age: 61,
    per: 30,
    str: 36,
    con: 36,
    dex: 34,
    int: 35,
    family: FAMILIES.RIYUE,
    family_level: 1,
    level: 5,
    max_mp: 1180000,
    max_hp: 1280000,
    prop: {
        gj: 9000,
        mz: 9100,
        ds: 8500
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["riyuexinfa", 800],
    ["piaomiaoshenfa", 800, "dodge"],
    ["riyuejian", 800, "sword"],
    ["huanmolongtianwu", 800, "unarmed"],
    ["tianmojian", 800, ["sword", "parry"]],
    ["xixingdafa", 800, "force"]);
this.on_master = function (me) {
    if (me.query_skill("tianmojian", 0) < 500) return me.notify_fail("任我行说道：天魔剑法尚未练出魔意，也配承受吸星真气？");
    if (me.query_skill("riyuexinfa", 0) < 500) return me.notify_fail("任我行说道：日月心法根基不够，吸来的真气只会撑裂经脉。");
    if (me.query_skill("huanmolongtianwu", 0) < 300) return me.notify_fail("任我行说道：你的经脉运转仍不够灵活，再去修炼幻魔龙天舞。");
    return true;
};
