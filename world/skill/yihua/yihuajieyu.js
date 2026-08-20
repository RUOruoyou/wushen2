this.inherits(SKILL);
this.name = "移花接木";
this.id = "yihuajieyu";
this.grade = 4;
this.first_title = "移花传人";
this.family = FAMILIES.YIHUA;
this.desc = "移花宫镇派绝学，天下卸劲与借力打力之极致。以柔克刚、借彼之力还施彼身。移花可剥夺敌势封断绝招，接木可纳劲蓄势生生不息，镜返更能化出玉镜之壁反震万钧劲力。";
this.attack_actions = [
    "$N双掌虚虚一引，一式「移花接木」牵向$n的$l",
    "$N身形微侧，使出「左牵右引」，顺着$n来势切入",
    "$N掌影忽聚忽散，一招「石沉大海」轻飘飘印向$n胸口",
    "$N双手划出半弧，一式「漩流回转」将劲力送向$n的$l",
    "$N脚步轻转，掌势似借似还，逼得$n难辨虚实"
];
this.parry_actions = [
    "$p双掌一引，以移花接木顺势卸开$P的攻势。",
    "$p身形不退反进，借$P来势轻轻一带，便化去了这一招。",
    "$p掌心虚按，将$P的力道牵偏，随即露出反击之机。"
];
this.dodge_actions = [
    "$n身形不动，$N一招击下却如石沉大海，劲力尽数被导入地下。",
    "$n轻轻一带，$N只觉自己的招数反击回来，慌忙收势。",
    "$n左牵右引，身形如处漩流，令$N根本找不到落手之处。",
    "$n双手回圈，$N只觉前方仿佛多了一堵无形气墙。"
];
this.can_enables = ["unarmed", "parry", "dodge"];
this.learn_condition = {
    max_mp: 7000,
    skill: {
        dodge: 300,
        parry: 300,
        mingyugong: 300,
        huayuebu: 220
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.5) + 40,
            mz: parseInt(lv * 1.4) + 35,
            str: parseInt(lv / 8) + 2
        },
        parry: {
            zj: parseInt(lv * 1.8) + 45,
            fy: parseInt(lv * 1.1) + 30,
            desc: "招架后借力反击（3.5秒CD），附加敌方攻击力；接木状态下CD缩至1.8秒"
        },
        dodge: {
            ds: parseInt(lv * 1.75) + 45,
            fy: parseInt(lv * 1.0) + 25,
            desc: "躲闪后借势反击（3.5秒CD），附带减速；接木状态下CD缩至1.8秒"
        }
    };
};

