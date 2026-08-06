this.inherits(SKILL);
this.name = "天魔剑法";
this.id = "tianmojian";
this.grade = 3;
this.family = FAMILIES.RIYUE;
this.desc = "任我行一脉的上乘剑术，剑势邪异凌厉，善以魔音、幻影和缠身剑气压制敌手。";
this.attack_actions = [
    "$N手中$w发出一声轻鸣，一式「天魔入梦」刺向$n的$l",
    "$N剑势骤然反折，使出「魔影缠身」绕过$n防线",
    "$N纵声长笑，一招「一剑穿心」直取$n胸口",
    "$N身随剑转，幽暗剑光如魔焰般席卷$n周身"
];
this.parry_actions = [
    "$p剑光如魔影回旋，将$P攻势锁在身外。",
    "$p手中剑势忽然反折，逼得$P中途变招。",
    "$p纵声一笑，以天魔剑意震散了$P来势。"
];
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 3000,
    skill: {
        sword: 240,
        riyuejian: 200,
        huanmolongtianwu: 160,
        riyuexinfa: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.42) + 30,
            mz: parseInt(lv * 1.25) + 25,
            bj_per: 2 + parseInt(lv / 500)
        },
        parry: {
            zj: parseInt(lv * 1.28) + 24,
            fy: parseInt(lv * 0.82) + 16
        }
    };
};
this.pfm = {
    chanshen: {
        name: "天魔缠身",
        distime: 27000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 24,
        use: function (me, target, lv) {
            var per = 76 + parseInt(lv / 42);
            if (per > 112) per = 112;
            var hit = false;
            me.send_room("<him>$N剑势化作四道幽暗魔影，层层缠向$n。</him>", target);
            for (var i = 0; i < 4; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.12,
                    attack_before: i ? "魔影再生，" : ""
                })) hit = true;
            }
            if (hit) {
                target.add_status({
                    id: "tianmo_chanshen",
                    name: "魔缠",
                    desc: "天魔剑气压制你的攻击和身法",
                    duration: 8000,
                    override: 2,
                    downside: true,
                    prop: {
                        gj_per: -12,
                        ds_per: -12
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 76 + parseInt(lv / 42);
            if (per > 112) per = 112;
            return "连续攻击四次，每剑造成" + per + "%攻击伤害，命中后降低敌方攻击和躲闪。";
        }
    },
    moxiao: {
        name: "天魔笑",
        distime: 39000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 30,
        use: function (me, target, lv) {
            var per = 140 + parseInt(lv / 30);
            if (per > 190) per = 190;
            var time = 4500 + lv * 3;
            if (time > 9000) time = 9000;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.22,
                diff_fy: 15,
                attack_msg: "<hir>$N纵声发出一阵天魔狂笑，手中剑光趁$n心神动摇直贯中门。</hir>"
            })) {
                target.add_status({
                    id: "tianmo_moxiao",
                    name: "魔音",
                    desc: "天魔笑震慑心神，使你暂时难以施展绝招",
                    duration: time,
                    override: 2,
                    downside: true,
                    prop: {
                        no_pfm: 1,
                        mz_per: -12,
                        zj_per: -12
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 140 + parseInt(lv / 30);
            if (per > 190) per = 190;
            var time = 4500 + lv * 3;
            if (time > 9000) time = 9000;
            return "造成" + per + "%攻击伤害并忽视15%防御；命中后封锁敌方绝招并降低命中、招架，持续" + (time / 1000) + "秒。";
        }
    }
};
