this.inherits(SKILL);
this.name = "北斗阵法";
this.id = "beidouzhen";
this.grade = 3;
this.desc = "全真教天罡北斗阵，以七人分据北斗星位、首尾相援；人数不足时也可借星位变化守御。";
this.family = FAMILIES.QUANZHEN;
this.can_enables = ["parry"];
this.learn_condition = {
    max_mp: 2800,
    skill: {
        parry: 220,
        quanzhenjian: 160,
        quanzhenxinfa: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        parry: {
            zj: parseInt(lv * 1.45) + 30,
            fy: parseInt(lv * 1.05) + 20,
            diff_sh_per: 2 + parseInt(lv / 500)
        }
    };
}
this.pfm = {
    tiangang: {
        name: "天罡北斗",
        distime: 32000,
        enable_skill: "parry",
        mp: 20,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 10000 + lv * 5;
            if (time > 18000) time = 18000;
            var ts = me.team || [me];
            var members = [];
            for (var i = 0; i < ts.length; i++) {
                var x = ts[i];
                if (!x || !x.is_here(me)) continue;
                if (x !== me && x.family !== FAMILIES.QUANZHEN && x.query_skill("beidouzhen", 0) <= 0) continue;
                members.push(x);
                if (members.length >= 7) break;
            }
            if (!members.length) members.push(me);
            var stars = members.length;
            var fy = 7 + stars * 2 + parseInt(lv / 500);
            if (fy > 25) fy = 25;
            var zj = parseInt(lv / 2) + 120 + stars * 60;
            me.send_room("<hiy>$N脚踏北斗方位，天罡北斗阵势隐然成形。</hiy>", target);
            for (var j = 0; j < members.length; j++) {
                var member = members[j];
                member.add_status({
                    id: "beidouzhen",
                    name: "北斗",
                    desc: "北斗阵法提升你的防御和招架",
                    duration: time,
                    override: 2,
                    prop: {
                        fy_per: fy,
                        zj: zj,
                        diff_sh_per: stars
                    }
                });
            }
        },
        query_desc: function (me, lv) {
            var time = 10000 + lv * 5;
            if (time > 18000) time = 18000;
            return "为在场同门队友布下北斗阵；每多一处星位都会继续提高防御、招架和伤害减免，持续" + (time / 1000) + "秒。";
        }
    }
};
