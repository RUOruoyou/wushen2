this.inherits(SKILL);
this.name = "摧心掌";
this.id = "cuixinzhang";
this.grade = 3;

this.attack_actions = [
    "$N双掌一沉，一招<HIR>「摧心裂腑」</HIR>，掌力阴毒，直印$n的胸口",
    "$N一招<HIC>「阴风摧心」</HIC>，左掌虚晃，右掌悄无声息地拍向$n的$l",
    "$N使一招<HIB>「毒龙摧心」</HIB>，掌风中隐隐带着阴寒之气，扑向$n",
    "$N一招<HIM>「黑煞摧心」</HIM>，双掌连环，一掌快过一掌，齐齐印向$n",
    "$N一招<GRN>「幽冥摧心」</GRN>，掌力诡异，看似缓慢，实则暗藏杀机，拍向$n的$l",
    "$N一招<HIY>「七煞摧心」</HIY>，掌影重重，阴毒内力透掌而出，罩向$n全身"
];
this.desc = "青城派绝学掌法，掌力阴毒，中掌者七日内必毒发心碎而亡。";
//<$1>$2</$1>
this.can_enables = ["unarmed"];
this.learn_condition = {
    max_mp: 3000,
    str1: 22,
    skill: {
        unarmed: 350
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.5) + 15,
            mz: parseInt(lv * 1.4) + 10
        }
    };
}
this.slots = [
    {
        prop: 'cxz_per',
        value: (lv) => 10,
        format: (val) => {
            return '摧心附加伤害提高10%';
        }
    },
    {
        prop: 'cxz_time',
        value: (lv) => Math.min(7000, 4000 + Math.floor(lv / 60) * 500),
        format: (val) => {
            return '摧心毒发昏迷时间增加';
        }
    }
];
this.pfm = {
    cuixin:
    {
        name: "摧心",
        distime: 20000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
            var per = 180 + parseInt(lv / 30) + me.query_prop('cxz_per');
            me.send_room("<hir>$N运起摧心掌，双掌泛起幽幽绿光，一招「摧心」直印$n心口</hir>", target);
            var hit = me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz,
                no_weapon: true
            });
            me.end_attack(target);
            if (hit) {
                var faintTime = me.query_prop('cxz_time') || 4000;
                target.add_status({
                    id: "cuixin_du",
                    name: "摧心阴毒",
                    desc: "中了摧心掌阴毒，七秒后毒发昏迷",
                    duration: 7000,
                    duration_count: 1,
                    downside: true,
                    override: 2,
                    on_interval: function (p) {
                        if (p && p.hp > 0) {
                            p.add_status({
                                id: "faint",
                                is_faint: true,
                                duration: faintTime,
                                name: "昏迷",
                                downside: true,
                                start_msg: "<hir>摧心阴毒发作，$N只觉心脉剧痛，眼前一黑，昏厥过去。</hir>\n",
                                finish_msg: "<hiy>$N缓缓苏醒，摧心阴毒渐渐散去。</hiy>\n"
                            }, me);
                        }
                    }
                }, me);
            }
        },
        query_desc: function (me, lv) {
            var per = 180 + parseInt(lv / 30);
            return "对敌人造成你" + per + "%伤害，并使敌人受到阴毒伤害，7秒后毒发昏迷4秒";
        }
    }
};
