this.inherits(SKILL);
this.name = "移花接木";
this.id = "yihuajieyu";
this.grade = 4;
this.first_title = "移花传人";
this.family = FAMILIES.YIHUA;
this.desc = "移花宫绝学，以牵引卸力之法将敌劲导入地下或反送回去，可同时用于招架与轻功。";
this.attack_actions = [
    "$N双掌虚虚一引，一式「移花接木」牵向$n的$l",
    "$N身形微侧，使出「左牵右引」，顺着$n来势切入",
    "$N掌影忽聚忽散，一招「石沉大海」轻飘飘印向$n胸口",
    "$N双手划出半弧，一式「漩流回转」将劲力送向$n的$l",
    "$N脚步轻转，掌势似借似还，逼得$n难辨虚实"
];
this.parry_actions = [
    "$p双掌一引，以移花接木顺势卸开$P的攻势。",
    "$p身形不退反进，借$P来势轻轻一带，便化去了这一招。",
    "$p掌心虚按，将$P的力道牵偏，随即露出反击之机。"
];
this.dodge_actions = [
    "$n身形不动，$N一招击下却如石沉大海，劲力尽数被导入地下。",
    "$n轻轻一带，$N只觉自己的招数反击回来，慌忙收势。",
    "$n左牵右引，身形如处漩流，令$N根本找不到落手之处。",
    "$n双手回圈，$N只觉前方仿佛多了一堵无形气墙。"
];
this.can_enables = ["unarmed", "parry", "dodge"];
this.learn_condition = {
    max_mp: 7000,
    skill: {
        dodge: 300,
        parry: 300,
        mingyugong: 300,
        huayuebu: 220
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.35) + 35,
            mz: parseInt(lv * 1.25) + 30
        },
        parry: {
            zj: parseInt(lv * 1.55) + 35,
            fy: parseInt(lv * 0.9) + 25,
            desc: "招架成功后可借力反击，冷却12秒"
        },
        dodge: {
            ds: parseInt(lv * 1.5) + 35,
            fy: parseInt(lv * 0.8) + 20,
            desc: "躲闪成功后可牵引敌力反击，冷却12秒"
        }
    };
}
this.on_parry_over = function (me, target, par) {
    if (par.is_parry && !me.query_temp("yihuajieyu")) {
        me.do_attack({
            target: target,
            mz: me.mz,
            gj: me.gj * (me.query_temp("yihua_jiemu") ? 1.3 : 1),
            attack_msg: "<hic>$N借$n攻势未尽之机，使出移花接木，将来劲反送回去。</hic>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        });
        me.end_attack(target);
        me.set_temp("yihuajieyu", 1, 12000);
    }
}
this.on_dodge_over = function (me, target, par) {
    if (par.is_dodge && !me.query_temp("yihuajieyu")) {
        me.do_attack({
            target: target,
            gj: me.gj * (me.query_temp("yihua_jiemu") ? 1.3 : 0.9),
            mz: me.mz * 1.1,
            attack_msg: "<hic>$N身影一转，以移花接木牵动$n落空的劲力，顺势反击。</hic>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        });
        me.end_attack(target);
        me.set_temp("yihuajieyu", 1, 12000);
    }
}
this.pfm = {
    jieyu: {
        name: "移花接木",
        distime: 26000,
        mp: 25,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 8000 + lv * 5;
            if (time > 18000) time = 18000;
            me.add_status({
                id: "yihua_jiemu",
                name: "移花接木",
                start_msg: "<hic>$N双掌虚引，气机如漩流般环绕周身，已将移花接木运至极处。</hic>",
                desc: "移花接木提升招架、躲闪和伤害减免，并强化借力反击",
                duration: time,
                override: 2,
                prop: {
                    zj_per: 16,
                    ds_per: 16,
                    diff_sh_per: 12
                }
            });
            me.set_temp("yihua_jiemu", 1, time);
        },
        query_desc: function (me, lv) {
            var time = 8000 + lv * 5;
            if (time > 18000) time = 18000;
            return (time / 1000) + "秒内提升16%招架和躲闪、12%伤害减免，并将借力反击伤害提高至130%。";
        }
    }
};
