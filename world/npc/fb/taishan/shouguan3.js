this.inherits(NPC);
this.set({
    name: "泰山掌门",
    desc: "泰山掌门立于绝顶石阶前，剑意沉雄，最后一关不容退让。",
    title: "泰山三关",
    gender: 1,
    age: 62,
    mp: 5200,
    max_mp: 9000,
    hp: 23000,
    max_hp: 23000,
    score: 40,
    prop: { gj: 820, mz: 680, ds: 620, fy: 720 },
    pfm_rate: 1
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 620], ["parry", 650], ["force", 600], ["sword", 700], ["taishanjianfa", 700, ["sword"]]);
this.set_drop({ obj: "money/silver", min: 12, max: 28 }, {
    obj: ["book/bc#taishanquanfa", "book/bc#taishanjianfa", "book/bc#panshishengong", "eq/lv3/taishan_dengshanxue", "eq/lv3/panshi_hufu"], odds: 2200
});
