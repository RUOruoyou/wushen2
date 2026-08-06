this.inherits(COMMAND);
this.command = "lingwu";
this.allow_fight = false;
this.regex = /^(\w+)(?:\s+(roll|choose|remove|removeok)(?:\s+(\d+))?)?$/;

const PAGE_PATH = "book/up";

this.enter = function (me, skillId, action, slotId) {
    if (!me.skills) return me.notify("你还没有学会任何特殊武功。");
    const skillItem = me.skills[skillId];
    const skillBase = SKILL.get(skillId);
    if (!skillItem || !skillBase) return me.notify("你还没有学会这门武功。");
    if (skillBase.type !== SKILL_TYPES.SKILL || skillBase.grade < 1) {
        return me.notify("基础武学和知识技能不能进阶。");
    }

    if (skillItem.progression_offer) {
        if (!isOfferCurrent(me, skillBase, skillItem)) {
            return refundInvalidOffer(me, skillBase, skillItem);
        }
        if (action === "choose") {
            return chooseSlot(me, skillBase, skillItem, parseInt(slotId));
        }
        return showOffer(me, skillBase, skillItem);
    }

    if (action === "remove" || action === "removeok") {
        return removeProgression(me, skillBase, skillItem, action === "removeok");
    }
    if (!skillBase.can_progress(me)) {
        const steps = Array.isArray(skillItem.addin) ? skillItem.addin.length : 0;
        const requiredLevel = 500 + steps * 300;
        if (me.query_skill(skillId, 0) < requiredLevel) {
            return sendProgression(me, skillBase, "这门武功达到" + requiredLevel + "级后才能进阶。", []);
        }
        if (steps >= 5) {
            const actions = Array.isArray(skillItem.addin) && skillItem.addin.length ? [{
                cmd: queryCommand(me, "lingwu " + skillBase.id + " remove"),
                name: "取消上一重进阶"
            }] : [];
            return sendProgression(me, skillBase, "这门武功已经进阶到最高重数。", actions);
        }
        return sendProgression(me, skillBase, "这门武功暂时没有足够的可选进阶词条。", []);
    }
    if (action === "roll") return createOffer(me, skillBase, skillItem);
    return showProgression(me, skillBase, skillItem);
};

function queryCommand(me, command) {
    if (me.is_player) return command;
    return "dc " + me.id + " " + command;
}

function queryPage(me) {
    return me.find_obj_bypath(PAGE_PATH);
}

function showProgression(me, skillBase, skillItem) {
    const cost = skillBase.query_progression_cost(me);
    const page = queryPage(me);
    const pageCount = page ? page.count : 0;
    const currentGrade = skillBase.query_grade(me);
    const steps = skillBase.query_progression_steps(me);
    const gradeNames = ["白色", "绿色", "蓝色", "黄色", "紫色", "橙色", "红色"];
    const message = skillBase.query_color_name(me) + "当前有效品质为"
        + gradeNames[currentGrade] + "，当前进阶" + steps + "/5重，下一重进阶需要" + cost
        + "份<hiz>武学进阶残页</hiz>。你目前拥有" + pageCount + "份。\n"
        + "红色为显示品质上限，达到红色后仍可继续进阶并提升属性；确认参悟后会固定生成三个不重复词条，关闭面板或重新登录不会刷新候选。";

    const actions = [
        {
            cmd: queryCommand(me, "lingwu " + skillBase.id + " roll"),
            name: "参悟三项词条"
        }
    ];
    if (Array.isArray(skillItem.addin) && skillItem.addin.length) {
        actions.push({
            cmd: queryCommand(me, "lingwu " + skillBase.id + " remove"),
            name: "取消上一重进阶"
        });
    }
    sendProgression(me, skillBase, message, actions);
}

