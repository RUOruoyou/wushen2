this.inherits(AREA);
this.set({
    id: "piaomiaofeng",
    name: "缥缈峰",
    desc: "缥缈峰保护女童、铁索桥与护送童姥路线副本。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 27,
    exp: 26000,
    pot: 15500,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/piaomiaofeng/",
    first: "fb/piaomiaofeng/entry",
    ss_title: "缥缈峰",
    fb_routes:     {
        "1": {
            "default": {
                "保护女童": 20,
                "卓不凡": 10,
                "背女童": 10,
                "铁索桥": 15,
                "李秋水": 30,
                "送童姥": 15
            }
        },
        "normal": {
            "default": {
                "保护女童": 20,
                "卓不凡": 10,
                "背女童": 10,
                "铁索桥": 15,
                "李秋水": 25,
                "送童姥": 20
            }
        }
    }
});
this.map = [
    { n: "缥缈峰入口", id: "fb/piaomiaofeng/entry", p: [0, 0], exits: ["n"] },
    { n: "断魂崖", id: "fb/piaomiaofeng/duanhunya", p: [0, -1], exits: ["s", "n"] },
    { n: "失足岩", id: "fb/piaomiaofeng/shizuyan", p: [0, -2], exits: ["s", "n"] },
    { n: "铁索桥", id: "fb/piaomiaofeng/tiesuoqiao", p: [0, -3], exits: ["s", "n"] },
    { n: "仙愁门", id: "fb/piaomiaofeng/xianchoumen", p: [0, -4], exits: ["s", "n"] },
    { n: "闭关室", id: "fb/piaomiaofeng/biguanshi", p: [0, -5], exits: ["s"] }
];
this.drops = ["st/xuanjing", "drug/age", "book/bc#shenjianjue", "book/bc#tianyuqijian", "book/bc#bulaochangchungong", "eq/fb/piaomiaofeng/tianlong_yizhu"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: "drug/age", odds: 1800 },
        { obj: ["book/bc#shenjianjue", "book/bc#tianyuqijian", "book/bc#bulaochangchungong"], odds: 1800 }
    ];
    if (isdiff) result.push({ obj: "eq/fb/piaomiaofeng/tianlong_yizhu", odds: 1000 });
    return [result];
};
this.on_leaved = function (me) {
    if (me && me.query_status && me.query_status("fb_piaomiaofeng_carry") && typeof me.remove_status === "function") {
        me.remove_status("fb_piaomiaofeng_carry", true);
    }
};
