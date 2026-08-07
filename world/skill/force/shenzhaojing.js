this.inherits(SKILL);
this.name = "神照经";
this.id = "shenzhaojing";
this.grade = 4;
this.first_title = "神照传人";
this.force_rad = 0.80;
this.desc = "丁典所传上乘内功，真气绵密深厚，尤善护心续脉、疗伤回气。修至深处可化拳意，内外兼修。";
//装为拳脚时的普通攻击描述
this.attack_actions = [
    "$N运起神照真气，一拳沉稳有力地击向$n的$l",
    "$N拳风带起隐隐劲气，直取$n的$l",
    "$N跨步上前，一记朴实的直拳打向$n的$l",
    "$N拳势虽简，内劲却深，一拳轰向$n的$l"
];
this.can_enables = ["force", "unarmed"];
this.learn_condition = {
    max_mp: 6000,
    skill: {
        force: 400,
        literate: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            str: parseInt(lv * 0.17) + 6,
            con: parseInt(lv * 0.17) + 6,
            dex: parseInt(lv * 0.17) + 6,
            int: parseInt(lv * 0.17) + 6,
            limit_mp: lv * 150,
            max_hp: lv * 16,
            diff_downside_per: 8 + parseInt(lv / 400),
            desc: "唯一：将你内力的80%转化为气血"
        },
        unarmed: {
            gj: parseInt(lv * 1.7),
            mz: parseInt(lv * 1.7),
            str: parseInt(lv * 0.21),
            con: parseInt(lv * 0.21)
        }
    };
};
this.pfm = {
    shenzhao: {
        name: "神照",
        distime: 60000,
        enable_skill: "force",
        mp: 1020,
        release_time: 500,
        use_type: 2,
        use: function (me, target, lv) {
            var add = parseInt(lv * 0.21);
            var time = 30000;
            me.send_room("<hig>$N默运神照经，真气流转周身，气血精神为之一振。</hig>");
            me.add_status({
                id: "shenzhao_shenzhao",
                name: "神照",
                desc: "神照护体，根骨、臂力、身法提升",
                duration: time,
                override: 2,
                prop: {
                    con: add,
                    str: add,
                    dex: add
                },
                only_combat: true,
                start_msg: "<hig>$N周身神照真气流转，气色大为不同。</hig>",
                finish_msg: "<hig>$N的神照真气渐渐收回丹田。</hig>"
            });
        },
        query_desc: function (me, lv) {
            var add = parseInt(lv * 0.21);
            return "神照护体，30秒内增加你" + add + "点根骨、臂力和身法。";
        }
    },
    quanJing: {
        name: "拳经",
        distime: 20000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 1020,
        release_time: 500,
        //护盾存在时冷却额外缩短（护盾期间拳经冷却减少）
        query_distime: function (me, lv, is_ref) {
            var dis = this.distime;
            if (is_ref) dis = dis * 2;
            //保留通用减冷却装备的影响
            dis = dis - me.query_prop("distime");
            dis = dis - dis * me.query_prop("distime_per") / 100;
            if (me.query_temp("shield") > 0) {
                dis = dis - dis * 30 / 100;
            }
            if (dis < 3000) return 3000;
            return parseInt(dis);
        },
        use: function (me, target, lv) {
            //纯臂力加成的直拳伤害
            var gj = me.str * (8 + parseInt(lv / 50)) + lv * 6;
            var sh = me.do_attack({
                target: target,
                gj: gj,
                mz: me.mz,
                no_weapon: true,
                attack_msg: "<hiy>$N跨步沉肩，一记朴实无华的直拳带着深沉内劲轰向$n。</hiy>",
                damage_msg: "<hir>$p闪避不及，被$P这拳结结实实打中，闷哼一声退了几步。</hir>",
                miss_msg: "<cyn>$p见拳势沉重，侧身及时躲开了这一击。</cyn>"
            });
            me.end_attack(target);
            //命中后给自己施加固定数值吸收护盾，臂力越高护盾越厚
            if (sh > 0) {
                var shield = me.str * (12 + parseInt(lv / 40)) + lv * 30;
                var time = 10000 + lv * 5;
                if (time > 18000) time = 18000;
                me.set_temp("shield", shield, time);
                me.send_room("<hiy>$N借拳劲回护周身，凝出一层厚实的拳意护盾。</hiy>");
                me.notify("<hiy>拳经命中，你获得" + shield + "点护盾。</hiy>");
            }
        },
        query_desc: function (me, lv) {
            var gj = me.str * (8 + parseInt(lv / 50)) + lv * 6;
            var shield = me.str * (12 + parseInt(lv / 40)) + lv * 30;
            return "一式直拳，臂力越高造成的伤害越大（约" + gj + "点伤害）；命中后给自己施加" + shield + "点吸收伤害的护盾，护盾存在期间拳经冷却减少30%。";
        }
    }
};
