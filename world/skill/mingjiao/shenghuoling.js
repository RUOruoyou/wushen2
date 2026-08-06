this.inherits(SKILL);
this.name = "圣火令法";
this.id = "shenghuoling";
this.grade = 3;
this.first_title = "圣火令主";
this.family = FAMILIES.MINGJIAO;
this.desc = "波斯总教传入中土的奇门武学，招式怪异难测，兼具连击、封招与扰乱气机之能。";
this.attack_actions = [
    "$N手中$w忽曲忽直，一式「圣火无形」从怪异角度刺向$n",
    "$N身形斜转，使出「光焰流转」，$w贴着$n防线切入",
    "$N招式似剑非剑，一招「令出如山」直取$n要害",
    "$N双手交错，数道奇异光影同时罩向$n周身"
];
this.parry_actions = [
    "$p以圣火令法的怪异路数斜斜封住$P攻势。",
    "$p手中兵刃忽然翻转，将$P来招锁在外门。",
    "$p身随令转，似退实进地化开了$P这一招。"
];
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 8500,
    skill: {
        sword: 320,
        parry: 300,
        qiankundanuoyi: 300,
        jiuyangshengong: 300,
        liehuojian: 220
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.6) + 40,
            mz: parseInt(lv * 1.45) + 35,
            bj_per: 4 + parseInt(lv / 400)
        },
        parry: {
            zj: parseInt(lv * 1.55) + 35,
            fy: parseInt(lv) + 25
        }
    };
};
this.pfm = {
    canxue: {
        name: "残血令",
        distime: 27000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 25,
        use: function (me, target, lv) {
            var per = 84 + parseInt(lv / 45);
            if (per > 112) per = 112;
            var hits = 0;
            var changes = [
                { gj: 0.9, mz: 1.35, no_parry: true, diff_fy: 0, msg: "令影忽从肘后翻出，" },
                { gj: 1.05, mz: 1.18, no_dodge: true, diff_fy: 8, msg: "身位斜错之间，" },
                { gj: 1.3, mz: 1.08, no_parry: false, diff_fy: 20, msg: "前两式俱是虚招，" }
            ];
            me.send_room("<hir>$N手中圣火令法忽曲忽直，三式全从常理之外攻向$n。</hir>", target);
            for (var i = 0; i < changes.length; i++) {
                var change = changes[i];
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per * change.gj / 100,
                    mz: me.mz * change.mz,
                    diff_fy: change.diff_fy,
                    no_parry: change.no_parry,
                    no_dodge: change.no_dodge,
                    attack_before: change.msg
                })) hits++;
            }
            if (hits >= 2) {
                target.add_status({
                    id: "shenghuo_cuowei",
                    name: "错位",
                    desc: "圣火令的怪异路数扰乱了你的招架和躲闪",
                    duration: 8000,
                    override: 2,
                    downside: true,
                    prop: {
                        zj_per: -12,
                        ds_per: -12
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 84 + parseInt(lv / 45);
            if (per > 112) per = 112;
            return "以不可招架、不可躲闪和高破防三种怪招连续进攻，基础伤害系数为" + per
                + "%；命中至少两式后降低敌方招架和躲闪。";
        }
    },
    lianxin: {
        name: "敛心令",
        distime: 39000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 31,
        use: function (me, target, lv) {
            var per = 135 + parseInt(lv / 32);
            if (per > 180) per = 180;
            var time = 5000 + lv * 3;
            if (time > 10000) time = 10000;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.25,
                diff_fy: 18,
                attack_msg: "<him>$N手中令影骤然收敛为一点幽光，施出「敛心令」直透$n气机。</him>"
            })) {
                target.add_status({
                    id: "shenghuo_lianxin",
                    name: "敛心",
                    desc: "圣火令扰乱气机，使你暂时无法施展绝招",
                    duration: time,
                    override: 2,
                    downside: true,
                    prop: {
                        no_pfm: 1,
                        gj_per: -10,
                        mz_per: -10
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 135 + parseInt(lv / 32);
            if (per > 180) per = 180;
            var time = 5000 + lv * 3;
            if (time > 10000) time = 10000;
            return "造成" + per + "%攻击伤害并忽视18%防御；命中后压制敌方攻击、命中和绝招，持续" + (time / 1000) + "秒。";
        }
    }
};
