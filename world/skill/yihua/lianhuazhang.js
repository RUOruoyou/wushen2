this.inherits(SKILL);
this.name = "绝情掌";
this.id = "lianhuazhang";
this.grade = 2;
this.family = FAMILIES.YIHUA;
this.desc = "移花宫掌法，出掌时看似清雅无情，实则以迷魂乱心、万念俱灰之意封制对手。";
this.attack_actions = [
    "$N周身花瓣纷飞，一式「迷魂」轻飘飘拂向$n的$l",
    "$N一声长啸，使出「万念俱灰」，双掌杂乱无章地拍向$n",
    "$N身形一转，一招「情尽于此」连消带打拍向$n的$l",
    "$N左掌虚引，右掌忽吐，一式「心如寒灰」直取$n胸口",
    "$N掌势忽轻忽重，使出「无情花落」，将$n笼在掌影之中"
];
this.parry_actions = [
    "$p掌心一翻，以绝情掌劲轻轻卸开$P的攻势。",
    "$p双掌如花瓣开合，将$P的来势引向一旁。",
    "$p脚下一转，冷冽掌影回护，封住了$P的进手。"
];
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 100,
        yihuaxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.15) + 20,
            mz: parseInt(lv * 0.9) + 20
        },
        parry: {
            zj: parseInt(lv) + 15,
            fy: parseInt(lv * 0.7) + 10
        }
    };
}
this.pfm = {
    lian: {
        name: "万念俱灰",
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
                mz: me.mz,
                no_weapon: true,
                attack_msg: "<hic>$N一声长啸，悲痛欲绝，双掌疯狂拍向$n，正是绝情掌「万念俱灰」。</hic>",
                damage_msg: "<hir>$n心神俱裂，被困在杂乱无章却暗藏杀机的掌风之中。</hir>"
            })) {
                target.add_status({
                    id: "busy",
                    name: "万念俱灰",
                    desc: "你被绝情掌扰乱心神，无法攻击、招架",
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
            return "以惑心掌势造成" + per + "%攻击伤害，命中后使敌人忙乱" + (time / 1000) + "秒。";
        }
    },
    mihun: {
        name: "迷魂",
        distime: 22000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 16,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 3500 + lv * 3;
            if (time > 8500) time = 8500;
            me.send_room("<him>四周忽然花瓣纷飞，$N立于花影之中向$n淡淡一笑，施出绝情掌「迷魂」。</him>", target);
            target.add_status({
                id: "busy",
                name: "迷魂",
                desc: "你被绝情掌迷乱心神，无法攻击、招架",
                is_busy: true,
                duration: time,
                downside: true
            }, me);
        },
        query_desc: function (me, lv) {
            var time = 3500 + lv * 3;
            if (time > 8500) time = 8500;
            return "以花影迷乱敌人，使其忙乱" + (time / 1000) + "秒。";
        }
    }
};
