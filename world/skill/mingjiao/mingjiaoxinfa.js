this.inherits(SKILL);
this.name = "圣火心法";
this.id = "mingjiaoxinfa";
this.grade = 1;
this.family = FAMILIES.MINGJIAO;
this.force_rad = 0.58;
this.desc = "明教入门心法，以圣火之意调和气血，为九阳神功和乾坤大挪移奠定根基。";
this.can_enables = ["force", "parry"];
this.learn_condition = {
    skill: {
        force: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            con: parseInt(lv / 10) + 1,
            max_hp: lv * 5,
            limit_mp: lv * 55,
            desc: "唯一：将你内力的58%转化为气血"
        },
        parry: {
            zj: parseInt(lv * 0.8) + 10,
            fy: parseInt(lv * 0.5) + 5
        }
    };
};
this.pfm = {
    shenghuo: {
        name: "圣火燃心",
        distime: 22000,
        enable_skill: "force",
        mp: 12,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 6000 + lv * 4;
            if (time > 12000) time = 12000;
            var gj = 8 + parseInt(lv / 100);
            if (gj > 16) gj = 16;
            me.add_status({
                id: "mingjiao_shenghuo",
                name: "圣火",
                start_msg: "<hiy>$N默运圣火心法，胸中战意如光明圣火般燃起。</hiy>",
                desc: "圣火心法提升你的攻击和命中",
                duration: time,
                override: 2,
                prop: {
                    gj_per: gj,
                    mz_per: 8
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 6000 + lv * 4;
            if (time > 12000) time = 12000;
            var gj = 8 + parseInt(lv / 100);
            if (gj > 16) gj = 16;
            return (time / 1000) + "秒内提升" + gj + "%攻击和8%命中。";
        }
    }
};
