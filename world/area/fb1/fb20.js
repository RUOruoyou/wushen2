this.inherits(AREA);
this.set({
    id: "yunmeng",
    name: "云梦沼泽",
    desc: "云梦沼泽巨鳄横行，火龙出没，洪荒古泽深处更有火龙王盘踞。",
    score: 100,
    is_show: true,
    first: "fb/yunmeng/rukou",
    is_copy: true,
    expend: 10,
    record_index: 19,
    exp: 2700,
    pot: 2700,
    is_multi: true,
    room_path: "fb/yunmeng/",
    ss_title: "云梦猎火"
});
this.map = [
    { n: "入口", id: "fb/yunmeng/rukou", p: [0, 0], exits: ["n"] },
    { n: "鳄群一", id: "fb/yunmeng/e1", p: [0, -1], exits: ["s", "n"] },
    { n: "鳄群二", id: "fb/yunmeng/e2", p: [0, -2], exits: ["s", "n"] },
    { n: "鳄群三", id: "fb/yunmeng/e3", p: [0, -3], exits: ["s", "n", "e"] },
    { n: "瑛姑方向", id: "fb/yunmeng/yinggu", p: [1, -3], exits: ["w", "n"] },
    { n: "火龙一", id: "fb/yunmeng/huolong1", p: [1, -4], exits: ["s", "n"] },
    { n: "火龙二", id: "fb/yunmeng/huolong2", p: [1, -5], exits: ["s", "n"] },
    { n: "火龙三", id: "fb/yunmeng/huolong3", p: [1, -6] },
    { n: "洪荒古泽", id: "fb/yunmeng/honghuang", p: [0, -4], exits: ["s", "n"] },
    { n: "补火一", id: "fb/yunmeng/buhuo1", p: [0, -5], exits: ["s", "n"] },
    { n: "补火二", id: "fb/yunmeng/buhuo2", p: [0, -6], exits: ["s", "n"] },
    { n: "火龙王深处", id: "fb/yunmeng/huolongwang", p: [0, -7] }
];
this.drops = [
    "res/eyupi", "res/huolongpi", "st/xuanjing", "st/st_blu#1", "st/st_red#1", "st/st_yel#1", "st/st_gre#1",
    "eq/lv3/huolongdao", "eq/lv3/huolongjian", "eq/lv3/huolongquan", "eq/lv3/huolongbian", "eq/lv3/huolonggun"
];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 30, max: 55 },
        { obj: ["res/eyupi", "res/huolongpi"], min: 1, max: 3 },
        { obj: ["st/xuanjing", "st/st_blu#1", "st/st_red#1", "st/st_yel#1", "st/st_gre#1"], odds: 3000 },
        { obj: ["eq/lv3/huolongdao", "eq/lv3/huolongjian", "eq/lv3/huolongquan", "eq/lv3/huolongbian", "eq/lv3/huolonggun"], odds: 1600 }
    ]];
};
