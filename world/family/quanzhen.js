this.inherits(FAMILY);

this.id = "QUANZHEN";
this.name = "全真教";
this.top_name = "全真教首席弟子";
this.top_family = "道宗";
this.can_battle = true;
this.def_npcs = [
    ["quanzhen/zhao", "quanzhen/liangong"],
    ["quanzhen/yin", "quanzhen/datang"],
    ["pub/mpguanli#QUANZHEN", "quanzhen/guangchang"],
    ["pub/dadizi#QUANZHEN", "quanzhen/liangong"],
    ["quanzhen/liu", "quanzhen/huizhentang"],
    ["quanzhen/ma", "quanzhen/shiweishi"],
    ["quanzhen/qiu", "quanzhen/wanwutang"],
    ["quanzhen/zhou", "quanzhen/houshan"],
    ["quanzhen/wang", "quanzhen/chongyang"]
];

this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 30) return isbad ? "小妖女" : "仙姑";
        return isbad ? "妖女" : "道姑";
    }
    if (age < 30) return isbad ? "臭牛鼻子" : "道兄";
    return isbad ? "老牛鼻子" : "道长";
}
this.call_me = function (player, isbad) {
    if (player.gender == 2) return isbad ? "本姑娘" : "贫道";
    return isbad ? "本山人" : "贫道";
}

this.set_titles("全真教长老", "全真教第一代弟子", "全真教第二代弟子",
    "全真教第三代弟子", "全真教第四代弟子", "全真教第五代弟子");
this.boss_path = "quanzhen/wang";

this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀我教弟子" + npc.name + "，全真教众弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}

this.on_battle = function () {
    if (this.boss) {
        this.boss.do_command("chat", "无量天尊！");
    }
}

this.boss_guard = ["quanzhen/chongyang", "quanzhen/houshan", "quanzhen/wanwutang"];
this.guard_rooms = ["quanzhen/datang", "quanzhen/liangong", "quanzhen/huizhentang", "quanzhen/shiweishi"];

this.create_name = function (npc) {
    return ["", "", "清", "志", "了", "玄"][npc.family_level] + UTIL.name2[this.random(UTIL.name2.length)];
}

this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["quanzhenxinfa", 800],
    ["quanzhenjian", 800, ["sword", "parry"]],
    ["qixingjian", 800, ["sword", "parry"]],
    ["beidouzhen", 800, "parry"],
    ["jinyangong", 800, "dodge"],
    ["haotianzhang", 800, "unarmed"],
    ["zhongnanzhi", 800, "unarmed"],
    ["xiantiangong", 800, "force"],
    ["chongyangshenzhang", 800, ["unarmed", "parry"]]
];
this.boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["quanzhenxinfa", 800],
    ["quanzhenjian", 800, ["sword", "parry"]],
    ["qixingjian", 800, ["sword", "parry"]],
    ["beidouzhen", 800, "parry"],
    ["jinyangong", 800, "dodge"],
    ["haotianzhang", 800, "unarmed"],
    ["zhongnanzhi", 800, "unarmed"],
    ["xiantiangong", 800, "force"],
    ["chongyangshenzhang", 800, ["unarmed", "parry"]]
];
this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["sword", 5000],
    ["quanzhenjian", 5000, ["sword", "parry"]],
    ["qixingjian", 5000, ["sword", "parry"]],
    ["beidouzhen", 5000, "parry"],
    ["jinyangong", 5000, "dodge"],
    ["xiantiangong", 5000, "force"],
    ["chongyangshenzhang", 5000, ["unarmed", "parry"]]
];
