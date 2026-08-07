this.inherits(AREA);
this.set({
    id: "wudu",
    name: "五毒教",
    desc: "苗疆密林深处毒雾弥漫，五毒教弟子以蛇虫布阵，神殿中有人坐镇毒阵。",
    score: 100,
    is_show: true,
    first: "fb/wudu/shandao",
    is_copy: true,
    expend: 10,
    exp: 12000,
    pot: 8500,
    is_multi: false,
    room_path: "fb/wudu/",
    ss_title: "破毒客"
});
this.map = [
    { n: "山道", id: "fb/wudu/shandao", p: [0, 0], exits: ["n"] },
    { n: "毒雾林", id: "fb/wudu/duwu", p: [0, -1], exits: ["s", "n", "e"] },
    { n: "药棚", id: "fb/wudu/yaopeng", p: [1, -1], exits: ["w"] },
    { n: "毒阵", id: "fb/wudu/duzhen", p: [0, -2], exits: ["s", "n"] },
    { n: "虫窟", id: "fb/wudu/chongku", p: [0, -3], exits: ["s", "n"] },
    { n: "神殿", id: "fb/wudu/shendian", p: [0, -4] }
];
this.drops = [
    "book/bc#qianzhuwandushou", "book/bc#wuduyanluobu", "book/bc#wudushengong", "book/bc#wudugoufa",
    "eq/lv2/wd_shou", "eq/lv2/wd_tou", "eq/lv2/wd_pifeng", "eq/lv2/wd_ring",
    "drug/dushe", "res/shexue", "st/xuanjing"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 12,
            max: 30
        }, {
            obj: ["res/shexue", "drug/dushe"],
            min: 1,
            max: 3
        }, {
            obj: ["book/bc#qianzhuwandushou", "book/bc#wuduyanluobu", "book/bc#wudushengong", "book/bc#wudugoufa"],
            odds: 4200
        }, {
            obj: ["eq/lv2/wd_shou", "eq/lv2/wd_tou", "eq/lv2/wd_pifeng", "eq/lv2/wd_ring"],
            odds: 2200
        }, {
            obj: "st/xuanjing",
            min: 2,
            max: 6
        }
    ]];
}
