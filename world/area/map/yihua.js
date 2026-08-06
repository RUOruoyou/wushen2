this.inherits(FAMILY_AREA);
this.set({
    id: "yihua",
    name: "移花宫",
    desc: "移花宫隐于绣玉谷深处，宫中花木常开，白玉为阶，寒池映月。门下武功讲究身法、内息与借力打力，以明玉功为根基，以移花接玉化敌攻势。",
    sp: "身法灵动，招架反击突出，擅短时控制和卸力反制",
    is_area: true,
    first: "yihua/xiuyugu",
    index: 11,
    room_path: "yihua/",
    family: "YIHUA"
});
this.map = [
    { n: "绣玉谷", id: "yihua/xiuyugu", p: [0, 3], exits: ["n", "e", "w"] },
    { n: "寒玉池", id: "yihua/hanchiyu", p: [-1, 3], exits: ["e", "n", "w"] },
    { n: "寒冰洞", id: "yihua/hanbingdong", p: [-2, 3], exits: ["e"] },
    { n: "密室", id: "yihua/mishi", p: [-1, 2], exits: ["s", "n"] },
    { n: "玉璧", id: "yihua/yubi", p: [-1, 1], exits: ["s"] },
    { n: "花林", id: "yihua/hualin", p: [1, 3], exits: ["w", "e", "n"] },
    { n: "飞花岭", id: "yihua/feihualing", p: [2, 3], exits: ["w"] },
    { n: "摘叶场", id: "yihua/zhaiyechang", p: [1, 2], exits: ["s"] },
    { n: "落英桥", id: "yihua/luoyingqiao", p: [0, 2], exits: ["s", "n"] },
    { n: "移花宫门", id: "yihua/gongmen", p: [0, 1], exits: ["s", "n"] },
    { n: "白玉阶", id: "yihua/baiyujie", p: [0, 0], exits: ["s", "n", "e"] },
    { n: "练功房", id: "yihua/liangong", p: [1, 0], exits: ["w", "e"] },
    { n: "试炼房", id: "yihua/shilianfang", p: [2, 0], exits: ["w"] },
    { n: "玉花廊", id: "yihua/yuhualang", p: [0, -1], exits: ["s", "n", "e", "w"] },
    { n: "听月小筑", id: "yihua/tingyue", p: [1, -1], exits: ["w", "e"] },
    { n: "水榭", id: "yihua/shuixie", p: [2, -1], exits: ["w"] },
    { n: "怜星阁", id: "yihua/lianxingge", p: [-1, -1], exits: ["e", "w"] },
    { n: "星月坪", id: "yihua/xingyueping", p: [-2, -1], exits: ["e"] },
    { n: "绣玉厅", id: "yihua/xiuyuting", p: [0, -2], exits: ["s", "n", "e", "w"] },
    { n: "清心室", id: "yihua/qingxinshi", p: [-1, -2], exits: ["e"] },
    { n: "望月楼", id: "yihua/wangyuelou", p: [1, -2], exits: ["w"] },
    { n: "邀月殿", id: "yihua/yaoyuedian", p: [0, -3], exits: ["s", "n"] },
    { n: "寒玉室", id: "yihua/hanyiushi", p: [0, -4], exits: ["s"] }
];
