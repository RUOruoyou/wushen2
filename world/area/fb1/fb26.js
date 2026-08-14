this.inherits(AREA);
this.set({
    id: "yanziwu",
    name: "燕子坞",
    desc: "燕子坞庄府、灵位与还施水阁副本，拜祭机关幂等计分。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 25,
    exp: 24000,
    pot: 14500,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/yanziwu/",
    first: "fb/yanziwu/entry",
    ss_title: "燕子坞",
    fb_routes:     {
        "1": {
            "default": {
                "包不同": 15,
                "王夫人": 15,
                "慕容复": 20,
                "拜祭灵位": 15,
                "还施水阁": 10,
                "慕容博": 25
            }
        },
        "normal": {
            "default": {
                "包不同": 15,
                "王夫人": 15,
                "慕容复": 20,
                "拜祭灵位": 15,
                "还施水阁": 10,
                "慕容博": 25
            }
        }
    }
});
this.map = [
    { n: "燕子坞岸边", id: "fb/yanziwu/entry", p: [0, 0], exits: ["n"] },
    { n: "庄府前院", id: "fb/yanziwu/qianyuan", p: [0, -1], exits: ["s","w","e","n"] },
    { n: "云锦楼", id: "fb/yanziwu/wangfuren", p: [-1, -1], exits: ["e"] },
    { n: "书房", id: "fb/yanziwu/murongfu", p: [1, -1], exits: ["w"] },
    { n: "慕容氏灵位", id: "fb/yanziwu/lingwei", p: [0, -2], exits: ["s","n"] },
    { n: "还施水阁", id: "fb/yanziwu/huanshi", p: [0, -3], exits: ["s","n"] },
    { n: "水阁密室", id: "fb/yanziwu/murongbo", p: [0, -4], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#canhezhi", "book/bc#douzhuanxingyi", "eq/fb/yanziwu/azhu_mianju"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: ["book/bc#canhezhi", "book/bc#douzhuanxingyi"], odds: 2200 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: "eq/fb/yanziwu/azhu_mianju", odds: 1200 }
    ];
    return [result];
};
