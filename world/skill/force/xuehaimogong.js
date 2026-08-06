this.inherits(SKILL);
this.name = "血海魔功";
this.id = "xuehaimogong";
this.grade = 3;
this.force_rad = 0.7;
this.family = FAMILIES.XUEDAO;
this.desc = "血刀门阴狠内功，可祭献自身气血换取爆发，也能以血海真气疗伤、震慑群敌。";
this.can_enables = ["force"];
this.learn_condition = {
    max_mp: 2000,
    skill: {
        force: 300,
        xuedaoxinfa: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            gj: parseInt(lv * 1.1) + 20,
            max_hp: lv * 12,
            limit_mp: lv * 80,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
}
this.pfm = {
    xuemo: {
        name: "血魔",
        distime: 60000,
        enable_skill: "force",
        mp: 40,
        release_time: 500,
        use: function (me, target, lv) {
            me.send_room("<hir>$N使出血海魔功「血魔」，一股凶厉血气自体内喷涌而出，化为血魔附体！</hir>", target);
            me.add_status({
                id: "xuehai_xuemo",
                name: "血魔",
                desc: "血魔附体提升攻击、防御、命中、躲闪、招架20%",
                duration: 30000,
                override: 2,
                prop: {
                    gj_per: 20,
                    fy_per: 20,
                    mz_per: 20,
                    ds_per: 20,
                    zj_per: 20
                },
                only_combat: true,
                start_msg: "$N周身血光大盛，血魔附体！",
                finish_msg: "$N周身血魔之气渐渐消散。"
            });
        },
        query_desc: function (me, lv) {
            return "血魔附体，30秒内攻击、防御、命中、躲闪、招架提升20%。";
        }
    },
    xueji: {
        name: "血祭",
        distime: 60000,
        enable_skill: "force",
        mp: 56,
        release_time: 500,
        use: function (me, target, lv) {
            var sacrifice = parseInt(me.max_hp * 0.25);
            if (sacrifice > me.hp - 1) sacrifice = me.hp - 1;
            if (sacrifice > 0) me.add_hp(-sacrifice);
            me.send_room("<hir>$N使出血海魔功「血祭」，周身血光冲天，进入不死不控的凶厉状态！</hir>", target);
            me.add_status({
                id: "xuehai_xueji",
                name: "血祭",
                desc: "血祭护体，你不会死亡且免疫控制，效果结束后9秒内全属性降低30%",
                duration: 9000,
                ig_control: 9000,
                override: 2,
                on_attach: function (p) {
                    p.xuehai_old_on_die = p.on_die;
                    p.on_die = function (killer) {
                        p.hp = 1;
                        return false;
                    };
                },
                on_expire: function (p) {
                    p.on_die = p.xuehai_old_on_die;
                    delete p.xuehai_old_on_die;
                    p.add_status({
                        id: "xuehai_xueji_debuff",
                        name: "血祭虚弱",
                        desc: "血祭后虚弱，全战斗属性降低30%",
                        duration: 9000,
                        prop: {
                            gj_per: -30,
                            fy_per: -30,
                            mz_per: -30,
                            ds_per: -30,
                            zj_per: -30
                        },
                        override: 2,
                        downside: true,
                        start_msg: "$N血祭之力消退，陷入虚弱状态。",
                        finish_msg: "$N的血祭虚弱状态消退了。"
                    });
                },
                start_msg: "$N周身被血光笼罩，进入血祭状态！",
                finish_msg: "$N周身血光散去。"
            });
        },
        query_desc: function (me, lv) {
            return "血祭自身，消耗25%最大气血，9秒内不会死亡、免疫控制；效果结束后9秒内全战斗属性降低30%。";
        }
    }
};
