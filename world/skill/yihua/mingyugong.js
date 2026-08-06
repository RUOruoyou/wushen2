this.inherits(SKILL);
this.name = "明玉神功";
this.id = "mingyugong";
this.grade = 3;
this.force_rad = 0.72;
this.family = FAMILIES.YIHUA;
this.desc = "移花宫上乘内功，真气清冷如玉、内敛无华，擅长护体蓄势并侵蚀对手内息。";
this.can_enables = ["force", "parry"];
this.learn_condition = {
    max_mp: 3000,
    skill: {
        force: 250,
        yihuaxinfa: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            con: parseInt(lv / 7) + 2,
            max_hp: lv * 9,
            fy_per: 3 + parseInt(lv / 350),
            limit_mp: lv * 98,
            desc: "唯一：将你内力的72%转化为气血"
        },
        parry: {
            zj: parseInt(lv * 1.15) + 30,
            fy: parseInt(lv * 0.9) + 20
        }
    };
}
this.on_force_over = function (me, target, par, sh) {
    if (!(sh > 0) || !target || !me.query_status("mingyugong") || me.query_temp("mingyu_hanxi")) return;
    var drain = parseInt(me.query_skill("mingyugong", 0) / 3) + parseInt(sh / 12);
    var limit = parseInt(me.max_mp * 0.025);
    if (drain > limit) drain = limit;
    if (drain > target.mp) drain = target.mp;
    if (drain <= 0) return;
    target.add_mp(-drain);
    me.add_mp(parseInt(drain / 2));
    me.set_temp("mingyu_hanxi", 1, 3000);
}
this.pfm = {
    ningyu: {
        name: "明玉凝霜",
        distime: 30000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        allow_busy: true,
        use: function (me, target, lv) {
            var time = 8000 + lv * 4;
            if (time > 18000) time = 18000;
            var ds = 14 + parseInt(lv / 160);
            if (ds > 28) ds = 28;
            me.send_room("<him>$N微一凝神，明玉真气由内而外凝成寒霜，气息愈发清冷无瑕。</him>", target);
            me.add_status({
                id: "mingyugong",
                name: "凝霜",
                desc: "明玉凝霜提升防御、躲闪和抗性，命中时会侵蚀敌方内力",
                duration: time,
                prop: {
                    fy_per: 12,
                    ds_per: ds,
                    diff_sh_per: 10,
                    diff_downside_per: 10
                },
                override: 2
            });
        },
        query_desc: function (me, lv) {
            var time = 8000 + lv * 4;
            if (time > 18000) time = 18000;
            var ds = 14 + parseInt(lv / 160);
            if (ds > 28) ds = 28;
            return (time / 1000) + "秒内提升12%防御、" + ds
                + "%躲闪、10%伤害减免和异常抗性；命中敌人时每3秒可侵蚀一次内力，并回收其中一半。";
        }
    },
    yuhe: {
        name: "明玉疗伤",
        distime: 36000,
        enable_skill: "force",
        mp: 24,
        use_type: 2,
        allow_busy: true,
        release_time: 0,
        use: function (me, target, lv) {
            var percent = 8 + parseInt(lv / 450);
            if (percent > 15) percent = 15;
            if (me.query_status("mingyugong")) {
                percent += 5;
                me.remove_status("mingyugong", true);
            }
            var hp = me.do_recover(parseInt(me.max_hp * percent / 100) + lv * 2);
            me.send_room("<hic>$N默运明玉神功，寒玉般真气流遍经脉，伤势随之缓缓收拢。</hic>");
            if (hp > 0) me.notify("明玉真气恢复了" + hp + "点气血。");
        },
        query_desc: function (me, lv) {
            var percent = 8 + parseInt(lv / 450);
            if (percent > 15) percent = 15;
            return "立即恢复" + percent + "%最大气血和额外" + (lv * 2)
                + "点气血；若处于凝霜状态，将消耗凝霜并额外恢复5%最大气血。";
        }
    }
};
