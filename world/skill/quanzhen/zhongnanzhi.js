this.inherits(SKILL);
this.name = "终南指";
this.id = "zhongnanzhi";
this.grade = 2;
this.desc = "终南山一脉点穴指法，取势精微，专破敌方气机，可与本门掌法互为辅佐。";
this.family = FAMILIES.QUANZHEN;
this.attack_actions = [
    "$N食中二指并拢，一式「终南问道」点向$n的$l",
    "$N左掌虚引，右指倏出，一招「云锁重关」疾点$n要穴",
    "$N身形一转，使出「松风入窍」，指风细密地袭向$n",
    "$N指尖微颤，一招「重阳遗意」直取$n胸前大穴"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 1200,
    skill: {
        unarmed: 160,
        parry: 120,
        quanzhenxinfa: 100
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv + 15),
            mz: parseInt(lv * 1.45 + 20),
            desc: "命中后有机会短时间削弱敌方命中"
        },
        parry: {
            zj: parseInt(lv * 1.2 + 10),
            fy: parseInt(lv * 0.7 + 5)
        }
    };
}
this.on_attack_over = function (me, target, par) {
    if (!par.is_dodge && !par.is_parry && !me.query_temp("zhongnanzhi")) {
        target.add_status({
            id: "zhongnan",
            name: "闭穴",
            desc: "终南指力影响你的命中",
            prop: {
                mz_per: -6
            },
            duration: 5000,
            override: 2,
            downside: true
        }, me);
        me.set_temp("zhongnanzhi", 1, 15000);
    }
}
this.pfm = {
    po: {
        name: "终南一指",
        distime: 22000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 15,
        use: function (me, target, lv) {
            var time = 6000 + lv * 4;
            if (time > 10000) time = 10000;
            var per = 100 + parseInt(lv / 40);
            if (per > 130) per = 130;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.15,
                no_weapon: true,
                attack_msg: "<hiy>$N凝神运气，并指使出「终南一指」，一道锐利指风直取$n胸前大穴。</hiy>",
                damage_msg: "<hir>$n被指力点中，只觉气机一滞，攻守都慢了半拍。</hir>"
            })) {
                target.add_status({
                    id: "zhongnan",
                    name: "闭穴",
                    desc: "终南指力影响你的命中和招架",
                    prop: {
                        mz_per: -12,
                        zj_per: -12
                    },
                    duration: time,
                    override: 2,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 6000 + lv * 4;
            if (time > 10000) time = 10000;
            var per = 100 + parseInt(lv / 40);
            if (per > 130) per = 130;
            return "以精准指力造成" + per + "%攻击伤害，命中后使敌方命中和招架降低12%，持续" + (time / 1000) + "秒。";
        }
    }
};
