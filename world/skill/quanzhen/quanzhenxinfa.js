this.inherits(SKILL);
this.name = "全真心法";
this.id = "quanzhenxinfa";
this.grade = 1;
this.force_rad = 0.65;
this.desc = "全真教入门内功心法，清静守一，以道家吐纳培本固元。";
this.family = FAMILIES.QUANZHEN;
this.can_enables = ["force"];
this.learn_condition = {
    skill: {
        force: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv * 3 + 80,
            limit_mp: lv * 12,
            desc: "唯一：将你内力的65%转化为气血"
        }
    };
}
