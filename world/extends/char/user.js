
USER.prototype.recount = function () {
    const forceDao = SKILL.get("force");
    const dodgeDao = SKILL.get("dodge");
    const parryDao = SKILL.get("parry");
    const staffDao = SKILL.get("staff");
    const clubDao = SKILL.get("club");
    const hpDaoBonus = (forceDao && forceDao.query_dao_hp_bonus
        ? forceDao.query_dao_hp_bonus(this) : 0)
        + (staffDao && staffDao.query_dao_hp_bonus ? staffDao.query_dao_hp_bonus(this) : 0);
    const dsDaoBonus = dodgeDao && dodgeDao.query_dao_ds_bonus
        ? dodgeDao.query_dao_ds_bonus(this) : 0;
    const fyDaoBonus = parryDao && parryDao.query_dao_fy_bonus
        ? parryDao.query_dao_fy_bonus(this) : 0;
    const zjDaoBonus = clubDao && clubDao.query_dao_zj_bonus
        ? clubDao.query_dao_zj_bonus(this) : 0;
    const conDaoBonus = staffDao && staffDao.query_dao_con_bonus
        ? staffDao.query_dao_con_bonus(this) : 0;
    const con = this.con * (100 + conDaoBonus) / 100;
    this.max_hp = parseInt(con * 5 + (this.max_mp * this.query_force_rad()
        + this.query_prop("max_hp") + this.query_prop("con") * con)
        * (100 + this.query_prop("hp_per") + hpDaoBonus) / 100);

    if (this.hp > this.max_hp) this.hp = this.max_hp;

    this.gjsd = 4000 - this.query_prop("gjsd");
    if (dodgeDao && dodgeDao.query_dao_gjsd_bonus) {
        this.gjsd -= dodgeDao.query_dao_gjsd_bonus(this);
    }
    if (this.gjsd > 500) {
        this.gjsd = parseInt(this.gjsd - (this.gjsd * this.query_prop("gjsd_per") / 100));
        if (this.gjsd < 500) this.gjsd = 500;
    } else {
        this.gjsd = 500;
    }

    this.gj = parseInt(this.str + (this.query_prop("gj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("gj_per")) / 100);
    this.fy = parseInt(((this.str + con) / 10 + this.query_prop("fy") + this.query_prop("con") * con / 10)
        * (100 + this.query_prop("fy_per") + fyDaoBonus) / 100);
    this.mz = parseInt((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
    this.ds = parseInt((this.dex / 2 + this.query_prop("ds") + this.query_prop("dex") * this.dex / 10)
        * (100 + this.query_prop("ds_per") + dsDaoBonus) / 100);
    if (this.dodge_skill && this.dodge_skill.on_recount_dodge) {
        this.ds += this.dodge_skill.on_recount_dodge(this);
    }
    this.zj = parseInt((this.str / 2 + this.query_prop("zj") + this.query_prop("str") * this.str / 10)
        * (100 + this.query_prop("zj_per") + zjDaoBonus) / 100);
    if (this.parry_skill && this.parry_skill.on_recount_parry) {
        this.zj += this.parry_skill.on_recount_parry(this);
    }
    this.bj = parseInt(this.dex / 10 + this.query_prop("bj_per"));
    this.diff_sh_per = this.query_prop('diff_sh_per');


    this.diff_fy_per = this.query_prop('diff_fy_per');
}

USER.prototype.level_up = function () {
    if (!this.level) {
        var sk = this.skill_limit();
        this.level = 1;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(10000, 10000);
        var now_sk = this.skill_limit();
        this.limit_mp += 1000;
        this.notify("<hiw>你的内力限制增加了1000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");

    } else if (this.level == 1) {
        var sk = this.skill_limit();
        this.level = 2;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(100000, 100000);
        var now_sk = this.skill_limit();
        this.limit_mp += 5000;
        this.notify("<hiw>你的最大内力限制增加了5000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");
    } else if (this.level == 2) {
        var sk = this.skill_limit();
        this.level = 3;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(200000, 200000);
        var now_sk = this.skill_limit();
        this.limit_mp += 10000;
        this.notify("<hiw>你的最大内力限制增加了10000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");

    } else if (this.level == 3) {
        var sk = this.skill_limit();
        this.level = 4;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(500000, 500000);
        var now_sk = this.skill_limit();
        this.limit_mp += 20000;
        this.notify("<hiw>你的最大内力限制增加了20000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");
    } else if (this.level == 4) {
        var sk = this.skill_limit();
        this.level = 5;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(1000000, 1000000);
        var now_sk = this.skill_limit();
        this.limit_mp += 50000;
        this.notify("<hiw>你的最大内力限制增加了50000。</hiw>");
        this.notify("<hiw>你的技能等级限制增加了" + (now_sk - sk) + "。</hiw>");
    } else if (this.level == 5) {
        var sk = this.skill_limit();
        this.level = 6;
        this.notify("<hiy>恭喜你提升到了" + this.get_level_desc() + "境界。</hiy>");
        this.add_exp(2000000, 2000000);
        this.limit_mp += 500000;
        this.add_temp("fenpei", 1);
        this.notify("<hiw>你的最大内力限制增加了500000。</hiw>");
        this.notify("<hiw>你的先天属性增加了1点。</hiw>");
    }
    this.color_name = null;
    this.environment.item_changed(this, true);
    this.send(`{type:"levelup",level:${this.level}}`);
}
USER.prototype.is_team = function (p) {
    if (!p || !p.team) return;
    return this.team == p.team;
}

USER.prototype.query_teamid = function () {
    if (this.team) return this.team.id;
    return this.id;
}

USER.prototype.can_trans = function () {
    if (!this.environment) return true;
    if (this.environment.is_fb()) return this.notify_fail("你现在正在副本区域。");
    const area = this.environment.parent;
    if (area && area.on_leave(this) == false) return false;
    return true;
}

USER.prototype.enable_area = function () {

    const area = this.environment && this.environment.parent;
    if (!area || !(area.jd_index >= 0)) return;
    if (!this.query_bool('fb2', area.jd_index)) {
        this.set_bool('fb2', area.jd_index, true);
        this.send('<him>你解锁新地图【' + area.name + '】。</him>');
        this.send(`{type:"dialog",dialog:"jh",unlock2:${this.query_temp('fb2', 0)}}`);
    }

}
USER.prototype.isenable_area = function (fb) {
    if (!fb) return false;
    if (typeof fb === 'number') {
        return this.query_bool('fb2', fb);
    }
    if (!(fb.jd_index >= 0)) return false;
    return this.query_bool('fb2', fb.jd_index);
}
USER.prototype.query_bool = function (key, index) {
    let step = parseInt(index / 32);
    if (step > 0) key = key.toString() + step.toString();
    let num = this.query_temp(key, 0);
    if (!num) return false;
    let bit = index % 32;
    return (num & (1 << bit)) !== 0;
}
USER.prototype.set_bool = function (key, index, value, time) {
    let step = parseInt(index / 32);
    if (step > 0) key = key.toString() + step.toString();
    let num = this.query_temp(key, 0);
    let bit = index % 32;
    if (value)
        this.set_temp(key, num | (1 << bit), time);
    else
        this.set_temp(key, num & ~(1 << bit), time);
}
USER.prototype.clear_bool = function (key, count) {
    let num = this.query_temp(key, 0);
    if (!num) return;
    for (let i = 0; i < count; i++) {
        if ((num & (1 << i)) !== 0) {
            return;
        }
    }
    this.remove_temp(key);
}


USER.prototype.expend_jingli = function (val) {
    if (val > 0 && this.query_jingli() >= val) {
        var expend = this.query_temp("ex_jl", 0);
        if (expend >= 200) {
            var add = this.query_temp("ad_jl", 0);
            if (add < val) return false;
            this.add_temp("ad_jl", -val);

        } else {
            if (expend + val > 200) {
                this.set_temp("ex_jl", 200, UTIL.diff_time());
                val = val - (200 - expend);
                this.add_temp("ad_jl", -val);
            } else {
                this.add_temp("ex_jl", val, UTIL.diff_time());
            }
        }
        return true;
    }
    return false;
}
USER.prototype.create_for = function (id) {
    if (!this.custom_skills) return false;
    return this.custom_skills.indexOf(id) > -1;
}
USER.prototype.query_age = function () {
    var dt = Date.now() - this.reg_time * 60000;

    return 14 + dt / 86400000 / 12 - this.query_prop("age") - this.query_temp("age", 0);
}

if (!USER.DAO_BASE_ON_SKILLCHANGED) {
    USER.DAO_BASE_ON_SKILLCHANGED = USER.prototype.on_skillchanged;
}
USER.prototype.on_skillchanged = function () {
    const messages = [];
    const send = this.send;
    this.send = function (message) {
        if (typeof message === "string" && message.indexOf('{type:"perform",skills:[') === 0) {
            messages.push(message);
            return;
        }
        return send.call(this, message);
    };
    try {
        USER.DAO_BASE_ON_SKILLCHANGED.call(this);
    } finally {
        this.send = send;
    }
    if (!messages.length || !this.skills) return;

    const baseIds = ["force", "unarmed", "dodge", "parry", "throwing"];
    const weapon = this.query_weapon_type();
    if (weapon !== WEAPON_TYPE.NONE) baseIds.unshift(weapon);
    const daoItems = [];
    for (const baseId of baseIds) {
        const baseSkill = this.skills[baseId];
        const skill = SKILL.get(baseId);
        if (!baseSkill || !skill || !skill.query_dao_performs) continue;
        const level = this.query_skill(baseId, 0);
        for (const perform of skill.query_dao_performs(this)) {
            if (perform.check && !perform.check(this, level, baseId)) continue;
            daoItems.push('{id:"' + baseId + '.' + perform.pid + '",name:"'
                + perform.query_name(this, baseId) + '",distime:'
                + perform.query_distime(this, level) + '}');
        }
    }
    if (!daoItems.length) {
        send.call(this, messages[0]);
        return;
    }
    const end = messages[0].lastIndexOf("]}");
    if (end < 0) {
        send.call(this, messages[0]);
        return;
    }
    const prefix = messages[0].slice(0, end);
    const separator = prefix.endsWith("[") ? "" : ",";
    send.call(this, prefix + separator + daoItems.join(",") + messages[0].slice(end));
}
FOLLOWER.prototype.remove_obj = USER.prototype.remove_obj;
FOLLOWER.prototype.can_add_obj = USER.prototype.can_add_obj;
FOLLOWER.prototype.add_obj = USER.prototype.add_obj;
FOLLOWER.prototype.recount = USER.prototype.recount;
FOLLOWER.prototype.items_changed = function (item, drop_count) {
    const data = {
        type: "dialog",
        dialog: "pack2",
        owner_id: this.id,
        id: item.id,
        money: this.money
    };
    if (drop_count) {
        data.remove = drop_count;
    } else if (!item.is_money) {
        data.name = item.color_name;
        data.count = item.count;
        data.grade = item.grade;
        data.unit = item.unit;
        data.value = item.transable ? item.value : 0;
        data.can_eq = item.is_equipment ? 1 : 0;
        data.can_use = item.on_use ? 1 : 0;
        data.can_study = item.on_study ? 1 : 0;
        data.can_open = item.on_open ? 1 : 0;
        data.can_combine = item.combine_count || 0;
        data.is_lock = item.is_locked ? 1 : 0;
        data.otype = item.otype;
    }
    const recipient = this.listener || WORLD.getUser(this.master);
    if (recipient) recipient.send(JSON.stringify(data));
};
FOLLOWER.prototype.send_commands = USER.prototype.send_commands;


