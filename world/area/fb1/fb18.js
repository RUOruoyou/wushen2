this.inherits(AREA);
this.set({
    id: "taishan",
    name: "泰山",
    desc: "泰山派的所在地，山势陡峭，守关弟子沿着山道阻拦来客。",
    score: 100,
    is_show: true,
    first: "fb/taishan/shanmen",
    is_copy: true,
    expend: 10,
    record_index: 17,
    exp: 16000,
    pot: 10500,
    is_multi: false,
    room_path: "fb/taishan/",
    ss_title: "泰山登顶"
});
this.map = [
    { n: "山门", id: "fb/taishan/shanmen", p: [0, 0], exits: ["n"] },
    { n: "山道", id: "fb/taishan/shandao", p: [0, -1], exits: ["s", "n"] },
    { n: "中途", id: "fb/taishan/zhongtu", p: [0, -2], exits: ["s", "n"] },
    { n: "山腰", id: "fb/taishan/shanyao", p: [0, -3], exits: ["s", "n"] },
    { n: "绝顶", id: "fb/taishan/jueding", p: [0, -4], exits: ["s", "n"] },
    { n: "峰顶", id: "fb/taishan/fengding", p: [0, -5] }
];
this.drops = [
    "eq/lv3/taishan_dengshanxue", "eq/lv3/panshi_hufu",
    "book/bc#taishanquanfa", "book/bc#taishanjianfa", "book/bc#panshishengong"
];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 25, max: 45 },
        { obj: ["book/bc#taishanquanfa", "book/bc#taishanjianfa", "book/bc#panshishengong"], odds: 3600 },
        { obj: ["eq/lv3/taishan_dengshanxue", "eq/lv3/panshi_hufu"], odds: 1800 },
        { obj: "st/xuanjing", min: 1, max: 3, odds: 2600 }
    ]];
};
