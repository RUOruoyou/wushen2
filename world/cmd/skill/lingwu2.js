this.inherits(COMMAND);
this.command = "lingwu2";
this.allow_fight = false;
this.regex = /^(\w+)(?:\s+(choose|remove|removeok)(?:\s+(\d+))?)?$/;

const PAGE_PATH = "book/wudao";

this.enter = function (me, skillId, action, arg) {
    if (!me.skills) return me.notify("你还没有学会任何特殊武功。");
    const skillItem = me.skills[skillId];
    const skillBase = SKILL.get(skillId);
    if (!skillItem || !skillBase) return me.notify("你还没有学会这门武功。");
    if (skillBase.type !== SKILL_TYPES.SKILL || skillBase.grade < 1) {
        return me.notify("基础武学和知识技能不能融合。");
    }
    if (!skillItem.enable_skill) {
        return me.notify("你需要先将这门武功装备到基本技能上才能融合。");
    }

    if (action === "remove" || action === "removeok") {
        return removeFusion(me, skillBase, skillItem, action === "removeok");
    }

    if (skillItem.ref) {
        const actions = [{
            cmd: queryCommand(me, "lingwu2 " + skillBase.id + " remove"),
            name: "取消融合"
        }];
        return sendProgression(me, skillBase, skillBase.query_color_name(me)
            + "已经融合了绝招，无法再次融合。", actions);
    }

    if (action === "choose") {
        return chooseFusion(me, skillBase, skillItem, parseInt(arg));
    }

    return showCandidates(me, skillBase, skillItem);
};

// ---- 候选收集 ----

function collectCandidates(me, skillBase, skillItem) {
    const baseType = skillItem.enable_skill;
    const targetId = skillBase.id;
    const candidates = [];

    for (var skId in me.skills) {
        if (skId === targetId) continue;
        var sp = SKILL.get(skId);
        if (!sp || !sp.pfm || sp.type !== SKILL_TYPES.SKILL) continue;
        var owned = me.skills[skId];
        if (!owned || owned.disable) continue;
        for (var key in sp.pfm) {
            var p = sp.pfm[key];
            if (p.enable_skill !== baseType) continue;
            if (p.no_copy) continue;
            candidates.push({
                skillId: skId,
                skillName: sp.name,
                pfmKey: key,
                pfmName: p.name,
                desc: formatPfmBrief(sp, p, me, 1000)
            });
        }
    }
    return candidates;
}

function formatPfmBrief(spSkill, pfm, me, lv) {
    var parts = [];
    if (pfm.query_mp) parts.push("耗内" + pfm.query_mp(me, lv));
    if (pfm.query_releasetime) {
        var rt = pfm.query_releasetime(me, lv);
        if (rt > 500) parts.push("出招" + (rt / 1000).toFixed(1) + "秒");
    }
    if (pfm.query_distime) {
        var cd = pfm.query_distime(me, lv);
        parts.push("冷却" + (cd / 1000).toFixed(0) + "秒");
    }
    return parts.join(" · ");
}

// ---- 主面板 ----

function showCandidates(me, skillBase, skillItem) {
    const candidates = collectCandidates(me, skillBase, skillItem);
    if (!candidates.length) {
        return sendProgression(me, skillBase,
            "你没有其他技能中有可融合的绝招。融合需要你已学会其他有同类型绝招的技能。", []);
    }

    const page = me.find_obj_bypath(PAGE_PATH);
    const pageCount = page ? page.count : 0;
    const baseType = skillItem.enable_skill;
    const baseTypeNames = {
        force: "内功", unarmed: "拳脚", sword: "剑法", blade: "刀法",
        club: "棍法", staff: "杖法", whip: "鞭法", throwing: "暗器",
        dodge: "轻功", parry: "招架", bite: "咬技"
    };

    const message = skillBase.query_color_name(me) + "当前装备在"
        + (baseTypeNames[baseType] || baseType) + "上。\n选择要融合的绝招（融合后释放等级减半、冷却加倍、有效品级+1）：\n"
        + "你需要消耗1本<hiz>武道</hiz>。你目前拥有" + pageCount + "本。";

    const actions = [];
    for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        actions.push({
            cmd: queryCommand(me, "lingwu2 " + skillBase.id + " choose " + i),
            name: c.skillName + " · " + c.pfmName + "（" + c.desc + "）"
        });
    }

    sendProgression(me, skillBase, message, actions);
}

