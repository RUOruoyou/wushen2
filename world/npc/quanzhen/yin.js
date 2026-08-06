this.inherits(NPC);
this.set({
    name: "尹志平",
    desc: "他粗眉大眼，神色沉静，是丘处机门下得意弟子，在全真教第三代中颇有名望。",
    title: "全真教第三代弟子 清和真人",
    gender: 1,
    age: 24,
    per: 28,
    str: 28,
    con: 25,
    dex: 25,
    int: 25,
    family: FAMILIES.QUANZHEN,
    family_level: 3,
    level: 1,
    max_mp: 300000,
    max_hp: 330000,
    prop: {
        gj: 2200,
        mz: 2200,
        ds: 2200
    }
});
this.set_objects(["eq/lv1/qz_cloth", 1, 1], ["eq/lv1/qz_jian", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 300],
    ["quanzhenxinfa", 300, "force"],
    ["quanzhenjian", 300, ["sword", "parry"]],
    ["qixingjian", 300, ["sword", "parry"]],
    ["beidouzhen", 300, "parry"],
    ["jinyangong", 300, "dodge"],
    ["haotianzhang", 300, "unarmed"],
    ["zhongnanzhi", 300, "unarmed"]);
this.on_master = function (me) {
    if (me.query_skill("quanzhenxinfa", 0) < 60) return me.notify_fail("尹志平说道：你的全真心法掌握程度还不够，需要多加练习。");
    return true;
}
