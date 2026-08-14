this.inherits(AREA);
this.set({
    id: "jingnian",
    name: "净念禅宗",
    desc: "净念禅宗普通盗帅/僧王/少帅与困难邪王/困难僧王分支副本，剧情状态和和氏璧只存于副本实例。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 34,
    exp: 33000,
    pot: 19000,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/jingnian/",
    first: "fb/jingnian/entry",
    ss_title: "净念禅宗",
    fb_routes:     {
        "1": {
            "邪王": { "主殿抗杀": 15, "昏迷突破": 10, "拦路僧": 15, "推开铜殿": 10, "五僧": 25, "和氏璧": 10, "邪王剧情": 15 },
            "困难僧王": { "入寺": 10, "老徐": 30, "进入钟楼": 10, "拦路天僧": 30, "长生门": 20 }
        },
        "normal": {
            "僧王": { "三次退出": 15, "白石阶段": 10, "黑影赴铜殿": 10, "老徐": 35, "和氏璧": 10, "长生门": 20 },
            "少帅": { "入寺": 10, "阿朱面具": 10, "寇仲与伪装": 25, "老徐归来": 15, "钟楼突破": 20, "长生门": 20 },
            "盗帅": { "崖底三人组": 20, "轻功跳跃": 10, "推开铜殿": 10, "五僧": 25, "和氏璧": 15, "长生门": 20 }
        }
    }
});
this.map = [
    { n: "净念禅宗正门", id: "fb/jingnian/entry", p: [0, 0], exits: ["n"] },
    { n: "净念禅宗主殿", id: "fb/jingnian/zhudian", p: [0, -1], exits: ["s", "n"] },
    { n: "白石广场", id: "fb/jingnian/baishi", p: [0, -2], exits: ["s", "w", "n", "nw", "se", "e"] },
    { n: "崖底", id: "fb/jingnian/yadi", p: [-2, -3], exits: ["e", "n"] },
    { n: "净念后山", id: "fb/jingnian/houshan", p: [-1, -3], exits: ["se", "ne"] },
    { n: "钟楼", id: "fb/jingnian/zhonglou", p: [0, -3], exits: ["s", "e", "sw", "n"] },
    { n: "拦僧道", id: "fb/jingnian/lanlu", p: [1, -3], exits: ["nw", "e"] },
    { n: "铜殿", id: "fb/jingnian/tongdian", p: [2, -3], exits: ["w", "s", "sw"] },
    { n: "长生门", id: "fb/jingnian/changsheng", p: [0, -4], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#wunianchangong", "book/bc#fumozhang", "book/bc#rulaishenzhang", "book/bc#changshengjue", "eq/fb/jingnian/xiedi_sheli", "eq/fb/jingnian/jingang_fumozhang"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#wunianchangong", "book/bc#fumozhang", "book/bc#rulaishenzhang", "book/bc#changshengjue"], odds: 1800 }
    ];
    result.push({ obj: ["eq/fb/jingnian/xiedi_sheli", "eq/fb/jingnian/jingang_fumozhang"], odds: 900 });
    return [result];
};
