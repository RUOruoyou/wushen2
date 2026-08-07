this.inherits(NPC);
this.set({
    name: "嵩山第四太保",
    desc: "第四太保守在队列末尾，擅长以多路剑势围攻。",
    title: "嵩山太保",
    gender: 1,
    age: 52,
    mp: 5600,
    max_mp: 9600,
    hp: 22000,
    max_hp: 22000,
    score: 2,
    prop: { gj: 820, mz: 700, ds: 620, fy: 740 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 610], ["parry", 680], ["force", 600], ["sword", 780]);
this.set_drop({ obj: "money/silver", min: 12, max: 24 }, { obj: "book/bc#hanbingzhenqi", odds: 1000 });
