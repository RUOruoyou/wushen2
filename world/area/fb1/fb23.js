this.inherits(AREA);
this.set({
    id: "xingxiu",
    name: "星宿海",
    desc: "星宿海狮吼子与丁春秋主线副本，可选弟子不计完成度。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 22,
    exp: 21000,
    pot: 13000,
    is_multi: false,
    is_diffi: false,
    room_path: "fb/xingxiu/",
    first: "fb/xingxiu/entry",
    ss_title: "星宿海",
    fb_routes:     {
        "normal": {
            "default": {
                "狮吼子": 35,
                "丁春秋": 65
            }
        }
    }
});
this.map = [
    { n: "星宿海入口", id: "fb/xingxiu/entry", p: [0, 0], exits: ["n"] },
    { n: "星宿岔路", id: "fb/xingxiu/fork", p: [0, -1], exits: ["s","w","e","n"] },
    { n: "摘星台", id: "fb/xingxiu/left", p: [-1, -1], exits: ["e"] },
    { n: "星宿偏殿", id: "fb/xingxiu/right", p: [1, -1], exits: ["w"] },
    { n: "星宿海", id: "fb/xingxiu/shihouzi", p: [0, -2], exits: ["s","n"] },
    { n: "日月洞", id: "fb/xingxiu/ridong", p: [0, -3], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#zhaixinggong", "book/bc#feixingshu", "book/bc#sanyinwugongzhao", "book/bc#huagongdafa", "eq/fb/xingxiu/bilinzheng", "eq/fb/xingxiu/shenmu_wangding"];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: ["book/bc#zhaixinggong", "book/bc#feixingshu", "book/bc#sanyinwugongzhao", "book/bc#huagongdafa"], odds: 2200 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["eq/fb/xingxiu/bilinzheng", "eq/fb/xingxiu/shenmu_wangding"], odds: 1200 }
    ]];
};
