this.inherits(SKILL);
this.name = "寒冰真气";
this.id = "hanbingzhenqi";
this.grade = 4;
this.force_rad = 0.7;
this.desc = "嵩山派的绝学寒冰真气，至阴至寒，真气散发一股冰入骨髓的寒气。";
this.can_enables = ["force"];
this.learn_condition = { max_mp: 100000, skill: { force: 650 } };
this.query_enable_prop = function (lv) {
    return {
        force: {
            gj: 1756,
            max_hp: 20000,
            limit_mp: 145000,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
};
this.on_force_over = function (me, target, par, sh) {
    if (!(sh > 0) || !target || !me.query_status("hanbingzhenqi")) return;
    target.damage2(4000, me);
    target.add_status({
        id: "hanbing_slow",
        name: "寒冰",
        duration: 15000,
        prop: { gjsd_per: -35 },
        downside: true,
        override: 2
    }, me);
};
this.pfm = {
    hanbing: {
        name: "寒冰",
        distime: 40000,
        enable_skill: "force",
        mp: 20,
        release_time: 500,
        use_type: 2,
        use: function (me, target, lv) {
            me.add_status({
                id: "hanbingzhenqi",
                name: "寒冰真气",
                desc: "伤害附加寒冰伤害，攻击你的敌人会被减速",
                duration: 20000,
                override: 2
            });
            me.end_attack(target);
        },
        query_desc: function () {
            return "运起全身真气，在20秒内，使自己的伤害附加4000寒冰伤害，并使攻击你的敌人冻结，在15秒内减慢35%攻击速度。";
        }
    }
};
