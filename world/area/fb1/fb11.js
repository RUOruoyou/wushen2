this.inherits(AREA);
this.set({
    id: "longmai",
    name: "龙脉地宫",
    desc: "四十二章经所指向的地宫深处，俑卫与毒蝎守着锁龙井，一条黑龙被封在井底。",
    score: 100,
    is_show: true,
    first: "bj/longmai/rukou",
    is_copy: true,
    expend: 10,
    exp: 10000,
    pot: 7000,
    is_multi: false,
    room_path: "bj/longmai/",
    ss_title: "黑龙使"
});
this.map = [
    { n: "地宫入口", id: "bj/longmai/rukou", p: [0, 0], exits: ["d"] },
    { n: "甬道", id: "bj/longmai/yongdao", p: [0, -1], exits: ["u", "e"] },
    { n: "蝎巢", id: "bj/longmai/xiechao", p: [1, -1], exits: ["w", "n"] },
    { n: "石门", id: "bj/longmai/shimen", p: [1, -2], exits: ["s", "n"] },
    { n: "锁龙井", id: "bj/longmai/suolongjing", p: [1, -3] }
];
this.drops = [
    "book/bc#qinlong", "eq/lv2/lm_jian", "eq/lv2/lm_cloth",
    "eq/lv2/lm_tou", "eq/lv2/lm_shoes", "eq/lv2/lm_pifeng", "sp/bj/zhu"
];
this.query_drops = function () {
    return [[
        {
            obj: "st/xuanjing",
            min: 3,
            max: 8
        }, {
            obj: ["eq/lv2/lm_cloth", "eq/lv2/lm_tou", "eq/lv2/lm_shoes", "eq/lv2/lm_pifeng", "eq/lv2/lm_pei", "eq/lv2/lm_jian"],
            odds: 3000
        }, {
            obj: "book/bc#qinlong",
            odds: 1800
        }, {
            obj: "sp/bj/zhu",
            odds: 1000
        }
    ]];
}
this.on_quick_over = function (me) {
    if (!WORLD.DATA.query_temp('longmai')) {
        WORLD.DATA.set_temp('longmai', 1, UTIL.diff_time(20));
        WORLD.DATA.set_temp("study_per", 50, 3600000 * 2);
    }
}
