this.inherits(AREA);
this.set({
    id: "taohuadao",
    name: "桃花岛",
    desc: "桃花岛九宫阵与石匣支线副本，普通和困难路线各自结算完成度。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 20,
    exp: 19000,
    pot: 12000,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/taohuadao/",
    first: "fb/taohuadao/entry",
    ss_title: "桃花岛",
    fb_routes:     {
        "1": {
            "default": {
                "破阵一": 25,
                "黄药师": 75
            }
        },
        "normal": {
            "default": {
                "破阵一": 15,
                "石匣线索": 10,
                "周伯通初遇": 15,
                "回报黄蓉": 15,
                "破阵二": 15,
                "周伯通石匣": 15,
                "交付黄蓉": 15
            }
        }
    }
});
this.map = [
    { n: "海滩", id: "fb/taohuadao/entry", p: [1, -4], exits: ["s"] },
    { n: "桃花林", id: "fb/taohuadao/maze1", p: [0, -3] },
    { n: "桃花林", id: "fb/taohuadao/maze2", p: [1, -3] },
    { n: "桃花林", id: "fb/taohuadao/maze3", p: [2, -3] },
    { n: "桃花林", id: "fb/taohuadao/maze4", p: [0, -2] },
    { n: "桃花林", id: "fb/taohuadao/maze5", p: [1, -2] },
    { n: "桃花林", id: "fb/taohuadao/maze6", p: [2, -2] },
    { n: "桃花林", id: "fb/taohuadao/maze7", p: [0, -1] },
    { n: "桃花林", id: "fb/taohuadao/maze8", p: [1, -1] },
    { n: "桃花林", id: "fb/taohuadao/maze9", p: [2, -1] },
    { n: "桃林出口", id: "fb/taohuadao/taolin_exit", p: [1, 0], exits: ["n", "s"] },
    { n: "小路", id: "fb/taohuadao/islandpath", p: [1, 1], exits: ["n", "s", "e"] },
    { n: "试剑亭", id: "fb/taohuadao/shijianting", p: [1, 2], exits: ["n"] },
    { n: "大门", id: "fb/taohuadao/damen", p: [2, 1], exits: ["w", "e"] },
    { n: "前院", id: "fb/taohuadao/qianyuan", p: [3, 1], exits: ["w", "e"] },
    { n: "大厅", id: "fb/taohuadao/dating", p: [4, 1], exits: ["w", "e", "n"] },
    { n: "书房", id: "fb/taohuadao/shufang", p: [5, 1], exits: ["w"] },
    { n: "卧室", id: "fb/taohuadao/huangrong1", p: [4, 0], exits: ["s"] },
    { n: "山洞", id: "fb/taohuadao/zhou2", p: [-1, -2], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#yunlongshenfa", "book/bc#biboshengong", "book/bc#anyingfuxiang", "book/bc#luoyingshenjian", "book/bc#tanzhishentong", "book/bc#canhezhi", "eq/fb/taohuadao/yuxiao", "eq/fb/taohuadao/ruanweijia"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: ["book/bc#yunlongshenfa", "book/bc#biboshengong", "book/bc#anyingfuxiang", "book/bc#luoyingshenjian", "book/bc#tanzhishentong", "book/bc#canhezhi"], odds: 2200 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 }
    ];
    result.push({ obj: ["eq/fb/taohuadao/yuxiao", "eq/fb/taohuadao/ruanweijia"], odds: 1200 });
    return [result];
};
