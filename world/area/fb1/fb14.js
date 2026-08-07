this.inherits(AREA);
this.set({
    id: "hengshan",
    name: "恒山",
    desc: "恒山山门清冷，藏经阁却遭黑衣人潜入。守住经卷后，白云庵中仍有一场掌法考验。",
    score: 100,
    is_show: true,
    first: "fb/hengshan/shanmen",
    is_copy: true,
    expend: 10,
    exp: 13000,
    pot: 9000,
    is_multi: false,
    room_path: "fb/hengshan/",
    ss_title: "白云客"
});
this.map = [
    { n: "山门", id: "fb/hengshan/shanmen", p: [0, 0], exits: ["n"] },
    { n: "松林", id: "fb/hengshan/songlin", p: [0, -1], exits: ["s", "n"] },
    { n: "藏经阁", id: "fb/hengshan/cangjing", p: [0, -2], exits: ["s", "n"] },
    { n: "回廊", id: "fb/hengshan/huilang", p: [0, -3], exits: ["s", "n"] },
    { n: "戒台", id: "fb/hengshan/jietai", p: [0, -4], exits: ["s", "n"] },
    { n: "白云庵", id: "fb/hengshan/baiyunan", p: [0, -5] }
];
this.drops = [
    "book/bc#baiyunxinfa", "book/bc#tianchangzhang",
    "book/bc#hengshanshenfa", "book/bc#hengshanjianfa", "book/bc#kuangfengkuaidao",
    "eq/lv2/hsn_cloth", "eq/lv2/hsn_shoes", "eq/lv2/hsn_zhu", "eq/lv2/hsn_ring",
    "eq/lv2/kuangfengdao", "eq/lv2/tbguang",
    "book/book#force", "book/book#unarmed", "book/book#sword", "drug/yulu", "st/xuanjing"
];
this.query_drops = function () {
    return [[
        {
            obj: "money/silver",
            min: 14,
            max: 32
        }, {
            obj: ["book/bc#baiyunxinfa", "book/bc#tianchangzhang", "book/bc#hengshanshenfa", "book/bc#hengshanjianfa", "book/bc#kuangfengkuaidao"],
            odds: 4200
        }, {
            obj: ["book/book#force", "book/book#unarmed", "book/book#sword"],
            odds: 1800
        }, {
            obj: ["eq/lv2/hsn_cloth", "eq/lv2/hsn_shoes", "eq/lv2/hsn_zhu", "eq/lv2/hsn_ring", "eq/lv2/kuangfengdao", "eq/lv2/tbguang"],
            odds: 2200
        }, {
            obj: "drug/yulu",
            odds: 1600
        }, {
            obj: "st/xuanjing",
            min: 1,
            max: 3
        }
    ]];
}
