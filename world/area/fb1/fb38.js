this.inherits(AREA);
this.set({
    id: "zhanshendian",
    name: "战神殿",
    desc: "战神殿星宿八卦、三波守卫、普通魔龙剧情与困难踏九重天副本。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 37,
    exp: 36000,
    pot: 20500,
    is_multi: false,
    is_diffi: true,
    room_path: "fb/zhanshendian/",
    first: "fb/zhanshendian/entry",
    ss_title: "战神殿",
    fb_routes:     {
        "1": {
            "default": {
                "星宿八卦": 10, "守卫一": 5, "守卫二": 5, "守卫三": 5, "孤星": 5,
                "祭拜": 5, "水石": 5, "金石": 5, "火石": 5, "木石": 5, "圆盘": 5,
                "剑魂": 5, "战魂": 5, "兵主魂": 5, "刀皇": 10, "蚩尤": 10, "踏九重天": 5
            }
        },
        "normal": {
            "default": {
                "星宿八卦": 20, "守卫一": 10, "守卫二": 10, "守卫三": 10,
                "孤星": 10, "木凤": 15, "魔龙": 15, "完成剧情": 10
            }
        }
    }
});
this.map = [
    { n: "战神殿入口", id: "fb/zhanshendian/entry", p: [0, 0], exits: ["n"] },
    { n: "星宿石室", id: "fb/zhanshendian/xingsu", p: [0, -1], exits: ["s", "n"] },
    { n: "守卫一", id: "fb/zhanshendian/guard1", p: [0, -2], exits: ["s", "n"] },
    { n: "守卫二", id: "fb/zhanshendian/guard2", p: [0, -3], exits: ["s", "n"] },
    { n: "守卫三", id: "fb/zhanshendian/guard3", p: [0, -4], exits: ["s", "n"] },
    { n: "孤星台", id: "fb/zhanshendian/guxing", p: [0, -5], exits: ["s"] },
    { n: "木凤巢", id: "fb/zhanshendian/mufeng", p: [-1, -6], exits: ["n"] },
    { n: "魔龙潭", id: "fb/zhanshendian/molong", p: [-1, -7], exits: ["s", "n"] },
    { n: "乘龙渡河", id: "fb/zhanshendian/finish", p: [-1, -8], exits: ["s"] },
    { n: "神殿祭坛", id: "fb/zhanshendian/shendian", p: [1, -6], exits: ["n", "u", "w", "d", "e"] },
    { n: "魔龙水潭", id: "fb/zhanshendian/shuishi", p: [0, -5], exits: ["d"] },
    { n: "金狴矿坑", id: "fb/zhanshendian/jinkuang", p: [0, -6], exits: ["e"] },
    { n: "融火窟", id: "fb/zhanshendian/ronghuo", p: [2, -5], exits: ["u"] },
    { n: "木凤石阶", id: "fb/zhanshendian/mufeng_hard", p: [2, -6], exits: ["w"] },
    { n: "四元素窟", id: "fb/zhanshendian/elements", p: [1, -7], exits: ["s", "n"] },
    { n: "三魂殿", id: "fb/zhanshendian/souls", p: [1, -8], exits: ["s", "n"] },
    { n: "刀皇殿", id: "fb/zhanshendian/daohuang", p: [1, -9], exits: ["s", "n"] },
    { n: "蚩尤殿", id: "fb/zhanshendian/chiyou_room", p: [1, -10], exits: ["s", "n"] },
    { n: "踏九重天", id: "fb/zhanshendian/jiuzhong", p: [1, -11], exits: ["s"] }
];
this.drops = ["st/xuanjing", "eq/fb/zhanshendian/molong_zhanjia", "eq/fb/zhanshendian/jinbi_guguan", "eq/fb/zhanshendian/mufeng_yuxue", "eq/fb/zhanshendian/huoni_doupeng", "sp/fb/zhanshendian/shenqi_suipian", "book/bc#zhanshentulu"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: "book/bc#zhanshentulu", odds: 1800 }
    ];
    result.push({ obj: ["eq/fb/zhanshendian/molong_zhanjia", "eq/fb/zhanshendian/jinbi_guguan", "eq/fb/zhanshendian/mufeng_yuxue", "eq/fb/zhanshendian/huoni_doupeng", "sp/fb/zhanshendian/shenqi_suipian"], odds: 800 });
    return [result];
};
