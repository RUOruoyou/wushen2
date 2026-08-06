this.inherits(COMMAND);
this.command = "dao";
this.allow_fight = false;
this.regex = /^(?:(\w+)(?:\s+(up))?)?$/;

const PAGE_PATH = "book/wudao";

this.enter = function (me, skillId, action) {
    if (!skillId) return showAvailable(me);

    const skillBase = SKILL.get(skillId);
    if (!skillBase || !skillBase.query_dao_config || !skillBase.query_dao_config()
        || skillBase.type !== SKILL_TYPES.BASE) {
        return me.notify("只有十类基础技能可以进行武道参悟。");
    }

    if (action === "up") return upgrade(me, skillBase);
    return showSkill(me, skillBase);
};

function showAvailable(me) {
    if (!me.skills) return me.notify("你还没有学会可参悟的基础技能。");
    const names = [];
    for (const skillId of SKILL.DAO_BASE_IDS) {
        const skillBase = SKILL.get(skillId);
        if (skillBase && me.skills[skillId] && skillBase.query_dao_next(me)) {
            names.push(skillBase.query_color_name(me));
        }
    }
    if (!names.length) return me.notify("你目前没有可以继续参悟的基础技能。");
    return me.notify("可参悟的基础技能：" + names.join("、") + "。\n使用 dao <技能ID> 查看详情。");
}

function showSkill(me, skillBase) {
    if (!me.skills || !me.skills[skillBase.id]) {
        return me.notify("你还没有学会" + skillBase.query_color_name(me) + "。");
    }
    const rank = skillBase.query_dao_rank(me);
    const next = skillBase.query_dao_next(me);
    const message = [
        skillBase.query_color_name(me), "当前为第", rank, "/5 阶。"
    ];
    if (!next) {
        message.push("\n你已经参悟至最高境界。\n", "当前技能等级上限：", skillBase.query_dao_level_limit(me), "级。");
        return sendProgression(me, skillBase, message.join(""), []);
    }
    message.push(
        "\n下一阶：", next.name,
        "\n等级要求：", next.requiredLevel,
        "级\n消耗：", next.cost,
        "本武道\n升阶后等级上限：", me.skill_limit() + next.levelBonus,
        "级\n当前技能等级：", me.skills[skillBase.id].level,
        "级。\n参悟不可撤销。"
    );
    const actions = [];
    if (skillBase.can_dao(me)) {
        actions.push({
            cmd: "dao " + skillBase.id + " up",
            name: "确认参悟"
        });
    } else {
        message.push("\n当前等级不足，暂不可参悟。");
    }
    return sendProgression(me, skillBase, message.join(""), actions);
}

function upgrade(me, skillBase) {
    if (!me.is_player) return me.notify("只有玩家角色可以进行武道参悟。");
    if (!me.skills || !me.skills[skillBase.id]) {
        return me.notify("你还没有学会" + skillBase.query_color_name(me) + "。");
    }
    const skillItem = me.skills[skillBase.id];
    const next = skillBase.query_dao_next(me);
    if (!next) return me.notify("你已经参悟至最高境界，无法继续升阶。");
    if (skillItem.level < next.requiredLevel) {
        return me.notify("你的" + skillBase.query_color_name(me) + "等级不足" + next.requiredLevel + "级。");
    }
    if (me.query_prop(skillBase.id)) {
        return me.notify("请先卸下增加" + skillBase.query_color_name(me) + "等级的装备。");
    }

    const page = me.find_obj_bypath(PAGE_PATH);
    if (!page || page.count < next.cost) {
        return me.notify("你需要" + next.cost + "本<hiz>武道</hiz>，但身上没有足够的武道。");
    }
    if (!me.remove_obj(page, next.cost)) {
        return me.notify("扣除武道失败，请重新尝试。");
    }

    const oldDao = skillBase.query_dao_rank(me);
    try {
        skillItem.dao = next.rank;
        me.init_skill();
        me.recount();
        me.save("dao-upgrade");
    } catch (error) {
        skillItem.dao = oldDao;
        try {
            me.init_skill();
            me.recount();
        } catch (rollbackError) {
            console.error("武道参悟属性回滚失败", me.id, skillBase.id, rollbackError);
        }
        if (me.can_add_obj(PAGE_PATH, next.cost)) {
            me.add_obj(PAGE_PATH, next.cost, true);
        } else {
            console.error("武道参悟扣费回滚失败", me.id, skillBase.id, next.cost);
        }
        console.error("武道参悟升级失败", me.id, skillBase.id, next.rank, error);
        return me.notify("参悟失败，未改变你的技能状态，请稍后再试。");
    }

    refreshSkill(me, skillBase, skillItem);
    refreshSkillDesc(me, skillBase);
    me.notify("你参悟了" + skillBase.query_color_name(me) + "，当前为第" + next.rank + "阶。");
}

function sendProgression(me, skillBase, message, actions) {
    me.notify(JSON.stringify({
        type: "dialog",
        dialog: "skills",
        progression: {
            id: skillBase.id,
            message: message,
            actions: actions || []
        }
    }));
}

function refreshSkill(me, skillBase, skillItem) {
    const needExp = skillBase.level_exp(skillItem.level, me);
    const next = skillBase.query_dao_next(me);
    const str = ["{type:\"dialog\",dialog:\"skills\",id:\"", skillBase.id,
        "\",name:\"", skillBase.query_base_color_name(me), "\",grade:", skillBase.grade,
        ",effective_grade:", skillBase.query_grade(me),
        ",dao_base:1",
        ",dao:", skillBase.query_dao_rank(me),
        ",dao_name:\"", skillBase.query_dao_name(me), "\",dao_next:",
        next ? next.rank : "null",
        ",dao_cost:", next ? next.cost : 0,
        ",dao_required_level:", next ? next.requiredLevel : 0,
        ",dao_level_limit:", skillBase.query_dao_level_limit(me),
        ",can_dao:", skillBase.can_dao(me) ? 1 : 0,
        ",level:", me.query_skill(skillBase.id, 0),
        ",exp:", parseInt((skillItem.exp || 0) * 100 / needExp), "}"];
    me.notify(str.join(""));
}

function refreshSkillDesc(me, skillBase) {
    me.notify(JSON.stringify({
        type: "dialog",
        dialog: "skills",
        id: skillBase.id,
        desc: skillBase.query_desc(me, me.query_skill(skillBase.id, 0))
    }));
}
