this.inherits(SKILL);
this.name = "流水鞭";
this.id = "liushuibian";
this.grade = 2;
this.family = FAMILIES.RIYUE;
this.desc = "向问天一脉的软鞭武学，鞭势如流水缠绕，擅长限制身法和封锁退路。";
this.attack_actions = [
    "$N手中$w一抖，一式「流水绕石」缠向$n的$l",
    "$N腕力轻吐，使出「长河落日」，鞭影横扫$n腰间",
    "$N脚步前逼，一招「回澜叠浪」卷向$n周身",
    "$N手中长鞭忽直忽曲，如水蛇般钻向$n空门"
];
this.parry_actions = [
    "$p长鞭回卷，将$P兵刃带向一旁。",
    "$p鞭影如水幕般层层护住周身。",
    "$p借鞭梢一搭一引，化开了$P的攻势。"
];
this.can_enables = ["whip", "parry"];
this.learn_condition = {
    max_mp: 1300,
    skill: {
        whip: 100,
        riyuexinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        whip: {
            gj: parseInt(lv * 1.08) + 16,
            mz: parseInt(lv * 1.18) + 18
        },
        parry: {
            zj: parseInt(lv * 1.05) + 15,
            dex: parseInt(lv / 10) + 1
        }
    };
};
this.pfm = {
    chan: {
        name: "流水缠身",
        distime: 22000,
        enable_skill: "whip",
        weapon_type: WEAPON_TYPE.WHIP,
        mp: 18,
        use: function (me, target, lv) {
            var per = 115 + parseInt(lv / 35);
            if (per > 155) per = 155;
            var time = 3000 + lv * 3;
            if (time > 7500) time = 7500;
            if (me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.2,
                diff_fy: 10,
                attack_msg: "<hic>$N手中长鞭化作层层水纹，骤然缠住$n周身退路。</hic>"
            })) {
                target.add_status({
                    id: "liushuibian_chan",
                    name: "鞭缠",
                    desc: "流水鞭缠住你的身法，使你无法攻击和招架",
                    duration: time,
                    is_busy: true,
                    downside: true
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 115 + parseInt(lv / 35);
            if (per > 155) per = 155;
            var time = 3000 + lv * 3;
            if (time > 7500) time = 7500;
            return "造成" + per + "%攻击伤害并忽视10%防御，命中后缠住敌人" + (time / 1000) + "秒。";
        }
    }
};
