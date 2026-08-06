this.inherits(NPC);
this.set({
    name: "毒蛇",
    desc: "一条碧绿毒蛇，蛇信吞吐，动作极快。",
    gender: 0,
    age: 6,
    per: 12,
    mp: 500,
    max_mp: 2200,
    hp: 7200,
    max_hp: 7200,
    score: 6,
    prop: { gj: 240, mz: 360, ds: 360 }
});
this.skill_map(
    ["dodge", 340],
    ["parry", 280],
    ["force", 260],
    ["bite", 340],
    ["dushegongji", 340, "bite"]);
this.set_drop({
    obj: "res/shexue",
    min: 1,
    max: 2
}, {
    obj: "drug/dushe",
    odds: 1500
});
