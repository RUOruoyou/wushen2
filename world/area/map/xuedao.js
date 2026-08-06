this.inherits(FAMILY_AREA);
this.set({
    id: "xuedao",
    name: "血刀门",
    desc: "雪山深处的邪派刀门，门人奉血刀为尊，刀法狠辣诡谲，内功阴寒霸道，轻功则取雪地潜行之势。",
    first: "xuedao/shanmen",
    is_area: true,
    index: 12,
    room_path: "xuedao/",
    sp: "刀法凶狠，擅长流血追伤，内功偏攻守与续战",
    family: "XUEDAO"
});
this.map = [
    { n: "山门", id: "xuedao/shanmen", p: [0, 0], exits: ["n"] },
    { n: "石阶", id: "xuedao/shijie", p: [0, -1], exits: ["s", "n", "e", "w"] },
    { n: "望雪楼", id: "xuedao/wangxuelou", p: [-1, -1], exits: ["e"] },
    { n: "风雪坡", id: "xuedao/fengxuepo", p: [1, -1], exits: ["w", "n"] },
    { n: "雪径", id: "xuedao/xuelu", p: [0, -2], exits: ["s", "n", "e", "w"] },
    { n: "练功场", id: "xuedao/liangong", p: [1, -2], exits: ["w"] },
    { n: "兵库", id: "xuedao/bingku", p: [-1, -2], exits: ["e", "w"] },
    { n: "戒刀堂", id: "xuedao/jiedaotang", p: [-2, -2], exits: ["e"] },
    { n: "血刀大殿", id: "xuedao/dadian", p: [0, -3], exits: ["s", "n", "e", "w"] },
    { n: "禅院", id: "xuedao/chanyuan", p: [-1, -3], exits: ["e", "n"] },
    { n: "经堂", id: "xuedao/jingtang", p: [-1, -4], exits: ["s", "e"] },
    { n: "血刀池", id: "xuedao/xuedaochi", p: [1, -3], exits: ["w", "e", "n"] },
    { n: "祭刀台", id: "xuedao/jidaotai", p: [2, -3], exits: ["w"] },
    { n: "冰牢", id: "xuedao/binglao", p: [1, -4], exits: ["s", "w"] },
    { n: "后院", id: "xuedao/houyuan", p: [0, -4], exits: ["s", "n", "e", "w"] },
    { n: "雪岭", id: "xuedao/xueling", p: [1, -5], exits: ["w", "n"] },
    { n: "后山", id: "xuedao/houshan", p: [0, -5], exits: ["s", "n", "e", "w"] },
    { n: "藏经洞", id: "xuedao/cangjingdong", p: [-1, -5], exits: ["e"] },
    { n: "血海密室", id: "xuedao/mishi", p: [0, -6], exits: ["s", "e"] },
    { n: "血海地窟", id: "xuedao/diku", p: [1, -6], exits: ["w", "s"] }
];
