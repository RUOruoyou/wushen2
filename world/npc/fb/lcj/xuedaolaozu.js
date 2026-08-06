this.inherits(NPC);
this.set({
    name: "血刀老祖",
    desc: "他披着破旧僧袍，手中血刀狭长弯曲，笑声阴狠刺耳。",
    title: "雪山血刀",
    gender: 1,
    age: 70,
    per: 14,
    mp: 8200,
    max_mp: 13500,
    hp: 34000,
    max_hp: 34000,
    pfm_rate: 1,
    score: 42,
    prop: { gj: 980, mz: 790, ds: 700, fy: 760 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv3/xuedao", 1, 1]);
this.skill_map(
    ["dodge", 720],
    ["parry", 760],
    ["force", 760],
    ["blade", 800],
    ["xuedaodaofa", 800, "blade"],
    ["xuedaojing", 760, "parry"],
    ["xuehaimogong", 760, "force"],
    ["xuedunbu", 720, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 15,
    max: 35
}, {
    obj: "eq/lv3/xuedao",
    odds: 900
}, {
    obj: "st/xuanjing",
    min: 1,
    max: 3,
    odds: 3000
});
