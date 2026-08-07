this.inherits(SKILL);
this.name = "狂风快刀";
this.id = "kuangfengkuaidao";
this.grade = 3;

this.attack_actions = [
    "$N手中$w大开大阖，一招<HIY>「狂风扫叶」</HIY>，挟劲风横扫$n的$l",
    "$N一招<HIC>「风卷残云」</HIC>，刀势旋转，刀光如轮般罩向$n",
    "$N$w一翻，一招<HIB>「狂风骤雨」</HIB>，瞬息间劈出数刀，齐齐砍向$n的$l",
    "$N使一招<HIM>「逆风行」</HIM>，贴地前冲，$w反手一撩，划向$n的腰间",
    "$N一招<GRN>「风声鹤唳」</GRN>，$w连环挥出，刀风凌厉，逼得$n连连后退",
    "$N一招<HIW>「狂风二十一式」</HIW>起手，$w舞成一片白光，铺天盖地斩向$n"
];
this.parry_actions = SKILL.get("parry").parry_actions;
this.desc = "采花大盗田伯光的成名刀法，刀势如狂风骤雨，以快制敌。";
//<$1>$2</$1>
this.can_enables = ["blade"];
this.learn_condition = {
    max_mp: 3000,
    skill: {
        blade: 300
    }
};
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: parseInt(lv * 1.51),
            bj_per: parseInt(lv / 250),
            dex: parseInt(lv / 5)
        }
    };
}
this.slots = [
    {
        prop: 'kfkd_sf_per',
        value: (lv) => 15,
        format: (val) => {
            return '狂风二十一式释放时间减少15%';
        }
    },
    {
        prop: 'kfkd_gjsd',
        value: (lv) => 20,
        format: (val) => {
            return '狂风二十一式攻速增益提高20%';
        }
    }
];
this.pfm = {
    ershi:
    {
        name: "狂风二十一式",
        distime: 30000,
        enable_skill: "blade",
        release_time: 4000,
        weapon_type: WEAPON_TYPE.BLADE,
        releasetime_per_key: 'kfkd_sf_per',
        mp: 20,
        is_weapon_buff: true,
        use: function (me, target, lv) {
            me.send_room("<hir>$N厉喝一声，使出「狂风二十一式」，$W化作漫天刀影，狂风般卷向$n</hir>", target);

            var mz = me.mz * 1.05;
            var gj = me.gj * 0.55;

            me.add_status({
                id: "blade",
                name: "狂风",
                desc: "狂风快刀之狂风，大幅增加你的攻速",
                duration: 5000,
                prop: {
                    gjsd_per: 100 + me.query_prop('kfkd_gjsd')
                },
                finish_msg: "$N的狂风刀势渐渐平复。"
            });

            me.call_interval(
                function () {
                    if (!me.can_attack()) return false;
                    target = me.query_enemy();
                    if (!target) return false;
                    me.do_attack({
                        target: target,
                        gj: gj,
                        mz: mz,
                        attack_before: "<hiy>狂风紧接</hiy>",
                        no_append: true
                    });
                    if (!me.end_attack(target)) {
                        return false;
                    }
                },
                238,
                21
            );
        },
        query_desc: function (me, lv) {
            return "快速攻击敌方21招，攻击期间增加你100%的攻速";
        }
    }
};
