this.inherits(NPC);
this.set({
    name: "何铁手",
    desc: "她一只铁手泛着幽光，笑意温婉，出手却狠辣无比。",
    title: "五毒教主",
    gender: 0,
    age: 25,
    per: 28,
    mp: 5200,
    max_mp: 8500,
    hp: 19000,
    max_hp: 19000,
    pfm_rate: 1,
    score: 35,
    prop: { gj: 700, mz: 560, ds: 560, fy: 540 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv2/anqi", 1, 1]);
this.skill_map(
    ["dodge", 540],
    ["parry", 540],
    ["sword", 500],
    ["force", 500],
    ["wudushengong", 500, "force"],
    ["unarmed", 560],
    ["wudugoufa", 560, "sword"],
    ["throwing", 520],
    ["qianzhuwandushou", 560, ["unarmed", "parry"]],
    ["wuduyanluobu", 540, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 8,
    max: 22
}, {
    obj: ["book/bc#qianzhuwandushou", "book/bc#wuduyanluobu", "book/bc#wudushengong", "book/bc#wudugoufa"],
    odds: 5200
}, {
    obj: ["eq/lv2/wd_shou", "eq/lv2/wd_tou", "eq/lv2/wd_pifeng", "eq/lv2/wd_ring", "eq/lv2/anqi"],
    odds: 3000
});
