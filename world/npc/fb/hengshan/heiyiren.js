this.inherits(NPC);
this.set({
    name: "黑衣人",
    desc: "一名蒙面黑衣人，动作干脆狠辣，显然是冲着藏经阁而来。",
    title: "潜入者",
    gender: 1,
    age: 30,
    per: 17,
    mp: 1200,
    max_mp: 3600,
    hp: 9000,
    max_hp: 9000,
    score: 8,
    prop: { gj: 300, mz: 320, ds: 320 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 350],
    ["parry", 350],
    ["force", 330],
    ["sword", 350],
    ["huashanjianfa", 350, "sword"]);
this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 8
}, {
    obj: ["eq/lv0/jian", "book/book#sword"],
    odds: 3600
});
