this.inherits(AREA);
this.set({
    id: "qingcheng",
    name: "青城山",
    desc: "青城松风观前八卦石盘暗合阵势，青城四秀守着山门，余沧海坐镇后堂。",
    score: 100,
    is_show: true,
    first: "fb/qingcheng/shanlu",
    is_copy: true,
    expend: 10,
    exp: 14000,
    pot: 9500,
    is_multi: false,
    room_path: "fb/qingcheng/",
    ss_title: "破阵客"
});
this.map = [
    { n: "山路", id: "fb/qingcheng/shanlu", p: [0, 0], exits: ["n"] },
    { n: "观前", id: "fb/qingcheng/qianmen", p: [0, -1], exits: ["s", "n"] },
    { n: "八卦台", id: "fb/qingcheng/baguatai", p: [0, -2], exits: ["s", "n"] },
    { n: "机关廊", id: "fb/qingcheng/jiguanlang", p: [0, -3], exits: ["s", "n"] },
    { n: "松风观", id: "fb/qingcheng/songfengguan", p: [0, -4], exits: ["s", "n"] },
    { n: "后堂", id: "fb/qingcheng/houtang", p: [0, -5] }
];
this.drops = [
    "book/bc#baguaquan", "book/bc#baguagun",
    "eq/lv2/qc_gun", "eq/lv2/qc_cloth", "eq/lv2/qc_ring",
    "book/book#club", "book/book#unarmed"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 14,
            max: 34
        }, {
            obj: ["book/bc#baguaquan", "book/bc#baguagun"],
            odds: 4200
        }, {
            obj: ["book/book#club", "book/book#unarmed"],
            odds: 1800
        }, {
            obj: ["eq/lv2/qc_gun", "eq/lv2/qc_cloth", "eq/lv2/qc_ring"],
            odds: 2200
        }
    ]];
}
