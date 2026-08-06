this.inherits(COMMAND);
this.command = "perform";
this.allow_busy = true;
this.allow_faint = true;
this.regex = /^(\w+)\.(.+?)$/;

this.enter = function (me, sk, pfmid) {
    this.try_perform(me, sk, pfmid);
}

this.fail = function (me, message, options) {
    if (!options || !options.silent) {
        if (message) me.notify(message);
    }
    return false;
}

this.resolve_perform = function (me, sk, pfmid, options) {
    if (!sk || !pfmid) return this.fail(me, "你要使用什么绝招。", options);
    if (!me.skills) return this.fail(me, "你目前没有学会任何技能。", options);

    var baseSkill = me.skills[sk];
    if (!baseSkill) return this.fail(me, "你不会用这个技能。", options);

    var is_dao = pfmid.indexOf("dao.") === 0;
    var sp_skill = is_dao ? SKILL.get(sk) : SKILL.get(baseSkill.enable_skill || sk);
    if (!sp_skill) return this.fail(me, "没有这个技能。", options);

    var sp_myskill = me.skills[sp_skill.id];
    if (!sp_myskill || sp_myskill.disable) {
        return this.fail(me, "这个技能暂时无法使用，请联系管理员处理。", options);
    }

    var is_ref = false;
    var pfm = is_dao && sp_skill.get_dao_pfm
        ? sp_skill.get_dao_pfm(pfmid, me)
        : sp_skill.get_pfm(pfmid);
    if (!pfm && pfmid === "ref") {
        pfm = me.query_ref_skill(me.skills[baseSkill.enable_skill]);
        is_ref = !!pfm;
    }
    if (!pfm) {
        return this.fail(me, sp_skill.name + "没有这个绝招。", options);
    }

    return {
        baseSkill: baseSkill,
        sp_skill: sp_skill,
        pfm: pfm,
        is_ref: is_ref,
        is_dao: is_dao
    };
}

this.try_perform = function (me, sk, pfmid, options) {
    options = options || {};
    var resolved = this.resolve_perform(me, sk, pfmid, options);
    if (!resolved) return false;

    var sp_skill = resolved.sp_skill;
    var pfm = resolved.pfm;
    var is_ref = resolved.is_ref;
    var is_dao = resolved.is_dao;
    var name = "【" + pfm.name + "】";

    if (pfm.no_auto && options.auto) return false;
    if (options.auto && me.state && !this.allow_state) return false;
    if (me.environment && me.environment.no_fight && !pfm.allow_safe) {
        return this.fail(me, "这里不允许战斗。", options);
    }
    if (me.hp <= 0) return false;
    if (!pfm.allow_busy && me.is_busy) {
        return this.fail(me, "你现在手忙脚乱，无法使用" + name + "。", options);
    }
    if (me.is_faint && !pfm.allow_faint) {
        return this.fail(me, "你正在昏迷中。", options);
    }
    if (!pfm.use_type && !me.is_fighting()) {
        return this.fail(me, name + "只能在战斗中使用。", options);
    }
    if (pfm.use_type === 1 && me.is_fighting()) {
        return this.fail(me, "战斗中无法使用" + name + "。", options);
    }

    var lv = me.query_skill(sp_skill.id, 0);
    if (is_ref) lv = parseInt(lv / 2);
    if (me.mp < pfm.query_mp(me, lv)) {
        return this.fail(me, "你的内力不够，无法使用" + name, options);
    }
    if (pfm.check && !pfm.check(me, lv, sk)) return false;
    if (pfm.enable_skill && pfm.enable_skill !== sk) {
        var enableSkill = SKILL.get(pfm.enable_skill);
        var enableName = enableSkill ? enableSkill.name : pfm.enable_skill;
        return this.fail(me, name + "需要装备为" + enableName + "才可以使用。", options);
    }
    if (sk === "throwing" && !me.can_throwing()) {
        return this.fail(me, "你没有装备暗器，无法使用" + name, options);
    }

    if (pfm.weapon_type) {
        if (pfm.weapon_type !== me.query_weapon_type()) {
            return this.fail(me, "你装备的武器不对，无法使用" + name, options);
        }
    } else {
        var need_weapon = WEAPON[sk];
        if (need_weapon && need_weapon !== me.query_weapon_type()) {
            return this.fail(me, "你装备的武器不对，无法使用" + name, options);
        }
    }

    if (pfm.check && !pfm.no_check && !pfm.check(me, lv)) return false;

    var key = "pfm/" + sk + "/" + pfmid;
    if (me.query_temp(key)) {
        return this.fail(me, pfm.name + "还没准备好，你还不能使用。", options);
    }

    var target = options.target || me.query_enemy();
    if (!pfm.use_type && (!target || target.hp <= 0 || (me.is_here && !me.is_here(target)))) {
        return this.fail(me, "你要用绝招对付谁？", options);
    }

    var now = Date.now();
    if (me.release_time && now < me.release_time) {
        return this.fail(me, "你上个技能还没释放完成。", options);
    }

    var isrelease = false;
    if (me.query_prop("no_pfm")) {
        me.send_room("<red>$N释放技能" + pfm.name + "，但是没有产生任何效果。</red>\n");
        me.remove_status("bikou");
        isrelease = true;
    } else if (target && target.parry_skill && target.parry_skill.on_parry_pfm) {
        isrelease = target.parry_skill.on_parry_pfm(target, me, pfm, lv, sk);
    } else {
        if (!is_dao && pfm.is_weapon && sp_skill !== me.attack_skill) {
            me.remove_status("weapon", true);
        }
        isrelease = pfm.use(me, target, lv, sk) !== false;
    }

    if (!isrelease) return false;

    me.add_mp(-pfm.query_mp(me, lv) || 0);
    me.set_temp("used_pfm", pfm.id, 20000);

    var rtime = pfm.query_releasetime(me, lv);
    me.release_time = rtime > 0 ? rtime + now : 0;

    var distime = pfm.query_distime(me, lv, is_ref);
    me.set_temp(key, 1, distime + rtime);
    me.notify('{type:"dispfm",id:"' + sk + "." + pfmid + '",rtime:'
        + rtime + ",distime:" + (distime + rtime) + "}");

    if (!is_dao && pfm.is_weapon && sp_skill !== me.attack_skill) {
        me.attack_skill = sp_skill;
        me.remove_status("weapon", true);
    }
    return true;
}

const WEAPON = {
    sword: "sword",
    blade: "blade",
    staff: "staff",
    club: "club",
    whip: "whip"
};
