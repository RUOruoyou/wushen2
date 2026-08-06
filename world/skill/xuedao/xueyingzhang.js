this.inherits(SKILL);
this.name = "金刚瑜伽母拳";
this.id = "xueyingzhang";
this.grade = 3;
this.family = FAMILIES.XUEDAO;
this.desc = "密宗护法拳术，拳势刚烈凶猛；自身气血越低，愤怒之意越盛，拳力也越强。";
this.attack_actions = [
    "$N目光一沉，使出「金刚怒目」一拳击向$n的$l",
    "$N全身骨骼爆响，一式「瑜伽伏魔」直取$n胸口",
    "$N身形斜进，使出「明王降世」，拳风贴着$n身侧袭来",
    "$N低喝一声，一招「护法雷拳」连环攻向$n周身要害",
    "$N双拳一合再分，使出「修罗破阵」轰向$n中门"
];
this.parry_actions = [
    "$p双拳一错，以瑜伽母拳的刚劲架开$P攻势。",
    "$p肩肘齐沉，护法拳劲迫得$P来招偏转。",
    "$p反拳横格，金刚劲力封住了$P的进手。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 2200,
    skill: {
        unarmed: 180,
        xuehaimogong: 180,
        xuelingqinna: 120
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.25) + 25,
            mz: parseInt(lv * 1.1) + 25
        },
        parry: {
            zj: parseInt(lv * 1.2) + 20,
            fy: parseInt(lv * 0.8) + 15
        }
    };
}
this.pfm = {
    zhangyin: {
        name: "金刚佛嗔",
        distime: 22000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 18,
        release_time: 0,
        use: function (me, target, lv) {
            var angry = me.hp < me.max_hp / 2;
            var per = 125 + parseInt(lv / 28) + (angry ? 35 : 0);
            if (per > 195) per = 195;
            me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.15,
                no_weapon: true,
                diff_fy: angry ? 20 : 10,
                attack_msg: angry ?
                    "<hir>$N目眦俱裂，一声爆喝，使出「金刚佛嗔」猛击$n。</hir>" :
                    "<hiy>$N大喝一声，使出「金刚佛嗔」，拳头如闪电般击向$n。</hiy>",
                damage_msg: "<hir>$n被刚猛拳劲正面击中，踉跄着连退数步。</hir>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 125 + parseInt(lv / 28);
            if (per > 195) per = 195;
            return "造成" + per + "%攻击伤害；气血低于一半时额外提高伤害并增强破防。";
        }
    },
    xiuluo: {
        name: "修罗降世",
        distime: 32000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 24,
        use: function (me, target, lv) {
            var lost = 1 - me.hp / me.max_hp;
            var count = 3 + (lost >= 0.5 ? 2 : 0);
            var per = 82 + parseInt(lv / 45) + parseInt(lost * 30);
            if (per > 125) per = 125;
            me.send_room("<hir>$N全身骨骼劈啪作响，拳势如修罗降世般轰向$n。</hir>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.1,
                    no_weapon: true,
                    attack_before: i ? "怒意更盛，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            return "连续攻击三次；气血低于一半时变为五次，且损失气血越多伤害越高。";
        }
    }
};
