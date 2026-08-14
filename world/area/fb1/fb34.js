this.inherits(AREA);
this.set({
    id: "xiakedao",
    name: "侠客岛",
    desc: "侠客岛赏善与罚恶双路线副本，入场消耗 60 点精力。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 60,
    record_index: 33,
    exp: 32000,
    pot: 18500,
    is_multi: true,
    is_diffi: false,
    room_path: "fb/xiakedao/",
    first: "fb/xiakedao/entry",
    ss_title: "侠客岛",
    fb_routes:     {
        "normal": {
            "赏善": {
                "路线锁定": 0, "问答": 50, "第六层": 15, "比试": 20, "帮忙": 15
            },
            "罚恶": {
                "路线锁定": 10, "罚恶使者": 15, "石室一": 25, "第一岛主": 25, "第二岛主": 25
            }
        }
    }
});
this.map = [
    { n: "侠客岛入口", id: "fb/xiakedao/entry", p: [0, 0], exits: ["n", "e"] },
    { n: "第一层石室", id: "fb/xiakedao/shangshan", p: [0, -1], exits: ["s", "n"] },
    { n: "第二层石室", id: "fb/xiakedao/shangshan2", p: [0, -2], exits: ["s", "n"] },
    { n: "第三层石室", id: "fb/xiakedao/shangshan3", p: [0, -3], exits: ["s", "n"] },
    { n: "第四层石室", id: "fb/xiakedao/shangshan4", p: [0, -4], exits: ["s", "n"] },
    { n: "第五层石室", id: "fb/xiakedao/shangshan5", p: [0, -5], exits: ["s", "n"] },
    { n: "第六层石室", id: "fb/xiakedao/shangshan6", p: [0, -6], exits: ["s", "n"] },
    { n: "赏善岛主", id: "fb/xiakedao/shangshan_boss", p: [0, -7], exits: ["s"] },
    { n: "罚恶使者", id: "fb/xiakedao/fae", p: [1, 0], exits: ["w", "e"] },
    { n: "罚恶石室", id: "fb/xiakedao/fae_room", p: [2, 0], exits: ["w", "e"] },
    { n: "第一岛主", id: "fb/xiakedao/island1", p: [3, 0], exits: ["w", "e"] },
    { n: "第二岛主", id: "fb/xiakedao/island2", p: [4, 0], exits: ["w"] }
];
this.drops = ["st/xuanjing", "book/bc#xuanxubu", "book/bc#taixuangong", "eq/fb/xiakedao/tianlong_zhuri_xue", "eq/fb/xiakedao/nilin_shouhuan"];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#xuanxubu", "book/bc#taixuangong"], odds: 1800 },
        { obj: ["eq/fb/xiakedao/tianlong_zhuri_xue", "eq/fb/xiakedao/nilin_shouhuan"], odds: 1000 }
    ]];
};
