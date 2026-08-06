this.inherits(SKILL);
this.name = "鹰爪功";
this.id = "yingzhuagong";
this.grade = 2;
this.family = FAMILIES.MINGJIAO;

this.attack_actions = [
    "$N全身拔地而起，半空中一个筋斗，一式「苍鹰袭兔」，迅猛地抓向$n的$l",
    "$N单腿直立，双臂平伸，一式「雄鹰展翅」，双爪一前一后拢向$n的$l",
    "$N一式「拔翅横飞」，全身向斜里平飞，右腿一绷，双爪搭向$n的肩头",
    "$N双爪交错上举，使一式「迎风振翼」，一拔身，分别袭向$n左右腋空门",
    "$N全身滚动上前，一式「飞龙献爪」，右爪突出，鬼魅般抓向$n的胸口",
    "$N伏地滑行，一式「拨云瞻日」，上手袭向膻中大穴，下手反抓$n的裆部",
    "$N左右手掌爪互逆，一式「搏击长空」，无数道劲气破空而出，迅疾无比地击向$n",
    "$N腾空高飞三丈，一式「鹰扬万里」，天空中顿时显出一个巨灵爪影，缓缓罩向$n"
];
this.desc = "明教白眉鹰王一脉的擒拿绝技，爪势凌厉，擅长撕裂护体和留下血痕。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 100
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv * 1 + 10,
            mz: lv + 100
        },
        parry: {
            zj: lv + 10,
            fy: parseInt(lv * 0.7) + 10
        }
    };
}

this.slots = [
    {
        prop: 'yzg_sh',
        value: (lv) => 10 + Math.floor(lv / 50),
        format: (val) => {
            return '赤血爪附加的伤害增加' + val + '%';
        },
    },
    {
        prop: 'yzg_mz',
        value: (lv) => 10 + Math.floor(lv / 50),
        format: (val) => {
            return '赤血爪附加的命中增加' + val + '%';
        },
    },
];
this.pfm = {
    zhen:
    {
        name: "赤血爪",
        distime: 10000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
            var t = 100 + parseInt(lv / 20) + me.query_prop("yzg_sh");
            if (me.do_attack({
                target: target,
                gj: me.gj * t / 100,
                attack_msg: "<hiy>$N运转真气，双手忽成爪行，施出绝招「<HIR>赤血爪</HIR>」，迅猛无比地抓向$n<hiy>",
                mz: me.mz * (200 + me.query_prop("yzg_mz")) / 100,
                damage_msg: "<HIR>但见$N双爪划过，$n已闪避不及，胸口被$N抓出十条血痕。</hir>",
                no_weapon: true
            })) {
                target.add_status({
                    id: "yingzhuaxuehen",
                    name: "血痕",
                    desc: "鹰爪功撕裂你的护体和招架",
                    duration: 7000,
                    override: 1,
                    max_count: 3,
                    downside: true,
                    prop: {
                        fy_per: -4,
                        zj_per: -4
                    }
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var t = 100 + parseInt(lv / 20);

            return "迅猛一抓造成" + t + "%攻击伤害，命中增加100%，命中后撕裂敌方防御和招架，最多叠加三层。";
        }
    }
};
