this.inherits(AREA);
this.set({
    id: "xuedaomen",
    name: "血刀门",
    desc: "血刀门四次转移与山谷决战副本，老祖只能在终点被击败。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 30,
    exp: 29000,
    pot: 17000,
    is_multi: true,
    is_diffi: false,
    room_path: "fb/xuedaomen/",
    first: "fb/xuedaomen/entry",
    ss_title: "血刀门",
    fb_routes:     {
        "normal": {
            "default": {
                "拦路弟子": 10,
                "落水转移": 15,
                "水牢转移": 15,
                "忘忧谷转移": 15,
                "最终转移": 15,
                "老祖到谷": 10,
                "血刀老祖": 20
            }
        }
    }
});
this.map = [
    { n: "血刀门入口", id: "fb/xuedaomen/entry", p: [0, 0], exits: ["n"] },
    { n: "山洞", id: "fb/xuedaomen/shandong", p: [0, -1], exits: ["s", "n"] },
    { n: "洞口", id: "fb/xuedaomen/dongkou", p: [0, -2], exits: ["s", "n"] },
    { n: "忘忧谷", id: "fb/xuedaomen/wangyougu", p: [0, -3], exits: ["s", "n"] },
    { n: "山谷", id: "fb/xuedaomen/shangu", p: [0, -4], exits: ["s"] }
];
this.drops = ["st/xuanjing", "book/bc#chuanyunzong", "book/bc#shenzhaojing", "book/bc#huagongdafa", "book/bc#hujiadaofa", "eq/fb/xuedaomen/xuedao", "eq/fb/xuedaomen/longxue_doupeng"];
this.query_drops = function () {
    return [[
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#chuanyunzong", "book/bc#shenzhaojing", "book/bc#huagongdafa", "book/bc#hujiadaofa"], odds: 1800 },
        { obj: ["eq/fb/xuedaomen/xuedao", "eq/fb/xuedaomen/longxue_doupeng"], odds: 1000 }
    ]];
};
