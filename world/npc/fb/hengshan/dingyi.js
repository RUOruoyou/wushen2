this.inherits(NPC);
this.set({
    name: "定逸师太",
    desc: "定逸师太性如烈火，双掌一起便有云涛翻涌之势。",
    title: "恒山派",
    gender: 0,
    age: 48,
    per: 22,
    mp: 3800,
    max_mp: 7000,
    hp: 15500,
    max_hp: 15500,
    score: 20,
    prop: { gj: 560, mz: 480, fy: 520 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 480],
    ["parry", 480],
    ["force", 500],
    ["unarmed", 500],
    ["baiyunxinfa", 500, "force"],
    ["tianchangzhang", 500, "unarmed"]);
this.set_drop({
    obj: "money/silver",
    min: 6,
    max: 16
}, {
    obj: ["book/bc#baiyunxinfa", "book/bc#tianchangzhang", "drug/yulu", "eq/lv2/hsn_zhu"],
    odds: 4200
});
