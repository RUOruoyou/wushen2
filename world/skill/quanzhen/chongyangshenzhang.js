this.inherits(SKILL);
this.name = "重阳神掌";
this.id = "chongyangshenzhang";
this.grade = 3;
this.first_title = "重阳传人";
this.desc = "王重阳所传上乘掌法，掌势厚重而变化精微，可与终南指互补攻守。";
this.family = FAMILIES.QUANZHEN;
this.attack_actions = [
    "$N双掌一分，使一招「重阳遗篇」，掌影沉稳地印向$n的$l",
    "$N脚下踏出北斗方位，一式「重阳连环」斜斜切入$n中门",
    "$N掌势由虚转实，使出「万物复苏」，绵密掌力层层涌向$n",
    "$N一声清啸，双掌推出一招「阳关三叠」，三重劲力前后相随",
    "$N左掌虚引，右掌忽然按出，一式「返照空明」直取$n胸口"
];
this.parry_actions = [
    "$p掌势一沉，以重阳神掌卸开$P攻势，反将来劲引偏。",
    "$p脚踏北斗方位，双掌一错，封住了$P的进手。",
    "$p双掌虚实相生，将$P的力道化在身侧。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 8000,
    skill: {
        unarmed: 300,
        parry: 300,
        xiantiangong: 300,
        zhongnanzhi: 220
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.45 + 25),
            mz: parseInt(lv * 1.25 + 20)
        },
        parry: {
            zj: parseInt(lv * 1.45 + 20),
            fy: parseInt(lv + 20)
        }
    };
}
this.pfm = {
    beidou: {
        name: "阳关三叠",
        distime: 20000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var per = 78 + parseInt(lv / 40);
            if (per > 108) per = 108;
            var hits = 0;
            var powers = [1, 1.25, 1.65];
            var defenses = [0, 8, 20];
            var messages = ["掌意初生，", "一阳复起，", "重阳返照，"];
            me.send_room("<hiy>$N吐气开声，使出重阳神掌「阳关三叠」，三重掌力一浪高过一浪。</hiy>", target);
            for (var i = 0; i < powers.length; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per * powers[i] * (1 + hits * 0.08) / 100,
                    mz: me.mz * (1.08 + i * 0.06),
                    no_weapon: true,
                    diff_fy: defenses[i],
                    attack_before: messages[i]
                })) hits++;
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 78 + parseInt(lv / 40);
            if (per > 108) per = 108;
            return "连续拍出三掌，基础伤害系数为" + per
                + "%；后两掌逐步提高伤害、命中和破防，前一掌命中还会继续增强后续掌力。";
        }
    }
};
