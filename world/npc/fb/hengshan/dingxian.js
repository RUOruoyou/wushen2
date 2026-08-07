this.inherits(NPC);
this.set({
    name: "定闲师太",
    desc: "定闲师太神情慈和，掌势却绵密如云，后发先至。",
    title: "恒山掌门",
    gender: 0,
    age: 55,
    per: 24,
    mp: 5200,
    max_mp: 8800,
    hp: 20500,
    max_hp: 20500,
    pfm_rate: 1,
    score: 30,
    prop: { gj: 720, mz: 560, fy: 620, ds: 520 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 560],
    ["parry", 560],
    ["force", 580],
    ["unarmed", 580],
    ["sword", 540],
    ["baiyunxinfa", 580, "force"],
    ["tianchangzhang", 580, "unarmed"],
    ["hengshanjianfa", 540, "sword"],
    ["hengshanshenfa", 560, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 8,
    max: 22
}, {
    obj: ["book/bc#baiyunxinfa", "book/bc#tianchangzhang", "book/bc#hengshanjianfa", "book/bc#kuangfengkuaidao"],
    odds: 5200
}, {
    obj: ["eq/lv2/hsn_cloth", "eq/lv2/hsn_shoes", "eq/lv2/hsn_zhu", "eq/lv2/hsn_ring", "eq/lv2/kuangfengdao", "eq/lv2/tbguang", "drug/yulu"],
    odds: 2600
});
