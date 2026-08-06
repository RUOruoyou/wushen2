this.inherits(SKILL);
this.name = "空明拳";
this.id = "kongmingquan";
this.grade = 4;
this.is_hidden = true;
this.desc = "周伯通所悟特殊拳法，空空蒙蒙，若有若无，以虚御实，并非全真教常规传承。";
this.family = FAMILIES.QUANZHEN;
this.attack_actions = [
    "$N双拳虚虚实实，一招「空碗盛饭」飘向$n的$l",
    "$N拳势忽轻忽重，使出「洞明若虚」，令$n难辨来路",
    "$N身形一晃，一式「顽童戏月」，拳影绕着$n周身游走",
    "$N双拳交错，一招「空谷传声」震向$n胸口"
];
this.parry_actions = [
    "$p双手一圈，以空明拳劲卸开$P的攻势，反令$P立足不稳。",
    "$p拳意若有若无，轻轻一带便把$P的力道引向一旁。",
    "$p哈哈一笑，双拳虚抱成圆，将$P的攻势化于无形。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 5000,
    skill: {
        unarmed: 300,
        parry: 300,
        xiantiangong: 260
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.25 + 20),
            mz: parseInt(lv * 1.1 + 20)
        },
        parry: {
            zj: parseInt(lv * 1.45 + 20),
            fy: parseInt(lv * 1.1 + 20),
            desc: "成功招架后有机会反震敌人"
        }
    };
}
this.on_parry_over = function (me, target, par) {
    if (par.is_parry && !me.query_temp("kongmingquan")) {
        me.do_attack({
            target: target,
            attack_msg: "<hiy>$N借力打力，空明拳劲顺势反震$n。</hiy>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        });
        me.end_attack(target);
        me.set_temp("kongmingquan", 1, 12000);
    }
}
this.pfm = {
    kong: {
        name: "空空如也",
        distime: 18000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 16,
        use: function (me, target, lv) {
            var per = 125 + parseInt(lv / 25);
            if (per > 170) per = 170;
            me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.25,
                no_weapon: true,
                diff_fy: 15,
                attack_msg: "<hic>$N使出空明拳「空空如也」，拳劲若有若无，忽从$n意想不到之处透入。</hic>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 125 + parseInt(lv / 25);
            if (per > 170) per = 170;
            return "以莫测拳劲造成" + per + "%攻击伤害，并忽视15%防御。";
        }
    },
    ming: {
        name: "灵台空明",
        distime: 30000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 22,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 7000 + lv * 4;
            if (time > 14000) time = 14000;
            me.add_status({
                id: "kongming_lingtai",
                name: "灵台空明",
                start_msg: "<hiy>$N深吸一口气，目光变得清澈无比，拳意顿入空明之境。</hiy>",
                desc: "灵台空明同时提升攻击、命中、躲闪和招架",
                duration: time,
                override: 2,
                prop: {
                    gj_per: 12,
                    mz_per: 12,
                    ds_per: 12,
                    zj_per: 12
                }
            });
            for (var i = 0; i < 3; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * 0.85,
                    mz: me.mz * 1.1,
                    no_weapon: true,
                    attack_before: i ? "拳意流转，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 7000 + lv * 4;
            if (time > 14000) time = 14000;
            return "连续攻击三次，并在" + (time / 1000) + "秒内提升12%攻击、命中、躲闪和招架。";
        }
    },
    luanwu: {
        name: "乱拳飞舞",
        distime: 34000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 25,
        use: function (me, target, lv) {
            var count = 5 + parseInt(lv / 250);
            if (count > 9) count = 9;
            var per = 58 + parseInt(lv / 60);
            if (per > 88) per = 88;
            me.send_room("<hir>$N忽然如痴如狂，使出空明拳「乱拳飞舞」，虚虚实实的拳影笼罩$n。</hir>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.08,
                    no_weapon: true,
                    attack_before: i ? "乱拳再起，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var count = 5 + parseInt(lv / 250);
            if (count > 9) count = 9;
            var per = 58 + parseInt(lv / 60);
            if (per > 88) per = 88;
            return "狂乱出拳" + count + "次，每拳造成" + per + "%攻击伤害。";
        }
    }
};
