this.inherits(FAMILY_AREA);
this.set({
    id: "riyue",
    name: "日月神教",
    desc: "日月神教总坛雄踞黑木崖，吊桥与百步阶层层设防，成德殿、教主大殿和日月神坛俯瞰群山，地底还藏着幽深囚室。",
    sp: "内力压制、控制与高速爆发突出，拥有吸星和辟邪两条顶级路线",
    is_area: true,
    first: "riyue/pingdingzhou",
    index: 14,
    room_path: "riyue/",
    family: "RIYUE"
});
this.map = [
    { n: "平定州", id: "riyue/pingdingzhou", p: [0, 5], exits: ["n"] },
    { n: "渡口", id: "riyue/dukou", p: [0, 4], exits: ["s", "n"] },
    { n: "长滩", id: "riyue/changtan", p: [0, 3], exits: ["s", "n"] },
    { n: "悬空吊桥", id: "riyue/diaoqiao", p: [0, 2], exits: ["s", "n"] },
    { n: "百步阶", id: "riyue/bubaijie", p: [0, 1], exits: ["s", "n"] },
    { n: "黑木崖山门", id: "riyue/shanmen", p: [0, 0], exits: ["s", "n"] },
    { n: "练武场", id: "riyue/lianwuchang", p: [0, -1], exits: ["s", "n", "e", "w"] },
    { n: "青龙堂", id: "riyue/qinglongtang", p: [-1, -1], exits: ["e"] },
    { n: "白虎堂", id: "riyue/baihutang", p: [1, -1], exits: ["w"] },
    { n: "黑木崖", id: "riyue/heimuya", p: [0, -2], exits: ["s", "n", "e", "w"] },
    { n: "向问天居", id: "riyue/xiangwentianju", p: [-1, -2], exits: ["e"] },
    { n: "听琴堂", id: "riyue/tingqintang", p: [1, -2], exits: ["w"] },
    { n: "成德殿", id: "riyue/chengdedian", p: [0, -3], exits: ["s", "n", "e", "w"] },
    { n: "地牢", id: "riyue/dilao", p: [-1, -3], exits: ["e", "n"] },
    { n: "长廊", id: "riyue/zoulang", p: [1, -3], exits: ["w", "e"] },
    { n: "小花园", id: "riyue/xiaohuayuan", p: [2, -3], exits: ["w", "n"] },
    { n: "教主大殿", id: "riyue/jiaozhudadian", p: [0, -4], exits: ["s", "n"] },
    { n: "地底密道", id: "riyue/didao", p: [-1, -4], exits: ["s", "n", "w"] },
    { n: "任我行囚室", id: "riyue/renwoxingqiushi", p: [-2, -4], exits: ["e"] },
    { n: "内室", id: "riyue/neishi", p: [2, -4], exits: ["s", "n"] },
    { n: "日月神坛", id: "riyue/riyueshentan", p: [0, -5], exits: ["s"] },
    { n: "思过密室", id: "riyue/siguomishi", p: [-1, -5], exits: ["s"] },
    { n: "东方静室", id: "riyue/dongfangjingshi", p: [2, -5], exits: ["s"] }
];
