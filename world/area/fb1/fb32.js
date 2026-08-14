this.inherits(AREA);
this.set({
    id: "gumu",
    name: "古墓派",
    desc: "古墓派剑指暗河、杨过昏迷、海潮考验与剑冢终战副本。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 31,
    exp: 30000,
    pot: 17500,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/gumu/",
    first: "fb/gumu/entry",
    ss_title: "古墓派",
    fb_routes:     {
        "1": {
            "default": {
                "剑指": 10, "古琴": 10, "小龙女": 15, "昏迷杨过": 10,
                "游水": 15, "石块": 10, "海潮七击": 15, "剑魔": 15
            }
        },
        "normal": {
            "default": {
                "剑指": 10, "古琴": 10, "小龙女": 15, "昏迷杨过": 10,
                "游水": 15, "石块": 10, "海潮七击": 15, "剑灵": 15
            }
        }
    }
});
this.map = [
    { n: "古墓派入口", id: "fb/gumu/entry", p: [0, 0], exits: ["n"] },
    { n: "古墓前厅", id: "fb/gumu/qianting", p: [0, -1], exits: ["s", "n"] },
    { n: "古墓卧室", id: "fb/gumu/woshi", p: [0, -2], exits: ["s", "e", "n"] },
    { n: "琴室", id: "fb/gumu/qinshi", p: [1, -2], exits: ["w", "e"] },
    { n: "暗河入口", id: "fb/gumu/anhe", p: [2, -2], exits: ["w", "n"] },
    { n: "随机水路", id: "fb/gumu/shuilu", p: [2, -3], exits: ["s", "n"] },
    { n: "峭壁", id: "fb/gumu/qiaobi", p: [2, -4], exits: ["s", "n"] },
    { n: "剑冢", id: "fb/gumu/jianzhong", p: [2, -5], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#yunvxinjing", "book/bc#yinsuojinling", "book/bc#anranxiaohunzhang", "book/bc#xuantiejianfa", "eq/fb/gumu/bingpo_yinzhen", "eq/fb/gumu/jinling_suo", "eq/fb/gumu/panlongzan", "eq/fb/gumu/longgu_huan"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#yunvxinjing", "book/bc#yinsuojinling", "book/bc#anranxiaohunzhang", "book/bc#xuantiejianfa"], odds: 1800 }
    ];
    result.push({ obj: ["eq/fb/gumu/bingpo_yinzhen", "eq/fb/gumu/jinling_suo"], odds: 1000 });
    if (isdiff) result.push({ obj: "eq/fb/gumu/longgu_huan", odds: 900 });
    else result.push({ obj: "eq/fb/gumu/panlongzan", odds: 900 });
    return [result];
};
