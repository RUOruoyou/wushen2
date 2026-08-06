this.inherits(SKILL);
this.name = "七伤拳";
this.id = "qishangquan";
this.grade = 3;
this.family = FAMILIES.MINGJIAO;
this.desc = "崆峒绝学，经金毛狮王发扬于明教；一拳七劲，或刚或柔，专伤脏腑经脉。";
this.attack_actions = [
    "$N气沉丹田，一式「损心诀」直击$n心口",
    "$N拳势忽刚忽柔，使出「伤肺诀」攻向$n的$l",
    "$N踏前一步，一招「摧肝肠」拳劲层层透入",
    "$N双拳连环，一式「阴阳倒乱」令$n难辨劲力来路",
    "$N低喝一声，七股拳劲同时涌向$n周身"
];
this.parry_actions = [
    "$p拳劲一吐，以七伤拳的刚柔变化震开$P。",
    "$p双拳护住中宫，将$P来势分化卸去。",
    "$p以柔劲牵引，刚劲随后迸发，迫退$P。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 3000,
    skill: {
        unarmed: 240,
        parry: 200,
        mingjiaoxinfa: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.4) + 28,
            mz: parseInt(lv * 1.1) + 22,
            bj_per: 2 + parseInt(lv / 500)
        },
        parry: {
            zj: parseInt(lv * 1.25) + 22,
            fy: parseInt(lv * 0.85) + 16
        }
    };
};
this.pfm = {
    qishang: {
        name: "七伤总诀",
        distime: 26000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 24,
        use: function (me, target, lv) {
            var per = 135 + parseInt(lv / 28);
            if (per > 185) per = 185;
            var effects = [
                ["损心", { gj_per: -12 }],
                ["伤肺", { fy_per: -12 }],
                ["摧肝", { mz_per: -12 }],
                ["断肠", { ds_per: -12 }],
                ["藏离", { zj_per: -12 }],
                ["精失", { expend_mp_per: -15 }],
                ["意恍", { releasetime_per: -15 }]
            ];
            var hit = me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.15,
                no_weapon: true,
                diff_fy: 15,
                attack_msg: "<hir>$N深吸一口气，七股刚柔各异的拳劲同时轰向$n。</hir>"
            });
            if (hit) {
                var effect = effects[me.random(effects.length)];
                target.add_status({
                    id: "qishangquan",
                    name: effect[0],
                    desc: "七伤拳劲损伤你的脏腑经脉",
                    duration: 9000,
                    override: 2,
                    downside: true,
                    prop: effect[1]
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 135 + parseInt(lv / 28);
            if (per > 185) per = 185;
            return "造成" + per + "%攻击伤害并忽视15%防御，随机施加攻击、防御、命中、躲闪、招架、内耗或出招速度减益。";
        }
    },
    qimai: {
        name: "七脉皆伤",
        distime: 38000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 30,
        use: function (me, target, lv) {
            var per = 72 + parseInt(lv / 45);
            if (per > 105) per = 105;
            me.send_room("<hiy>$N拳势连变，七伤劲力沿七脉接连轰向$n。</hiy>", target);
            for (var i = 0; i < 5; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.08,
                    no_weapon: true,
                    attack_before: i ? "拳劲再变，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 72 + parseInt(lv / 45);
            if (per > 105) per = 105;
            return "连续攻击五次，每拳造成" + per + "%攻击伤害。";
        }
    }
};
