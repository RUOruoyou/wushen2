this.inherits(FAMILY);

this.id = "MINGJIAO";
this.name = "明教";
this.top_name = "明教首席弟子";
this.top_family = "光明顶";
this.can_battle = true;

this.def_npcs = [
    ["mingjiao/dizi", "mingjiao/shanmen"],
    ["pub/mpguanli#MINGJIAO", "mingjiao/wuxingqixiaochang"],
    ["pub/dadizi#MINGJIAO", "mingjiao/wuxingqixiaochang"],
    ["mingjiao/wei", "mingjiao/fuwangdong"],
    ["mingjiao/yin", "mingjiao/yingwangtang"],
    ["mingjiao/xie", "mingjiao/shiwangtang"],
    ["mingjiao/dai", "mingjiao/daiqisitang"],
    ["mingjiao/yang", "mingjiao/guangmingzuoshidian"],
    ["mingjiao/zhang", "mingjiao/guangmingding"]
];

this.boss_path = "mingjiao/zhang";
this.boss_guard = ["mingjiao/guangmingding", "mingjiao/houdian", "mingjiao/shenghuotan"];
this.guard_rooms = ["mingjiao/shanmen", "mingjiao/wuxingqixiaochang", "mingjiao/tianweitang", "mingjiao/ziweitang"];

this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender === 2) {
        if (age < 20) return isbad ? "小妖女" : "姑娘";
        if (age < 50) return isbad ? "妖女" : "女侠";
        return isbad ? "老妖婆" : "前辈";
    }
    if (age < 20) return isbad ? "小贼" : "兄弟";
    if (age < 50) return isbad ? "恶徒" : "少侠";
    return isbad ? "老贼" : "前辈";
};

this.call_me = function (player, isbad) {
    if (player.gender === 2) return isbad ? "本姑娘" : "小女子";
    return isbad ? "本座" : "在下";
};

this.set_titles("明教教主", "明教左右使", "明教法王", "明教旗使", "明教内门弟子", "明教弟子");

this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀本教弟子" + npc.name + "，明教上下听令，护卫光明顶！");
    }
};

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", fam.name + "既犯光明顶，明教弟子当同心迎敌。");
    }
};

this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["mingjiaoxinfa", 800, "force"],
    ["qingfushenfa", 800, "dodge"],
    ["yingzhuagong", 800, ["unarmed", "parry"]],
    ["liehuojian", 800, ["sword", "parry"]],
    ["hanbingmianzhang", 800, ["unarmed", "parry"]],
    ["qishangquan", 800, ["unarmed", "parry"]],
    ["jiuyangshengong", 800, "force"],
    ["qiankundanuoyi", 800, ["dodge", "parry"]],
    ["shenghuoling", 800, ["sword", "parry"]]
];

this.boss_skills = this.npc_skills.slice();
this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["sword", 5000],
    ["qingfushenfa", 5000, "dodge"],
    ["yingzhuagong", 5000, ["unarmed", "parry"]],
    ["liehuojian", 5000, ["sword", "parry"]],
    ["hanbingmianzhang", 5000, ["unarmed", "parry"]],
    ["qishangquan", 5000, ["unarmed", "parry"]],
    ["jiuyangshengong", 5000, "force"],
    ["qiankundanuoyi", 5000, ["dodge", "parry"]],
    ["shenghuoling", 5000, ["sword", "parry"]]
];