this.on_parry_over = function (me, target, par) {
    if (!par.is_parry) return;
    var mirror = me.query_temp("yihua_jingfan") > 0 && !me.query_temp("yihua_jingfan_cd");
    var hasJiemu = !!me.query_status("yihua_jiemu");
    var cd = hasJiemu ? 1800 : 3500;

    if (!mirror && me.query_temp("yihuajieyu_parry")) return;

    var skillLv = me.query_skill("yihuajieyu", 0);
    var targetGj = target && target.gj ? target.gj : 0;

    if (mirror) {
        var mirrorGj = Math.max(parseInt(targetGj * 1.2), parseInt(me.gj * 1.0)) + parseInt(skillLv * 8);
        me.do_attack({
            target: target,
            gj: mirrorGj,
            mz: me.mz * 1.25,
            diff_fy: 30,
            attack_msg: "<hio>$N周身明镜止水，双掌化作无匹漩涡，将$n的招式连本带利以「移花接玉」轰然反震回去！</hio>",
            damage_msg: "<hir>$n被自己的刚猛劲力与移花绝劲反噬轰中，气血剧烈翻腾！</hir>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        });
        me.end_attack(target);

        me.set_temp("yihua_jingfan_cd", 1, 1000);
        var left = parseInt(me.query_temp("yihua_jingfan") || 0) - 1;
        if (left > 0) {
            me.set_temp("yihua_jingfan", left);
        } else {
            me.remove_temp("yihua_jingfan");
            me.remove_status("yihua_jingfan", true);
        }
    } else {
        var baseMult = hasJiemu ? 1.8 : 1.3;
        var finalGj = parseInt(me.gj * baseMult) + parseInt(targetGj * 0.25);
        me.do_attack({
            target: target,
            gj: finalGj,
            mz: me.mz * 1.15,
            diff_fy: hasJiemu ? 20 : 10,
            attack_msg: hasJiemu
                ? "<him>$N纳劲归渊，顺着$n攻势猛烈旋引，借彼万钧之力反轰回去！</him>"
                : "<hic>$N借$n攻势未尽之机，使出移花接木，将来劲反送回去。</hic>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        });
        me.end_attack(target);
        me.set_temp("yihuajieyu_parry", 1, cd);
    }

    // 每次反击回哺自身气血与内力
    var hpHeal = Math.max(50, parseInt(me.max_hp * (hasJiemu ? 0.02 : 0.01)) + skillLv);
    var mpHeal = Math.max(50, parseInt(me.max_mp * (hasJiemu ? 0.03 : 0.02)) + skillLv);
    me.add_hp(hpHeal);
    me.add_mp(mpHeal);
};

this.on_dodge_over = function (me, target, par) {
    if (!par.is_dodge) return;
    var mirror = me.query_temp("yihua_jingfan") > 0 && !me.query_temp("yihua_jingfan_cd");
    var hasJiemu = !!me.query_status("yihua_jiemu");
    var cd = hasJiemu ? 1800 : 3500;

    if (!mirror && me.query_temp("yihuajieyu_dodge")) return;

    var skillLv = me.query_skill("yihuajieyu", 0);
    var targetGj = target && target.gj ? target.gj : 0;

    if (mirror) {
        var mirrorGj = Math.max(parseInt(targetGj * 1.2), parseInt(me.gj * 1.0)) + parseInt(skillLv * 8);
        me.do_attack({
            target: target,
            gj: mirrorGj,
            mz: me.mz * 1.25,
            diff_fy: 30,
            attack_msg: "<hio>$N身形如幻似镜，踏着落英回旋反折，将$n落空之势化作狂暴气旋反轰回去！</hio>",
            damage_msg: "<hir>$n来势落空反遭巨力回扯，身不由己地被震得连退数步！</hir>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        });
        me.end_attack(target);

        me.set_temp("yihua_jingfan_cd", 1, 1000);
        var left = parseInt(me.query_temp("yihua_jingfan") || 0) - 1;
        if (left > 0) {
            me.set_temp("yihua_jingfan", left);
        } else {
            me.remove_temp("yihua_jingfan");
            me.remove_status("yihua_jingfan", true);
        }
    } else {
        var baseMult = hasJiemu ? 1.6 : 1.1;
        var finalGj = parseInt(me.gj * baseMult) + parseInt(targetGj * 0.15);
        if (me.do_attack({
            target: target,
            gj: finalGj,
            mz: me.mz * 1.2,
            diff_fy: hasJiemu ? 15 : 5,
            attack_msg: hasJiemu
                ? "<him>$N花影拂动，足尖在虚空中轻点，牵引$n落空劲力回旋反制！</him>"
                : "<hic>$N身影一转，以移花接木牵动$n落空的劲力，顺势反击。</hic>",
            no_append: true,
            no_append_target: true,
            no_weapon: true
        })) {
            target.add_status({
                id: "yihua_luokong",
                name: "势尽",
                desc: "来势落空，出手速度降低15%",
                duration: 4000,
                override: 2,
                downside: true,
                prop: {
                    gjsd_per: -15
                }
            }, me);
        }
        me.end_attack(target);
        me.set_temp("yihuajieyu_dodge", 1, cd);
    }

    // 每次反击回哺自身气血与内力
    var hpHeal = Math.max(50, parseInt(me.max_hp * (hasJiemu ? 0.02 : 0.01)) + skillLv);
    var mpHeal = Math.max(50, parseInt(me.max_mp * (hasJiemu ? 0.03 : 0.02)) + skillLv);
    me.add_hp(hpHeal);
    me.add_mp(mpHeal);
};

this.pfm = {
    yihua: {
        name: "移花·断脉牵机",
        distime: 24000,
        mp: 30,
        release_time: 0,
        use: function (me, target, lv) {
            var per = 180 + parseInt(lv / 15);
            if (per > 240) per = 240;
            var time = 5000 + lv * 4;
            if (time > 8000) time = 8000;

            var hit = me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.3,
                diff_fy: 25,
                no_weapon: true,
                attack_msg: "<hic>$N双掌虚引，体内明玉真气激荡如潮，一招「移花·断脉牵机」直透$n周身要穴！</hic>",
                damage_msg: "<hir>$n只觉周身气脉如被无形丝线绞紧，内力运转骤滞！</hir>"
            });

            if (hit) {
                // 1. 强力破防与封招
                target.add_status({
                    id: "yihua_yihua",
                    name: "移花印",
                    desc: "经脉被移花真气牵引封锁：躲闪招架大幅降低，且无法施展绝招",
                    duration: time,
                    override: 2,
                    downside: true,
                    prop: {
                        ds_per: -35,
                        zj_per: -35,
                        no_pfm: 1
                    }
                }, me);

                // 2. 剥离并偷取目标身上 1 个正面状态
                if (target.status && target.status.length) {
                    for (var i = target.status.length - 1; i >= 0; i--) {
                        var st = target.status[i];
                        if (st && !st.downside && st.id !== "busy" && st.id !== "faint" && !st.is_busy && !st.is_faint) {
                            var stName = st.name || "护体真气";
                            target.remove_status(st.id, true);
                            me.add_status({
                                id: "yihua_steal",
                                name: "移花·纳势",
                                desc: "移彼之花纳为己用，攻击力提升15%",
                                duration: 10000,
                                override: 2,
                                prop: {
                                    gj_per: 15
                                }
                            }, me);
                            me.send_room("<hic>$N双掌顺势一牵，竟将$n身上的「" + stName + "」气机生生剥除并化归己用！</hic>", target);
                            break;
                        }
                    }
                }
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 180 + parseInt(lv / 15);
            if (per > 240) per = 240;
            var time = 5000 + lv * 4;
            if (time > 8000) time = 8000;
            return "造成" + per + "%攻击伤害并忽视25%防御；命中后" + (time / 1000)
                + "秒内降低敌方35%躲闪和招架并封印其绝招，同时强行剥除敌方一个正面增益并转化为自身15%攻击提升。";
        }
    },

    jieyu: {
        name: "接木·纳劲归渊",
        distime: 28000,
        mp: 25,
        use_type: 2,
        release_time: 0,
        allow_busy: true,
        use: function (me, target, lv) {
            var time = 12000 + lv * 6;
            if (time > 18000) time = 18000;
            me.remove_status("busy");
            me.add_status({
                id: "yihua_jiemu",
                name: "接木",
                start_msg: "<him>$N双掌在胸前徐徐合抱，气机化作深邃漩流，周身泛起温润玉光，已入「接木·纳劲归渊」之境！</him>",
                desc: "纳劲归渊：提升25%招架、25%躲闪与20%免伤；借力反击冷却缩至1.8秒，伤害大幅提升并反哺气血内力",
                duration: time,
                override: 2,
                prop: {
                    zj_per: 25,
                    ds_per: 25,
                    diff_sh_per: 20
                }
            });
            me.set_temp("yihua_jiemu", 1, time);
        },
        query_desc: function (me, lv) {
            var time = 12000 + lv * 6;
            if (time > 18000) time = 18000;
            return "解除自身忙乱，在" + (time / 1000)
                + "秒内提升25%招架、25%躲闪与20%伤害减免；期间借力反击内置冷却缩短至1.8秒，伤害提升至180%，且每次反击恢复自身气血与内力。";
        }
    },

    jingfan: {
        name: "镜返·移花接玉",
        distime: 35000,
        mp: 32,
        use_type: 2,
        release_time: 0,
        allow_busy: true,
        use: function (me, target, lv) {
            me.remove_status("busy");
            me.add_status({
                id: "yihua_jingfan",
                name: "移花接玉",
                start_msg: "<hio>$N轻叱一声，双掌划出浑圆玉壁，明玉真气凝若寒镜，正是移花宫至高绝学「移花接玉」！</hio>",
                finish_msg: "<hio>$N身前的玉镜壁渐渐化作漫天花雨消散。</hio>",
                desc: "移花接玉：获得50%高额免伤，受击自动以破防威能将敌方攻势加倍反震",
                duration: 10000,
                override: 2,
                prop: {
                    diff_sh_per: 50
                },
                on_expire: function (p) {
                    p.remove_temp("yihua_jingfan");
                    p.remove_temp("yihua_jingfan_cd");
                }
            });
            me.set_temp("yihua_jingfan", 3);
            me.remove_temp("yihua_jingfan_cd");
        },
        query_desc: function (me, lv) {
            return "解除自身忙乱，10秒内获得50%伤害减免；接下来3次招架或躲闪将必定触发移花接玉，以目标攻击力的120%结合自身内劲施加破防反震（忽视30%防御），反震间隔1秒。";
        }
    }
};