function createOffer(me, skillBase, skillItem) {
    const cost = skillBase.query_progression_cost(me);
    const page = queryPage(me);
    if (!(cost > 0)) return sendProgression(me, skillBase, "这门武功已经无法继续进阶。", []);
    if (!page || page.count < cost) {
        return sendProgression(me, skillBase, "你的<hiz>武学进阶残页</hiz>不足，还需要"
            + (cost - (page ? page.count : 0)) + "份。", []);
    }

    const pool = skillBase.query_progression_slots(me).slice();
    if (pool.length < 3) {
        return sendProgression(me, skillBase, "这门武功暂时没有足够的可选进阶词条。", []);
    }
    const choices = [];
    while (choices.length < 3) {
        const index = me.random(pool.length);
        choices.push(pool.splice(index, 1)[0]);
    }

    if (!me.remove_obj(page, cost)) {
        return me.notify("扣除武学进阶残页失败，请重新尝试。");
    }
    skillItem.progression_offer = {
        grade: skillBase.query_grade(me),
        addin_count: Array.isArray(skillItem.addin) ? skillItem.addin.length : 0,
        cost: cost,
        choices: choices
    };
    return showOffer(me, skillBase, skillItem);
}

function showOffer(me, skillBase, skillItem) {
    const offer = skillItem.progression_offer;
    const message = "你从" + skillBase.query_color_name(me)
        + "中参悟出以下三项词条。本次候选已经固定，请指定其中一项：";
    const actions = [];
    for (let i = 0; i < offer.choices.length; i++) {
        const slotId = offer.choices[i];
        actions.push({
            cmd: queryCommand(me, "lingwu " + skillBase.id + " choose " + slotId),
            name: skillBase.query_progression_slot_desc(me, slotId, true)
        });
    }
    sendProgression(me, skillBase, message, actions);
}

function chooseSlot(me, skillBase, skillItem, slotId) {
    const offer = skillItem.progression_offer;
    if (!(slotId >= 0) || offer.choices.indexOf(slotId) < 0) {
        return me.notify("这个词条不在本次参悟结果中。");
    }
    if (!skillBase.query_slot(slotId)) {
        return refundInvalidOffer(me, skillBase, skillItem);
    }

    const level = me.query_skill(skillBase.id, 0);
    const oldScore = skillBase.query_score(level, me);
    skillBase.release_prop(me, level);
    if (!Array.isArray(skillItem.addin)) skillItem.addin = [];
    if (!Array.isArray(skillItem.addin_costs)) skillItem.addin_costs = [];
    skillItem.addin.push(slotId);
    skillItem.addin_costs.push(offer.cost);
    delete skillItem.progression_offer;
    skillBase.attach_prop(me, level);
    me.add_score(skillBase.query_score(level, me) - oldScore);
    me.recount();
    refreshSkill(me, skillBase, skillItem);
    me.notify("你选择了「" + skillBase.query_progression_slot_desc(me, slotId, false)
        + "」，" + skillBase.query_color_name(me) + "完成一重进阶。");
    return refreshSkillDesc(me, skillBase);
}

function removeProgression(me, skillBase, skillItem, confirmed) {
    if (!Array.isArray(skillItem.addin) || !skillItem.addin.length) {
        return me.notify("这门武功还没有进阶词条。");
    }
    const lastIndex = skillItem.addin.length - 1;
    const slotId = skillItem.addin[lastIndex];
    const storedCost = Array.isArray(skillItem.addin_costs)
        ? parseInt(skillItem.addin_costs[lastIndex]) : 0;
    const fallbackGrade = Math.min(SKILL.MAX_GRADE, skillBase.grade + skillItem.addin.length);
    const isKnownCost = SKILL.PROGRESSION_COSTS.indexOf(storedCost) > 0;
    const fullRefund = isKnownCost ? storedCost : (SKILL.PROGRESSION_COSTS[fallbackGrade] || 0);
    const refund = Math.floor(fullRefund / 2);
    if (!confirmed) {
        const message = "取消后将移除上一重词条「"
            + skillBase.query_progression_slot_desc(me, slotId, false)
            + "」，返还" + refund + "份<hiz>武学进阶残页</hiz>（原消耗的一半）。";
        return sendProgression(me, skillBase, message, [{
            cmd: queryCommand(me, "lingwu " + skillBase.id + " removeok"),
            name: "确认取消上一重"
        }]);
    }
    if (refund > 0 && !me.can_add_obj(PAGE_PATH, refund)) {
        return me.notify("你的背包已满，无法返还武学进阶残页。");
    }

    const level = me.query_skill(skillBase.id, 0);
    const oldScore = skillBase.query_score(level, me);
    skillBase.release_prop(me, level);
    skillItem.addin.pop();
    if (Array.isArray(skillItem.addin_costs)) {
        skillItem.addin_costs.pop();
        if (!skillItem.addin_costs.length) delete skillItem.addin_costs;
    }
    skillBase.attach_prop(me, level);
    me.add_score(skillBase.query_score(level, me) - oldScore);
    me.recount();
    if (refund > 0) me.add_obj(PAGE_PATH, refund);
    refreshSkill(me, skillBase, skillItem);
    me.notify("你取消了" + skillBase.query_color_name(me) + "的上一重进阶，取回了"
        + refund + "份<hiz>武学进阶残页</hiz>。");
    return refreshSkillDesc(me, skillBase);
}

