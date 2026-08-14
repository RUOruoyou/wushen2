this.inherits(AREA);
this.set({
    id: "guangmingding",
    name: "光明顶",
    desc: "光明顶救援灭绝与五旗支路副本，号令层数记录在副本实例内。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 28,
    exp: 27000,
    pot: 16000,
    is_multi: true,
    is_diffi: false,
    room_path: "fb/guangmingding/",
    first: "fb/guangmingding/entry",
    ss_title: "光明顶",
    fb_routes:     {
        "normal": {
            "default": {
                "冷谦": 5, "张中": 5, "周颠": 5,
                "颜垣": 5, "闻苍松": 5, "庄铮": 5, "辛然": 5, "唐洋": 5,
                "韦一笑": 5, "殷天正": 5,
                "救灭绝": 15,
                "光明左使": 10, "光明右使": 10,
                "张无忌": 15
            }
        }
    }
});
this.start_order_battle = function (room, me, battleId, allyPath) {
    const state = room && room.query_fb_state ? room.query_fb_state(me) : null;
    if (!state || state.failed) return false;
    if (!state.guangmingdingBattles) state.guangmingdingBattles = {};
    if (state.guangmingdingBattles[battleId]) return false;
    const enemies = room.items.filter(item => item && item.path === "fb/guangmingding/mingjiao_dizi" && item.hp > 0);
    const allies = room.items.filter(item => item && item.path === allyPath && item.hp > 0);
    const count = Math.min(enemies.length, allies.length);
    if (!count) return false;
    state.guangmingdingBattles[battleId] = 1;
    for (let index = 0; index < count; index++) {
        if (typeof enemies[index].do_kill === "function") enemies[index].do_kill(allies[index]);
    }
    room.notify("明教守众已向六大门派援军杀去，快出手救人！");
    return true;
};
this.map = [
    { n: "光明顶入口", id: "fb/guangmingding/entry", p: [0, 0], exits: ["n"] },
    { n: "半山亭", id: "fb/guangmingding/banshanting", p: [0, -1], exits: ["s", "n"] },
    { n: "半山腰", id: "fb/guangmingding/banshanyao", p: [0, -2], exits: ["s", "n"] },
    { n: "林间小屋", id: "fb/guangmingding/linjian", p: [0, -3], exits: ["s", "n"] },
    { n: "光明顶", id: "fb/guangmingding/ding", p: [0, -4], exits: ["s", "w", "e", "n"] },
    { n: "厚土旗", id: "fb/guangmingding/houtu", p: [-1, -4], exits: ["e", "w"] },
    { n: "巨木旗", id: "fb/guangmingding/jumu", p: [-2, -4], exits: ["e", "w"] },
    { n: "锐金旗", id: "fb/guangmingding/ruijin", p: [-3, -4], exits: ["e"] },
    { n: "练武场", id: "fb/guangmingding/lianwu", p: [1, -4], exits: ["w", "e"] },
    { n: "烈火旗", id: "fb/guangmingding/liehuo", p: [2, -4], exits: ["w", "e"] },
    { n: "洪水旗", id: "fb/guangmingding/hongshui", p: [3, -4], exits: ["w"] },
    { n: "圣火堂", id: "fb/guangmingding/shenghuotang", p: [0, -5], exits: ["s", "n", "w", "e"] },
    { n: "光明左使", id: "fb/guangmingding/zuoshi", p: [-1, -5], exits: ["e"] },
    { n: "光明右使", id: "fb/guangmingding/youshi", p: [1, -5], exits: ["w"] },
    { n: "圣火坛", id: "fb/guangmingding/shenghuotan", p: [0, -6], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#shenghuoshengong", "book/bc#sixiangbu", "book/bc#baguaquan", "book/bc#yunlongjian", "book/bc#longxianggong", "book/bc#douzhuanxingyi", "eq/fb/guangmingding/shenghuoling", "eq/fb/guangmingding/zhouzhiruo_shouhuan", "eq/fb/guangmingding/yangbuhui_xianglian", "eq/fb/guangmingding/zhaomin_jiezhi", "eq/fb/guangmingding/weiyixiao_taomingxie", "eq/fb/guangmingding/yitianjian"];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#shenghuoshengong", "book/bc#sixiangbu", "book/bc#baguaquan", "book/bc#yunlongjian", "book/bc#longxianggong", "book/bc#douzhuanxingyi"], odds: 1800 },
        { obj: ["eq/fb/guangmingding/shenghuoling", "eq/fb/guangmingding/zhouzhiruo_shouhuan", "eq/fb/guangmingding/yangbuhui_xianglian", "eq/fb/guangmingding/zhaomin_jiezhi", "eq/fb/guangmingding/weiyixiao_taomingxie", "eq/fb/guangmingding/yitianjian"], odds: 1000 }
    ]];
};
