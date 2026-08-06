this.inherits(SKILL);
this.name = "日月剑法";
this.id = "riyuejian";
this.grade = 2;
this.family = FAMILIES.RIYUE;
this.desc = "日月神教基础剑法，剑路明暗交替，善以连续变招迫使敌人露出破绽。";
this.attack_actions = [
    "$N手中$w划出半轮弧光，一式「日升东方」刺向$n的$l",
    "$N剑光忽明忽暗，使出「月隐西山」切入$n中门",
    "$N脚步连变，一招「日月同辉」连点$n数处要穴",
    "$N长剑斜挑，剑影如残月般掠向$n肩颈"
];
this.parry_actions = [
    "$p剑光一转，以日月交替之势封住$P来招。",
    "$p长剑斜引，将$P攻势带向一旁。",
    "$p踏着日月步位回剑护住周身。"
];
this.can_enables = ["sword", "parry"];
this.learn_condition = {
    max_mp: 1200,
    skill: {
        sword: 100,
        riyuexinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.12) + 16,
            mz: parseInt(lv * 1.08) + 16
        },
        parry: {
            zj: parseInt(lv) + 14,
            fy: parseInt(lv * 0.65) + 9
        }
    };
};
this.pfm = {
    tonghui: {
        name: "日月同辉",
        distime: 19000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 17,
        use: function (me, target, lv) {
            var per = 86 + parseInt(lv / 45);
            if (per > 118) per = 118;
            me.send_room("<hiy>$N剑势忽明忽暗，三道日月剑光接连射向$n。</hiy>", target);
            for (var i = 0; i < 3; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.1,
                    attack_before: i ? "剑光一转，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 86 + parseInt(lv / 45);
            if (per > 118) per = 118;
            return "连续攻击三次，每剑造成" + per + "%攻击伤害。";
        }
    }
};
