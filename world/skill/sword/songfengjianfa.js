this.inherits(SKILL);
this.name = "松风剑法";
this.id = "songfengjianfa";
this.grade = 3;

this.attack_actions = [
    "$N手中$w一抖，一招<HIC>「松涛阵阵」</HIC>，剑势如松涛般层层涌向$n",
    "$N一招<HIG>「风入松林」</HIG>，$w连点数下，剑气如风穿松针，刺向$n的$l",
    "$N使一招<HIB>「松风观月」</HIB>，剑光如月华，自松影间刺出，罩向$n",
    "$N一招<HIM>「寒松傲雪」</HIM>，$w寒光凛凛，直取$n的咽喉",
    "$N一招<GRN>「松下听涛」</GRN>，沉肩坠肘，$w平刺而出，挟风声刺向$n",
    "$N一招<HIY>「松风无影」</HIY>，$w舞得只见剑影不见剑身，铺天盖地罩向$n"
];
this.parry_actions = SKILL.get("parry").parry_actions;
this.desc = "青城派镇派剑法，剑势如松风，越战越疾，每次出剑都在积蓄速度。";
//<$1>$2</$1>
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 3000,
    dex1: 22,
    skill: {
        sword: 350
    }
};
// 每次出剑后累积一层"松风"，提升攻速，松月无影消耗层数
this.on_attack_over = function (me, target, par) {
    var lv = me.query_skill("songfengjianfa", 0);
    var count = me.query_temp("songfeng_ceng");
    if (count === undefined || count === null) count = 0;
    if (count < 10) count++;
    me.set_temp("songfeng_ceng", count, 8000);
    var per = 2 + Math.floor(lv / 100);
    if (per > 8) per = 8;
    me.add_status({
        id: "songfeng_speed",
        name: "松风",
        desc: "松风剑法，攻速随出剑累积",
        duration: 8000,
        prop: {
            gjsd_per: count * per
        },
        override: 2
    });
}
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.5) + 15,
            mz: parseInt(lv * 1.4) + 10,
            dex: parseInt(lv / 12)
        }, parry: {
            zj: parseInt(lv * 1.4) + 10,
            max_hp: lv * 6,
            dex: parseInt(lv / 12)
        }
    };
}
this.slots = [
    {
        prop: 'sfjf_max',
        value: (lv) => 15,
        format: (val) => {
            return '松月无影最大攻击次数提升';
        }
    },
    {
        prop: 'sfjf_per',
        value: (lv) => 1,
        count: 2,
        format: (val) => {
            return '松月无影每层所需松风层数减少';
        }
    }
];
this.pfm = {
    songyue:
    {
        name: "松月无影",
        distime: 20000,
        enable_skill: "sword",
        release_time: 500,
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        use: function (me, target, lv) {
            var ceng = me.query_temp("songfeng_ceng") || 0;
            var need = 3 - me.query_prop('sfjf_per');
            if (need < 1) need = 1;
            var count = 1 + Math.floor(ceng / need);
            var max = 8 + me.query_prop('sfjf_max');
            if (count > max) count = max;
            if (count < 1) count = 1;
            var per = 70 + parseInt(lv / 40);
            me.send_room("<hir>$N借松风剑势，瞬间出剑，剑光如月下松影，「松月无影」连刺$n" + count + "剑</hir>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                    attack_before: "<hiy>松影连珠</hiy>",
                    no_append: true
                });
            }
            me.end_attack(target);
            // 释放后清空累积
            me.remove_temp("songfeng_ceng");
            me.remove_status("songfeng_speed");
        },
        query_desc: function (me, lv) {
            var ceng = me.query_temp("songfeng_ceng") || 0;
            var count = 1 + Math.floor(ceng / 3);
            var per = 70 + parseInt(lv / 40);
            return "消耗你积累的速度，瞬间出剑，每3层松风增加你一次攻击次数（当前" + count + "剑），每剑造成" + per + "%伤害";
        }
    }
};
