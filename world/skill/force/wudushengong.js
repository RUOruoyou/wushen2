this.inherits(SKILL);
this.name = "五毒神功";
this.id = "wudushengong";
this.grade = 2;
this.force_rad = 0.7;
this.desc = "五毒教的内功心法";
this.can_enables = ["force"];
this.learn_condition = {
    max_mp: 30000,
    skill: { force: 300 }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: parseInt(lv * 8),
            fy: parseInt(lv * 1.0),
            limit_mp: parseInt(lv * 55),
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
};
