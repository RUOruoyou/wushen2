this.inherits(SKILL);
this.name = "移风换影";
this.id = "huayuebu";
this.grade = 2;
this.family = FAMILIES.YIHUA;
this.desc = "移花宫高明轻功，身形如清风与花影互换，飘忽难测，能从忙乱中抽身。";
this.dodge_actions = [
    "$n一式「飘忽不相待」，全身化作一缕清风，巧妙躲过了$N这一招。",
    "$n使出「花自飘零水自流」，向后飘出数丈之遥。",
    "$n一式「痴心白发换无情」，瞬间纵出数丈，避开了$N的杀招。",
    "$n使出「飞红万点愁如海」，只见花影晃动，$N竟分不清真身。",
    "$n侧身旋步，如落花随风，将$N的攻势让了过去。"
];
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 1200,
    skill: {
        dodge: 100,
        yihuaxinfa: 80
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            dex: parseInt(lv / 7) + 2,
            ds: parseInt(lv * 1.2) + 30
        }
    };
}
this.pfm = {
    yueying: {
        name: "换影",
        distime: 28000,
        enable_skill: "dodge",
        mp: 15,
        release_time: 0,
        allow_busy: true,
        use: function (me, target, lv) {
            var time = 5000 + lv * 5;
            if (time > 12000) time = 12000;
            var ds = parseInt(lv * 1.5) + 300;
            me.remove_status("busy");
            me.add_status({
                id: "huayuebu",
                name: "换影",
                start_msg: "<hic>$N展开移风换影，真身与花影倏然互换，身形变得飘忽难测。</hic>",
                desc: "移风换影使你的躲闪提升",
                duration: time,
                prop: {
                    ds: ds
                },
                override: 2
            });
        },
        query_desc: function (me, lv) {
            var time = 5000 + lv * 5;
            if (time > 12000) time = 12000;
            var ds = parseInt(lv * 1.5) + 300;
            return "解除自身忙乱，并提升" + ds + "点躲闪，持续" + (time / 1000) + "秒。";
        }
    }
};
