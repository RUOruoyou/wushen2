this.inherits(SKILL);
this.name = "幻魔龙天舞";
this.id = "huanmolongtianwu";
this.grade = 3;
this.family = FAMILIES.RIYUE;
this.desc = "日月神教奇门拳脚，身、步、掌交织如魔龙狂舞，以虚影和连击扰乱对手。";
this.attack_actions = [
    "$N身形旋转，一式「魔龙探爪」抓向$n的$l",
    "$N步法忽左忽右，使出「幻影盘空」连攻$n数处空门",
    "$N双掌上下翻飞，一招「龙舞九天」罩向$n周身",
    "$N身影骤分，数道掌影同时涌向$n胸前"
];
this.parry_actions = [
    "$p身形如魔龙盘旋，顺势卸开了$P攻势。",
    "$p掌影虚实交错，令$P无法找到真正的防线。",
    "$p脚步一转，双掌已从侧面封住$P来招。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 2700,
    skill: {
        unarmed: 220,
        piaomiaoshenfa: 180,
        riyuexinfa: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.32) + 25,
            mz: parseInt(lv * 1.24) + 24
        },
        parry: {
            zj: parseInt(lv * 1.25) + 22,
            dex: parseInt(lv / 8) + 2
        }
    };
};
this.pfm = {
    longwu: {
        name: "幻魔龙天舞",
        distime: 26000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 23,
        use: function (me, target, lv) {
            var count = 4 + parseInt(lv / 400);
            if (count > 6) count = 6;
            var per = 76 + parseInt(lv / 48);
            if (per > 108) per = 108;
            var hit = false;
            me.send_room("<him>$N身形腾挪如魔龙狂舞，重重掌影从四面八方罩向$n。</him>", target);
            for (var i = 0; i < count; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.1,
                    no_weapon: true,
                    attack_before: i ? "幻影再转，" : ""
                })) hit = true;
            }
            if (hit) {
                target.add_status({
                    id: "huanmo_longwu",
                    name: "幻乱",
                    desc: "幻魔龙天舞扰乱你的命中、躲闪和招架",
                    duration: 8000,
                    override: 2,
                    downside: true,
                    prop: {
                        mz_per: -10,
                        ds_per: -10,
                        zj_per: -8
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var count = 4 + parseInt(lv / 400);
            if (count > 6) count = 6;
            var per = 76 + parseInt(lv / 48);
            if (per > 108) per = 108;
            return "连续攻击" + count + "次，每次造成" + per + "%攻击伤害，并降低敌方命中、躲闪和招架。";
        }
    }
};
