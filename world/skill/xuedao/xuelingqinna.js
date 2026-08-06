this.inherits(SKILL);
this.name = "密宗大手印";
this.id = "xuelingqinna";
this.grade = 2;
this.family = FAMILIES.XUEDAO;
this.desc = "密宗外门刚猛掌印，运力时骨节爆响，掌势沉重如山，能震伤护体并封住气机。";
this.attack_actions = [
    "$N低声默念密宗真言，一记「须弥印」按向$n的$l",
    "$N双臂骨节爆响，使出「降魔印」直击$n胸前",
    "$N左掌虚晃，右掌结印，一招「伏虎印」拍向$n肩井",
    "$N腾身而起，一式「宝瓶印」从上向下罩住$n",
    "$N沉肩进步，使出「轮回印」重重压向$n中门"
];
this.parry_actions = [
    "$p双掌结印，以密宗手法封住$P来势。",
    "$p掌势沉下，迫得$P攻势一滞。",
    "$p侧身错步，反掌在$P腕下一托，化开了这一招。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 100,
        xuedaoxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.1) + 15,
            mz: parseInt(lv) + 15
        },
        parry: {
            zj: parseInt(lv * 1.1) + 15,
            dex: parseInt(lv / 10) + 1
        }
    };
}
this.pfm = {
    suohou: {
        name: "大手印",
        distime: 18000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 15,
        release_time: 0,
        use: function (me, target, lv) {
            var per = 110 + parseInt(lv / 35);
            if (per > 145) per = 145;
            var time = 3000 + lv * 3;
            if (time > 8000) time = 8000;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.1,
                no_weapon: true,
                diff_fy: 12,
                attack_msg: "<hib>$N面色怪异，默念密宗真言，腾空伸手使出「大手印」按向$n胸前。</hib>",
                damage_msg: "<hir>$n被斗大的掌印正面震中，护体气机顿时散乱。</hir>"
            })) {
                target.add_status({
                    id: "busy",
                    name: "掌印",
                    desc: "你被密宗大手印震住气机，无法攻击、招架",
                    is_busy: true,
                    duration: time,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 110 + parseInt(lv / 35);
            if (per > 145) per = 145;
            var time = 3000 + lv * 3;
            if (time > 8000) time = 8000;
            return "造成" + per + "%攻击伤害并忽视12%防御，命中后使敌人忙乱" + (time / 1000) + "秒。";
        }
    },
    jingang: {
        name: "金刚印",
        distime: 24000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var per = 145 + parseInt(lv / 24);
            if (per > 195) per = 195;
            me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.15,
                no_weapon: true,
                diff_fy: 20,
                attack_msg: "<hiy>$N面容庄重，双掌结成金刚印，带着雷霆般的劲力拍向$n。</hiy>",
                damage_msg: "<hir>$n被金刚印震得连退数步，胸中气血翻腾不休。</hir>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 145 + parseInt(lv / 24);
            if (per > 195) per = 195;
            return "造成" + per + "%攻击伤害并忽视20%防御。";
        }
    }
};
