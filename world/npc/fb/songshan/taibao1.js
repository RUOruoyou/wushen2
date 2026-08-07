this.inherits(NPC);
this.set({
    name: "嵩山第一太保",
    desc: "太保手持长剑，剑势凌厉。",
    title: "嵩山太保",
    gender: 1,
    age: 42,
    mp: 4500,
    max_mp: 8000,
    hp: 18000,
    max_hp: 18000,
    score: 5,
    prop: { gj: 740, mz: 620, ds: 560, fy: 650 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 550], ["parry", 620], ["force", 520], ["sword", 700]);
this.set_drop({ obj: "money/silver", min: 10, max: 20 }, { obj: "book/bc#songshanjianfa", odds: 800 });
