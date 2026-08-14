this.inherits(AREA);
this.set({
    id: "cihang",
    name: "慈航静斋",
    desc: "慈航七苦门、祁冰云/浪翻云分支、庞斑多命与石窟领悟副本。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 35,
    exp: 34000,
    pot: 19500,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/cihang/",
    first: "fb/cihang/entry",
    ss_title: "慈航静斋",
    fb_routes:     {
        "1": {
            "剑魔": { "七苦门": 15, "遗书与挑战": 15, "庞斑三命": 40, "剑魔阶段": 15, "石窟领悟": 15 },
            "魔师": { "七苦门": 15, "长生资格": 10, "拦江岛战斗": 15, "魔师战斗": 45, "石窟领悟": 15 }
        },
        "normal": {
            "浪子": { "七苦门": 20, "祁冰云": 10, "遗书": 15, "浪翻云": 15, "庞斑三命": 25, "石窟领悟": 15 },
            "国师": { "七苦门": 20, "观战求突破": 10, "比试庞斑": 15, "浪翻云阶段": 40, "石窟领悟": 15 }
        }
    }
});
this.map = [
    { n: "慈航入口", id: "fb/cihang/entry", p: [0, 0], exits: ["n"] },
    { n: "第一重苦门", id: "fb/cihang/qikumenu", p: [0, -1], exits: ["s", "n"] },
    { n: "第二重苦门", id: "fb/cihang/qikumenu2", p: [0, -2], exits: ["s", "n"] },
    { n: "第三重苦门", id: "fb/cihang/qikumenu3", p: [0, -3], exits: ["s", "n"] },
    { n: "第四重苦门", id: "fb/cihang/qikumenu4", p: [0, -4], exits: ["s", "n"] },
    { n: "第五重苦门", id: "fb/cihang/qikumenu5", p: [0, -5], exits: ["s", "n"] },
    { n: "第六重苦门", id: "fb/cihang/qikumenu6", p: [0, -6], exits: ["s", "n"] },
    { n: "第七重苦门", id: "fb/cihang/qikumenu7", p: [0, -7], exits: ["s", "n"] },
    { n: "慈航分路", id: "fb/cihang/fenlu", p: [0, -8], exits: ["s", "w", "e"] },
    { n: "观云山路", id: "fb/cihang/langlu", p: [-1, -8], exits: ["e", "ne"] },
    { n: "祁冰云山路", id: "fb/cihang/qibinglu", p: [1, -8], exits: ["w", "nw"] },
    { n: "拦江岛", id: "fb/cihang/jiangdao", p: [0, -9], exits: ["sw", "se", "n"] },
    { n: "桃源小径", id: "fb/cihang/taoyuan", p: [0, -10], exits: ["s", "n"] },
    { n: "石窟", id: "fb/cihang/shiku", p: [0, -11], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#bianjianfa", "book/bc#lingxibu", "book/bc#cihangjiandian", "eq/fb/cihang/feiyi_jian", "eq/fb/cihang/bianan_hua"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#bianjianfa", "book/bc#lingxibu", "book/bc#cihangjiandian"], odds: 1800 }
    ];
    result.push({ obj: "eq/fb/cihang/feiyi_jian", odds: 1000 });
    if (isdiff) result.push({ obj: "eq/fb/cihang/bianan_hua", odds: 900 });
    return [result];
};
