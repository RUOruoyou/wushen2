this.inherits(AREA);
this.set({
    id: "baituo",
    name: "白驼山",
    desc: "白驼山花园与毒蛇岩洞双线副本，组队共享主线完成度。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 21,
    exp: 20000,
    pot: 12500,
    is_multi: true,
    is_diffi: false,
    room_path: "fb/baituo/",
    first: "fb/baituo/entry",
    ss_title: "白驼山",
    fb_routes:     {
        "normal": {
            "default": {
                "欧阳锋": 25,
                "白衣少女": 15,
                "毒蛇一": 15,
                "毒蛇二": 15,
                "怪蟒": 30
            }
        }
    }
});
this.map = [
    { n: "白驼山入口", id: "fb/baituo/entry", p: [0, 0], exits: ["n"] },
    { n: "练功房", id: "fb/baituo/liangongfang", p: [0, -1], exits: ["s","w","e"] },
    { n: "白驼花园", id: "fb/baituo/huayuan", p: [-1, -1], exits: ["e","n"] },
    { n: "花园北廊", id: "fb/baituo/huayuan2", p: [-1, -2], exits: ["s"] },
    { n: "药房", id: "fb/baituo/yaofang", p: [1, -1], exits: ["w","e"] },
    { n: "蛇路一", id: "fb/baituo/dushe1", p: [2, -1], exits: ["w","e"] },
    { n: "蛇路二", id: "fb/baituo/dushe2", p: [3, -1], exits: ["w","e"] },
    { n: "岩洞", id: "fb/baituo/yandong", p: [4, -1], exits: ["w","e"] },
    { n: "白驼山出口", id: "fb/baituo/exit", p: [5, -1], exits: ["w"] }
];
this.drops = ["st/xuanjing", "book/bc#lingshezhangfa", "book/bc#chanchubufa", "book/bc#hamagong", "eq/fb/baituo/lingshezhang"];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: ["book/bc#lingshezhangfa", "book/bc#chanchubufa", "book/bc#hamagong"], odds: 2200 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: "eq/fb/baituo/lingshezhang", odds: 1200 }
    ]];
};
