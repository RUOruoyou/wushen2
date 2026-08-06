this.inherits(SKILL);
this.name = "绝情掌诀";
this.id = "suiyuzhi";
this.grade = 3;
this.family = FAMILIES.YIHUA;
this.desc = "绝情掌的上乘心诀，将冷冽内劲尽数灌入掌风，以魂飞魄散之势正面摧敌。";
this.attack_actions = [
    "$N双掌一错，一式「情断义绝」拍向$n的$l",
    "$N掌心寒意骤盛，使出「心灰意冷」直逼$n中门",
    "$N身形轻转，一招「魂不守舍」连拍$n周身要穴",
    "$N左掌虚引，右掌倏出，一式「魄散神离」直取$n胸前"
];
this.parry_actions = [
    "$p双掌一错，以绝情掌诀封住$P的来势。",
    "$p冷冽掌风一吐，迫得$P攻势一滞。",
    "$p身形微侧，绝情掌劲已切向$P手腕。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 2200,
    skill: {
        unarmed: 180,
        yihuaxinfa: 150,
        huayuebu: 120
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.1) + 25,
            mz: parseInt(lv * 1.5) + 30
        },
        parry: {
            zj: parseInt(lv * 1.2) + 20,
            dex: parseInt(lv / 8) + 2
        }
    };
}
this.on_attack_over = function (me, target, par) {
    if (!par.is_dodge && !par.is_parry && !me.query_temp("suiyuzhi")) {
        target.add_status({
            id: "suiyuzhi",
            name: "封脉",
            desc: "绝情掌劲影响你的出手和命中",
            prop: {
                mz_per: -8,
                gjsd_per: -8
            },
            duration: 5000,
            override: 2,
            downside: true
        }, me);
        me.set_temp("suiyuzhi", 1, 15000);
    }
}
this.pfm = {
    fengmai: {
        name: "魂飞魄散",
        distime: 22000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 18,
        release_time: 0,
        use: function (me, target, lv) {
            var per = 145 + parseInt(lv / 24);
            if (per > 195) per = 195;
            var time = 6000 + lv * 4;
            if (time > 11000) time = 11000;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.18,
                no_weapon: true,
                diff_fy: 18,
                attack_msg: "<hic>$N将内力尽数注于掌风，双掌猛然拍向$n，使出绝情掌诀「魂飞魄散」。</hic>",
                damage_msg: "<hir>$n被凌厉掌风正面击中，心神震荡，攻守顿时散乱。</hir>"
            })) {
                target.add_status({
                    id: "suiyuzhi",
                    name: "封脉",
                    desc: "魂飞魄散扰乱你的命中和出手速度",
                    prop: {
                        mz_per: -12,
                        gjsd_per: -12
                    },
                    duration: time,
                    override: 2,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 145 + parseInt(lv / 24);
            if (per > 195) per = 195;
            var time = 6000 + lv * 4;
            if (time > 11000) time = 11000;
            return "造成" + per + "%攻击伤害并忽视18%防御，命中后降低敌方命中和出手速度，持续" + (time / 1000) + "秒。";
        }
    }
};
