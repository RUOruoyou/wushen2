this.inherits(NPC);
this.set({
    name: "曲洋",
    desc: "他气度清雅，与黑木崖的肃杀气氛颇不相同，指间似仍残留抚琴后的余韵。",
    title: "日月神教长老",
    gender: 1,
    age: 55,
    per: 34,
    str: 27,
    con: 30,
    dex: 32,
    int: 36,
    family: FAMILIES.RIYUE,
    family_level: 3,
    level: 3,
    max_mp: 450000,
    max_hp: 470000,
    prop: {
        gj: 4100,
        mz: 4700,
        ds: 5000
    }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/whip", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 500],
    ["sword", 450],
    ["whip", 500],
    ["literate", 500],
    ["riyuexinfa", 500, "force"],
    ["piaomiaoshenfa", 500, "dodge"],
    ["riyuejian", 450, "sword"],
    ["liushuibian", 500, ["whip", "parry"]]);
this.on_master = function (me) {
    if (me.query_skill("riyuexinfa", 0) < 100) return me.notify_fail("曲洋说道：心中气息未定，招式便难有从容之意。");
    if (me.query_skill("piaomiaoshenfa", 0) < 100) return me.notify_fail("曲洋说道：身法节奏尚乱，再多体会行止缓急。");
    return true;
};
