this.inherits(FAMILY_AREA);
this.set({
    id: "mingjiao",
    name: "明教",
    desc: "明教总坛坐落昆仑光明顶，圣火坛与五行旗拱卫大殿，地下密道中藏有历代教主参悟乾坤大挪移的石室。",
    sp: "攻防转换灵活，擅长反击、恢复、状态压制和持续作战",
    is_area: true,
    first: "mingjiao/kunlunshanjiao",
    index: 13,
    room_path: "mingjiao/",
    family: "MINGJIAO"
});
this.map = [
    { n: "昆仑山脚", id: "mingjiao/kunlunshanjiao", p: [0, 5], exits: ["n"] },
    { n: "光明山道", id: "mingjiao/guangmingshandao", p: [0, 4], exits: ["s", "n", "w"] },
    { n: "碧水寒潭", id: "mingjiao/bishuihantan", p: [-1, 4], exits: ["e"] },
    { n: "明教山门", id: "mingjiao/shanmen", p: [0, 3], exits: ["s", "n"] },
    { n: "五行旗校场", id: "mingjiao/wuxingqixiaochang", p: [0, 2], exits: ["s", "n", "e", "w"] },
    { n: "烈火旗营", id: "mingjiao/liehuoqiying", p: [1, 2], exits: ["w"] },
    { n: "锐金旗营", id: "mingjiao/ruijinqiying", p: [-1, 2], exits: ["e"] },
    { n: "天微堂", id: "mingjiao/tianweitang", p: [0, 1], exits: ["s", "n", "e", "w"] },
    { n: "鹰王堂", id: "mingjiao/yingwangtang", p: [1, 1], exits: ["w"] },
    { n: "蝠王洞", id: "mingjiao/fuwangdong", p: [-1, 1], exits: ["e"] },
    { n: "紫微堂", id: "mingjiao/ziweitang", p: [0, 0], exits: ["s", "n", "e", "w"] },
    { n: "狮王堂", id: "mingjiao/shiwangtang", p: [-1, 0], exits: ["e"] },
    { n: "光明左使殿", id: "mingjiao/guangmingzuoshidian", p: [1, 0], exits: ["w"] },
    { n: "圣火坛", id: "mingjiao/shenghuotan", p: [0, -1], exits: ["s", "n", "e", "w"] },
    { n: "练武场", id: "mingjiao/lianwuchang", p: [1, -1], exits: ["w"] },
    { n: "藏经室", id: "mingjiao/cangjingshi", p: [-1, -1], exits: ["e"] },
    { n: "光明顶大殿", id: "mingjiao/guangmingding", p: [0, -2], exits: ["s", "n"] },
    { n: "后殿", id: "mingjiao/houdian", p: [0, -3], exits: ["s", "n", "e", "w"] },
    { n: "龙王堂", id: "mingjiao/daiqisitang", p: [-1, -3], exits: ["e"] },
    { n: "教主静室", id: "mingjiao/zhangwujishi", p: [1, -3], exits: ["w"] },
    { n: "明教密道", id: "mingjiao/midao", p: [0, -4], exits: ["s", "n", "e"] },
    { n: "阳顶天遗室", id: "mingjiao/yangdingtianyishi", p: [1, -4], exits: ["w"] },
    { n: "乾坤石室", id: "mingjiao/qiankunshishi", p: [0, -5], exits: ["s"] }
];
