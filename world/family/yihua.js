this.inherits(FAMILY);

this.id = "YIHUA";
this.name = "移花宫";
this.top_name = "移花宫首席弟子";
this.top_family = "绣玉谷";
this.can_battle = true;

this.def_npcs = [
    ["yihua/gongnv", "yihua/gongmen"],
    ["pub/dadizi#YIHUA", "yihua/xiuyuting"],
    ["pub/mpguanli#YIHUA", "yihua/xiuyuting"],
    ["yihua/huawuque", "yihua/tingyue"],
    ["yihua/lianxing", "yihua/lianxingge"],
    ["yihua/yaoyue", "yihua/yaoyuedian"]
];

this.boss_path = "yihua/yaoyue";

this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 18) return isbad ? "小丫头" : "姑娘";
        else if (age < 50) return isbad ? "妖女" : "仙子";
        return isbad ? "老妖婆" : "前辈";
    }
    if (age < 20) return isbad ? "小子" : "公子";
    else if (age < 50) return isbad ? "狂徒" : "少侠";
    return isbad ? "老匹夫" : "前辈";
}

this.call_me = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 30) return isbad ? "本姑娘" : "小女子";
        return isbad ? "本宫" : "妾身";
    }
    if (age < 50) return isbad ? "本公子" : "在下";
    return isbad ? "老夫" : "在下";
}

this.set_titles("移花宫大宫主", "移花宫二宫主", "移花宫护法", "移花宫内门弟子", "移花宫弟子", "移花宫外门弟子");

this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀我宫弟子" + npc.name + "，移花宫弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", fam.name + "若要踏入绣玉谷，便先试试移花宫的手段。");
    }
}

this.boss_guard = ["yihua/yaoyuedian", "yihua/lianxingge", "yihua/xiuyuting"];
this.guard_rooms = ["yihua/gongmen", "yihua/baiyujie", "yihua/liangong", "yihua/hualin"];

this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["throwing", 800],
    ["literate", 800],
    ["yihuaxinfa", 800],
    ["huayuebu", 800, "dodge"],
    ["lianhuazhang", 800, ["unarmed", "parry"]],
    ["suiyuzhi", 800, ["unarmed", "parry"]],
    ["feihuazhaiye", 800, ["sword", "parry"]],
    ["mingyugong", 800, "force"],
    ["yihuajieyu", 800, ["parry", "dodge"]]
];

this.boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["throwing", 800],
    ["literate", 800],
    ["huayuebu", 800, "dodge"],
    ["lianhuazhang", 800, ["unarmed", "parry"]],
    ["suiyuzhi", 800, ["unarmed", "parry"]],
    ["feihuazhaiye", 800, ["sword", "parry"]],
    ["mingyugong", 800, "force"],
    ["yihuajieyu", 800, ["parry", "dodge"]]
];

this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["sword", 5000],
    ["throwing", 5000],
    ["huayuebu", 5000, "dodge"],
    ["suiyuzhi", 5000, ["unarmed", "parry"]],
    ["feihuazhaiye", 5000, ["sword", "parry"]],
    ["mingyugong", 5000, "force"],
    ["yihuajieyu", 5000, ["parry", "dodge"]],
    ["lianhuazhang", 5000, ["unarmed", "parry"]]
];
