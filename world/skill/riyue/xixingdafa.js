this.inherits(SKILL);
this.name = "吸星大法";
this.id = "xixingdafa";
this.grade = 4;
this.first_title = "吸星传人";
this.family = FAMILIES.RIYUE;
this.force_rad = 0.78;
this.desc = "任我行镇教绝学，能牵引敌方内力归入己身，并扰乱对手经脉运转。";
this.can_enables = ["force", "parry"];
this.learn_condition = {
    max_mp: 7000,
    skill: {
        force: 300,
        riyuexinfa: 300,
        tianmojian: 260,
        huanmolongtianwu: 220
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            con: parseInt(lv / 6) + 3,
            dex: parseInt(lv / 7) + 3,
            max_hp: lv * 8,
            limit_mp: lv * 110,
            desc: "命中敌人后会间歇吸取其当前内力；唯一：将你内力的78%转化为气血"
        },
        parry: {
            zj: parseInt(lv * 1.5) + 35,
            fy: parseInt(lv) + 25,
            desc: "招架成功时会削减敌方当前内力"
        }
    };
};
this.do_force_attack = function (me, target, par) {
    if (!target || par.is_parry || me.query_temp("xixing_xi")) return 0;
    var drain = parseInt(me.query_skill("xixingdafa", 0) / 4) + 20;
    if (drain > target.mp) drain = target.mp;
    if (drain <= 0) return 0;
    target.add_mp(-drain);
    me.add_mp(parseInt(drain * 0.6));
    me.send_combat("<hic>$N五指微张暗运吸星大法，$n的内力丝丝缕缕地涌入$P体内。</hic>", target);
    me.set_temp("xixing_xi", 1, 8000);
    return 0;
};
this.on_parry_over = function (me, target, par) {
    if (!par.is_parry || me.query_temp("xixing_parry")) return;
    var drain = parseInt(me.query_skill("xixingdafa", 0) / 3) + 30;
    if (drain > target.mp) drain = target.mp;
    if (drain > 0) {
        target.add_mp(-drain);
        me.add_mp(parseInt(drain * 0.4));
        me.send_combat("<hic>$N卸力之际顺势牵引，$n的内力顺着攻势丝丝泄入$P经脉。</hic>", target);
    }
    me.set_temp("xixing_parry", 1, 10000);
};
this.pfm = {
    xi: {
        name: "吸取真气",
        distime: 28000,
        enable_skill: "force",
        mp: 20,
        use: function (me, target, lv) {
            var per = 120 + parseInt(lv / 35);
            if (per > 165) per = 165;
            var hit = me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.2,
                no_weapon: true,
                diff_fy: 12,
                attack_msg: "<him>$N五指虚按$n膻中，吸星真气如漩涡般猛然牵引。</him>"
            });
            if (hit) {
                var drain = lv * 3 + parseInt(me.max_mp * 0.02);
                if (drain > target.mp) drain = target.mp;
                if (drain > 0) {
                    target.add_mp(-drain);
                    me.add_mp(parseInt(drain * 0.75));
                    me.notify("你以吸星大法夺取了" + drain + "点内力。");
                }
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 120 + parseInt(lv / 35);
            if (per > 165) per = 165;
            var drain = lv * 3 + parseInt(me.max_mp * 0.02);
            return "造成" + per + "%攻击伤害；命中后吸取目标" + drain + "点内力，并恢复其中75%。";
        }
    },
    sangong: {
        name: "功散八脉",
        distime: 42000,
        enable_skill: "force",
        mp: 32,
        use: function (me, target, lv) {
            var per = 135 + parseInt(lv / 32);
            if (per > 180) per = 180;
            var time = 5500 + lv * 3;
            if (time > 10500) time = 10500;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.2,
                no_weapon: true,
                diff_fy: 18,
                attack_msg: "<hir>$N吸星真气骤然逆转，沿$n经脉冲入八脉，意欲震散其功力。</hir>"
            })) {
                target.add_status({
                    id: "xixing_sangong",
                    name: "散功",
                    desc: "吸星真气扰乱八脉，压制你的绝招、攻击和防御",
                    duration: time,
                    override: 2,
                    downside: true,
                    prop: {
                        no_pfm: 1,
                        gj_per: -15,
                        fy_per: -15,
                        expend_mp_per: -20
                    }
                }, me);
                var drain = lv * 2;
                if (drain > target.mp) drain = target.mp;
                target.add_mp(-drain);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 135 + parseInt(lv / 32);
            if (per > 180) per = 180;
            var time = 5500 + lv * 3;
            if (time > 10500) time = 10500;
            return "造成" + per + "%攻击伤害并忽视18%防御，削减内力并压制目标绝招、攻击、防御和内力效率" + (time / 1000) + "秒。";
        }
    }
};