function isOfferCurrent(me, skillBase, skillItem) {
    const offer = skillItem.progression_offer;
    if (!offer || !Array.isArray(offer.choices) || offer.choices.length !== 3) return false;
    if (offer.grade !== skillBase.query_grade(me)) return false;
    if (parseInt(offer.cost) !== queryOfferCost(offer)) return false;
    const addinCount = Array.isArray(skillItem.addin) ? skillItem.addin.length : 0;
    if (offer.addin_count !== addinCount) return false;
    const availableSlots = skillBase.query_progression_slots(me);
    const uniqueSlots = [];
    for (let i = 0; i < offer.choices.length; i++) {
        const slotId = parseInt(offer.choices[i]);
        if (uniqueSlots.indexOf(slotId) >= 0 || availableSlots.indexOf(slotId) < 0) return false;
        uniqueSlots.push(slotId);
    }
    return true;
}

function refundInvalidOffer(me, skillBase, skillItem) {
    const offer = skillItem.progression_offer;
    const refund = offer && parseInt(offer.cost) === queryOfferCost(offer)
        ? parseInt(offer.cost) : 0;
    if (refund > 0 && !me.can_add_obj(PAGE_PATH, refund)) {
        return me.notify("进阶候选已经失效，但你的背包已满，暂时无法退还残页。请清理背包后重试。");
    }
    delete skillItem.progression_offer;
    if (refund > 0) me.add_obj(PAGE_PATH, refund);
    me.notify(skillBase.query_color_name(me) + "的进阶候选已经失效，消耗的"
        + refund + "份<hiz>武学进阶残页</hiz>已退还，请重新参悟。");
}

function queryOfferCost(offer) {
    if (!offer) return 0;
    // 红色是显示品质上限，进阶重数达到上限前仍按最后一档费用继续提升属性。
    const targetGrade = Math.min(SKILL.MAX_GRADE, parseInt(offer.grade) + 1);
    return SKILL.PROGRESSION_COSTS[targetGrade] || 0;
}

function sendProgression(me, skillBase, message, actions) {
    me.notify(JSON.stringify({
        type: "dialog",
        dialog: "skills",
        progression: {
            id: skillBase.id,
            from: me.is_player ? undefined : me.id,
            message: message,
            actions: actions
        }
    }));
}

function refreshSkill(me, skillBase, skillItem) {
    const needExp = skillBase.level_exp(skillItem.level, me);
    me.notify(JSON.stringify({
        type: "dialog",
        dialog: "skills",
        id: skillBase.id,
        from: me.is_player ? undefined : me.id,
        name: skillBase.query_base_color_name(me),
        grade: skillBase.grade,
        effective_grade: skillBase.query_grade(me),
        level: me.query_skill(skillBase.id, 0),
        exp: parseInt((skillItem.exp || 0) * 100 / needExp)
    }));
}

function refreshSkillDesc(me, skillBase) {
    me.notify(JSON.stringify({
        type: "dialog",
        dialog: "skills",
        id: skillBase.id,
        desc: skillBase.query_desc(me, me.query_skill(skillBase.id, 0))
    }));
}
