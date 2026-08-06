this.inherits(NPC);
this.set({
    name: "张无忌",
    desc: "他神色温和沉静，气息浑厚绵长，周身九阳真气若有若无，已臻返璞归真之境。",
    title: "明教教主",
    gender: 1,
    age: 25,
    per: 38,
    str: 34,
    con: 38,
    dex: 37,
    int: 36,
    family: FAMILIES.MINGJIAO,
    family_level: 1,
    level: 5,
    max_mp: 1220000,
    max_hp: 1320000,
    prop: {
        gj: 9100,
        mz: 9600,
        ds: 9600
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
    ["mingjiaoxinfa", 800],
    ["qingfushenfa", 800, "dodge"],
    ["yingzhuagong", 800, "unarmed"],
    ["liehuojian", 800, "sword"],
    ["hanbingmianzhang", 800, "unarmed"],
    ["qishangquan", 800, "unarmed"],
    ["jiuyangshengong", 800, "force"],
    ["qiankundanuoyi", 800, "dodge"],
    ["shenghuoling", 800, ["sword", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("jiuyangshengong", 0) < 500) return me.notify_fail("张无忌说道：九阳神功尚未融会贯通，乾坤与圣火令便无从驾驭。");
    if (me.query_skill("qiankundanuoyi", 0) < 400) return me.notify_fail("张无忌说道：乾坤大挪移仍有滞涩，还需体会运劲之妙。");
    if (me.query_skill("qishangquan", 0) < 300) return me.notify_fail("张无忌说道：七伤拳刚柔七劲尚未分明，再磨炼一番。");
    return true;
};
