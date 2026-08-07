this.inherits(NPC);
this.set({
    name: "温府家丁",
    desc: "温府养的护院家丁，手中木棍使得颇有章法。",
    title: "温府护院",
    gender: 1,
    age: 28,
    per: 18,
    mp: 900,
    max_mp: 3200,
    hp: 8500,
    max_hp: 8500,
    score: 8,
    prop: { gj: 260, fy: 260 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/mugun", 1, 1]);
this.skill_map(
    ["dodge", 320],
    ["parry", 320],
    ["force", 300],
    ["unarmed", 300],
    ["club", 320],
    ["baguagun", 320, "club"]);
this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 8
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/mugun", "book/bc#baguagun", "eq/lv3/baguagun"],
    odds: 4500
});
