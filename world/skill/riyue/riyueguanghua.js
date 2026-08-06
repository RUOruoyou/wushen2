this.inherits(SKILL);
this.name = "日月光华";
this.id = "riyueguanghua";
this.grade = 3;
this.first_title = "光华使者";
this.family = FAMILIES.RIYUE;
this.force_rad = 0.76;
this.desc = "东方不败一脉的极速内功，将真气贯入身法与剑势，以极高速度换取瞬间爆发。";
this.can_enables = ["force", "dodge"];
this.learn_condition = {
    max_mp: 7000,
    skill: {
        force: 300,
        dodge: 300,
        riyuexinfa: 300,
        piaomiaoshenfa: 260
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            dex: parseInt(lv / 5) + 4,
            max_hp: lv * 6,
            limit_mp: lv * 105,
            releasetime_per: 5 + parseInt(lv / 500),
            desc: "唯一：将你内力的76%转化为气血"
        },
        dodge: {
            ds: parseInt(lv * 1.55) + 40,
            mz: parseInt(lv * 0.8) + 20,
            dex: parseInt(lv / 7) + 3
        }
    };
};
this.pfm = {
    guanghua: {
        name: "日月光华",
        distime: 33000,
        enable_skill: "force",
        mp: 26,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 9000 + lv * 4;
            if (time > 18000) time = 18000;
            me.add_status({
                id: "riyue_guanghua",
                name: "光华",
                start_msg: "<hiy>$N真气化作日月光华流遍周身，身形与剑势骤然快至极处。</hiy>",
                desc: "日月光华提升攻击、命中、躲闪和出招速度",
                duration: time,
                override: 2,
                prop: {
                    gj_per: 18,
                    mz_per: 18,
                    ds_per: 18,
                    releasetime_per: 18
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 9000 + lv * 4;
            if (time > 18000) time = 18000;
            return (time / 1000) + "秒内提升18%攻击、命中、躲闪和出招速度。";
        }
    },
    huazhan: {
        name: "光华瞬斩",
        distime: 40000,
        enable_skill: "force",
        mp: 30,
        use_condition: "需要当前气血高于15%",
        check: function (me) {
            return me.hp > me.max_hp * 0.15;
        },
        use: function (me, target, lv) {
            var cost = parseInt(me.max_hp * 0.08);
            if (cost > me.hp - 1) cost = me.hp - 1;
            if (cost > 0) me.add_hp(-cost);
            var per = 70 + parseInt(lv / 45);
            if (per > 105) per = 105;
            me.send_room("<hiy>$N强催日月光华，身形化作五道耀眼残影同时袭向$n。</hiy>", target);
            for (var i = 0; i < 5; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.18,
                    no_weapon: true,
                    diff_fy: 10,
                    attack_before: i ? "光影再闪，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 70 + parseInt(lv / 45);
            if (per > 105) per = 105;
            return "消耗8%最大气血连续攻击五次，每次造成" + per + "%攻击伤害并忽视10%防御。";
        }
    }
};
