this.inherits(NPC);
this.set({
    name: "泰山守关长老",
    desc: "泰山长老守在云雾深处，掌力沉稳如山。",
    title: "泰山二关",
    gender: 1,
    age: 56,
    mp: 4200,
    max_mp: 7600,
    hp: 18000,
    max_hp: 18000,
    score: 30,
    prop: { gj: 650, mz: 560, ds: 520, fy: 600 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/tiezhang", 1, 1]);
this.skill_map(["dodge", 520], ["parry", 540], ["force", 500], ["unarmed", 560]);
this.set_drop({ obj: "money/silver", min: 10, max: 22 }, {
    obj: ["book/bc#taishanquanfa", "book/bc#panshishengong", "eq/lv3/panshi_hufu"], odds: 1400
});
