this.inherits(NPC);
this.set({
    name: "温方达",
    desc: "温家长老之一，掌中八卦棍沉稳狠辣。",
    title: "温家长老",
    gender: 1,
    age: 58,
    per: 20,
    mp: 2200,
    max_mp: 5200,
    hp: 12500,
    max_hp: 12500,
    score: 18,
    prop: { gj: 430, fy: 420 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv2/gun", 1, 1]);
this.skill_map(
    ["dodge", 420],
    ["parry", 420],
    ["force", 400],
    ["unarmed", 400],
    ["sword", 400],
    ["club", 430],
    ["baguagun", 430, "club"],
    ["baguaquan", 400, "unarmed"],
    ["jinshejianfa", 400, "sword"],
    ["jinsheyoushenbu", 400, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 5,
    max: 14
}, {
    obj: ["book/bc#baguagun", "book/bc#baguaquan", "book/bc#jinshejianfa", "book/bc#jinsheyoushenbu", "eq/lv2/js_pifeng", "eq/lv3/baguagun", "eq/lv3/jinshejian"],
    odds: 3200
});
