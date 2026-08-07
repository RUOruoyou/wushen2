this.inherits(NPC);
this.set({
    name: "五毒使者",
    desc: "五毒教使者衣袖宽大，掌心泛着一层暗绿毒气。",
    title: "五毒教",
    gender: 1,
    age: 34,
    per: 18,
    mp: 2600,
    max_mp: 5800,
    hp: 13000,
    max_hp: 13000,
    score: 18,
    prop: { gj: 460, mz: 430, ds: 430, fy: 390 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 430],
    ["parry", 430],
    ["sword", 400],
    ["force", 400],
    ["wudushengong", 400, "force"],
    ["unarmed", 450],
    ["wudugoufa", 450, "sword"],
    ["qianzhuwandushou", 450, ["unarmed", "parry"]],
    ["wuduyanluobu", 430, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 4,
    max: 12
}, {
    obj: ["book/bc#qianzhuwandushou", "book/bc#wuduyanluobu", "book/bc#wudushengong", "book/bc#wudugoufa", "drug/dushe", "eq/lv2/wd_ring"],
    odds: 4200
});
