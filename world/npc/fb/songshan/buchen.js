this.inherits(NPC);
this.set({
    name: "卜沉",
    desc: "卜沉是嵩山第四波太保之一，身形如铁塔，掌力阴沉。",
    title: "嵩山太保",
    gender: 1,
    age: 50,
    mp: 5600,
    max_mp: 9600,
    hp: 22000,
    max_hp: 22000,
    score: 4,
    prop: { gj: 820, mz: 700, ds: 620, fy: 740 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/tiezhang", 1, 1]);
this.skill_map(["dodge", 610], ["parry", 680], ["force", 600], ["unarmed", 780]);
this.set_drop({ obj: "money/silver", min: 12, max: 24 }, { obj: "book/bc#dasongyangshenzhang", odds: 1000 });
