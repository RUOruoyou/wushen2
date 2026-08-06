this.inherits(AREA);
this.set({
    id: "hengshan2",
    name: "衡山",
    desc: "衡山琴台风声如曲，嵩山刺客潜入山中。听懂琴谱后，方能上流云峰见莫大先生。",
    score: 100,
    is_show: true,
    first: "fb/hengshan2/shanmen",
    is_copy: true,
    expend: 10,
    exp: 15000,
    pot: 10000,
    is_multi: false,
    room_path: "fb/hengshan2/",
    ss_title: "衡山琴客"
});
this.map = [
    { n: "山门", id: "fb/hengshan2/shanmen", p: [0, 0], exits: ["n"] },
    { n: "回雁桥", id: "fb/hengshan2/huiyanqiao", p: [0, -1], exits: ["s", "n"] },
    { n: "琴台", id: "fb/hengshan2/qintai", p: [0, -2], exits: ["s", "n"] },
    { n: "竹径", id: "fb/hengshan2/zhujing", p: [0, -3], exits: ["s", "n"] },
    { n: "流云峰", id: "fb/hengshan2/liuyunfeng", p: [0, -4], exits: ["s", "n"] },
    { n: "掌门居", id: "fb/hengshan2/zhangmenju", p: [0, -5] }
];
this.drops = [
    "book/bc#liuyunzhang", "book/bc#kuangfengkuaijian",
    "eq/lv2/hs_qin", "eq/lv2/hs2_cloth", "eq/lv2/hs2_shoes", "eq/lv2/hs2_ring",
    "book/book#sword", "book/book#unarmed"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 16,
            max: 36
        }, {
            obj: ["book/bc#liuyunzhang", "book/bc#kuangfengkuaijian"],
            odds: 4200
        }, {
            obj: ["book/book#sword", "book/book#unarmed"],
            odds: 1800
        }, {
            obj: ["eq/lv2/hs_qin", "eq/lv2/hs2_cloth", "eq/lv2/hs2_shoes", "eq/lv2/hs2_ring"],
            odds: 2200
        }
    ]];
}
