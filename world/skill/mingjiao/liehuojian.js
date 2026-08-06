this.inherits(SKILL);
this.name = "烈火剑法";
this.id = "liehuojian";
this.grade = 2;
this.family = FAMILIES.MINGJIAO;
this.desc = "明教烈火旗传下的剑法，剑路刚烈迅疾，连环三剑如烈焰卷地。";
this.attack_actions = [
    "$N手中$w一振，一式「烈焰初腾」直刺$n的$l",
    "$N踏前半步，使出「火卷残云」，$w横扫$n腰间",
    "$N剑势忽盛，一招「焚风裂石」挟热浪劈向$n",
    "$N手腕连抖，点点剑光如火星般罩向$n周身"
];
this.parry_actions = [
    "$p剑光一横，如火墙般封住$P的攻势。",
    "$p手中剑势连环，将$P来招逼向一旁。",
    "$p踏着烈火旗步法回剑护住中宫。"
];
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 1200,
    skill: {
        sword: 100,
        mingjiaoxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.15) + 18,
            mz: parseInt(lv) + 15
        },
        parry: {
            zj: parseInt(lv) + 15,
            fy: parseInt(lv * 0.65) + 10
        }
    };
};
this.pfm = {
    sanjue: {
        name: "烈火三绝剑",
        distime: 19000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 17,
        use: function (me, target, lv) {
            var per = 88 + parseInt(lv / 45);
            if (per > 120) per = 120;
            var hit = false;
            me.send_room("<hir>$N长剑一展，烈火三绝剑化作三道赤红剑光卷向$n。</hir>", target);
            for (var i = 0; i < 3; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.08,
                    attack_before: i ? "烈焰再起，" : ""
                })) hit = true;
            }
            if (hit) {
                target.add_status({
                    id: "liehuojian",
                    name: "灼伤",
                    desc: "烈火剑气降低你的防御",
                    duration: 7000,
                    override: 2,
                    downside: true,
                    prop: {
                        fy_per: -10
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 88 + parseInt(lv / 45);
            if (per > 120) per = 120;
            return "连续攻击三次，每剑造成" + per + "%攻击伤害，命中后降低敌方10%防御。";
        }
    }
};
