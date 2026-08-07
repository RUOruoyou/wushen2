this.inherits(SKILL);
this.name = "泰山拳法";
this.id = "taishanquanfa";
this.grade = 2;
this.desc = "泰山派的拳法功夫";
this.can_enables = ["unarmed", "parry"];
this.learn_condition = { max_mp: 30000, skill: { unarmed: 350 } };
this.query_enable_prop = function (lv) {
    return {
        unarmed: { gj: 1310, str: 125, fy: 1510 },
        parry: { zj: 1310, fy: 1200 }
    };
};
this.pfm = {
    taishan: {
        name: "泰山压顶",
        distime: 20000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.NONE,
        mp: 100,
        release_time: 4000,
        use: function (me, target, lv) {
            me.do_attack({ target: target, gj: me.gj + me.fy * 2, mz: me.mz, no_weapon: true });
            me.end_attack(target);
        },
        query_desc: function () {
            return "对敌人造成你攻击力附加你200%防御的伤害";
        }
    }
};
