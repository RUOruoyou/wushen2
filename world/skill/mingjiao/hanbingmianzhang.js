this.inherits(SKILL);
this.name = "寒冰绵掌";
this.id = "hanbingmianzhang";
this.grade = 3;
this.family = FAMILIES.MINGJIAO;
this.desc = "青翼蝠王所擅阴寒掌法，掌力绵密入骨，能够迟滞敌人并借寒气滋养自身。";
this.attack_actions = [
    "$N掌心泛起一层寒霜，一式「寒潮暗涌」拍向$n的$l",
    "$N双掌轻飘飘推出，阴寒掌力无声无息地罩住$n",
    "$N身形一晃，一招「冰封千里」贴向$n胸口",
    "$N掌势绵延不绝，使出「霜河倒卷」逼向$n周身"
];
this.parry_actions = [
    "$p掌中寒气一吐，迫得$P攻势为之一缓。",
    "$p双掌绵密回环，将$P的劲力消于寒气之中。",
    "$p借青蝠身法侧开半步，反掌封住$P进路。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 2600,
    skill: {
        unarmed: 220,
        qingfushenfa: 180,
        mingjiaoxinfa: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.3) + 25,
            mz: parseInt(lv * 1.15) + 20
        },
        parry: {
            zj: parseInt(lv * 1.25) + 20,
            fy: parseInt(lv * 0.9) + 15
        }
    };
};
this.pfm = {
    hanbing: {
        name: "寒冰透骨",
        distime: 24000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 21,
        use: function (me, target, lv) {
            var per = 125 + parseInt(lv / 30);
            if (per > 170) per = 170;
            var time = 6000 + lv * 3;
            if (time > 11000) time = 11000;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.15,
                no_weapon: true,
                attack_msg: "<hic>$N掌心寒气骤盛，使出寒冰绵掌「寒冰透骨」印向$n胸前。</hic>"
            })) {
                target.add_status({
                    id: "hanbingmianzhang",
                    name: "寒毒",
                    desc: "寒冰掌力迟滞你的攻击、命中和躲闪",
                    duration: time,
                    override: 2,
                    downside: true,
                    prop: {
                        gj_per: -8,
                        mz_per: -10,
                        ds_per: -10,
                        releasetime_per: -12
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 125 + parseInt(lv / 30);
            if (per > 170) per = 170;
            return "造成" + per + "%攻击伤害，并以寒毒降低敌方攻击、命中、躲闪和出招速度。";
        }
    },
    qingfu: {
        name: "青蝠吸血",
        distime: 32000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 26,
        use: function (me, target, lv) {
            var per = 145 + parseInt(lv / 28);
            if (per > 195) per = 195;
            var hit = me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.2,
                no_weapon: true,
                diff_fy: 12,
                attack_msg: "<him>$N化作一道青影贴近$n，寒冰绵掌劲力忽吐忽收。</him>"
            });
            if (hit) {
                var hp = parseInt(me.max_hp * 0.06) + lv;
                me.do_recover(hp);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 145 + parseInt(lv / 28);
            if (per > 195) per = 195;
            return "造成" + per + "%攻击伤害并忽视12%防御；命中后恢复6%最大气血和额外" + lv + "点气血。";
        }
    }
};
