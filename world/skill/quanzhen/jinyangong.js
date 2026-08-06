this.inherits(SKILL);
this.name = "金雁功";
this.id = "jinyangong";
this.grade = 2;
this.desc = "全真教轻功身法，进退如雁，讲究轻灵稳健。";
this.family = FAMILIES.QUANZHEN;
this.dodge_actions = [
    "$n足尖一点，一招「金雁横空」，身形斜斜掠开，避过了$N这一招。",
    "$n衣袂轻扬，一式「雁落平沙」，飘然后退数尺。",
    "$n身形微晃，使出「雁回首」，有惊无险地让开了$N的攻势。",
    "$n脚下连点，宛如孤雁穿云，倏地闪到一旁。"
];
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 800,
    skill: {
        dodge: 120,
        quanzhenxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.25 + 10),
            desc: "成功躲闪后短时间提升身法，不叠加"
        }
    };
}
this.on_dodge_over = function (me, target, par) {
    if (par.is_dodge && !me.query_temp("jinyangong")) {
        var lv = me.query_skill("jinyangong", 0);
        me.add_status({
            id: "jinyan",
            name: "金雁",
            desc: "金雁功身法提升你的躲闪",
            prop: {
                ds: parseInt(lv / 3)
            },
            duration: 6000,
            override: 2
        });
        me.set_temp("jinyangong", 1, 10000);
    }
}
this.pfm = {
    yanwu: {
        name: "鹰飞雁舞",
        distime: 28000,
        enable_skill: "dodge",
        mp: 15,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 8000 + lv * 5;
            if (time > 16000) time = 16000;
            var ds = 12 + parseInt(lv / 180);
            if (ds > 22) ds = 22;
            me.add_status({
                id: "jinyan_yanwu",
                name: "鹰飞雁舞",
                start_msg: "<hic>$N提气轻身，忽如苍鹰横空，忽如飞雁回旋。</hic>",
                desc: "金雁功提升你的躲闪、命中和防御",
                duration: time,
                override: 2,
                prop: {
                    ds_per: ds,
                    mz_per: 8,
                    fy_per: 8
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 8000 + lv * 5;
            if (time > 16000) time = 16000;
            var ds = 12 + parseInt(lv / 180);
            if (ds > 22) ds = 22;
            return (time / 1000) + "秒内提升" + ds + "%躲闪、8%命中和8%防御。";
        }
    }
};
