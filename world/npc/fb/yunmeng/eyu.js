this.inherits(NPC);
this.set({
    name: "巨鳄",
    desc: "云梦沼泽中的巨鳄，鳞甲坚硬，张口便有腥风扑面。",
    title: "沼泽猛兽",
    gender: 1,
    age: 10,
    mp: 1200,
    max_mp: 2200,
    hp: 12000,
    max_hp: 12000,
    score: 10,
    prop: { gj: 650, mz: 520, ds: 420, fy: 520 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(["dodge", 400], ["parry", 400], ["force", 300], ["bite", 500], ["unarmed", 500], ["dushegongji", 500, "bite"]);
this.set_drop({ obj: "res/eyupi", min: 1, max: 2, odds: 7000 }, { obj: "money/silver", min: 3, max: 8 });
