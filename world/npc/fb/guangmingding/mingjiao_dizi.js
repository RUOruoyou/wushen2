this.inherits(NPC);
this.set({
    name: "明教守众",
    title: "<hic>明教</hic>",
    desc: "这名明教守众正围攻六大门派援军。",
    gender: 1,
    age: 30,
    hp: 55000,
    max_hp: 55000,
    mp: 10000,
    max_mp: 10000,
    score: 0,
    prop: { gj: 2300, mz: 2100, ds: 1500, fy: 1700 },
    no_refresh: true,
    is_drop: false
});
this.skill_map(["dodge", 1300], ["parry", 1300], ["force", 1300], ["unarmed", 1300]);
