this.inherits(SKILL);
this.name = "恒山剑法";
this.id = "hengshanjianfa";
this.grade = 3;

this.attack_actions = [
    "$N手中$w斜指，一招<HIC>「绵里藏针」</HIC>，剑势舒缓，却暗藏杀机，刺向$n的$l",
    "$N使一招<HIY>「白云出岫」</HIY>，剑光如云，连绵不绝，罩向$n的$l",
    "$N剑走轻灵，一招<HIB>「松风剑影」</HIB>，$w划出一道弧线，平削$n的颈部",
    "$N一招<HIM>「落雁平沙」</HIM>，$w自上而下，挟风声直点$n的肩头",
    "$N身形一矮，反手出剑，一招<GRN>「空谷清音」</GRN>，刺向$n的$l",
    "$N一招<HIW>「流云七剑」</HIW>起手式，$w连点数下，剑气逼人，刺向$n的胸口"
];
this.parry_actions = SKILL.get("parry").parry_actions;
this.desc = "恒山派剑法，绵密严谨，长于守御，而往往是在最令人出其不意之处突出杀招。";
//<$1>$2</$1>
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 3000,
    skill: {
        sword: 300
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.3) + 15,
            mz: parseInt(lv * 1.5) + 10,
            fy: parseInt(lv * 1.0) + 8
        }, parry: {
            zj: parseInt(lv * 1.2) + 10
        }
    };
}
this.slots = [
    {
        prop: 'hsjf_ly_per',
        value: (lv) => 5,
        format: (val) => {
            return '流云七剑附加伤害提高5%';
        }
    },
    {
        prop: 'hsjf_mz_per',
        value: (lv) => 10,
        format: (val) => {
            return '绵里藏针命中后增伤提高10%';
        }
    }
];
this.pfm = {
    liuyun:
    {
        name: "流云七剑",
        distime: 20000,
        enable_skill: "sword",
        release_time: 4000,
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        use: function (me, target, lv) {
            var per = 55 + parseInt(lv / 50) + me.query_prop('hsjf_ly_per');
            me.send_room("<hir>$N手中$w连挥，行云流水般使出「流云七剑」，剑光如云涛般涌向$n</hir>", target);
            for (var i = 0; i < 7; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                    attack_before: "<hiy>紧跟着</hiy>",
                    no_append: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 55 + parseInt(lv / 50);
            return "行云流水般连出七招，每招造成你攻击力" + per + "%的伤害";
        }
    },
    mizang:
    {
        name: "绵里藏针",
        distime: 15000,
        enable_skill: "sword",
        release_time: 4000,
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        use: function (me, target, lv) {
            var per = 75 + parseInt(lv / 40);
            var per2 = 150 + parseInt(lv / 30) + me.query_prop('hsjf_mz_per');
            me.send_room("<hiw>$N示弱于敌，$w虚晃一记，正是「绵里藏针」，看准$n破绽蓄势待发</hiw>", target);
            var hit = me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz
            });
            me.end_attack(target);
            if (!hit) {
                me.send_room("<hir>$N一击未中，后招骤起，剑势暴增，反手再刺$n</hir>", target);
                me.do_attack({
                    target: target,
                    gj: me.gj * per2 / 100,
                    mz: me.mz * 1.3
                });
                me.end_attack(target);
            }
        },
        query_desc: function (me, lv) {
            var per = 75 + parseInt(lv / 40);
            var per2 = 150 + parseInt(lv / 30);
            return "先手示弱对敌人造成" + per + "%的伤害，如果未命中，后手会增加你" + per2 + "%的伤害和命中";
        }
    }
};
