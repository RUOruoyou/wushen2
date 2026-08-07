this.inherits(NPC);
this.set({
    name: "瑛姑方向巨鳄",
    desc: "这只巨鳄潜伏在瑛姑方向的泥水里，是不能漏掉的关键猎物。",
    title: "关键巨鳄",
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
this.set_drop({ obj: "res/eyupi", min: 1, max: 2, odds: 7000 });
