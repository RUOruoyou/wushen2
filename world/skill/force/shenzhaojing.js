this.inherits(SKILL);
this.name = "神照经";
this.id = "shenzhaojing";
this.grade = 4;
this.first_title = "神照传人";
this.force_rad = 0.80;
this.desc = "丁典所传上乘内功，真气绵密深厚，尤善护心续脉、疗伤回气。";
this.can_enables = ["force"];
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
            con: parseInt(lv / 6) + 4,
            fy: parseInt(lv * 1.2) + 25,
            max_hp: lv * 16,
            limit_mp: lv * 125,
            diff_downside_per: 8 + parseInt(lv / 400),
            desc: "唯一：将你内力的80%转化为气血"
        }
    };
};
this.pfm = {
    zhaoxin: {
        name: "照心",
        distime: 36000,
        enable_skill: "force",
        mp: 30,
        use_type: 2,
        release_time: 0,
        use_condition: "需要气血未满",
        check: function (me) {
            return me.hp < me.max_hp;
        },
        use: function (me, target, lv) {
            var percent = 12 + parseInt(lv / 500);
            if (percent > 20) percent = 20;
            var hp = me.do_recover(parseInt(me.max_hp * percent / 100) + lv * 2);
            me.send_room("<hig>$N默运神照经，真气流转周身，伤势渐渐收拢。</hig>");
            if (hp > 0) me.notify("神照经恢复了" + hp + "点气血。");
        },
        query_desc: function (me, lv) {
            var percent = 12 + parseInt(lv / 500);
            if (percent > 20) percent = 20;
            return "恢复自身" + percent + "%最大气血和额外" + (lv * 2) + "点气血。";
        }
    },
    xumai: {
        name: "续脉",
        distime: 45000,
        enable_skill: "force",
        mp: 35,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 10000 + lv * 4;
            if (time > 18000) time = 18000;
            me.add_status({
                id: "shenzhao_xumai",
                name: "续脉",
                desc: "神照真气护住心脉，提升防御和异常抗性",
                duration: time,
                override: 2,
                prop: {
                    fy_per: 18,
                    diff_downside_per: 18
                }
            });
            me.send_room("<hig>$N运起神照经「续脉」，一缕温润真气护住心脉。</hig>");
        },
        query_desc: function (me, lv) {
            var time = 10000 + lv * 4;
            if (time > 18000) time = 18000;
            return (time / 1000) + "秒内提升18%防御和18%异常抗性。";
        }
    }
};
