this.inherits(SKILL);
this.name = "金蛇剑法";
this.id = "jinshejianfa";
this.grade = 3;
this.attack_actions = [
    "$N手中$w一抖，一招「金蛇出洞」直刺$n的$l",
    "$N身形游走，$w化作金蛇盘旋，罩向$n周身",
    "$N一招「金蛇狂舞」，剑光如蛇信吞吐，逼向$n",
    "$N反手一剑，剑势诡异地划向$n的$l"
];
this.desc = "金蛇郎君所创的一门剑法";
this.can_enables = ["sword"];
this.learn_condition = {
    max_mp: 10000,
    skill: { sword: 400 }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.31),
            mz: parseInt(lv * 1.31),
            bj_per: 6
        }
    };
};
this.pfm = {
    kuangwu: {
        name: "金蛇狂舞",
        distime: 20000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        release_time: 4000,
        use: function (me, target, lv) {
            me.do_attack({ target: target, gj: me.gj * 2, mz: me.mz });
            me.end_attack(target);
        },
        query_desc: function () {
            return "对敌人造成200%攻击力的伤害，命中后使敌人忙乱6秒";
        }
    },
    zhuihun: {
        name: "金蛇追魂",
        distime: 30000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        release_time: 4000,
        use: function (me, target, lv) {
            if (me.do_attack({ target: target, gj: me.gj, mz: me.mz })) {
                target.add_status({ id: "faint", name: "昏迷", is_faint: true, downside: true, duration: 4000 }, me);
            }
            me.end_attack(target);
        },
        query_desc: function () {
            return "对敌人造成伤害，命中后使敌人昏迷4秒";
        }
    }
};
