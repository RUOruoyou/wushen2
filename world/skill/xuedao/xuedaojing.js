this.inherits(SKILL);
this.name = "血刀经";
this.id = "xuedaojing";
this.grade = 4;
this.first_title = "血刀传人";
this.family = FAMILIES.XUEDAO;
this.desc = "血刀门秘传真经，将血刀刀法、血海魔功与神空行融为一体，愈是负伤，刀势愈发凶狂。";
this.attack_actions = [
    "$N刀锋低垂，一式「血经初解」忽然斩向$n的$l",
    "$N身形一晃，使出「雪海藏锋」，手中$w从不可思议的角度切入",
    "$N刀势似退实进，一招「白骨照血」贴着$n破绽削去",
    "$N脚下风雪骤起，使出「血路无回」，$w连环卷向$n周身",
    "$N低声冷笑，一式「饮血归宗」直取$n胸腹要害"
];
this.parry_actions = [
    "$p血刀一转，以血刀经的诡异刀势卸开$P攻势。",
    "$p身形贴着刀光后撤半步，反以刀背磕偏$P来招。",
    "$p刀锋忽沉忽起，迫得$P攻势落空。"
];
this.can_enables = ["blade", "parry"];
this.learn_condition = {
    max_mp: 7000,
    skill: {
        blade: 300,
        parry: 300,
        xuedaodaofa: 300,
        xuehaimogong: 300,
        xuedunbu: 220,
        xueyingzhang: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: parseInt(lv * 1.65) + 40,
            mz: parseInt(lv * 1.3) + 30,
            bj_per: parseInt(lv / 300) + 1,
            desc: "招架后有机会以血刀反击"
        },
        parry: {
            zj: parseInt(lv * 1.55) + 35,
            fy: parseInt(lv) + 25,
            str: parseInt(lv / 10)
        }
    };
}
this.on_parry_over = function (me, target, par) {
    if (par.is_parry && !me.query_temp("xuedaojing_fanji")) {
        me.do_attack({
            target: target,
            gj: me.gj * 0.9,
            mz: me.mz * 1.1,
            attack_msg: "<hir>$N趁$n攻势未尽，血刀经刀势一转，反手一刀切向$n破绽。</hir>"
        });
        me.end_attack(target);
        me.set_temp("xuedaojing_fanji", 1, 12000);
    }
}
this.on_attack_over = function (me, target, par, sh) {
    if (!(sh > 0) || !me.query_status("xuedaojing_shixue")) return;
    var recover = parseInt(sh * 0.12);
    var limit = parseInt(me.max_hp * 0.025);
    if (recover > limit) recover = limit;
    if (recover > 0) me.do_recover(recover);
}
this.pfm = {
    tumo: {
        name: "赤炼神刀",
        distime: 26000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 25,
        use: function (me, target, lv) {
            var isBleeding = target.query_status("xuedao_bleed");
            var lost = 1 - me.hp / me.max_hp;
            var per = 80 + parseInt(lv / 30) + parseInt(lost * 35);
            if (per > 130) per = 130;
            if (isBleeding) per += 30;
            var time = 6000 + lv * 4;
            if (time > 12000) time = 12000;
            var count = isBleeding ? 4 : 5;

            if (isBleeding) target.remove_status("xuedao_bleed", true);
            me.send_room(isBleeding
                ? "<hir>$N循着$n迸裂的刀创催动「赤炼神刀」，四道血光尽数斩向旧伤。</hir>"
                : "<hir>$N运起血刀经「赤炼神刀」，刀光如赤炼毒蛇般从五个方向噬向$n。</hir>", target);
            var hit = false;
            for (var i = 0; i < count; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.1,
                    diff_fy: isBleeding ? 18 : 8,
                    attack_before: i ? "紧跟着" : ""
                })) hit = true;
            }
            if (hit) {
                target.add_status({
                    id: "xuedaojing",
                    name: "裂血",
                    desc: "血刀经刀劲撕裂你的防御和招架",
                    prop: {
                        fy_per: -10,
                        zj_per: -10
                    },
                    duration: time,
                    override: 2,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var lost = 1 - me.hp / me.max_hp;
            var per = 80 + parseInt(lv / 30) + parseInt(lost * 35);
            if (per > 130) per = 130;
            var time = 6000 + lv * 4;
            if (time > 12000) time = 12000;
            return "通常连斩五刀，每刀造成" + per
                + "%攻击伤害；目标正在流血时改为撕裂旧伤的四刀，消耗流血并使每刀额外提高30%伤害和破防。命中后降低敌方防御和招架。";
        }
    },
    shixue: {
        name: "噬血穹苍",
        distime: 42000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 32,
        use_condition: "需要当前气血高于20%",
        check: function (me) {
            return me.hp > me.max_hp * 0.2;
        },
        use: function (me, target, lv) {
            var sacrifice = parseInt(me.max_hp * 0.1);
            if (sacrifice > me.hp - 1) sacrifice = me.hp - 1;
            if (sacrifice > 0) me.add_hp(-sacrifice);
            var lost = 1 - me.hp / me.max_hp;
            var per = 92 + parseInt(lv / 32) + parseInt(lost * 45);
            if (per > 158) per = 158;
            var time = 9000 + lv * 3;
            if (time > 14000) time = 14000;
            me.add_status({
                id: "xuedaojing_shixue",
                name: "噬血",
                desc: "噬血穹苍提升攻击和暴击，血刀命中时会汲取气血",
                duration: time,
                override: 2,
                only_combat: true,
                prop: {
                    gj_per: 16,
                    bj_per: 5,
                    fy_per: -10
                }
            });
            me.send_room("<hir>$N以自身鲜血祭刀，施出「噬血穹苍」，三道凶厉血光扑向$n。</hir>", target);
            for (var i = 0; i < 3; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.18,
                    diff_fy: 15,
                    attack_before: i ? "血光再闪，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 9000 + lv * 3;
            if (time > 14000) time = 14000;
            return "牺牲10%最大气血连续攻击三次，每刀忽视15%防御；随后进入" + (time / 1000)
                + "秒噬血状态，提升攻击和暴击但降低防御，血刀命中时恢复实际伤害12%的气血。";
        }
    }
};
