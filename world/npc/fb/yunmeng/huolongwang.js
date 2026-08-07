this.inherits(NPC);
this.set({
    name: "火龙王",
    desc: "洪荒古泽深处的火龙王，盘踞在岩浆与毒雾之间。此处不要求击杀它。",
    title: "洪荒火龙王",
    gender: 1,
    age: 200,
    mp: 6000,
    max_mp: 12000,
    hp: 50000,
    max_hp: 50000,
    score: 0,
    prop: { gj: 1600, mz: 1100, ds: 800, fy: 1200 },
    no_refresh: true
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(["dodge", 800], ["parry", 850], ["force", 800], ["bite", 1000], ["unarmed", 1000], ["dushegongji", 1000, "bite"]);
