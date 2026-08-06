this.inherits(SKILL);
this.name = "日月心法";
this.id = "riyuexinfa";
this.grade = 1;
this.family = FAMILIES.RIYUE;
this.force_rad = 0.57;
this.desc = "日月神教入门心法，行气迅捷偏于攻势，是吸星、天魔和日月光华的共同根基。";
this.can_enables = ["force", "parry"];
this.learn_condition = {
    skill: {
        force: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            con: parseInt(lv / 11) + 1,
            dex: parseInt(lv / 12) + 1,
            max_hp: lv * 4,
            limit_mp: lv * 58,
            desc: "唯一：将你内力的57%转化为气血"
        },
        parry: {
            zj: parseInt(lv * 0.75) + 10,
            fy: parseInt(lv * 0.45) + 5
        }
    };
};
this.pfm = {
    zhaori: {
        name: "日月昭昭",
        distime: 22000,
        enable_skill: "force",
        mp: 12,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 6000 + lv * 4;
            if (time > 12000) time = 12000;
            me.add_status({
                id: "riyue_zhaori",
                name: "昭日",
                start_msg: "<hiy>$N运转日月心法，真气如朝日初升，攻势骤然凌厉。</hiy>",
                desc: "日月心法提升你的攻击和出招速度",
                duration: time,
                override: 2,
                prop: {
                    gj_per: 10,
                    releasetime_per: 8
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 6000 + lv * 4;
            if (time > 12000) time = 12000;
            return (time / 1000) + "秒内提升10%攻击和8%出招速度。";
        }
    }
};
