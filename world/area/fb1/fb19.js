this.inherits(AREA);
this.set({
    id: "songshan",
    name: "嵩山",
    desc: "中岳嵩山，也是五岳剑派嵩山派的所在地，太保列阵守护封禅台。",
    score: 100,
    is_show: true,
    first: "fb/songshan/shanmen",
    is_copy: true,
    expend: 10,
    record_index: 18,
    exp: 2600,
    pot: 2600,
    is_multi: false,
    room_path: "fb/songshan/",
    ss_title: "嵩山盟主"
});
this.map = [
    { n: "山门", id: "fb/songshan/shanmen", p: [0, 0], exits: ["n"] },
    { n: "一太保", id: "fb/songshan/taibao1", p: [0, -1], exits: ["s", "n"] },
    { n: "二太保", id: "fb/songshan/taibao2", p: [0, -2], exits: ["s", "n"] },
    { n: "三太保", id: "fb/songshan/taibao3", p: [0, -3], exits: ["s", "n"] },
    { n: "四太保", id: "fb/songshan/taibao4", p: [0, -4], exits: ["s", "n"] },
    { n: "封禅台", id: "fb/songshan/fengchantai", p: [0, -5], exits: ["s", "n"] },
    { n: "盟主殿", id: "fb/songshan/mengzhudian", p: [0, -6] }
];
this.drops = [
    "book/bc#dasongyangshenzhang", "book/bc#songshanjianfa", "eq/lv3/wuyuelingqi",
    "eq/lv3/mengzhupifeng", "book/bc#hanbingzhenqi"
];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 28, max: 50 },
        { obj: ["book/bc#dasongyangshenzhang", "book/bc#songshanjianfa", "book/bc#hanbingzhenqi"], odds: 3000 },
        { obj: ["eq/lv3/wuyuelingqi", "eq/lv3/mengzhupifeng"], odds: 1700 },
        { obj: "st/xuanjing", min: 1, max: 4, odds: 2400 }
    ]];
};
