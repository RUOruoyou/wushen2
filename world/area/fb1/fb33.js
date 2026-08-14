this.inherits(AREA);
this.set({
    id: "huashanlunjian",
    name: "华山论剑",
    desc: "华山论剑五绝车轮战副本，离开论剑台会重置当前挑战进度。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 32,
    exp: 31000,
    pot: 18000,
    is_multi: false,
    is_diffi: false,
    room_path: "fb/huashanlunjian/",
    first: "fb/huashanlunjian/entry",
    ss_title: "华山论剑",
    fb_routes:     {
        "normal": {
            "default": {
                "一绝": 20,
                "二绝": 20,
                "三绝": 20,
                "四绝": 20,
                "五绝": 20
            }
        }
    }
});
this.map = [
    { n: "华山论剑入口", id: "fb/huashanlunjian/entry", p: [0, 0], exits: ["n"] },
    { n: "论剑台下", id: "fb/huashanlunjian/taixia", p: [0, -1], exits: ["s", "n"] },
    { n: "论剑台一", id: "fb/huashanlunjian/tai1", p: [0, -2], exits: ["s", "n"] },
    { n: "论剑台二", id: "fb/huashanlunjian/tai2", p: [0, -3], exits: ["s", "n"] },
    { n: "论剑台三", id: "fb/huashanlunjian/tai3", p: [0, -4], exits: ["s", "n"] },
    { n: "论剑台四", id: "fb/huashanlunjian/tai4", p: [0, -5], exits: ["s", "n"] },
    { n: "论剑台五", id: "fb/huashanlunjian/tai5", p: [0, -6], exits: ["s", "n"] },
    { n: "绝壁", id: "fb/huashanlunjian/juebi", p: [0, -7], exits: ["s", "n"] },
    { n: "五绝宝箱", id: "fb/huashanlunjian/treasure", p: [0, -8], exits: ["s"] }
];
this.drops = [
    "st/xuanjing", "book/bc#duanjiajian", "book/bc#kumushengong", "book/bc#tiannanbu",
    "book/bc#yunlongshenfa", "book/bc#songshanjianfa", "book/bc#chanchubufa",
    "book/bc#anyingfuxiang", "book/bc#biboshengong", "book/bc#luoyingshenjian",
    "book/bc#hamagong", "book/bc#lingshezhangfa", "book/bc#tanzhishentong",
    "book/bc#yiyangzhi", "book/bc#jiuyinshengong", "eq/fb/huashanlunjian/lingshezhang", "eq/fb/huashanlunjian/yuxiao", "eq/fb/huashanlunjian/yuzhuzhang", "eq/fb/huashanlunjian/tianlong_pan"
];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: this.drops.slice(1), odds: 1800 }
    ]];
};
