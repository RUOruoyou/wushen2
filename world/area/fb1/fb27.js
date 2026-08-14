this.inherits(AREA);
this.set({
    id: "heimuya",
    name: "黑木崖",
    desc: "黑木崖三堂、吊篮和密道路线副本，困难模式会让三堂长老同时守崖。",
    score: 100,
    is_show: true,
    is_copy: true,
    expend: 10,
    record_index: 26,
    exp: 25000,
    pot: 15000,
    is_multi: true,
    is_diffi: true,
    room_path: "fb/heimuya/",
    first: "fb/heimuya/entry",
    ss_title: "黑木崖",
    fb_routes:     {
        "1": {
            "default": {
                "吊篮一": 5,
                "吊篮二": 5,
                "吊篮三": 5,
                "上官云": 10,
                "贾布": 10,
                "童百熊": 10,
                "杨莲亭一": 10,
                "密道链": 15,
                "杨莲亭二": 10,
                "东方不败": 20
            }
        },
        "normal": {
            "default": {
                "上官云": 10,
                "贾布": 10,
                "童百熊": 10,
                "吊篮一": 5,
                "吊篮二": 5,
                "吊篮三": 5,
                "杨莲亭一": 10,
                "密道链": 15,
                "杨莲亭二": 10,
                "东方不败": 20
            }
        }
    }
});
this.map = [
    { n: "黑木崖入口", id: "fb/heimuya/entry", p: [0, 0], exits: ["n", "e"] },
    { n: "白虎堂", id: "fb/heimuya/baihutang", p: [-1, -1], exits: ["s", "e"] },
    { n: "青龙堂", id: "fb/heimuya/qinglongtang", p: [1, -1], exits: ["s", "w", "e"] },
    { n: "风雷堂", id: "fb/heimuya/fengleitang", p: [2, -1], exits: ["w", "e"] },
    { n: "吊篮一", id: "fb/heimuya/diaolan1", p: [3, -1], exits: ["w", "e"] },
    { n: "吊篮二", id: "fb/heimuya/diaolan2", p: [4, -1], exits: ["w", "e"] },
    { n: "吊篮三", id: "fb/heimuya/diaolan3", p: [5, -1], exits: ["w", "e"] },
    { n: "黑木崖大门", id: "fb/heimuya/damen", p: [6, -1], exits: ["w", "e"] },
    { n: "杨莲亭一", id: "fb/heimuya/yang1", p: [7, -1], exits: ["w", "e"] },
    { n: "密道入口", id: "fb/heimuya/midao", p: [8, -1], exits: ["w", "e"] },
    { n: "杨莲亭二", id: "fb/heimuya/yang2", p: [9, -1], exits: ["w", "e"] },
    { n: "东方闺房", id: "fb/heimuya/dongfang", p: [10, -1], exits: ["w"] }
];
this.drops = ["st/xuanjing", "book/bc#xuantiejianfa", "book/bc#kuihuashengong", "eq/fb/heimuya/shangguanyun_pifeng", "eq/fb/heimuya/tongbaixiong_jiezhi", "eq/fb/heimuya/yanglianting_xiangquan", "eq/fb/heimuya/jiabu_yaodai", "eq/fb/heimuya/dongfang_xiuhuazhen"];
this.query_drops = function (isdiff) {
    const result = [
        { obj: "money/silver", min: 35, max: 70 },
        { obj: "st/xuanjing", min: 2, max: 5, odds: 2500 },
        { obj: ["book/bc#xuantiejianfa", "book/bc#kuihuashengong"], odds: 1800 }
    ];
    result.push({ obj: ["eq/fb/heimuya/shangguanyun_pifeng", "eq/fb/heimuya/tongbaixiong_jiezhi", "eq/fb/heimuya/yanglianting_xiangquan", "eq/fb/heimuya/jiabu_yaodai", "eq/fb/heimuya/dongfang_xiuhuazhen"], odds: 900 });
    return [result];
};
