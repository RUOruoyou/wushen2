this.inherits(SKILL);
this.name = "血刀戒法";
this.id = "xuejiedao";
this.grade = 1;
this.family = FAMILIES.XUEDAO;
this.desc = "血刀门入门戒刀法，先练劈削缠锁与反手出刀，为真正的血刀刀法打下根基。";
this.attack_actions = [
    "$N踏前一步，一式「破戒开锋」，手中$w斜劈$n的$l",
    "$N反腕横刀，使出「雪线横江」，刀锋贴着$n身侧削去",
    "$N脚下一错，一招「戒影回风」，$w忽然折向$n肩头",
    "$N低喝一声，使出「寒灯照血」，刀光自下而上撩向$n的$l",
    "$N双手握刀，一式「血路初开」直取$n中门"
];
this.parry_actions = [
    "$p手中戒刀一横，硬生生架住$P的攻势。",
    "$p刀锋斜压，将$P的来招带偏。",
    "$p退半步回刀护身，封住了$P的进手。"
];
this.can_enables = ["blade", "parry"];
this.learn_condition = {
    max_mp: 500,
    skill: {
        blade: 50,
        xuedaoxinfa: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: parseInt(lv) + 10,
            mz: parseInt(lv * 0.8) + 10
        },
        parry: {
            zj: parseInt(lv) + 10,
            fy: parseInt(lv * 0.6) + 5
        }
    };
}
this.pfm = {
    pojie: {
        name: "破戒斩",
        distime: 10000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 10,
        use: function (me, target, lv) {
            var per = 90 + parseInt(lv / 20);
            if (per > 125) per = 125;
            me.send_room("<hir>$N沉肩进步，使出血戒刀法「破戒斩」，手中$W带着腥风劈向$n。</hir>", target);
            me.do_attack({
                target: target,
                gj: me.gj * per / 100,
                mz: me.mz * 1.05
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var per = 90 + parseInt(lv / 20);
            if (per > 125) per = 125;
            return "凝力斩出一刀，造成" + per + "%攻击伤害。";
        }
    }
};
