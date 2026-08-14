this.inherits(AREA);
this.set({
    id: "tianlongsi",
    name: "天龙寺",
    desc: "天龙寺伪装、抓段誉与护送路线副本，普通和困难门禁不同。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 29,
    exp: 28000,
    pot: 16500,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/tianlongsi/",
    first: "fb/tianlongsi/entry",
    ss_title: "天龙寺",
    fb_routes:     {
        "1": {
            "default": {
                "伪装进入": 10,
                "抓段誉": 20,
                "枯荣": 15,
                "六名和尚": 30,
                "护送段誉": 25
            }
        },
        "normal": {
            "default": {
                "前置和尚": 10,
                "抓段誉": 20,
                "枯荣": 15,
                "余下和尚": 30,
                "护送段誉": 25
            }
        }
    }
});
this.map = [
    { n: "天龙寺入口", id: "fb/tianlongsi/entry", p: [0, 0], exits: ["n"] },
    { n: "舍利殿", id: "fb/tianlongsi/shelidian", p: [0, -1], exits: ["s", "w", "e", "n"] },
    { n: "无我殿", id: "fb/tianlongsi/wuwo", p: [-1, -2], exits: ["e", "n"] },
    { n: "无常殿", id: "fb/tianlongsi/wuchang", p: [-1, -3], exits: ["s", "n"] },
    { n: "无乐殿", id: "fb/tianlongsi/wule", p: [1, -2], exits: ["w", "n"] },
    { n: "无静阁", id: "fb/tianlongsi/wujing", p: [1, -3], exits: ["s", "n"] },
    { n: "般若台", id: "fb/tianlongsi/banruotai", p: [0, -4], exits: ["s", "n"] },
    { n: "牟尼堂", id: "fb/tianlongsi/munitang", p: [0, -5], exits: ["s", "n"] }
];
this.drops = ["st/xuanjing", "book/bc#tiannanbu", "book/bc#duanjiajian", "book/bc#kumushengong", "book/bc#liumaishenjian", "eq/fb/tianlongsi/longgu_sheli"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#tiannanbu", "book/bc#duanjiajian", "book/bc#kumushengong", "book/bc#liumaishenjian"], odds: 1800 }
    ];
    if (isdiff) result.push({ obj: "eq/fb/tianlongsi/longgu_sheli", odds: 1000 });
    return [result];
};
