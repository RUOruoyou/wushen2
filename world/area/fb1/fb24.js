this.inherits(AREA);
this.set({
    id: "binghuo",
    name: "冰火岛",
    desc: "冰火岛火山与丛林双线副本，困难模式追加张五侠战斗。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 23,
    exp: 22000,
    pot: 13500,
    is_multi: true,
    is_diffi: true,
    room_path: "fb/binghuo/",
    first: "fb/binghuo/entry",
    ss_title: "冰火岛",
    fb_routes:     {
        "1": {
            "default": {
                "炎龙一": 10,
                "炎龙二": 15,
                "炎龙王": 20,
                "白熊一": 10,
                "白熊二": 15,
                "谢逊": 15,
                "张五侠": 15
            }
        },
        "normal": {
            "default": {
                "炎龙一": 10,
                "炎龙二": 15,
                "炎龙王": 20,
                "白熊一": 10,
                "白熊二": 15,
                "谢逊": 30
            }
        }
    }
});
this.map = [
    { n: "冰火岛海边", id: "fb/binghuo/entry", p: [0, 0], exits: ["n"] },
    { n: "海边岩石", id: "fb/binghuo/central", p: [0, -1], exits: ["s","w","e","n"] },
    { n: "炎龙浅滩", id: "fb/binghuo/yanlong1", p: [-1, -1], exits: ["e","n"] },
    { n: "双炎龙路", id: "fb/binghuo/yanlong2", p: [-1, -2], exits: ["s","n"] },
    { n: "火山脚", id: "fb/binghuo/yanlongwang", p: [-1, -3], exits: ["s"] },
    { n: "丛林浅滩", id: "fb/binghuo/baixiong1", p: [1, -1], exits: ["w","n"] },
    { n: "石山暗口", id: "fb/binghuo/baixiong2", p: [1, -2], exits: ["s"] },
    { n: "谢逊石洞", id: "fb/binghuo/shixun", p: [0, -2], exits: ["s"] }
];
this.drops = ["st/xuanjing","st/st_blu#1","st/st_red#1","st/st_yel#1","st/st_gre#1","st/st_blu#2","st/st_yel#2","st/st_gre#2","drug/huoyan","book/bc#sixiangbu","book/bc#qianzhuwandushou", "eq/fb/binghuo/lihuozhu", "eq/fb/binghuo/tulongdao"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: ["book/bc#sixiangbu","book/bc#qianzhuwandushou","st/st_blu#1","st/st_red#1","st/st_yel#1","st/st_gre#1","st/st_blu#2","st/st_yel#2","st/st_gre#2","st/xuanjing"], odds: 2200 },
        { obj: ["drug/huoyan"], min: 1, max: 2, odds: 2500 }
    ];
    result.push({ obj: "eq/fb/binghuo/lihuozhu", odds: 1200 });
    if (isdiff) result.push({ obj: "eq/fb/binghuo/tulongdao", odds: 900 });
    return [result];
};
