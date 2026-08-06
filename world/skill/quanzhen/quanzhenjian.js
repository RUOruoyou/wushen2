this.inherits(SKILL);
this.name = "全真剑法";
this.id = "quanzhenjian";
this.grade = 2;
this.desc = "全真教嫡传剑法，剑势古朴严整，以定阳、化三清、缠字和同归诸诀层层进境。";
this.family = FAMILIES.QUANZHEN;
this.attack_actions = [
    "$N长剑斜指，一招「定阳针」，剑尖凝成一点寒芒刺向$n的$l",
    "$N脚踏七星，一式「七星聚会」，手中$w连环点向$n周身要害",
    "$N剑势忽分忽合，使出「一气化三清」，三道剑影齐齐罩向$n",
    "$N手中$w轻轻一抖，一招「白虹贯日」直奔$n的$l",
    "$N左手捏诀，右手$w一招「三环套月」，剑光连绵不绝地圈向$n",
    "$N长剑回环，一式「罡风扫叶」，剑气贴地卷向$n下盘"
];
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        sword: 120,
        quanzhenxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.25 + 15),
            mz: parseInt(lv * 1.25 + 15)
        },
        parry: {
            zj: parseInt(lv * 1.2 + 15),
            fy: parseInt(lv * 0.8 + 10)
        }
    };
}
this.pfm = {
    sanqing: {
        name: "一气化三清",
        distime: 15000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        use: function (me, target, lv) {
            var array_lv = me.query_skill("beidouzhen", 0);
            var count = 3 + parseInt(array_lv / 250);
            if (count > 5) count = 5;
            var per = 65 + parseInt(lv / 35);
            if (per > 100) per = 100;
            me.send_room("<hiy>$N使出全真剑法「一气化三清」，手中$W晃成三道白虹，循七星方位卷向$n。</hiy>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                    attack_before: i ? "紧跟着" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var count = 3 + parseInt(me.query_skill("beidouzhen", 0) / 250);
            if (count > 5) count = 5;
            var per = 65 + parseInt(lv / 35);
            if (per > 100) per = 100;
            return "连续出剑" + count + "次，每剑造成" + per + "%攻击伤害；北斗阵法越高，剑数越多。";
        }
    },
    ding: {
        name: "定阳针",
        distime: 18000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 14,
        use: function (me, target, lv) {
            var per = 125 + parseInt(lv / 22);
            if (per > 175) per = 175;
            me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.35,
                diff_fy: 12,
                attack_msg: "<hic>$N脚下左弓右箭，神气完足，一式全真剑法「定阳针」斜斜刺向$n。</hic>",
                damage_msg: "<hir>$n被这一点凝练剑光刺中，护体气机应声而破。</hir>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 125 + parseInt(lv / 22);
            if (per > 175) per = 175;
            return "以高命中剑招造成" + per + "%攻击伤害，并忽视敌方12%防御。";
        }
    },
    chan: {
        name: "缠字诀",
        distime: 24000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 16,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 3000 + lv * 4;
            if (time > 9000) time = 9000;
            if (me.do_attack({
                target: target,
                gj: me.gj * (105 + Math.min(35, parseInt(lv / 30))) / 100,
                mz: me.mz * 1.2,
                attack_msg: "<hiy>$N使出全真剑法「缠字诀」，手中$W上挑下刺，剑势从四面八方缠向$n。</hiy>",
                damage_msg: "<hir>$n只觉剑上压力一层强过一层，攻守都被牢牢缠住。</hir>"
            })) {
                target.add_status({
                    id: "busy",
                    name: "剑缠",
                    desc: "你被全真剑法缠住，无法攻击、招架",
                    is_busy: true,
                    duration: time,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 3000 + lv * 4;
            if (time > 9000) time = 9000;
            return "以严密剑势攻击，命中后使敌人忙乱" + (time / 1000) + "秒。";
        }
    },
    tonggui: {
        name: "同归剑法",
        distime: 36000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 25,
        use: function (me, target, lv) {
            var time = 10000 + lv * 5;
            if (time > 18000) time = 18000;
            me.send_room("<hir>$N左手捏诀，右手握紧$W，使出全真剑法「同归剑法」，拼着门户大开直取$n。</hir>", target);
            me.do_attack({
                target: target,
                gj: me.gj * (145 + Math.min(45, parseInt(lv / 25))) / 100,
                mz: me.mz * 1.15,
                diff_fy: 18
            });
            me.add_status({
                id: "quanzhen_tonggui",
                name: "同归",
                desc: "同归剑意提升攻击和命中，但会削弱自身防御",
                duration: time,
                override: 2,
                prop: {
                    gj_per: 12 + Math.min(8, parseInt(lv / 300)),
                    mz_per: 10,
                    fy_per: -15,
                    ds_per: -10
                }
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 10000 + lv * 5;
            if (time > 18000) time = 18000;
            return "舍守强攻造成高额伤害，随后" + (time / 1000) + "秒内提升攻击和命中，但降低防御与躲闪。";
        }
    }
};
