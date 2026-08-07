this.inherits(NPC);
this.set({
    name: "嵩山第三太保",
    desc: "太保身形魁梧，剑招沉重。",
    title: "嵩山太保",
    gender: 1,
    age: 48,
    mp: 5000,
    max_mp: 8800,
    hp: 20000,
    max_hp: 20000,
    score: 5,
    prop: { gj: 780, mz: 680, ds: 600, fy: 700 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 590], ["parry", 660], ["force", 560], ["sword", 740]);
this.set_drop({ obj: "money/silver", min: 10, max: 20 }, { obj: "eq/lv3/mengzhupifeng", odds: 700 });
