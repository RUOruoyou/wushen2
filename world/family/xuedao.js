this.inherits(FAMILY);

this.id = "XUEDAO";
this.name = "血刀门";
this.top_name = "血刀门首席弟子";
this.top_family = "雪山血海";
this.can_battle = true;

this.def_npcs = [
    ["xuedao/dizi", "xuedao/shanmen"],
    ["xuedao/shouwei", "xuedao/wangxuelou"],
    ["pub/mpguanli#XUEDAO", "xuedao/shanmen"],
    ["pub/dadizi#XUEDAO", "xuedao/liangong"],
    ["xuedao/daoseng", "xuedao/jiedaotang"],
    ["xuedao/shanyong", "xuedao/xuedaochi"],
    ["xuedao/baoxiang", "xuedao/dadian"],
    ["xuedao/laozu", "xuedao/mishi"]
];

this.boss_path = "xuedao/laozu";
this.boss_guard = ["xuedao/mishi", "xuedao/houshan", "xuedao/dadian"];
this.guard_rooms = ["xuedao/shanmen", "xuedao/shijie", "xuedao/xuelu", "xuedao/liangong", "xuedao/xuedaochi", "xuedao/jiedaotang", "xuedao/houyuan"];

this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 18) return isbad ? "小妖女" : "小师妹";
        else if (age < 50) return isbad ? "妖女" : "师姐";
        return isbad ? "老妖婆" : "前辈";
    }
    if (age < 20) return isbad ? "小贼" : "小师弟";
    else if (age < 50) return isbad ? "恶贼" : "师兄";
    return isbad ? "老贼" : "前辈";
}

this.call_me = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 30) return isbad ? "本姑娘" : "小女子";
        return isbad ? "老娘" : "妾身";
    }
    if (age < 50) return isbad ? "老子" : "在下";
    return isbad ? "老夫" : "在下";
}

this.set_titles("血刀老祖", "血刀门护法", "血刀门上师", "血刀门弟子", "血刀门入门弟子");

this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀我门弟子" + npc.name + "，血刀门弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", fam.name + "敢来雪山撒野，老祖便用血刀开路。");
    }
}

this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["blade", 800],
    ["unarmed", 800],
    ["literate", 800],
    ["xuedaoxinfa", 800, "force"],
    ["xuejiedao", 800, ["blade", "parry"]],
    ["xuelingqinna", 800, ["unarmed", "parry"]],
    ["xuehaimogong", 800, "force"],
    ["xuedunbu", 800, "dodge"],
    ["xuedaodaofa", 800, ["blade", "parry"]],
    ["xueyingzhang", 800, ["unarmed", "parry"]],
    ["xuedaojing", 800, ["blade", "parry"]]
];

this.boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["blade", 800],
    ["unarmed", 800],
    ["literate", 800],
    ["xuedaoxinfa", 800, "force"],
    ["xuejiedao", 800, ["blade", "parry"]],
    ["xuelingqinna", 800, ["unarmed", "parry"]],
    ["xuehaimogong", 800, "force"],
    ["xuedunbu", 800, "dodge"],
    ["xuedaodaofa", 800, ["blade", "parry"]],
    ["xueyingzhang", 800, ["unarmed", "parry"]],
    ["xuedaojing", 800, ["blade", "parry"]]
];

this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["blade", 5000],
    ["unarmed", 5000],
    ["xuedaoxinfa", 5000, "force"],
    ["xuejiedao", 5000, ["blade", "parry"]],
    ["xuelingqinna", 5000, ["unarmed", "parry"]],
    ["xuehaimogong", 5000, "force"],
    ["xuedunbu", 5000, "dodge"],
    ["xuedaodaofa", 5000, ["blade", "parry"]],
    ["xueyingzhang", 5000, ["unarmed", "parry"]],
    ["xuedaojing", 5000, ["blade", "parry"]]
];
