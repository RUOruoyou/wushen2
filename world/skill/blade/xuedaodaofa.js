this.inherits(SKILL);
this.name = "血刀刀法";
this.id = "xuedaodaofa";
this.grade = 3;
this.family = FAMILIES.XUEDAO;
this.desc = "血刀门镇派刀法，刀路诡奇狠辣，刀势愈战愈狂，愈是负伤刀劲愈强。";
this.attack_actions = [
    "$N反手拔刀，一式「血影横江」，刀光贴着雪气削向$n的$l",
    "$N脚下一错，使出「回风饮血」，手中$w忽然折转，斩向$n的肩背",
    "$N低喝一声，一招「雪岭开锋」，$w自下而上划出一道暗红刀弧",
    "$N身形斜进，手中$w连闪，一式「残阳照血」直取$n要害",
    "$N刀势忽缓忽急，使出「血海翻涛」，层层刀影卷向$n周身",
    "$N一招「寒刃入骨」，刀锋贴地反撩，削向$n的$l"
];
this.parry_actions = [
    "$p血刀一横，刀背磕开$P的攻势。",
    "$p斜跨半步，以血刀刀脊卸开$P的来招。",
    "$p手中血刀忽然一压，迫得$P攻势偏到一旁。"
];
this.can_enables = ["blade", "parry"];
this.learn_condition = {
    max_mp: 3000,
    skill: {
        blade: 300,
        parry: 200,
        xuejiedao: 200,
        xuehaimogong: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: parseInt(lv * 1.5) + 30,
            mz: parseInt(lv * 1.3) + 25,
            add_sh_per: 4,
            desc: "气血每降低1%增加2%伤害"
        },
        parry: {
            zj: parseInt(lv * 1.3) + 25,
            str: parseInt(lv / 10)
        }
    };
}
this.on_attack = function (me, target, par) {
    var lostPercent = 100 - parseInt(me.hp * 100 / me.max_hp);
    if (lostPercent > 0) {
        return parseInt(me.gj * lostPercent * 2 / 100);
    }
    return 0;
}
this.on_attack_over = function (me, target, par, sh) {
    if (me.query_status("xuedao_shixue")) {
        var hpCost = parseInt(me.hp * 0.01);
        if (hpCost < 1) hpCost = 1;
        me.add_hp(-hpCost);
    }
    if (!par.is_dodge && !par.is_parry && !me.query_temp("xuedao_bleed_cd")) {
        var lv = me.query_skill("xuedaodaofa", 0);
        if (me.random(lv + 100) > 120) {
            var sh2 = parseInt(lv / 6) + parseInt(me.gj / 20) + 20;
            target.add_status({
                id: "xuedao_bleed",
                name: "刀创",
                desc: "你被血刀刀法划开伤口，每三秒损失气血" + sh2,
                duration: 3000,
                duration_count: 4,
                on_interval: function (p) {
                    if (p.hp > 0) {
                        p.send_room("<hir>$N的刀创迸裂，鲜血染红衣襟。</hir>");
                        p.damage(sh2, me);
                        if (p.hp < 0) p.hp = 1;
                    }
                },
                downside: true,
                override: 2
            }, me);
            me.set_temp("xuedao_bleed_cd", 1, 9000);
        }
    }
}
this.pfm = {
    shixue: {
        name: "嗜血",
        distime: 60000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 20,
        release_time: 500,
        use: function (me, target, lv) {
            me.send_room("<hir>$N以自身鲜血催动刀意，使出血刀刀法「嗜血」，周身血气沸腾，刀势陡然凌厉！</hir>", target);
            me.add_status({
                id: "xuedao_shixue",
                name: "嗜血",
                desc: "嗜血状态提升攻速、命中和攻击力40%，每次攻击消耗1%当前气血",
                duration: 15000,
                override: 2,
                prop: {
                    gjsd_per: 40,
                    mz_per: 40,
                    gj_per: 40
                },
                only_combat: true,
                start_msg: "$N周身血气沸腾，进入嗜血状态。",
                finish_msg: "$N周身血气渐散，嗜血状态消退了。"
            });
        },
        query_desc: function (me, lv) {
            return "消耗自身生命进入嗜血状态，15秒内攻击速度、命中和攻击力提升40%，每次攻击消耗1%当前气血。";
        }
    },
    xuehaimodao: {
        name: "血海魔刀",
        distime: 20000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 20,
        release_time: 4000,
        use: function (me, target, lv) {
            var per = 68 + parseInt(lv / 30);
            if (per > 100) per = 100;
            me.send_room("<hir>$N使出血刀刀法「血海魔刀」，身形暴起，血光化作六道刀影斩向$n！</hir>", target);
            var totalDamage = 0;
            for (var i = 0; i < 6; i++) {
                var result = me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.1,
                    attack_before: i ? "紧跟着" : ""
                });
                if (result > 0) totalDamage += result;
            }
            me.end_attack(target);
            if (totalDamage > 0) {
                var heal = parseInt(totalDamage);
                if (heal > 0) {
                    me.do_recover(heal);
                    me.notify("血海魔刀吸收了" + heal + "点气血。");
                }
            }
        },
        query_desc: function (me, lv) {
            var per = 68 + parseInt(lv / 30);
            if (per > 100) per = 100;
            return "对敌人瞬间攻击6次，每刀造成" + per + "%攻击伤害，攻击结束后吸收造成的总伤害恢复气血。";
        }
    },
};
