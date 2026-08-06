this.inherits(SKILL);
this.name = "辟邪剑法";
this.id = "pixiejian";
this.grade = 3;
this.first_title = "辟邪传人";
this.family = FAMILIES.RIYUE;
this.desc = "以极端速度和诡异身法催动的禁忌剑术，攻势如鬼魅连闪，但运剑时护体空门大开。";
this.attack_actions = [
    "$N身形一闪，一式「流星飞坠」已刺到$n的$l",
    "$N手中$w忽隐忽现，使出「鬼影幢幢」连点$n要穴",
    "$N足不沾地，一招「江上弄笛」从$n侧后掠过",
    "$N剑光骤缩如针，一式「群邪辟易」直贯$n中门",
    "$N身影一分为三，三点寒芒同时袭向$n"
];
this.parry_actions = [
    "$p身形骤闪，手中剑光已从侧面截住$P来招。",
    "$p不与$P硬接，只以快绝身法避过锋芒。",
    "$p剑尖连点，在$P招式成形前封住数处变化。"
];
this.dodge_actions = [
    "$n身影如鬼魅般一闪，$N眼前只余一道残像。",
    "$n足尖轻点，已从$N招式尚未合拢的缝隙穿过。",
    "$n衣袖微扬，转眼绕到了$N身侧。",
    "$n身形忽近忽远，令$N根本无法锁定。"
];
this.can_enables = ["sword", "dodge", "parry"];
this.learn_condition = {
    max_mp: 8500,
    dex: 36,
    skill: {
        sword: 320,
        dodge: 320,
        riyuejian: 260,
        piaomiaoshenfa: 300,
        riyueguanghua: 300
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.62) + 42,
            mz: parseInt(lv * 1.62) + 45,
            bj_per: 6 + parseInt(lv / 350),
            fy_per: -10,
            desc: "辟邪剑法以护体空门换取极高攻击、命中和暴击"
        },
        dodge: {
            ds: parseInt(lv * 1.75) + 45,
            dex: parseInt(lv / 5) + 4,
            releasetime_per: 8
        },
        parry: {
            zj: parseInt(lv * 1.4) + 30,
            fy: parseInt(lv * 0.72) + 18
        }
    };
};
this.pfm = {
    bixie: {
        name: "辟邪七闪",
        distime: 29000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 27,
        use: function (me, target, lv) {
            var hasGhost = me.query_status("pixie_guiying");
            var count = hasGhost ? 7 : 4;
            var per = 60 + parseInt(lv / 50);
            if (per > 90) per = 90;
            if (hasGhost) per += 8;
            me.send_room(hasGhost
                ? "<hir>$N借鬼影无踪之势骤然消失，七道细若游丝的剑光同时刺向$n。</hir>"
                : "<him>$N身形连闪，四道诡异剑光从不同方位刺向$n。</him>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.22,
                    diff_fy: hasGhost ? 12 : 6,
                    attack_before: i ? "残影一晃，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 60 + parseInt(lv / 50);
            if (per > 90) per = 90;
            return "通常连续攻击四次，每剑造成" + per
                + "%攻击伤害；处于鬼影状态时提升为七次，并额外提高伤害和破防。";
        }
    },
    guiying: {
        name: "鬼影无踪",
        distime: 38000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 30,
        use_condition: "需要当前气血高于15%",
        check: function (me) {
            return me.hp > me.max_hp * 0.15;
        },
        use: function (me, target, lv) {
            var time = 7000 + lv * 4;
            if (time > 15000) time = 15000;
            var cost = parseInt(me.max_hp * 0.08);
            if (cost > me.hp - 1) cost = me.hp - 1;
            if (cost > 0) me.add_hp(-cost);
            me.add_status({
                id: "pixie_guiying",
                name: "鬼影",
                desc: "鬼影无踪提升命中、躲闪和出招速度，同时降低防御",
                duration: time,
                override: 2,
                prop: {
                    gj_per: 12,
                    mz_per: 25,
                    ds_per: 25,
                    releasetime_per: 25,
                    fy_per: -18
                }
            });
            me.send_room("<him>$N逆运真气逼出一口鲜血，身影随即化为无声无息的鬼魅残像。</him>", target);
        },
        query_desc: function (me, lv) {
            var time = 7000 + lv * 4;
            if (time > 15000) time = 15000;
            return "消耗8%最大气血，在" + (time / 1000)
                + "秒内提升12%攻击、25%命中与躲闪、25%出招速度，但降低18%防御；同时强化辟邪七闪。";
        }
    }
};
