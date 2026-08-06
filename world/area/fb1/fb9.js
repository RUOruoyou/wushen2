this.inherits(AREA);
this.set({
    id: "shenlong",
    name: "神龙岛",
    desc: "海外孤岛上的神龙教总坛，林中毒蛇横行，教众分据各处，洪安通坐镇大厅。",
    score: 100,
    is_show: true,
    first: "bj/shenlong/haitan",
    is_copy: true,
    expend: 10,
    exp: 8000,
    pot: 5000,
    is_multi: false,
    room_path: "bj/shenlong/",
    ss_title: "神龙使"
});
this.map = [
    { n: "海滩", id: "bj/shenlong/haitan", p: [0, 0], exits: ["n"] },
    { n: "灌木林", id: "bj/shenlong/lin1", p: [0, -1], exits: ["s", "n"] },
    { n: "灌木林", id: "bj/shenlong/lin2", p: [0, -2], exits: ["s", "n"] },
    { n: "空地", id: "bj/shenlong/kongdi", p: [0, -3], exits: ["s", "n", "e"] },
    { n: "小屋", id: "bj/shenlong/xiaowu", p: [0, -4] },
    { n: "大道", id: "bj/shenlong/dadao", p: [1, -3], exits: ["w", "e"] },
    { n: "练武场", id: "bj/shenlong/wuchang", p: [2, -3], exits: ["w", "n"] },
    { n: "山道", id: "bj/shenlong/dadao2", p: [2, -4], exits: ["s", "n"] },
    { n: "大门", id: "bj/shenlong/damen", p: [2, -5], exits: ["s", "n"] },
    { n: "大厅", id: "bj/shenlong/dating", p: [2, -6] }
];
this.drops = [
    "book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shedaoqigong",
    "book/bc#shenlongjian", "book/bc#huagumianzhang", "eq/lv2/sl_ling"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 8,
            max: 20
        }, {
            obj: ["res/pimao1", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["book/bc#shenlongxinfa", "book/bc#yixingbufa", "book/bc#shedaoqigong", "book/bc#shenlongjian", "book/bc#huagumianzhang"],
            odds: 4500
        }, {
            obj: ["eq/lv2/sl_cloth", "eq/lv2/sl_tou", "eq/lv2/sl_shoes", "eq/lv2/sl_shou", "eq/lv2/sl_yao", "eq/lv2/sl_zhang", "eq/lv2/sl_ling"],
            odds: 2500
        }
    ]];
}
