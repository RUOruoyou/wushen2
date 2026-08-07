this.inherits(NPC);
this.set({
    name: "嵩山第二太保",
    desc: "太保双手持剑，守势严密。",
    title: "嵩山太保",
    gender: 1,
    age: 45,
    mp: 4800,
    max_mp: 8400,
    hp: 19000,
    max_hp: 19000,
    score: 5,
    prop: { gj: 760, mz: 650, ds: 580, fy: 670 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 570], ["parry", 640], ["force", 540], ["sword", 720]);
this.set_drop({ obj: "money/silver", min: 10, max: 20 }, { obj: "book/bc#dasongyangshenzhang", odds: 800 });
