this.inherits(AREA);
this.set({
    id: "yinyanggu",
    name: "阴阳谷",
    desc: "阴阳谷烛龙与幽冥双路线副本，深度状态只存在副本实例。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 36,
    exp: 35000,
    pot: 20000,
    is_multi: true,
    is_diffi: false,
    room_path: "fb/yinyanggu/",
    first: "fb/yinyanggu/entry",
    ss_title: "阴阳谷",
    fb_routes:     {
        "normal": {
            "烛龙": { "大石": 10, "深度": 20, "幽莹": 20, "藤蔓": 10, "洞窟": 5, "烛照": 5, "烛九阴": 30 },
            "幽冥": { "大石": 10, "深度": 20, "藤蔓": 10, "洞窟": 5, "烛九阴幽冥": 25, "双子一": 15, "双子二": 15 }
        }
    }
});
this.map = [
    { n: "阴阳谷入口", id: "fb/yinyanggu/entry", p: [0, 0], exits: ["n"] },
    { n: "大石台", id: "fb/yinyanggu/dashi", p: [0, -1], exits: ["s", "n"] },
    { n: "深水区", id: "fb/yinyanggu/shenshui", p: [0, -2], exits: ["s", "n"] },
    { n: "玄冰洞", id: "fb/yinyanggu/xuanbing", p: [0, -3], exits: ["s", "n"] },
    { n: "藤蔓平台", id: "fb/yinyanggu/platform", p: [0, -4], exits: ["s", "n"] },
    { n: "洞窟节点", id: "fb/yinyanggu/cave", p: [0, -5], exits: ["s", "n"] },
    { n: "阴阳核心", id: "fb/yinyanggu/core", p: [0, -6], exits: ["s"] }
];
this.drops = ["st/xuanjing", "sp/fb/yinyanggu/pojun", "sp/fb/yinyanggu/tanlang", "sp/fb/yinyanggu/qisha", "sp/fb/yinyanggu/ziwei", "eq/fb/yinyanggu/yinyang_huan", "book/bc#yinyangjiuzhuan"];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["sp/fb/yinyanggu/pojun", "sp/fb/yinyanggu/tanlang", "sp/fb/yinyanggu/qisha", "sp/fb/yinyanggu/ziwei", "eq/fb/yinyanggu/yinyang_huan"], odds: 1200 },
        { obj: "book/bc#yinyangjiuzhuan", odds: 1800 }
    ]];
};
