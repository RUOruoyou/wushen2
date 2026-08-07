this.inherits(SKILL);
this.name = "恒山身法";
this.id = "hengshanshenfa";
this.grade = 2;

this.dodge_actions = [
    "$n一式<HIW>「白云出岫」</HIW>，身形轻晃，已从$N剑锋下飘然而过。",
    "$n使一式<HIC>「松风拂袂」</HIC>，脚下一步三摇，让开了$N这一招。",
    "$n身子微侧，一式<HIY>「暮鼓晨钟」</HIY>，似退非退，$N这一招堪堪落空。",
    "$n一式<HIB>「空山听雨」</HIB>，屏息凝神，原地只留下一道残影。",
    "$n轻提裙摆，一式<HIM>「落霞孤鹜」</HIM>，凌空跃起，避过$N凌厉攻势。",
    "$n足尖连点，一式<GRN>「苍松迎客」</GRN>，斜斜飘出丈余，落定在$N身侧。"
];
this.desc = "恒山派的轻功身法，绵密严谨，长于腾挪躲闪。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        dodge: 200
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.2) + 10,
            fy: parseInt(lv * 1.0) + 8
        }
    };
}
this.slots = [
    {
        prop: 'hsssf_ds',
        value: (lv) => 10,
        format: (val) => {
            return '灵虚附加的躲闪提高10%';
        }
    },
    {
        prop: 'hsssf_fy',
        value: (lv) => 10,
        format: (val) => {
            return '灵虚附加的防御提高10%';
        }
    }
];
this.pfm = {
    lingxu:
    {
        name: "灵虚",
        distime: 30000,
        enable_skill: "dodge",
        mp: 20,
        release_time: 500,
        use: function (me, target, lv) {
            var per = 15 + Math.min(parseInt(lv / 200), 10);
            var time = 8000 + lv * 2;
            if (time > 15000) time = 15000;
            me.send_room("<hiw>$N足尖轻点，运起恒山身法「灵虚」，身形忽地化作数道白云般飘忽不定。</hiw>", target);
            me.add_status({
                id: "dodge",
                name: "灵虚",
                desc: "恒山身法之灵虚，增加你的躲闪和防御",
                duration: time,
                prop: {
                    ds_per: per + me.query_prop('hsssf_ds'),
                    fy_per: per + me.query_prop('hsssf_fy')
                },
                finish_msg: "$N的灵虚身法渐渐收束，凝立于原地。"
            });
        },
        query_desc: function (me, lv) {
            var per = 15 + Math.min(parseInt(lv / 200), 10);
            var time = 8000 + lv * 2;
            if (time > 15000) time = 15000;
            return "" + (time / 1000) + "秒内增加你" + per + "%的躲闪和防御";
        }
    }
};
