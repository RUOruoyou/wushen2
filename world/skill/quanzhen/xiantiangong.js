this.inherits(SKILL);
this.name = "先天功";
this.id = "xiantiangong";
this.grade = 3;
this.force_rad = 0.78;
this.desc = "王重阳所传全真上乘内功，返本归元，先天一气周流不息。";
this.family = FAMILIES.QUANZHEN;
this.can_enables = ["force"];
this.learn_condition = {
    max_mp: 3200,
    skill: {
        force: 300,
        quanzhenxinfa: 240
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv * 8,
            fy: parseInt(lv * 1.1),
            diff_sh_per: 5 + parseInt(lv / 350),
            limit_mp: lv * 90,
            desc: "唯一：将你内力的78%转化为气血"
        }
    };
}
this.pfm = {
    hu: {
        name: "先天无极劲",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var diff = 18 + parseInt(lv / 300);
            var time = 20000 + lv * 8;
            if (time > 35000) time = 35000;
            me.send_room("<hiy>$N闭目凝神，先天一气流转周身，化作一层若有若无的无极护劲。</hiy>");
            me.add_status({
                id: "force",
                name: "先天无极",
                desc: "先天真气提升你的防御和伤害减免",
                duration: time,
                prop: {
                    fy_per: diff,
                    diff_sh_per: diff,
                    max_hp: lv * 6
                },
                on_expire: function (p) {
                    if (p.hp > p.max_hp) {
                        p.hp = p.max_hp;
                        p.notify_hp();
                    }
                }
            });
            me.hp += lv * 6;
            me.notify_hp();
        },
        query_desc: function (me, lv) {
            var diff = 18 + parseInt(lv / 300);
            var time = 20000 + lv * 8;
            if (time > 35000) time = 35000;
            return (time / 1000) + "秒内提升防御" + diff + "%、伤害减免" + diff + "%，并以先天真气增加" + (lv * 6) + "点气血。";
        }
    }
};
