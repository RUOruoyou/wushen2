this.inherits(SKILL);
this.name = "镇岳诀";
this.id = "zhenyuejue";
this.grade = 3;
this.force_rad = 0.77;
this.desc = "衡山派的内功心法，凝重如山，气血浑厚，练成后能将内力化为镇岳真气护体。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.learn_condition = {
    max_mp: 60000,
    skill: {
        force: 350
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            fy: parseInt(lv * 1.31),
            max_hp: parseInt(lv * 10) + 50,
            fy_per: 6,
            limit_mp: parseInt(lv * 103),
            desc: "唯一：将你内力的77%转化为气血"
        }
    };
}

this.slots = [
    {
        prop: "con",
        value: lv => 1 + Math.floor(lv / 12),
        format: (val) => {
            return "根骨：+" + val;
        }
    },
    {
        prop: "zyj_str",
        value: lv => 200 + Math.floor(lv / 5),
        format: (val) => {
            return "镇岳增加的臂力提高至" + val;
        }
    }
];
this.pfm = {
    zhenyue:
    {
        name: "镇岳",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 500,
        use_type: 2,
        use: function (me, target, lv) {
            var str = parseInt(lv / 3) + me.query_prop('zyj_str');
            var time = 25000 + lv * 5;
            if (time > 35000) time = 35000;
            me.send_room("<hiw>$N凝神运气，运起镇岳诀，浑身真气凝重如山，气势陡增</hiw>", target);
            me.add_status({
                id: "force",
                name: "镇岳",
                desc: "镇岳诀，大幅增加你的臂力",
                duration: time,
                prop: {
                    str: str
                },
                finish_msg: "$N的镇岳真气渐渐散去，恢复如常。"
            });
        },
        query_desc: function (me, lv) {
            var str = parseInt(lv / 3);
            var time = 25000 + lv * 5;
            if (time > 35000) time = 35000;
            return "使用镇岳诀增加你" + str + "的臂力，持续" + (time / 1000) + "秒";
        }
    }
};
