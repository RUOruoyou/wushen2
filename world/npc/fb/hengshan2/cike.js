this.inherits(NPC);
this.set({
    name: "嵩山刺客",
    desc: "嵩山刺客黑衣短剑，潜入琴台，只为毁去衡山曲谱。",
    title: "嵩山派",
    gender: 1,
    age: 33,
    per: 18,
    mp: 3200,
    max_mp: 6200,
    hp: 15000,
    max_hp: 15000,
    score: 20,
    prop: { gj: 540, mz: 500, ds: 480, fy: 430 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(
    ["dodge", 500],
    ["parry", 500],
    ["force", 460],
    ["sword", 500],
    ["kuangfengkuaijian", 500, ["sword", "dodge"]]);
this.set_drop({
    obj: "money/silver",
    min: 5,
    max: 15
}, {
    obj: ["book/bc#kuangfengkuaijian", "book/book#sword", "st/xuanjing", "eq/lv2/hs2_shoes"],
    odds: 4200
});
