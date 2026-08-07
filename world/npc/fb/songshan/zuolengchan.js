this.inherits(NPC);
this.set({
    name: "左冷禅",
    desc: "左冷禅端坐盟主殿中，寒冰真气森然逼人。",
    title: "五岳盟主",
    gender: 1,
    age: 55,
    mp: 7200,
    max_mp: 13000,
    hp: 38000,
    max_hp: 38000,
    score: 75,
    pfm_rate: 1,
    prop: { gj: 1200, mz: 1000, ds: 850, fy: 1050 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 800], ["parry", 850], ["force", 820], ["sword", 900], ["songshanjianfa", 900, ["sword", "parry"]], ["hanbingzhenqi", 850, "force"]);
this.set_drop({ obj: "money/silver", min: 20, max: 40 }, {
    obj: ["book/bc#dasongyangshenzhang", "book/bc#songshanjianfa", "book/bc#hanbingzhenqi", "eq/lv3/wuyuelingqi", "eq/lv3/mengzhupifeng"], odds: 2200
});
