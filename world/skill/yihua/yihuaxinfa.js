this.inherits(SKILL);
this.name = "移花心法";
this.id = "yihuaxinfa";
this.grade = 1;
this.family = FAMILIES.YIHUA;
this.desc = "移花宫入门心法，讲究气息清冷绵长，为绝情掌、移风换影和明玉神功打下根基。";
this.can_enables = ["force"];
this.learn_condition = {
    skill: {
        force: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            con: parseInt(lv / 8) + 1,
            max_hp: lv * 7,
            limit_mp: lv * 80
        }
    };
}
