this.inherits(SKILL);
this.name = "移风剑法";
this.id = "feihuazhaiye";
this.grade = 3;
this.family = FAMILIES.YIHUA;
this.desc = "移花宫上乘剑法，身法姿态柔美飘逸，剑势却藏在花影风声之间，最擅连续快攻。";
this.attack_actions = [
    "$N身随剑走，一式「飘忽不相待」，手中$w轻盈地掠向$n的$l",
    "$N姿态万千，使出「花自飘零水自流」，$w无声切入$n中门",
    "$N剑光化作落英纷飞，一招「飞红万点愁如海」罩向$n周身",
    "$N身形轻转，一式「痴心白发换无情」随着花影刺向$n要害"
];
this.parry_actions = [
    "$p身形轻转，手中剑光随风一带，将$P攻势引向一旁。",
    "$p姿态如舞，$P只见花影一闪，来招已被封在身外。",
    "$p手中剑势似柔实韧，轻轻一圈便化开了$P的攻势。"
];
this.can_enables = ["sword", "parry", "unarmed", "throwing"];
this.learn_condition = {
    max_mp: 2600,
    skill: {
        sword: 220,
        huayuebu: 180,
        yihuaxinfa: 180
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.25) + 20,
            mz: parseInt(lv * 1.25) + 25
        },
        throwing: {
            gj: parseInt(lv * 1.25) + 20,
            mz: parseInt(lv * 1.35) + 25,
            bj_per: 2 + parseInt(lv / 500)
        },
        sword: {
            gj: parseInt(lv * 1.4) + 30,
            mz: parseInt(lv * 1.4) + 35,
            bj_per: 2 + parseInt(lv / 400)
        },
        parry: {
            zj: parseInt(lv * 1.25) + 25,
            fy: parseInt(lv * 0.8) + 15
        }
    };
}
this.pfm = {
    feihua: {
        name: "柔情媚影",
        distime: 24000,
        mp: 18,
        release_time: 0,
        check: function (me, lv, type) {
            return type !== "throwing" || me.can_throwing();
        },
        use: function (me, target, lv, type) {
            var count = 2 + parseInt(lv / 350);
            if (count > 4) count = 4;
            var per = 90 + parseInt(lv / 45);
            if (per > 130) per = 130;
            var is_throwing = type === "throwing";
            var is_sword = type === "sword" || type === "parry";
            var hit = false;
            if (is_throwing)
                me.send_room("<hic>$N扬手撒出点点寒芒，以移风剑法的柔情媚影之意罩向$n。</hic>", target);
            else if (is_sword)
                me.send_room("<hic>$N陡然间姿态万千，手中$W随身形轻盈舞动，使出「柔情媚影」。</hic>", target);
            else
                me.send_room("<hic>$N双袖轻拂，以柔情媚影的剑意化入掌指，连环袭向$n。</hic>", target);
            for (var i = 0; i < count; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.1,
                    no_weapon: !is_throwing && !is_sword,
                    is_throwing: is_throwing,
                    attack_msg: ""
                })) hit = true;
            }
            if (hit) {
                target.add_status({
                    id: "feihuazhaiye",
                    name: "媚影",
                    desc: "柔情媚影扰乱你的身法和判断",
                    prop: {
                        ds_per: -10,
                        zj_per: -8
                    },
                    duration: 7000,
                    override: 2,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var count = 2 + parseInt(lv / 350);
            if (count > 4) count = 4;
            var per = 90 + parseInt(lv / 45);
            if (per > 130) per = 130;
            return "姿态惑敌后连续攻击" + count + "次，每次造成" + per + "%攻击伤害，并降低敌方躲闪与招架。";
        }
    },
    yifeng: {
        name: "移风起栖云飞扬",
        distime: 32000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 25,
        release_time: 0,
        use: function (me, target, lv) {
            var per = 70 + parseInt(lv / 40);
            if (per > 108) per = 108;
            me.send_room("<him>$N身形轻舞，使出移风剑法「移风起栖云飞扬」，手中$W化为无数花瓣般的剑光。</him>", target);
            for (var i = 0; i < 6; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 1.12,
                    attack_before: i ? "花瓣从中剑光再舞，" : ""
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 70 + parseInt(lv / 40);
            if (per > 108) per = 108;
            return "连续刺出六剑，每剑造成" + per + "%攻击伤害。";
        }
    }
};
