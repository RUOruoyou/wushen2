this.inherits(SKILL);
this.name = "踏歌行";
this.id = "tagehang";
this.grade = 2;

this.dodge_actions = [
    "$n一式<HIC>「长歌入阵」</HIC>，踏歌而进，步法悠然，却堪堪避过$N这一招",
    "$n一式<HIY>「青城踏歌」</HIY>，足踏节拍，身形随之飘忽不定",
    "$n一式<HIB>「松风和歌」</HIB>，随风而动，$N的攻势只打在空处",
    "$n一式<HIM>「行歌踏远」</HIB>，且歌且行，转眼已在丈余之外",
    "$n一式<GRN>「醉歌踏月」</GRN>，似醉非醉，摇晃间已脱出$N的攻势",
    "$n一式<HIW>「高歌踏云」</HIW>，歌声朗朗，身形如行云流水般滑开"
];
this.desc = "青城派的高明轻功，踏歌而行，进退之间暗合音律，灵动异常。";
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
            ds: parseInt(lv * 1.34),
            dex: parseInt(lv / 8) + 1
        }
    };
}
this.slots = [
    {
        prop: 'tgh_gj',
        value: (lv) => 1500,
        format: (val) => {
            return '踏歌行增加攻击力' + val;
        }
    },
    {
        prop: 'tgh_ds',
        value: (lv) => 2000,
        count: 2,
        format: (val) => {
            return '踏歌行增加躲闪' + val;
        }
    }
];
this.pfm = {
    tagehang:
    {
        name: "踏歌行",
        distime: 30000,
        enable_skill: "dodge",
        mp: 20,
        release_time: 500,
        use: function (me, target, lv) {
            var gjAdd = 1000 + parseInt(lv);
            var dsAdd = 1500 + parseInt(lv) + me.query_prop('tgh_ds');
            var time = 18000 + lv * 2;
            if (time > 20000) time = 20000;
            me.send_room("<hiy>$N朗声高歌，运起踏歌行，歌声过处，攻防灵动，气势陡增</hiy>", target);
            me.add_status({
                id: "dodge",
                name: "踏歌行",
                desc: "青城派踏歌行，提升你的攻击力和躲闪",
                duration: time,
                prop: {
                    gj: gjAdd + me.query_prop('tgh_gj'),
                    ds: dsAdd
                },
                finish_msg: "$N的歌声渐歇，踏歌行之势收束。"
            });
        },
        query_desc: function (me, lv) {
            var gjAdd = 1000 + parseInt(lv);
            var dsAdd = 1500 + parseInt(lv);
            var time = 18000 + lv * 2;
            if (time > 20000) time = 20000;
            return "" + (time / 1000) + "秒内，提升自身攻击力" + gjAdd + "点，躲闪" + dsAdd + "点";
        }
    }
};
