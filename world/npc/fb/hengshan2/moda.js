this.inherits(NPC);
this.set({
    name: "莫大先生",
    desc: "莫大先生枯瘦清癯，琴声未绝，琴中剑已藏在袖底。",
    title: "衡山掌门",
    gender: 1,
    age: 60,
    per: 23,
    mp: 6000,
    max_mp: 9400,
    hp: 22500,
    max_hp: 22500,
    pfm_rate: 1,
    score: 35,
    prop: { gj: 790, mz: 620, ds: 580, fy: 600 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1], ["eq/lv2/hs_qin", 1, 1]);
this.skill_map(
    ["dodge", 600],
    ["parry", 600],
    ["force", 560],
    ["unarmed", 580],
    ["sword", 600],
    ["throwing", 560],
    ["liuyunzhang", 580, "unarmed"],
    ["kuangfengkuaijian", 600, ["sword", "dodge"]],
    ["zhenyuejue", 560, "force"],
    ["hengshanwushenjian", 600, "sword"],
    ["chuanyunzong", 600, "dodge"]);
this.set_drop({
    obj: "money/silver",
    min: 8,
    max: 24
}, {
    obj: ["book/bc#liuyunzhang", "book/bc#chuanyunzong", "book/bc#zhenyuejue", "book/bc#hengshanwushenjian"],
    odds: 5200
}, {
    obj: ["eq/lv2/hs_qin", "eq/lv2/hs2_cloth", "eq/lv2/hs2_shoes", "eq/lv2/hs2_ring", "eq/lv2/qyhuan", "eq/lv2/lzjpao"],
    odds: 2800
});
