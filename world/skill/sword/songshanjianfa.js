this.inherits(SKILL);
this.name = "嵩山剑法";
this.id = "songshanjianfa";
this.grade = 3;
this.desc = "嵩山派绝学，剑法气象森严，端严雄伟。";
this.can_enables = ["sword", "parry"];
this.learn_condition = { max_mp: 60000, skill: { sword: 500 } };
this.query_enable_prop = function (lv) {
    return {
        sword: { gj: parseInt(lv * 2.01), mz: parseInt(lv * 1.02), str: parseInt(lv * 0.127) },
        parry: { zj: parseInt(lv * 2.31), max_hp: parseInt(lv * 7), con: parseInt(lv * 0.127) }
    };
};
this.pfm = {
    wanyue: {
        name: "万岳朝宗",
        distime: 10000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 0,
        release_time: 4000,
        use: function (me, target, lv) {
            var cost = parseInt(me.mp * 0.3);
            if (cost < 1) cost = 1;
            me.mp -= cost;
            me.do_attack({ target: target, gj: me.gj + cost, mz: me.mz });
            me.end_attack(target);
        },
        query_desc: function () {
            return "消耗你30%的当前内力，对敌人造成等量伤害。";
        }
    }
};
