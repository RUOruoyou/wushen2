this.inherits(NPC);
this.set({
    name: "泰山守关弟子",
    desc: "泰山弟子横剑立在山道中央，专门阻拦登山者。",
    title: "泰山一关",
    gender: 1,
    age: 30,
    mp: 3200,
    max_mp: 6200,
    hp: 14000,
    max_hp: 14000,
    score: 30,
    prop: { gj: 520, mz: 480, ds: 450, fy: 450 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 450], ["parry", 450], ["force", 420], ["sword", 500]);
this.set_drop({ obj: "money/silver", min: 8, max: 18 }, {
    obj: ["book/bc#taishanjianfa", "eq/lv3/taishan_dengshanxue"], odds: 1200
});
