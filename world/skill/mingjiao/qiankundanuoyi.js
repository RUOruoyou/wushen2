this.inherits(SKILL);
this.name = "乾坤大挪移";
this.id = "qiankundanuoyi";
this.grade = 4;
this.first_title = "乾坤使者";
this.family = FAMILIES.MINGJIAO;
this.desc = "明教镇教绝学，以精微运劲牵引敌力、转移攻势，并从对手破绽中反击。";
this.dodge_actions = [
    "$n双手一引，$N只觉招式被一股无形劲力带向空处。",
    "$n身形微旋，以乾坤挪移之势避开$N锋芒。",
    "$n脚下不动，气机一转，$N的攻势竟从身侧滑过。",
    "$n借势换位，转眼已立在$N攻势之外。"
];
this.parry_actions = [
    "$p双掌一圈，以乾坤大挪移将$P劲力导向一旁。",
    "$p顺着$P来势轻轻一引，随即反送回去。",
    "$p气机忽转，$P只觉自己的招式竟不受控制。"
];
this.can_enables = ["dodge", "parry"];
this.learn_condition = {
    max_mp: 7500,
    skill: {
        dodge: 300,
        parry: 300,
        jiuyangshengong: 300,
        qingfushenfa: 250
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.6) + 40,
            fy: parseInt(lv * 0.9) + 25,
            desc: "躲闪成功后有机会借势反击"
        },
        parry: {
            zj: parseInt(lv * 1.65) + 40,
            fy: parseInt(lv * 1.05) + 30,
            desc: "招架成功后有机会挪转敌力反击"
        }
    };
};
this.on_parry_over = function (me, target, par) {
    if (par.is_parry && !me.query_temp("qiankun_fanji")) {
        me.do_attack({
            target: target,
            gj: me.gj * (me.query_status("qiankun_nuoyi") ? 1.25 : 0.95),
            mz: me.mz * 1.1,
            no_weapon: true,
            no_append: true,
            no_append_target: true,
            attack_msg: "<hic>$N顺着$n攻势一引一送，以乾坤大挪移将劲力反还。</hic>"
        });
        me.end_attack(target);
        me.set_temp("qiankun_fanji", 1, 12000);
    }
};
this.on_dodge_over = function (me, target, par) {
    if (par.is_dodge && !me.query_temp("qiankun_fanji")) {
        me.do_attack({
            target: target,
            gj: me.gj * (me.query_status("qiankun_nuoyi") ? 1.2 : 0.9),
            mz: me.mz * 1.12,
            no_weapon: true,
            no_append: true,
            no_append_target: true,
            attack_msg: "<hic>$N借移形换位之机切入$n空门，乾坤劲力随势反击。</hic>"
        });
        me.end_attack(target);
        me.set_temp("qiankun_fanji", 1, 12000);
    }
};
this.pfm = {
    nuoyi: {
        name: "大挪移",
        distime: 30000,
        mp: 26,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 9000 + lv * 5;
            if (time > 19000) time = 19000;
            me.remove_status("busy");
            me.add_status({
                id: "qiankun_nuoyi",
                name: "挪移",
                start_msg: "<hic>$N双手虚抱，周身气机流转，乾坤挪移之势已然成形。</hic>",
                desc: "乾坤大挪移提升招架、躲闪、减伤并强化反击",
                duration: time,
                override: 2,
                prop: {
                    zj_per: 18,
                    ds_per: 18,
                    diff_sh_per: 15,
                    diff_busy_per: 15
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 9000 + lv * 5;
            if (time > 19000) time = 19000;
            return "解除忙乱，在" + (time / 1000) + "秒内提升18%招架和躲闪、15%减伤与控制抗性，并强化挪移反击。";
        }
    }
};
