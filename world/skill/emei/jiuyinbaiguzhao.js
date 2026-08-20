this.inherits(SKILL);
this.name = "九阴白骨爪";
this.id = "jiuyinbaiguzhao";
this.grade = 3;

this.family = FAMILIES.EMEI;
this.attack_actions = [
    "$N左爪虚晃，右爪蓄力，一招「勾魂夺魄」直插向$n的$l",
    "$N双手连环成爪，爪爪钩向$n，「九子连环」已向$n的$l抓出",
    "$N双手使出「十指穿心」，招招不离$n的$l",
    "$N身形围$n一转，使出「天罗地网」，$n的$l已完全笼罩在爪影下",
    "$N使一招「风卷残云」，双爪幻出满天爪影抓向$n全身",
    "$N吐气扬声，一招「唯我独尊」双爪奋力向$n天灵戳下"
];
this.desc = "九阴真经里记载的外门功夫，阴狠毒辣";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp:5000,
    skill: {
        unarmed: 300
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.6) + 20,
            mz: parseInt(lv*1.5 + 20)
        },
        parry: {
            zj: parseInt(lv * 1.5) + 20,
            fy: lv + 20
        }
    };
}

this.BAI_GU_YIN = "baiguyin_mark";
this.add_baiguyin_mark = function (target, from) {
    if (!target || !target.add_status) return;
    target.add_status({
        id: this.BAI_GU_YIN,
        name: "白骨印",
        desc: "九阴爪痕入骨，每层削减2%防御，可被夺命/追魂引爆",
        duration: 15000,
        count: 1,
        override: 1,
        max_count: 5,
        downside: true,
        prop: {
            fy_per: -2
        }
    }, from);
};

this.on_attack_over = function (me, target, par) {
    if (!par.is_dodge && !par.is_parry && target.hp > 0) {
        this.add_baiguyin_mark(target, me);
    }
};

this.pfm = {
    duo:
    {
        name: "夺命",
        distime: 18000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var gj = me.gj * (200 + lv / 10)/100;
            var marks = target.query_status("baiguyin_mark") || 0;
            var no_parry = false;
            var attackMsg = "<hiy>$N冷笑数声，手指微微弯曲成爪，身形疾转，飞向$n头顶抓下</hiy>";
            if (marks >= 3) {
                no_parry = true;
                attackMsg = "<hiy>$N催动白骨印，五指泛出惨白光芒，一爪破开$n的招架直取要害！</hiy>";
            }
            if (me.do_attack({
                target: target,
                    gj: gj,
                mz: me.mz,
                no_weapon: true,
                no_parry: no_parry,
                    attack_msg: attackMsg,
                damage_msg:"<hir>$n哪里料到$N竟有如此变招，不及躲闪，被$P抓了个鲜血淋漓，头痛欲裂。</hir>"
            })) {
                if (marks >= 3) {
                    for (var i = 0; i < 3; i++) {
                        target.remove_status("baiguyin_mark", false);
                    }
                }
                target.add_status({
                    id: "miss",
                    name: "夺命",
                    desc: "你无法躲闪",
                    is_rash: true,
                    duration: 8000,
                    downside: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var gj = 200 + parseInt(lv / 10);
            return "快速狠辣的攻击，命中后对敌人造成你攻击力" + gj + "%的伤害，在8秒内使敌人无法闪避。若目标至少3层白骨印，本次攻击无法被招架；命中后消耗3层白骨印。";
        }
    }, juan:
    {
        name: "风卷残云",
        distime: 18000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
             lv = 30 - lv / 100;
            if (lv < 10) lv = 10;
            var count = parseInt((100 - target.hp * 100 / target.max_hp) / lv) + 3;
            me.send_room("<hir>$N一声厉啸，手指弯曲成爪，身形疾转，双爪化为一片残影，飞向$n抓去</hir>\n", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true
                });
            }
            var marks = target.query_status("baiguyin_mark") || 0;
            if (marks >= 5 && target.hp > 0) {
                target.remove_status("baiguyin_mark", true);
                me.do_attack({
                    target: target,
                    attack_msg: "<hir>$N双爪泛起惨白光芒，一招「九阴追魂」直插$n天灵，避无可避！</hir>",
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    no_dodge: true,
                    no_parry: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var lv = 30 - lv / 100;
            if (lv < 10) lv = 10;
            return "对敌人进行快速攻击3次，对方的气血每降低" + lv + "%，你的攻击次数增加1次；每次命中叠加1层白骨印，达到5层时清空白骨印并追加一次不可闪避、不可招架的九阴追魂。";
        }
    }
};
