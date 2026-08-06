this.inherits(AREA);
this.set({
    id: "wenfu",
    name: "温府",
    desc: "温家大宅内外戒备森严，温家五老守着金蛇旧事，后园石窟中还藏着一只金蛇秘匣。",
    score: 100,
    is_show: true,
    first: "fb/wenfu/damen",
    is_copy: true,
    expend: 10,
    exp: 11000,
    pot: 8000,
    is_multi: false,
    room_path: "fb/wenfu/",
    ss_title: "金蛇客"
});
this.map = [
    { n: "大门", id: "fb/wenfu/damen", p: [0, 0], exits: ["n"] },
    { n: "前厅", id: "fb/wenfu/qianting", p: [0, -1], exits: ["s", "n", "e"] },
    { n: "后园", id: "fb/wenfu/houyuan", p: [1, -1], exits: ["w"] },
    { n: "偏院", id: "fb/wenfu/pianting", p: [0, -2], exits: ["s", "n"] },
    { n: "石窟", id: "fb/wenfu/shiku", p: [0, -3], exits: ["s", "n"] },
    { n: "密室", id: "fb/wenfu/mishi", p: [0, -4] }
];
this.drops = [
    "book/bc#jinshezhang", "book/bc#wuduyanluobu", "eq/lv1/jinshezhui",
    "eq/lv2/js_zhui", "eq/lv2/js_ring", "eq/lv2/js_pifeng", "eq/lv2/js_nang"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 12,
            max: 28
        }, {
            obj: ["book/bc#jinshezhang", "book/bc#wuduyanluobu"],
            odds: 4200
        }, {
            obj: ["eq/lv1/jinshezhui", "eq/lv2/js_zhui", "eq/lv2/js_ring", "eq/lv2/js_pifeng", "eq/lv2/js_nang"],
            odds: 2400
        }, {
            obj: "st/xuanjing",
            min: 2,
            max: 5
        }
    ]];
}
