this.inherits(FAMILY);

this.id = "RIYUE";
this.name = "日月神教";
this.top_name = "日月神教首席弟子";
this.top_family = "黑木崖";
this.can_battle = true;

this.def_npcs = [
    ["riyue/dizi", "riyue/shanmen"],
    ["pub/mpguanli#RIYUE", "riyue/lianwuchang"],
    ["pub/dadizi#RIYUE", "riyue/lianwuchang"],
    ["riyue/shangguan", "riyue/qinglongtang"],
    ["riyue/qu", "riyue/tingqintang"],
    ["riyue/renyingying", "riyue/xiaohuayuan"],
    ["riyue/xiang", "riyue/xiangwentianju"],
    ["riyue/renwoxing", "riyue/renwoxingqiushi"],
    ["riyue/dongfang", "riyue/jiaozhudadian"]
];

this.boss_path = "riyue/dongfang";
this.boss_guard = ["riyue/jiaozhudadian", "riyue/chengdedian", "riyue/riyueshentan"];
this.guard_rooms = ["riyue/shanmen", "riyue/lianwuchang", "riyue/heimuya", "riyue/chengdedian"];

this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender === 2) {
        if (age < 20) return isbad ? "小妖女" : "姑娘";
        if (age < 50) return isbad ? "妖女" : "女侠";
        return isbad ? "老妖婆" : "前辈";
    }
    if (age < 20) return isbad ? "小贼" : "兄弟";
    if (age < 50) return isbad ? "魔头" : "少侠";
    return isbad ? "老魔" : "前辈";
};

this.call_me = function (player, isbad) {
    if (player.gender === 2) return isbad ? "本座" : "小女子";
    return isbad ? "本座" : "在下";
};

this.set_titles("日月神教教主", "日月神教光明使", "日月神教长老", "日月神教堂主", "日月神教内门弟子", "日月神教弟子");

this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀本教弟子" + npc.name + "，神教弟子即刻封锁黑木崖！");
    }
};

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", fam.name + "敢犯黑木崖，今日便叫尔等有来无回。");
    }
};

this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["whip", 800],
    ["literate", 800],
    ["riyuexinfa", 800, "force"],
    ["piaomiaoshenfa", 800, "dodge"],
    ["riyuejian", 800, ["sword", "parry"]],
    ["liushuibian", 800, ["whip", "parry"]],
    ["huanmolongtianwu", 800, ["unarmed", "parry"]],
    ["tianmojian", 800, ["sword", "parry"]],
    ["xixingdafa", 800, "force"],
    ["riyueguanghua", 800, ["force", "dodge"]],
    ["pixiejian", 800, ["sword", "dodge", "parry"]]
];

this.boss_skills = this.npc_skills.slice();
this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["sword", 5000],
    ["whip", 5000],
    ["piaomiaoshenfa", 5000, "dodge"],
    ["riyuejian", 5000, ["sword", "parry"]],
    ["liushuibian", 5000, "whip"],
    ["huanmolongtianwu", 5000, ["unarmed", "parry"]],
    ["tianmojian", 5000, ["sword", "parry"]],
    ["xixingdafa", 5000, "force"],
    ["riyueguanghua", 5000, ["force", "dodge"]],
    ["pixiejian", 5000, ["sword", "dodge", "parry"]]
];
