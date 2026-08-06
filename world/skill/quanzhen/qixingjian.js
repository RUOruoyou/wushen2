this.inherits(SKILL);
this.name = "天罡剑法";
this.id = "qixingjian";
this.grade = 3;
this.desc = "全真教将剑法与天罡北斗阵合一的上乘剑术，脚踏星位，从不同方位连续合击。";
this.family = FAMILIES.QUANZHEN;
this.attack_actions = [
    "$N脚踏天枢位，一招「星垂平野」，手中$w斜斜刺向$n的$l",
    "$N剑势一转，使出「斗转河横」，剑光沿七星方位圈向$n",
    "$N左手捏诀，右手$w一式「玉衡分光」点向$n胸前要穴",
    "$N身形忽进忽退，一招「开阳照影」逼得$n难辨来路",
    "$N手中$w连划数点寒芒，使出「瑶光落斗」罩向$n的$l"
];
this.parry_actions = [
    "$p脚踩七星方位，剑势回环，封住了$P的进手。",
    "$p手中剑光一转，以天罡剑法将$P的攻势引偏。",
    "$p左手捏诀，右手横剑，守住中宫要害。"
];
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 2500,
    skill: {
        sword: 220,
        quanzhenjian: 200,
        beidouzhen: 160,
        xiantiangong: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.35) + 25,
            mz: parseInt(lv * 1.25) + 25
        },
        parry: {
            zj: parseInt(lv * 1.35) + 20,
            fy: parseInt(lv * 0.9) + 15,
            desc: "攻击命中后有机会扰乱敌方身法"
        }
    };
}
this.on_attack_over = function (me, target, par) {
    if (!par.is_dodge && !par.is_parry && !me.query_temp("qixingjian")) {
        target.add_status({
            id: "qixingjian",
            name: "星乱",
            desc: "天罡剑法扰乱你的命中和躲闪",
            prop: {
                mz_per: -8,
                ds_per: -8
            },
            duration: 5000,
            override: 2,
            downside: true
        }, me);
        me.set_temp("qixingjian", 1, 15000);
    }
}
this.query_beidou_stars = function (me) {
    var team = me.team || [me];
    var stars = 0;
    for (var i = 0; i < team.length; i++) {
        var member = team[i];
        if (!member || !member.is_here(me)) continue;
        if (member !== me && member.family !== FAMILIES.QUANZHEN
            && member.query_skill("beidouzhen", 0) <= 0) continue;
        stars++;
        if (stars >= 7) break;
    }
    return stars || 1;
}
this.pfm = {
    lianzhu: {
        name: "七星绝命剑",
        distime: 22000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 18,
        release_time: 0,
        use: function (me, target, lv) {
            var mark = target.query_status("qixing_mark");
            var count = 4 + Math.min(2, parseInt(mark / 3));
            var per = 82 + parseInt(lv / 55);
            if (per > 120) per = 120;
            per += mark * 4;
            me.send_room("<him>$N一声长啸，手中$W化成一道剑幕，七点寒星从幕中接连射向$n。</him>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                    diff_fy: 6 + mark * 2,
                    attack_before: i ? "紧跟着" : ""
                });
            }
            if (mark) target.remove_status("qixing_mark", true);
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 82 + parseInt(lv / 55);
            if (per > 120) per = 120;
            return "连续出剑四次，消耗目标身上的星位标记；标记越多，攻击次数、每剑伤害和破防越高。基础伤害系数为"
                + per + "%。";
        }
    },
    gongyue: {
        name: "七星拱月",
        distime: 36000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 28,
        release_time: 0,
        use: function (me, target, lv) {
            var stars = SKILL.get("qixingjian").query_beidou_stars(me);
            var count = 3 + Math.min(4, stars - 1);
            var per = 70 + parseInt(lv / 50);
            if (per > 100) per = 100;
            var mz = me.mz * (1.1 + Math.min(0.25, me.query_skill("beidouzhen", 0) / 4000));
            me.send_room("<hiy>$N踏遍北斗七处星位，身形化作七道人影，使出天罡剑法「七星拱月」。</hiy>", target);
            var hit = false;
            for (var i = 0; i < count; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: mz,
                    diff_fy: 10,
                    attack_before: i ? "剑光再转，" : ""
                })) hit = true;
            }
            if (hit) {
                target.remove_status("qixing_mark", true);
                target.add_status({
                    id: "qixing_mark",
                    name: "星位",
                    desc: "天罡剑气在你周身留下星位标记，可被七星绝命剑引爆",
                    duration: 12000,
                    count: stars,
                    max_count: 7,
                    override: 1,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var stars = SKILL.get("qixingjian").query_beidou_stars(me);
            var count = 3 + Math.min(4, stars - 1);
            var per = 70 + parseInt(lv / 50);
            if (per > 100) per = 100;
            return "按当前北斗阵势攻出" + count + "剑，每剑造成" + per
                + "%攻击伤害并忽视10%防御；命中后留下" + stars + "层星位标记。";
        }
    }
};
