this.inherits(SKILL);
this.name = "昊天掌";
this.id = "haotianzhang";
this.grade = 2;
this.desc = "全真教掌法，掌势沉稳，出手如昊天垂象，堂皇正大。";
this.family = FAMILIES.QUANZHEN;
this.attack_actions = [
    "$N双掌一错，使一招「紫气东来」，掌风绵密地按向$n的$l",
    "$N掌势下沉，一招「玄门正宗」平平推出，却暗含雄浑内劲",
    "$N踏前半步，一式「昊天有极」，右掌直取$n胸口",
    "$N两掌回环，使出「清虚无为」，掌影层层罩向$n"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 900,
    skill: {
        unarmed: 120,
        quanzhenxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.15 + 15),
            mz: parseInt(lv * 1.05 + 10)
        },
        parry: {
            zj: parseInt(lv + 10),
            fy: parseInt(lv * 0.6 + 5)
        }
    };
}
this.pfm = {
    gang: {
        name: "三花聚顶",
        distime: 16000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 12,
        use: function (me, target, lv) {
            var sh = me.gj * (120 + parseInt(lv / 24)) / 100;
            if (sh > me.gj * 1.5) sh = me.gj * 1.5;
            if (me.do_attack({
                target: target,
                gj: sh,
                no_weapon: true,
                attack_msg: "<hic>$N大喝一声，合身扑上，双掌同时击出一招昊天掌「三花聚顶」。</hic>",
                damage_msg: "<hir>$n被这股雄浑掌力震得气息一窒。</hir>"
            })) {
                target.add_status({
                    id: "haotian",
                    name: "掌压",
                    desc: "昊天掌力压制你的攻击",
                    prop: {
                        gj_per: -8
                    },
                    duration: 5000 + parseInt(lv * 2),
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 120 + parseInt(lv / 24);
            if (per > 150) per = 150;
            return "双掌齐出造成" + per + "%攻击伤害，命中后短时间降低敌方8%攻击。";
        }
    }
};
