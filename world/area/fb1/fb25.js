this.inherits(AREA);
this.set({
    id: "yihuagong",
    name: "移花宫",
    desc: "移花宫花径、宫主机关与暗道副本，困难模式包含宫主援战。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 24,
    exp: 23000,
    pot: 14000,
    is_multi: true,
    is_diffi: true,
    room_path: "fb/yihuagong/",
    first: "fb/yihuagong/entry",
    ss_title: "移花宫",
    fb_routes:     {
        "1": {
            "default": {
                "花径": 10,
                "花月奴": 10,
                "宫女一": 10,
                "宫女二": 10,
                "邀月": 15,
                "怜星": 15,
                "床榻机关": 10,
                "暗道": 5,
                "花无缺": 15
            }
        },
        "normal": {
            "default": {
                "花径": 10,
                "花月奴": 10,
                "宫女一": 10,
                "宫女二": 10,
                "邀月": 15,
                "怜星": 15,
                "床榻机关": 10,
                "暗道": 5,
                "花无缺": 15
            }
        }
    }
});
this.map = [
    { n: "移花宫山道", id: "fb/yihuagong/entry", p: [0, 0], exits: ["n"] },
    { n: "十字花径", id: "fb/yihuagong/huajing", p: [0, -1], exits: ["s"] },
    { n: "花月奴处", id: "fb/yihuagong/huaynu", p: [0, -2], exits: ["s","n"] },
    { n: "第一组宫女", id: "fb/yihuagong/gongnu1", p: [0, -3], exits: ["s","n"] },
    { n: "第二组宫女", id: "fb/yihuagong/gongnu2", p: [0, -4], exits: ["s","n"] },
    { n: "邀月宫", id: "fb/yihuagong/yaoyue", p: [0, -5], exits: ["s","e"] },
    { n: "怜星宫", id: "fb/yihuagong/lianxing", p: [1, -5], exits: ["w","e"] },
    { n: "床榻机关", id: "fb/yihuagong/chuangta", p: [2, -5], exits: ["w","e"] },
    { n: "二层暗道", id: "fb/yihuagong/erceng", p: [3, -5], exits: ["w","n"] },
    { n: "花无缺密室", id: "fb/yihuagong/huawuque", p: [3, -6], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#taishanquanfa", "book/bc#songfengjianfa", "book/bc#xuanxubu", "book/bc#hanbingzhenqi", "sp/fb/yihuagong/biyu_xuelian", "eq/fb/yihuagong/lianxing_biyuzan", "eq/fb/yihuagong/yaoyue_shouhuan", "eq/fb/yihuagong/huawuque_yupei", "eq/fb/yihuagong/yihuagongzhuang", "eq/fb/yihuagong/yihuagonglv", "eq/fb/yihuagong/bixue_zhaodanqing"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: ["book/bc#taishanquanfa", "book/bc#songfengjianfa", "book/bc#xuanxubu", "book/bc#hanbingzhenqi"], odds: 2200 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: "sp/fb/yihuagong/biyu_xuelian", odds: 1800 }
    ];
    result.push({ obj: ["eq/fb/yihuagong/lianxing_biyuzan", "eq/fb/yihuagong/yaoyue_shouhuan", "eq/fb/yihuagong/huawuque_yupei", "eq/fb/yihuagong/yihuagongzhuang", "eq/fb/yihuagong/yihuagonglv"], odds: 1000 });
    if (isdiff) result.push({ obj: "eq/fb/yihuagong/bixue_zhaodanqing", odds: 900 });
    return [result];
};
