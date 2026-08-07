this.inherits(SKILL);
this.name = "大嵩阳神掌";
this.id = "dasongyangshenzhang";
this.grade = 3;
this.desc = "大嵩阳神掌乃是嵩山派绝学，以变化繁复，出手迅捷见称。";
this.can_enables = ["unarmed"];
this.learn_condition = { max_mp: 30000, skill: { unarmed: 450 } };
this.query_enable_prop = function (lv) {
    return { unarmed: { gj: parseInt(lv * 1.3), gjsd: 200, mz: parseInt(lv * 1.22) } };
};
this.pfm = {
    wuying: {
        name: "无影掌",
        distime: 20000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.NONE,
        mp: 20,
        release_time: 3000,
        use: function (me, target, lv) {
            if (me.do_attack({ target: target, gj: me.gj * 3, mz: me.mz, no_weapon: true })) {
                target.add_status({ id: "busy", is_busy: true, downside: true, duration: 8000, name: "忙乱" }, me);
            }
            me.end_attack(target);
        },
        query_desc: function () {
            return "对敌人造成300%的伤害，命中后使敌人忙乱8秒。";
        }
    }
};
