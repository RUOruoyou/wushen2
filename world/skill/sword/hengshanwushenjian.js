this.inherits(SKILL);
this.name = "衡山五神剑";
this.id = "hengshanwushenjian";
this.grade = 3;

this.attack_actions = [
    "$N手中$w一颤，一招<HIR>「祝融焚天」</HIR>，剑势如烈焰，直刺$n的$l",
    "$N一招<HIG>「石廪擎天」</HIG>，$w沉重如山，自上而下劈向$n",
    "$N使一招<HIC>「芙蓉照水」</HIC>，剑光潋滟，连点$n周身数处",
    "$N一招<HIW>「鹤翔紫阁」</HIW>，纵身高跃，$w自空中下击$n的$l",
    "$N一招<HIB>「天柱擎云」</HIB>，$w直出如柱，挟雷霆之势刺向$n胸口",
    "$N一招<HIM>「五神归一」</HIM>，五道剑气齐发，笼罩$n全身要害"
];
this.parry_actions = SKILL.get("parry").parry_actions;
this.desc = "衡山派镇派绝学，融祝融、石廪、芙蓉、鹤翔、天柱五路剑法为一，剑势磅礴。";
//<$1>$2</$1>
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 3000,
    str1: 22,
    skill: {
        sword: 350
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.5) + 15,
            str: parseInt(lv / 10),
            mz: parseInt(lv * 1.4) + 10
        }, parry: {
            zj: parseInt(lv * 1.5) + 12,
            str: parseInt(lv / 10),
            fy: parseInt(lv * 1.0) + 8
        }
    };
}
this.slots = [
    {
        prop: 'hswsj_per',
        value: (lv) => 8,
        format: (val) => {
            return '五神剑附加伤害提高8%';
        }
    },
    {
        prop: 'hswsj_per2',
        value: (lv) => 5,
        count: 2,
        format: (val) => {
            return '五神赋属性增益提高5%';
        }
    }
];
this.pfm = {
    wushen:
    {
        name: "五神剑",
        distime: 13000,
        enable_skill: "sword",
        release_time: 4000,
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        use: function (me, target, lv) {
            var per = 110 + parseInt(lv / 40) + me.query_prop('hswsj_per');
            me.send_room("<hir>$N长剑连挥，五神齐出，「祝融、石廪、芙蓉、鹤翔、天柱」五道剑气依次刺向$n</hir>", target);
            for (var i = 0; i < 5; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                    attack_before: "<hiy>五神相承</hiy>",
                    no_append: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 110 + parseInt(lv / 40);
            return "瞬间对敌人攻击5次，每次造成" + per + "%伤害";
        }
    },
    wushenfu:
    {
        name: "五神赋",
        distime: 30000,
        enable_skill: "sword",
        release_time: 4000,
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        use: function (me, target, lv) {
            var names = ["祝融", "石廪", "芙蓉", "鹤翔", "天柱"];
            var props = [
                { gj_per: 30 },
                { fy_per: 30 },
                { ds_per: 30 },
                { mz_per: 30 },
                { gjsd_per: 30 }
            ];
            var idx = Math.floor(Math.random() * 5);
            var per = 30 + me.query_prop('hswsj_per2');
            var time = 18000 + lv * 2;
            if (time > 25000) time = 25000;
            var prop = {};
            for (var k in props[idx]) {
                prop[k] = per;
            }
            me.send_room("<hiw>$N吟诵五神赋，召唤「" + names[idx] + "」之神护体，周身气势大盛</hiw>", target);
            me.add_status({
                id: "sword",
                name: names[idx] + "之神",
                desc: "五神赋之" + names[idx] + "，增加你的战斗属性",
                duration: time,
                prop: prop,
                finish_msg: "$N护体的" + names[idx] + "之神渐渐散去。"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 30;
            var time = 18000 + lv * 2;
            if (time > 25000) time = 25000;
            return "召唤祝融/石廪/芙蓉/鹤翔/天柱之一，" + (time / 1000) + "秒内随机增加你的某项战斗属性" + per + "%";
        }
    }
};
