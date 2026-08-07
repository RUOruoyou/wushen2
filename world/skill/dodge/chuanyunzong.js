this.inherits(SKILL);
this.name = "穿云纵";
this.id = "chuanyunzong";
this.grade = 2;

this.dodge_actions = [
    "$n一式<HIW>「穿云破雾」</HIW>，身形如穿云之雁，瞬间让过$N这一招",
    "$n使一式<HIC>「云中漫步」</HIC>，脚踏云气般飘出丈余，避开了$N",
    "$n一式<HIB>「凌空穿云」</HIB>，纵身跃起，从$N头顶掠过",
    "$n身子一扭，一式<HIM>「云龙三现」</HIM>，原地留下三道残影，真身已退至数丈之外",
    "$n一式<GRN>「云烟过眼」</GRN>，身形淡薄如烟，$N这一招竟似打在云雾之上",
    "$n足不点地，一式<HIY>「云舒云卷」</HIY>，舒展身形，从容避开$N攻势"
];
this.desc = "衡山派的高明轻功，身法轻灵，宛若穿云之雁，进退如风。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 1000,
    dex1: 22,
    skill: {
        dodge: 250
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.6),
            dex: parseInt(lv * 0.152)
        }
    };
}
this.slots = [
    {
        prop: 'cyz_ds',
        value: (lv) => 15,
        count: 2,
        format: (val) => {
            return '穿云纵躲闪提高15%';
        }
    },
    {
        prop: 'cyz_gjsd',
        value: (lv) => 10,
        format: (val) => {
            return '穿云纵攻速提高10%';
        }
    }
];
