this.inherits(SKILL);
this.name = "九阳神功";
this.id = "jiuyangshengong";
this.grade = 3;
this.first_title = "九阳传人";
this.family = FAMILIES.MINGJIAO;
this.force_rad = 0.82;
this.desc = "至刚至阳的无上内功，真气生生不息，既可护体疗伤，也能催发刚猛战气。";
this.can_enables = ["force", "parry"];
this.learn_condition = {
    max_mp: 6000,
    skill: {
        force: 300,
        mingjiaoxinfa: 300,
        qishangquan: 220
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            con: parseInt(lv / 5) + 4,
            max_hp: lv * 12,
            limit_mp: lv * 115,
            diff_downside_per: 8 + parseInt(lv / 500),
            desc: "唯一：将你内力的82%转化为气血"
        },
        parry: {
            zj: parseInt(lv * 1.45) + 35,
            fy: parseInt(lv * 1.15) + 30,
            diff_sh_per: 3 + parseInt(lv / 450)
        }
    };
};
this.pfm = {
    zhanqi: {
        name: "九阳战气",
        distime: 32000,
        enable_skill: "force",
        mp: 24,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 9000 + lv * 4;
            if (time > 18000) time = 18000;
            var gj = 15 + parseInt(lv / 200);
            if (gj > 25) gj = 25;
            me.remove_status("jiuyang_huti", true);
            me.add_status({
                id: "jiuyang_zhanqi",
                name: "九阳战气",
                start_msg: "<hiy>$N周身真气炽烈如阳，九阳战气冲霄而起。</hiy>",
                desc: "九阳战气提升你的攻击、命中和暴击",
                duration: time,
                override: 2,
                prop: {
                    gj_per: gj,
                    mz_per: 12,
                    bj_per: 5
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 9000 + lv * 4;
            if (time > 18000) time = 18000;
            var gj = 15 + parseInt(lv / 200);
            if (gj > 25) gj = 25;
            return (time / 1000) + "秒内提升" + gj + "%攻击、12%命中和5%暴击。";
        }
    },
    huti: {
        name: "九阳护体",
        distime: 36000,
        enable_skill: "force",
        mp: 26,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 10000 + lv * 4;
            if (time > 19000) time = 19000;
            me.remove_status("jiuyang_zhanqi", true);
            me.add_status({
                id: "jiuyang_huti",
                name: "九阳护体",
                start_msg: "<hir>$N体内九阳真气流转，周身如有一层无形气墙。</hir>",
                desc: "九阳护体提升防御、招架和伤害减免",
                duration: time,
                override: 2,
                prop: {
                    fy_per: 18,
                    zj_per: 18,
                    diff_sh_per: 14,
                    diff_downside_per: 12
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 10000 + lv * 4;
            if (time > 19000) time = 19000;
            return (time / 1000) + "秒内提升18%防御、18%招架、14%伤害减免和12%异常抗性。";
        }
    },
    liaoshang: {
        name: "真阳疗伤",
        distime: 40000,
        enable_skill: "force",
        mp: 28,
        use_type: 2,
        allow_busy: true,
        release_time: 0,
        use_condition: "需要气血未满",
        check: function (me) {
            return me.hp < me.max_hp;
        },
        use: function (me, target, lv) {
            var percent = 10 + parseInt(lv / 500);
            if (percent > 18) percent = 18;
            var hasStance = me.query_status("jiuyang_zhanqi") || me.query_status("jiuyang_huti");
            if (hasStance) percent += 4;
            me.remove_status("jiuyang_zhanqi", true);
            me.remove_status("jiuyang_huti", true);
            me.remove_status("busy");
            var hp = me.do_recover(parseInt(me.max_hp * percent / 100) + lv * 2);
            me.send_room("<hiy>$N盘运九阳真气，炽热内息流遍百骸，伤势迅速收拢。</hiy>");
            if (hp > 0) me.notify("九阳真气恢复了" + hp + "点气血。");
        },
        query_desc: function (me, lv) {
            var percent = 10 + parseInt(lv / 500);
            if (percent > 18) percent = 18;
            return "解除自身忙乱，并恢复" + percent + "%最大气血和额外" + (lv * 2)
                + "点气血；若正在运转战气或护体，将消耗该架势并额外恢复4%最大气血。";
        }
    }
};
