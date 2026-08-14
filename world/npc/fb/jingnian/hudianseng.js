this.inherits(NPC);
this.set({
    name: "护殿僧",
    desc: "护殿僧在邪王路线中主动围攻闯入主殿的人。",
    title: "净念禅宗护殿僧",
    gender: 1,
    age: 42,
    hp: 150000,
    max_hp: 150000,
    mp: 26000,
    max_mp: 26000,
    score: 0,
    prop: { gj: 4700, mz: 3900, ds: 3000, fy: 3700 },
    no_refresh: true
});
this.skill_map(["dodge", 2700], ["parry", 2700], ["force", 2700], ["unarmed", 2700]);
