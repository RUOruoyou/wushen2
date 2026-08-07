this.inherits(AREA);
this.set({
    id: "lcj",
    name: "连城诀",
    desc: "荆州旧案牵出一段冤狱和宝藏秘闻，万府、大牢、雪谷与天宁寺宝库之间，处处都是人心贪念留下的杀机。",
    score: 100,
    is_show: true,
    first: "fb/lcj/jingzhou",
    is_copy: true,
    expend: 10,
    record_index: 16,
    exp: 19000,
    pot: 12000,
    is_multi: false,
    room_path: "fb/lcj/",
    ss_title: "铁骨孤心"
});
this.map = [
    { n: "荆州城", id: "fb/lcj/jingzhou", p: [0, 0], exits: ["n"] },
    { n: "万府", id: "fb/lcj/wanfu", p: [0, -1], exits: ["s", "n"] },
    { n: "大牢", id: "fb/lcj/dilao", p: [0, -2], exits: ["s", "n"] },
    { n: "荒坟", id: "fb/lcj/huangfen", p: [0, -3], exits: ["s", "n"] },
    { n: "雪谷", id: "fb/lcj/xuegu", p: [0, -4], exits: ["s", "n"] },
    { n: "天宁寺", id: "fb/lcj/tianningsi", p: [0, -5], exits: ["s", "n"] },
    { n: "宝库", id: "fb/lcj/baoku", p: [0, -6] }
];
this.drops = [
    "book/bc#tangshijianfa",
    "book/bc#shenzhaojing",
    "eq/lv3/xuedao",
    "eq/lv3/juhua_yupei",
    "sp/lcj/liancheng_canpian",
    "sp/lcj/baozang_suipian",
    "st/xuanjing",
    "drug/yulu"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 20,
            max: 45
        }, {
            obj: "sp/lcj/baozang_suipian",
            min: 1,
            max: 3
        }, {
            obj: "sp/lcj/liancheng_canpian",
            odds: 3000
        }, {
            obj: ["book/bc#tangshijianfa", "book/bc#shenzhaojing"],
            odds: 3000
        }, {
            obj: ["eq/lv3/xuedao", "eq/lv3/juhua_yupei"],
            odds: 900
        }, {
            obj: ["st/xuanjing", "drug/yulu"],
            odds: 2600
        }
    ]];
}
