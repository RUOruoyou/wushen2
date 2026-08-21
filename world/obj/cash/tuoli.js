this.inherits(OBJ);
this.set({
    unit: "张",
    name: "叛师符",
    desc: "使用后可以使脱离当前门派，门派学到的所有武功会遗忘，会返还你学习和练习技能消耗的潜能",
    grade: 5,
    value: 0
});
this.on_use = function (me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");
    if (me.query_temp('tuolicd')) return me.notify_fail("你刚脱离门派没多久，频繁的背叛师门会被武林中人所不齿的。");
    if (!me.family || me.family == FAMILIES.NONE)
        return me.notify_fail("你还没有门派，不需要叛师。");
    var list = [];
    var up_count = 0;
    var addin_skills = [];
    var addin_refund = 0;
    for (var key in me.skills) {
        var skill = SKILL.get(key);
        if (skill.family === me.family) {
            let skitem = me.skills[key];
            if (skitem.ref)
                return me.notify_fail('请先取消' + skill.query_color_name(me) + '融合的绝招。');

            if (skitem.addin && skitem.addin.length) {
                addin_skills.push(skill);
                addin_refund += query_addin_refund(skill, skitem);
            }
            list.push(skill);
            if (skill.source_skill) {
                up_count += (skill.grade === 4 ? 50 : 100);
            }
        }
    }
    if (addin_refund > 0 && !me.can_add_obj('book/up', addin_refund))
        return me.notify_fail('你的背包已满，无法退还武学进阶残页，请清理背包后重试。');
    if (me.query_temp("tuoli")) {
        if (addin_skills.length) {
            var addin_names = [];
            for (var i = 0; i < addin_skills.length; i++) {
                remove_all_addin(me, addin_skills[i]);
                addin_names.push(addin_skills[i].query_color_name(me));
            }
            if (addin_refund > 0) me.add_obj('book/up', addin_refund);
            me.notify("<hiy>已自动取消" + addin_names.join("、") + "的技能进阶，取回" + addin_refund + "份<hiz>武学进阶残页</hiz>。</hiy>");
        }
        var sum = 0;
        for (var i = 0; i < list.length; i++) {
            var needpot = list[i].query_needexp(me.skills[list[i].id].level, me);
            if (me.remove_skill(list[i].id)) {
                if (needpot)
                    sum += needpot;
                me.notify('{type:"dialog",dialog:"skills",remove:"' + list[i].id + '"}');
            }
        }
        me.send_room("<hiy>$N义无反顾的拿出叛师符，嘴里念念有词...\n\n</hiy>");
        if (sum) {
            me.notify("<hig>你遗忘的武功转化为" + parseInt(sum) + "点潜能。</hig>");

            me.pot += parseInt(sum);
        }
        if (up_count > 0) {
            let obj = me.add_obj('book/up', up_count);
            me.notify("你获得了" + obj.unit_name(up_count) + "。");
        }

        me.add_status({
            id: "faint",
            is_faint: true,
            duration: 10000,
            name: "昏迷", downside: true,
            finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
            start_msg: "<hir>$N突然觉得一生所学忘了个精光，头痛难忍，惨叫一声昏了过去……</hir>\n"
        });
        let fam = me.family;
        me.family = FAMILIES.NONE;
        me.add_title("普通百姓", "family");
        me.remove_temp("master");

        //me.remove_temp("master");
        me.remove_temp("family");
        me.remove_temp("family_level");
        me.set_temp('tuolicd', 1, UTIL.diff_time());
        WORLD.DATA.reset_famtops(me, fam);


    } else {
        var str = ["<hiy>你使用这张符咒后将会脱离" + me.family.name + "，以下武功将会被遗忘："];
        str.push("</hiy>");
        if (list.length) {
            str.push("\n");
            for (var i = 0; i < list.length; i++) {
                str.push("\n");
                str.push(list[i].color_name);
            }
            str.push("");
        }
        if (addin_skills.length) {
            str.push('\n以下武功的技能进阶将自动取消，返还' + addin_refund + '份<hiz>武学进阶残页</hiz>（原消耗的一半）：');
            for (var i = 0; i < addin_skills.length; i++) {
                str.push("\n");
                str.push(addin_skills[i].query_color_name(me));
            }
        }
        str.push('\n脱离门派期间师门物资将停止发放。');
        if (up_count > 0) {
            str.push('\n退还' + up_count + '份<hiz>武学进阶残页</hiz>。');
        }

        me.notify(str.join(""));
        me.set_temp("tuoli", 1, 10000);
        me.send_commands("use " + this.id, "确定脱离门派");
        return false;
    }

}

function query_addin_refund(skillBase, skitem) {
    // 与 lingwu 手动取消进阶同规则：每重返还原消耗一半，无消耗记录时按品质档位估算
    var total = 0;
    var count = skitem.addin.length;
    for (var i = 0; i < count; i++) {
        var storedCost = Array.isArray(skitem.addin_costs) ? parseInt(skitem.addin_costs[i]) : 0;
        var fallbackGrade = Math.min(SKILL.MAX_GRADE, skillBase.grade + count - i);
        var isKnownCost = SKILL.PROGRESSION_COSTS.indexOf(storedCost) > 0;
        var fullRefund = isKnownCost ? storedCost : (SKILL.PROGRESSION_COSTS[fallbackGrade] || 0);
        total += Math.floor(fullRefund / 2);
    }
    return total;
}

function remove_all_addin(me, skillBase) {
    var skitem = me.skills[skillBase.id];
    if (!skitem || !Array.isArray(skitem.addin) || !skitem.addin.length) return;
    var level = me.query_skill(skillBase.id, 0);
    var oldScore = skillBase.query_score(level, me);
    skillBase.release_prop(me, level);
    skitem.addin.length = 0;
    delete skitem.addin_costs;
    skillBase.attach_prop(me, level);
    me.add_score(skillBase.query_score(level, me) - oldScore);
    me.recount();
}
