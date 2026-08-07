this.inherits(AREA);
this.set({
    id: "guanwai",
    name: "关外雪原",
    desc: "松花江外的雪原人迹罕至，猛兽横行，阎基藏身此处，胡斐也在追查他的踪迹。",
    score: 100,
    is_show: true,
    first: "bj/guanwai/matou",
    is_copy: true,
    expend: 10,
    exp: 9000,
    pot: 6000,
    is_multi: false,
    room_path: "bj/guanwai/",
    ss_title: "雪原行者"
});
this.map = [
    { n: "渡口", id: "bj/guanwai/matou", p: [0, 0], exits: ["n"] },
    { n: "雪林", id: "bj/guanwai/xuelin", p: [0, -1], exits: ["s", "n"] },
    { n: "雪岭", id: "bj/guanwai/xueling", p: [0, -2], exits: ["s", "n"] },
    { n: "山坳", id: "bj/guanwai/shanao", p: [0, -3], exits: ["s", "n"] },
    { n: "药庐", id: "bj/guanwai/yaolu", p: [0, -4], exits: ["s", "e"] },
    { n: "小屋", id: "bj/guanwai/xiaowu", p: [1, -4] }
];
this.drops = [
    "book/bc#hujiadaofa", "book/bc#sixiangbu", "book/bc#lengyueshengong",
    "sp/bj/yanji", "drug/xiongdan", "eq/lv4/chuangwangdao"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 10,
            max: 25
        }, {
            obj: ["res/pimao2", "st/xuanjing"],
            min: 1,
            max: 3
        }, {
            obj: ["book/bc#hujiadaofa", "book/bc#sixiangbu", "book/bc#lengyueshengong"],
            odds: 4500
        }, {
            obj: "eq/lv4/chuangwangdao",
            odds: 900
        }, {
            obj: "drug/xiongdan",
            odds: 1200
        }
    ]];
}
this.on_quick_over = function (me) {
    if (!me.query_temp("fb/guanwai/hu")) {
        me.set_temp("fb/guanwai/hu", 1);
    }
}
