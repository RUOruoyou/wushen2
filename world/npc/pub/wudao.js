this.inherits(NPC);
this.set({
    name: "",
    desc: "他是武道塔的神秘守护者",
    title: "武道塔守护者",
    gender: 1,
    age: 25,
    per: this.random(44),
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,
    no_refresh: true,
    no_fight: true
});

const WUDAO_COMBAT_FLOORS = [
    null, null, null, null,
    { gj: 6000, mz: 9000, ds: 4500, zj: 6500, fy: 4500 },
    { gj: 8000, mz: 11000, ds: 6500, zj: 8500, fy: 6500 },
    { gj: 10500, mz: 13000, ds: 8500, zj: 10500, fy: 8500 },
    { gj: 13000, mz: 15000, ds: 12000, zj: 13000, fy: 10500 },
    { gj: 16000, mz: 17500, ds: 14000, zj: 16000, fy: 13000 },
    { gj: 22000, mz: 20000, ds: 17500, zj: 19500, fy: 16000 },
    { gj: 25000, mz: 24000, ds: 21000, zj: 23000, fy: 20000 }
];

this.combat_floors = WUDAO_COMBAT_FLOORS;

this.apply_combat_floor = function (level) {
    const combatFloor = this.combat_floors[Math.floor(level / 10)];
    if (!combatFloor) return;
    for (const prop of ["gj", "mz", "ds", "zj", "fy"]) {
        const missing = combatFloor[prop] - this[prop];
        if (missing > 0) this.add_prop(prop, Math.ceil(missing));
    }
    this.recount();
}

this.init_from = function (player, level) {
    this.con = this.dex = this.int = this.str = 20 + parseInt(level / 3);
    if (level > 100) level = 100;
    const grade1 = Math.floor(level / 10);
    this.name = UTIL.random_name(this.gender);
    this.skill_map.apply(this, this.skills_def[grade1]);
    var color = ["hig", "hic", "hiy", "hiz", "hio", "ora"][parseInt(level / 20)];
    this.title = "<" + color + ">武道塔守护者</" + color + ">";
    this.set_objects(['eq/lv0/cloth', 1, 1], ["eq/lv0/jian", 1, 1]);

    this.hp = this.max_hp = 1000 + level * level * 150;
    this.mp = this.max_mp = parseInt(this.hp / 2);
    this.init();
    this.recount();
    this.apply_combat_floor(level);

}


this.skills_def = [
    [
        ["force", 100], ["unarmed", 100], ["sword", 100], ["parry", 100], ["dodge", 100],
        ["hunyuanyiqi", 100, "force"], ["wudangchangquan", 100, "unarmed"], ["yixingbufa", 100, "dodge"],
        ["wudangjianfa", 100, "sword"], ["zhemeishou", 100, "parry"]
    ],
    [
        ["force", 300], ["unarmed", 300], ["sword", 300], ["parry", 300], ["dodge", 300],
        ["zixiashengong", 300, "force"], ["taizuchangquan", 300, "unarmed"],
        ["yunlongjian", 300, "sword"], ["taijiquan", 300, "parry"], ["sixiangbu", 300, "dodge"],
    ],
    [
        ["force", 500], ["unarmed", 500], ["sword", 500], ["parry", 500], ["dodge", 500],
        ["taijishengong", 500, "force"], ["qishangquan", 500, "unarmed"],
        ["kuangfengkuaijian", 500, "sword"], ["taijiquan", 500, "parry"], ["tiyunzong", 500, "dodge"],
    ],
    [
        ["force", 800], ["unarmed", 800], ["sword", 800], ["parry", 800], ["dodge", 800],
        ["yijinjing", 800, "force"], ["yiyangzhi", 800, "unarmed"],
        ["taijijian", 800, "sword"], ["dugujiujian", 800, "parry"], ["wuduyanluobu", 800, "dodge"],
    ],
    [
        ["force", 1100], ["unarmed", 1100], ["sword", 1100], ["parry", 1100], ["dodge", 1100],
        ["mingyugong", 1100, "force"], ["yiyangzhi", 1100, "unarmed"],
        ["yitianjianfa", 1100, "sword"], ["yihuajieyu", 1100, ["parry", "dodge"]]
    ],
    [
        ["force", 1400], ["unarmed", 1400], ["sword", 1400], ["parry", 1400], ["dodge", 1400],
        ["hamagong", 1400, "force"], ["tanzhishentong", 1400, "unarmed"],
        ["tianyuqijian", 1400, "sword"], ["taijiquan", 1400, "parry"], ["kuihuashengong", 1400, "dodge"],
    ],
    [
        ["force", 1700], ["unarmed", 1700], ["sword", 1700], ["parry", 1700], ["dodge", 1700],
        ["kuihuashengong", 1700, ["force", "dodge"]], ["canhezhi", 1700, "unarmed"],
        ["bianjianfa", 1700, ["sword", "parry"]]
    ],
    [
        ["force", 2000], ["unarmed", 2000], ["sword", 2000], ["parry", 2000], ["dodge", 2000],
        ["jiuyangshengong", 2000, "force"], ["rulaishenzhang", 2000, "unarmed"],
        ["dugujiujian", 2000, "sword"], ["taijiquan", 2000, "parry"], ["kuihuashengong", 2000, "dodge"],
    ],
    [
        ["force", 2500], ["unarmed", 2500], ["sword", 2500], ["parry", 2500], ["dodge", 2500],
        ["taixuangong", 2500, "force"], ["rulaishenzhang", 2500, "unarmed"],
        ["xuantiejianfa", 2500, "sword"], ["taijiquan", 2500, "parry"], ["xuanxubu", 2500, "dodge"],
    ],
    [
        ["force", 3000], ["unarmed", 3000], ["sword", 3000], ["parry", 3000], ["dodge", 3000],
        ["jiuyinshengong", 3000, "force"], ["sanyinwugongzhao", 3000, "unarmed"],
        ["taijijian", 3000, "sword"], ["qiankundanuoyi", 3000, "parry"], ["lingxibu", 3000, "dodge"],
    ],
    [
        ["force", 4000], ["unarmed", 4000], ["sword", 4000], ["parry", 4000], ["dodge", 4000],
        ["jiuyangshengong", 5000, "force"], ["liumaishenjian", 5000, "unarmed"],
        ["xuantiejianfa", 5000, "sword"], ["qiankundanuoyi", 5000, "parry"], ["lingxibu", 5000, "dodge"],
    ]
];
