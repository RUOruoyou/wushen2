this.inherits(NPC);
this.set({
    name: "罗人杰",
    desc: "青城四秀之一，拳法短促狠辣，出招毫不留情。",
    title: "青城四秀",
    gender: 1,
    age: 28,
    per: 19,
    mp: 2400,
    max_mp: 5600,
    hp: 12500,
    max_hp: 12500,
    score: 12,
    prop: { gj: 460, mz: 430, fy: 400 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 430],
    ["parry", 430],
    ["force", 400],
    ["unarmed", 460],
    ["baguaquan", 460, "unarmed"]);
this.set_drop({
    obj: "money/silver",
    min: 4,
    max: 12
}, {
    obj: ["book/bc#baguaquan", "book/book#unarmed"],
    odds: 3600
});
