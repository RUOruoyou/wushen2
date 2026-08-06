this.inherits(SKILL);
this.name = "神空行";
this.id = "xuedunbu";
this.grade = 3;
this.family = FAMILIES.XUEDAO;
this.desc = "密宗上乘身法，步履腾挪如天马跃空，忽进忽退，最擅贴身扰乱对手。";
this.dodge_actions = [
    "$n身形回转，如天马跃空般横移数尺，避开了$N的攻势。",
    "$n忽然缩身后撤，旋即拔地而起，$N的招式只击中一片残影。",
    "$n步法一错，已绕到$N侧后，险险闪过这一击。",
    "$n低身疾掠，随即冲天而起，令$N一招落空。",
    "$n身形忽进忽退，神空行展开后竟难以捉摸。"
];
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 2000,
    skill: {
        dodge: 300,
        xuehaimogong: 150
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.6) + 120,
            mz: parseInt(lv / 2),
            dex: parseInt(lv / 8) + 2
        }
    };
}
this.slots = [
    {
        prop: "xdb_ds",
        value: function () { return 5; },
        format: function (val) {
            return "血影遁提升闪避额外增加" + val + "%";
        }
    }
];
this.pfm = {
    dun: {
        name: "天马行空",
        distime: 30000,
        enable_skill: "dodge",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 8000 + lv * 6;
            if (time > 16000) time = 16000;
            var ds = 14 + parseInt(lv / 160) + me.query_prop("xdb_ds");
            var mz = 8 + parseInt(lv / 250);

            me.add_status({
                id: "dodge",
                name: "天马行空",
                start_msg: "<hic>$N展开神空行，身形回转如天马跃空，忽然切入$n身侧。</hic>",
                desc: "神空行提升你的闪避和命中",
                prop: {
                    ds_per: ds,
                    mz_per: mz
                },
                duration: time,
                finish_msg: "$N身形落回实处，天马行空的迅疾身法渐渐平复。"
            });
            if (target && me.is_here(target)) {
                target.add_status({
                    id: "busy",
                    name: "天马行空",
                    desc: "你被神空行扰乱身位，无法攻击、招架",
                    is_busy: true,
                    duration: 2500 + Math.min(4500, lv * 2),
                    downside: true
                }, me);
            }
        },
        query_desc: function (me, lv) {
            var time = 8000 + lv * 6;
            if (time > 16000) time = 16000;
            var ds = 15 + parseInt(lv / 150) + me.query_prop("xdb_ds");
            var mz = 8 + parseInt(lv / 250);
            return "扰乱敌人身位，并在" + (time / 1000) + "秒内增加自身" + ds + "%闪避和" + mz + "%命中。";
        }
    }
};
