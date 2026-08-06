this.inherits(SKILL);
this.name = "血刀心法";
this.id = "xuedaoxinfa";
this.grade = 1;
this.family = FAMILIES.XUEDAO;
this.desc = "血刀门入门心法，借雪山寒气锤炼气血，是血刀刀路和血海魔功的根基。";
this.can_enables = ["force"];
this.learn_condition = {
    skill: {
        force: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            str: parseInt(lv / 10) + 1,
            con: parseInt(lv / 12) + 1,
            max_hp: lv * 8,
            limit_mp: lv * 70
        }
    };
}