// ---- 选择融合 ----

function chooseFusion(me, skillBase, skillItem, index) {
    const candidates = collectCandidates(me, skillBase, skillItem);
    if (!(index >= 0) || index >= candidates.length) {
        return me.notify("这个绝招不在可选列表中。");
    }

    const page = me.find_obj_bypath(PAGE_PATH);
    if (!page || page.count < 1) {
        return sendProgression(me, skillBase, "你需要1本<hiz>武道</hiz>来进行融合，但你身上没有。", []);
    }

    const chosen = candidates[index];

    // 验证源技能仍存在
    var srcSkill = SKILL.get(chosen.skillId);
    if (!srcSkill || !srcSkill.pfm || !srcSkill.pfm[chosen.pfmKey]) {
        return me.notify("源绝招已不存在，请重新选择。");
    }

    if (!me.remove_obj(page, 1)) {
        return me.notify("扣除武道失败，请重新尝试。");
    }

    const level = me.query_skill(skillBase.id, 0);
    const oldScore = skillBase.query_score(level, me);
    skillBase.release_prop(me, level);
    skillItem.ref = chosen.skillId + "/" + chosen.pfmKey;
    skillBase.attach_prop(me, level);
    me.add_score(skillBase.query_score(level, me) - oldScore);
    me.recount();

    refreshSkill(me, skillBase, skillItem);
    me.notify("你将「" + srcSkill.name + " · " + chosen.pfmName
        + "」融合到了" + skillBase.query_color_name(me) + "中。");
    return refreshSkillDesc(me, skillBase);
}

// ---- 取消融合 ----

function removeFusion(me, skillBase, skillItem, confirmed) {
    if (!skillItem.ref) {
        return me.notify("这门武功还没有融合绝招。");
    }

    var refs = skillItem.ref.split("/");
    var srcSkill = SKILL.get(refs[0]);
    var srcPfm = srcSkill ? srcSkill.get_pfm(refs[1]) : null;
    var pfmDesc = srcPfm ? (srcSkill.name + " · " + srcPfm.name) : "未知绝招";

    if (!confirmed) {
        const message = "取消融合将移除「" + pfmDesc + "」，返还1本<hiz>武道</hiz>。";
        return sendProgression(me, skillBase, message, [{
            cmd: queryCommand(me, "lingwu2 " + skillBase.id + " removeok"),
            name: "确认取消融合"
        }]);
    }

    if (!me.can_add_obj(PAGE_PATH, 1)) {
        return me.notify("你的背包已满，无法返还武道。");
    }

    const level = me.query_skill(skillBase.id, 0);
    const oldScore = skillBase.query_score(level, me);
    skillBase.release_prop(me, level);
    delete skillItem.ref;
    skillBase.attach_prop(me, level);
    me.add_score(skillBase.query_score(level, me) - oldScore);
    me.recount();
    me.add_obj(PAGE_PATH, 1);

    refreshSkill(me, skillBase, skillItem);
    me.notify("你取消了" + skillBase.query_color_name(me) + "的融合，取回了1本<hiz>武道</hiz>。");
    return refreshSkillDesc(me, skillBase);
}

// ---- 共享工具函数（与 lingwu.js 一致） ----

function queryCommand(me, command) {
    if (me.is_player) return command;
    return "dc " + me.id + " " + command;
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
        name: skillBase.query_base_color_name(),
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
