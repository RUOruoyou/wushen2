this.inherits(SKILL);
this.name = "青蝠身法";
this.id = "qingfushenfa";
this.grade = 2;
this.family = FAMILIES.MINGJIAO;

this.dodge_actions = [
"只见$n一招「福满乾坤」，身形陡然纵起，躲过了$N这一招。",
	"$n一式「五蝠献寿」，身形晃动，向一旁飘出，避开了$N这一招。。",
	"$n使出「洞天福地」，一个空心筋斗向后翻出，避开了$N的凌厉攻势。",
	"$n一招「云龙百蝠」，身随意转，$N只觉眼前一花，$n已绕至$N的身后。"
];
this.desc = "明教青翼蝠王韦一笑的成名轻功，来去如电，最擅从围攻和忙乱中脱身。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];

this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.25) + 30,
            dex: parseInt(lv / 8) + 2
        }
    };
};

this.learn_condition = {
    max_mp: 1200,
    skill: {
        dodge: 100,
        mingjiaoxinfa: 80
    }
};
this.pfm = {
    huanying: {
        name: "如影如幻",
        distime: 28000,
        enable_skill: "dodge",
        mp: 16,
        release_time: 0,
        allow_busy: true,
        use: function (me, target, lv) {
            var time = 5000 + lv * 5;
            if (time > 13000) time = 13000;
            var ds = parseInt(lv * 1.4) + 280;
            me.remove_status("busy");
            me.add_status({
                id: "qingfu_huanying",
                name: "幻影",
                start_msg: "<hic>$N身形骤然化作数道青影，倏忽间已换了方位。</hic>",
                desc: "青蝠身法提升你的躲闪和出招速度",
                duration: time,
                override: 2,
                prop: {
                    ds: ds,
                    releasetime_per: 10
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 5000 + lv * 5;
            if (time > 13000) time = 13000;
            return "解除自身忙乱，并提升躲闪和10%出招速度，持续" + (time / 1000) + "秒。";
        }
    }
};
