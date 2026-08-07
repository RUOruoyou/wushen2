this.inherits(AREA);
this.set({
    id: "tdh",
    name: "天地会",
    desc: "天地会在北京城的青木堂所在，据说在入口在一家药铺里面",
    score: 100,
    is_show: true,
    first: "bj/tdh/hct",
    is_copy: true,
    expend: 10,
    exp: 6000,
    pot: 4000,
    is_multi: false,
    room_path: "bj/tdh/",
    ss_title: "青木堂香主"
});
this.map = [
    { n: "暗道入口", id: "bj/tdh/andao1", p: [0, 0], exits: ["w"] },
    { n: "内室", id: "bj/tdh/neishi", p: [0, -1], exits: ["s1d"] },
    { n: "回春堂", id: "bj/tdh/hct", p: [1, -1], exits: ["w"] },
    { n: "曲折暗道", id: "bj/tdh/andao", p: [-1, 0], exits: ["w"] },
    { n: "暗道出口", id: "bj/tdh/andao2", p: [-2, 0], exits: ["n"] },
    { n: "青木堂", id: "bj/tdh/dating", p: [-2, -1], exits: ["n", "e"] },
    { n: "侧厅", id: "bj/tdh/ceting", p: [-1, -1] },
    { n: "客店后院", id: "bj/tdh/kedian", p: [-2, -2], exits: ["e"] },
    { n: "东客房", id: "bj/tdh/kedian3", p: [-1, -2] }
];
this.drops = [
    "book/bc#mizongxinfa", "book/bc#dashouyin", "book/bc#houquan", "book/bc#yunlongjian", "book/bc#yunlongshenfa", "book/bc#yunlongxinfa",
    "book/bc#shenxingbaibian", "book/bc#qiufengfuchen", "eq/lv2/yunlongjian"
];

this.quick_drops = [
    {
        obj: "money/silver",
        min: 10,
        max: 20
    }, {
        obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv1/fuchen"],
        odds: 8000
    }, {
        obj: ["book/bc#mizongxinfa", "book/bc#dashouyin", "book/bc#houquan", "book/bc#yunlongjian", "book/bc#yunlongshenfa", "book/bc#yunlongxinfa", "book/bc#shenxingbaibian", "book/bc#qiufengfuchen"],
        odds: 5000
    }, {
        obj: "eq/lv2/yunlongjian",
        odds: 1000
    }, {
        obj: "st/xuanjing",
        min: 1,
        max: 3
    }
];
