this.inherits(SKILL);
this.name = "金蛇游身步";
this.id = "jinsheyoushenbu";
this.grade = 3;
this.dodge_actions = [
    "$n身形一转，金蛇游身步如蛇行草上，避开了$N的攻势。",
    "$n脚下滑动，身影忽左忽右，$N一招落空。",
    "$n借势游走，宛如金蛇缠身，轻巧地闪过$N的攻击。"
];
this.desc = "金蛇郎君所创的轻功身法，步法诡异，如有万蛇缠身。";
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 30000,
    skill: { dodge: 400 }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.63),
            busy_per: 20
        }
    };
};
this.pfm = {
    snake: {
        name: "金蛇游身",
        distime: 30000,
        enable_skill: "dodge",
        mp: 20,
        release_time: 4000,
        use: function (me, target, lv) {
            var time = 6000;
            var success = me.random(lv / 2) + lv > target.query_skill(target.dodge_skill.id, 0);
            if (success) {
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    downside: true,
                    duration: time,
                    name: "忙乱"
                }, me);
            }
            me.send_room(success
                ? "<hiy>$N身形游走，使出「金蛇游身」，$n顿时眼花缭乱。</hiy>"
                : "<hiy>$N使出「金蛇游身」，可是$n早有防备，未受影响。</hiy>", target);
        },
        query_desc: function () {
            return "金蛇游身，如有万蛇缠身，成功后使敌人忙乱6秒。";
        }
    }
};
