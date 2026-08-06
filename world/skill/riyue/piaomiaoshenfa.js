this.inherits(SKILL);
this.name = "飘渺身法";
this.id = "piaomiaoshenfa";
this.grade = 2;
this.family = FAMILIES.RIYUE;
this.desc = "黑木崖秘传轻功，身形飘忽迅疾，往往在人看清之前已绕至侧后。";
this.dodge_actions = [
    "$n身形一晃，如烟似雾地避开了$N这一招。",
    "$n足尖轻点，转眼已从$N攻势缝隙中穿过。",
    "$n衣袖微动，整个人忽然飘出数丈之外。",
    "$n沿着$N招式边缘一旋，悄无声息地换了方位。"
];
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 1200,
    skill: {
        dodge: 100,
        riyuexinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.25) + 30,
            dex: parseInt(lv / 8) + 2
        }
    };
};
this.pfm = {
    wuying: {
        name: "飘渺无影",
        distime: 27000,
        enable_skill: "dodge",
        mp: 16,
        allow_busy: true,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 5000 + lv * 5;
            if (time > 13000) time = 13000;
            me.remove_status("busy");
            me.add_status({
                id: "piaomiao_wuying",
                name: "无影",
                start_msg: "<hic>$N衣袖一拂，身形化作一道难以捕捉的淡影。</hic>",
                desc: "飘渺无影提升你的躲闪、命中和出招速度",
                duration: time,
                override: 2,
                prop: {
                    ds_per: 16,
                    mz_per: 10,
                    releasetime_per: 10
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 5000 + lv * 5;
            if (time > 13000) time = 13000;
            return "解除自身忙乱，在" + (time / 1000) + "秒内提升16%躲闪、10%命中和10%出招速度。";
        }
    }
};
