
CHARACTER.prototype.recount = function () {

    this.gjsd = 4000 - this.query_prop("gjsd");
    this.gjsd = parseInt(this.gjsd - (this.gjsd * this.query_prop("gjsd_per") / 100));
    if (this.gjsd < 500) this.gjsd = 500;

    this.gj = parseInt(this.str + (this.query_prop("gj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("gj_per")) / 100);
    this.fy = parseInt(((this.str + this.con) / 10 + this.query_prop("fy") + this.query_prop("con") * this.con / 10) * (100 + this.query_prop("fy_per")) / 100);
    this.mz = parseInt((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
    this.ds = parseInt((this.dex / 2 + this.query_prop("ds") + this.query_prop("dex") * this.dex / 5) * (100 + this.query_prop("ds_per")) / 100);
    this.zj = parseInt((this.str / 2 + this.query_prop("zj") + this.query_prop("str") * this.str / 5) * (100 + this.query_prop("zj_per")) / 100);
    this.bj = parseInt(this.dex / 10 + this.query_prop("bj_per"));

    this.diff_sh_per = this.query_prop('diff_sh_per');
    this.diff_fy_per = this.query_prop('diff_fy_per');


}

CHARACTER.prototype.crit = function (target, part, bj_per) {
    if (this.random(100) < bj_per
        + (part ? part.crit : 0) - target.query_prop("diff_bj")) {
        return true;
    }
}
CHARACTER.prototype.do_attack = function (par) {
    if (this.is_faint || this.hp <= 0 || !this.fight_type) return;
    var target = par.target;
    if (!target) {
        target = this.query_enemy();
        if (!target) return;
    }
    var weapon = this.query_weapon();//par.no_weapon ? null :
    var attackskill = par.no_weapon ? this.noweapon_skill : this.attack_skill;
    var weapon_type = par.no_weapon ?
        WEAPON_TYPE.NONE : (weapon ? weapon.weapon_type : WEAPON_TYPE.NONE);
    if (!par.dao_base_id) {
        par.dao_base_id = par.is_throwing ? WEAPON_TYPE.THROWING : weapon_type;
    }
    if (attackskill.on_before_attack
        && !par.is_throwing
        && !par.no_append_before) attackskill.on_before_attack(this, target, par);
    if (this.force_skill.on_before_attack && !par.no_append_before) {
        this.force_skill.on_before_attack(this, target, par);
    }

    this.attack_part = par.part ?? target.query_part();

    var attack_msg = par.attack_msg;
    if (attack_msg === undefined) {
        attack_msg = attackskill.query_attack_action(this, target);
    }
    if (par.attack_before) {
        attack_msg = par.attack_before + attack_msg;
    }
    if (attack_msg) this.send_combat(attack_msg, target);


    var sh = par.gj ?? this.gj, mz = par.mz ?? this.mz;
    const daoSkill = SKILL.get(par.dao_base_id);
    const daoAffected = par.dao_affected !== false;
    const daoAttackContext = daoAffected && daoSkill && daoSkill.query_dao_attack_context
        ? daoSkill.query_dao_attack_context(this, target, par) : {};
    let daoHitBonus = par.dao_hit_bonus || 0;
    if (daoAffected && daoSkill && daoSkill.query_dao_hit_bonus) {
        daoHitBonus += daoSkill.query_dao_hit_bonus(this);
    }
    if (daoAffected && daoAttackContext.hitBonus) daoHitBonus += daoAttackContext.hitBonus;
    if (daoHitBonus) mz += mz * daoHitBonus / 100;
    if (daoAffected && daoAttackContext.diffFyPer) {
        par.diff_fy = (par.diff_fy || 0) + daoAttackContext.diffFyPer;
    }
    if (target.query_dao_no_parry && target.query_dao_no_parry()) par.no_parry = true;
    par.is_dodge = false; par.is_parry = false;
    const daoDodgeSkill = SKILL.get("dodge");
    if (!par.no_dodge && daoDodgeSkill && daoDodgeSkill.query_dao_absolute_dodge
        && (target.query_temp && target.query_temp("dao/dodge/absolute")
            || daoDodgeSkill.query_dao_absolute_dodge(target, par))) {
        par.is_dodge = true;
        par.dao_absolute_dodge = true;
    } else if (target.is_faint || this.is_shadow) {
        par.is_dodge = false;
        par.is_parry = false;
    }
    else if (target.is_rash) {
        par.is_dodge = false;
        par.is_parry = (target.is_busy || par.no_parry) ? false : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
    } else if (this.is_miss && !par.no_dodge) {
        par.is_dodge = true;
        par.is_parry = (target.is_busy || par.no_parry) ? false : Math.random() * (target.zj / 2) + target.zj / 2 > mz;
    } else if (target.is_miss || par.no_dodge) {
        par.is_dodge = false;
        par.is_parry = (target.is_busy || par.no_parry) ? false : (Math.random() * (target.zj / 2) + target.zj / 2 > mz);
    } else if (target.is_busy || par.no_parry) {
        par.is_dodge = Math.random() * (target.ds / 2) + target.ds / 2 > mz;
        par.is_parry = false;
    } else {
        par.is_dodge = Math.random() * (target.ds / 2) + target.ds / 2 > mz;
        par.is_parry = Math.random() * (target.zj / 2) + target.zj / 2 > mz;
    }
    if (par.is_dodge) {
        if (par.on_dodge) par.on_dodge(target);
        if (target.on_dao_dodge) target.on_dao_dodge();
    } else if (target.dodge_skill.on_dodge) {
        target.dodge_skill.on_dodge(target, this, par);
    }
    if (par.is_dodge) {
        sh = 0;
        this.send_combat((par.miss_msg || target.dodge_skill.query_dodge_action()) + "\n", target);
    } else {

        if (target.parry_skill.on_parry &&
            !par.no_parry && !target.is_busy && !target.is_faint) {
            target.parry_skill.on_parry(target, this, par);
        }
        if (par.on_parry) {
            par.on_parry(target, par.is_parry);
        }
        par.bj = par.bj ?? this.bj;
        if (par.is_parry) {
            sh = 0;
        } else {
            if (weapon && weapon.do_attack &&
                ((par.no_weapon && weapon_type === WEAPON_TYPE.NONE)
                    || (!par.no_weapon && weapon_type !== WEAPON_TYPE.NONE))
                && !par.is_throwing) {
                sh += weapon.do_attack(this, target, par);
            }
            if (attackskill.on_attack && !par.is_throwing) {
                sh += attackskill.on_attack(this, target, par);
            }
            sh = sh * this.attack_part.hert;
            if (!par.no_power) {
                sh = sh + sh * this.query_prop("add_sh_per") / 100; //增加伤害%

                var daoCrit = daoSkill && daoSkill.query_dao_crit_bonus
                    ? daoSkill.query_dao_crit_bonus(this) : 0;
                const critMultiplier = par.dao_crit_multiplier || 1;
                par.iscirt = par.cirt ? par.cirt(target, this.attack_part, (par.bj + daoCrit) * critMultiplier)
                    : this.crit(target, this.attack_part, (par.bj + daoCrit) * critMultiplier);

                if (par.iscirt)
                    sh = sh * (150 + (par.add_bjsh_per ?? this.query_prop("add_bjsh_per"))
                        + (daoSkill && daoSkill.query_dao_crit_damage_bonus
                            ? daoSkill.query_dao_crit_damage_bonus(this) : 0)) / 100;
            }
        }
        let power_gj = par.power_gj ?? 0;
        if (this.force_skill.do_force_attack) {
            power_gj += this.force_skill.do_force_attack(this, target, par);
        }
        if (power_gj > 0 && (!weapon || weapon.weapon_type === WEAPON_TYPE.NONE)) {
            power_gj = power_gj + power_gj * this.query_prop("add_sh_per") / 100; //增加伤害%
            if (par.iscirt)
                power_gj = power_gj * (150 + (par.add_bjsh_per ?? this.query_prop("add_bjsh_per"))) / 100;

        }

        if (power_gj > 0) sh += power_gj;
        if (daoAffected && daoSkill && daoSkill.query_dao_attack_context) {
            Object.assign(daoAttackContext, daoSkill.query_dao_attack_context(this, target, par));
        }
        if (daoAttackContext.gjBonus) sh += daoAttackContext.gjBonus;
        if (this.query_dao_next_damage_bonus && par.dao_affected !== false) {
            const nextBonus = this.query_dao_next_damage_bonus();
            if (nextBonus) sh *= (100 + nextBonus) / 100;
        }
        var daoNextDamage = false;
        var daoDamageSkill = daoSkill;
        if (par.dao_affected !== false && daoDamageSkill && daoDamageSkill.id === "sword"
            && daoDamageSkill.query_dao_rank(this) >= 5
            && this.query_temp("dao/sword/next_damage")) {
            daoNextDamage = true;
            this.remove_temp("dao/sword/next_damage");
        }
        if (daoNextDamage) sh *= 1.3;
        if (par.dao_affected !== false && daoDamageSkill && daoDamageSkill.id === "sword"
            && daoDamageSkill.query_dao_rank(this) >= 5 && par.iscirt) {
            this.set_temp("dao/sword/next_damage", 1, 30000);
        }
        if (!par.dao_damage_applied && par.dao_affected !== false) {
            var daoBonus = daoDamageSkill && daoDamageSkill.query_dao_damage_bonus
                ? daoDamageSkill.query_dao_damage_bonus(this) : 0;
            daoBonus += daoAttackContext.damageBonus || 0;
            var daoMultiplier = par.dao_multiplier || 100;
            if (daoBonus || daoMultiplier !== 100) {
                sh = sh * daoMultiplier * (100 + daoBonus) / 10000;
            }
            par.dao_damage_applied = true;
        }
        if (target.force_skill.on_force_parry) {
            par.power_gj = power_gj;
            sh -= target.force_skill.on_force_parry(target, this, sh, par);
            if (this.hp <= 0 || !target.fight_type) {
                return;
            }
        }
        if (sh > 0)
            sh = target.damage(sh, this, par.diff_fy, par);
        if (sh > 0 && this.on_dao_hit) this.on_dao_hit(target, par, sh);

        if (par.is_parry) {
            par.dao_parry_final_damage = par.gj ?? this.gj ?? 0;
            if (target.on_dao_parry_success) target.on_dao_parry_success(this, par);
            if (target.query_dao_parry_reflect) {
                const reflected = target.query_dao_parry_reflect(this, par);
                if (reflected > 0) this.damage(reflected, target, 0, { dao_affected: false });
            }
            this.send_combat((par.parry_msg || target.parry_skill.query_parry_action(target, this, weapon_type)) + "\n", target);
            if (sh > 0) {
                target.send_combat(query_status_msg(target.hp, target.max_hp));
                target.on_damage && target.on_damage(this, sh);
            }
        }
        else {
            if (sh > 0) {
                this.send_combat(damage_msg(sh, par.is_throwing ? WEAPON_TYPE.THROWING : weapon_type,
                    target, par.iscirt, par.damage_msg)
                    , target);
                target.send_combat(query_status_msg(target.hp, target.max_hp));
                target.on_damage && target.on_damage(this, sh);
            } else {
                this.send_combat("结果没有造成任何伤害。\n", true);
            }
        }

    }
    if (this.fight_type) {
        if (!par.no_append_target && target.fight_type) {
            target.dodge_skill.on_dodge_over
                && target.dodge_skill.on_dodge_over(target, this, par);

            if (!par.is_dodge)
                target.parry_skill.on_parry_over &&
                    target.parry_skill.on_parry_over(target, this, par);
        }
        if (!par.no_append) {
            weapon && weapon.on_attack_over && weapon.on_attack_over(this, target, par, sh);
            attackskill.on_attack_over && attackskill.on_attack_over(this, target, par, sh);
            this.force_skill.on_force_over &&
                this.force_skill.on_force_over(this, target, par, sh);
        }
    }
    return sh;
}
CHARACTER.prototype.from_attack = function (sh, mz, gjmsg, shmsg, dsmsg, parrymsg) {
    gjmsg && this.send_room(gjmsg);
    var is_dodge = mz > 0 ? Math.random() * (this.ds / 2) + this.ds / 2 > mz : false;
    if (is_dodge) {
        this.send_room((dsmsg || this.dodge_skill.query_dodge_action()), this);
    } else {
        this.send_room(shmsg);
        this.damage(sh);
        this.send_combat(query_status_msg(this.hp, this.max_hp));

        if (this.fight_type === 1 && this.hp < 0) {
            this.hp = 1;
        } else if (this.hp <= 0) {
            this.die();
            this.end_fight();
        }
    }
    return is_dodge;
}
CHARACTER.prototype.do_recover = function (hp) {
    hp = hp + hp * this.query_prop('recover_per') / 100;
    if (!(hp > 0)) return 0;
    return this.add_hp(parseInt(hp));
}

CHARACTER.prototype.damage = function (sh, from, diff_fy, par) {
    if (!(sh > 0)) return 0;
    let diff_sh_per = this.diff_sh_per;
    let fy = this.fy;
    if (diff_fy > 0) {
        diff_sh_per -= diff_sh_per * diff_fy / 100;
        fy -= fy * diff_fy / 100;
    }
    let diff_fy_per = from ? from.diff_fy_per : 0;//忽视防御，从免伤开始减
    if (diff_sh_per > 0 && diff_fy_per > 0) {
        diff_sh_per -= diff_fy_per;
        if (diff_sh_per < 0) {
            diff_fy_per = -diff_sh_per;
        }
    }
    if (fy > 0 && diff_fy_per > 0) {
        fy -= fy * diff_fy_per / 100;
        if (fy < 0) fy = 0;
    }
    if (diff_sh_per > 0)
        sh = sh - sh * diff_sh_per / 100;//伤害减免
    if (fy > 0 && sh > 0)
        sh = (sh / (sh + fy) * sh);
    sh = sh - this.query_prop("diff_sh");

    if (sh > 0 && this.equipment && this.equipment[1] && this.equipment[1].on_defense) {
        sh = this.equipment[1].on_defense(this, from, sh);
    }
    if (sh > 0 && this.force_skill.on_damage) {
        sh = this.force_skill.on_damage(this, from, sh);
    }
    if (sh > 0 && this.query_dao_damage_taken) {
        sh = this.query_dao_damage_taken(sh, from, par);
    }
    //固定数值吸收护盾：与装备方式无关，任意技能施加的护盾都生效
    if (sh > 0 && this.query_shield) {
        sh = this.query_shield(sh, from, par);
    }

    if (sh > 0) {
        sh = parseInt(sh);
        if (this.record_damage && from) {
            if (!this.damages) this.damages = {};
            let damag = (this.damages[from.id] || 0) + sh;
            this.damages[from.id] = damag;
            this.sum_damages = (this.sum_damages ?? 0) + sh;
        }
        this.add_hp(-sh);
        return sh;
    }
    return 0;
}
CHARACTER.prototype.damage2 = function (sh, from) {
    if (!sh) return;

    if (this.record_damage && from) {
        if (!this.damages) this.damages = {};
        var damag = (this.damages[from.id] || 0) + sh;
        this.damages[from.id] = damag;

    }
    if (this.force_skill.on_damage) {
        sh = this.force_skill.on_damage(this, from, sh);
        if (!sh) return 0;
    }
    this.add_hp(-sh);
    return sh;
}
CHARACTER.prototype.damage3 = function (sh, from) {
    if (!(sh > 0)) return;

    this.add_hp(-sh);
    if (this.force_skill.on_damage) {
        this.force_skill.on_damage(this, from, 0);
    }
    return sh;
}
//固定数值吸收护盾：用 set_temp("shield", 值, 时长) 施加，
//受伤时优先扣除护盾值，扣完才扣真实气血。与装备方式无关。
CHARACTER.prototype.query_shield = function (sh, from, par) {
    var shield = this.query_temp("shield");
    if (!(shield > 0)) return sh;
    var absorb = Math.min(shield, sh);
    var left = shield - absorb;
    if (left > 0) {
        //保留原过期时间：读取后再按剩余时长写回
        var item = this.temp && this.temp["shield"];
        var expire = item && item.e ? item.e - Date.now() : 0;
        if (expire > 0) {
            this.set_temp("shield", left, expire);
        } else {
            this.set_temp("shield", left);
        }
    } else {
        this.remove_temp("shield");
        this.send_room("<hiy>$N身上的护盾被击碎。</hiy>");
    }
    return sh - absorb;
};


var catch_hunt_msg = [
    "<HIW>$N和$n仇人相见分外眼红，立刻打了起来！</HIW>",
    "<HIW>$N对著$n大喝：「可恶，又是你！」</HIW>",
    "<HIW>$N和$n一碰面，二话不说就打了起来！</HIW>",
    "<HIW>$N一眼瞥见$n，「哼」的一声冲了过来！</HIW>",
    "<HIW>$N一见到$n，愣了一愣，大叫：「我宰了你！」</HIW>",
    "<HIW>$N喝道：「$n，我们的帐还没算完，看招！」</HIW>",
    "<HIW>$N喝道：「$n，看招！」</HIW>"];
var guard_msg = [
    "<CYN>$N注视著$n的行动，企图寻找机会出手。\n</CYN>",
    "<CYN>$N正盯著$n的一举一动，随时准备发动攻势。\n</CYN>",
    "<CYN>$N缓缓地移动脚步，想要找出$n的破绽。\n</CYN>",
    "<CYN>$N目不转睛地盯著$n的动作，寻找进攻的最佳时机。\n</CYN>",
    "<CYN>$N慢慢地移动著脚步，伺机出手。\n</CYN>",
];


var status_msg = [
    "($N<HIG>看起来充满活力，一点也不累。</HIG>)\n",
    "($N<HIG>似乎有些疲惫，但是仍然十分有活力。</HIG>)\n",
    "($N<HIY>看起来可能有些累了。</HIY>)\n",
    "($N<HIY>动作似乎开始有点不太灵光，但是仍然有条不紊。</HIY>)\n",
    "($N<HIY>气喘嘘嘘，看起来状况并不太好。</HIY>)\n",
    "($N<RED>似乎十分疲惫，看来需要好好休息了。</RED>)\n",
    "($N<RED>已经一副头重脚轻的模样，正在勉力支撑著不倒下去。</RED>)\n",
    "($N<RED>看起来已经力不从心了。</RED>)\n",
    "($N<HIR>摇头晃脑、歪歪斜斜地站都站不稳，眼看就要倒在地上。</HIR>)\n",
    "($N<HIR>已经陷入半昏迷状态，随时都可能摔倒晕去。</HIR>)\n"
];
function query_status_msg(hp, maxhp) {
    var ratio = parseInt(hp * 10 / maxhp);
    if (ratio < 0) ratio = 0;
    if (ratio > 9) ratio = 9;
    return status_msg[9 - ratio];
}
function damage_msg2(msg, damage, iscrit) {
    return msg + "\n$N对$n造成" + iscrit ? ("<hir>" + damage + "</hir>点暴击伤害") : ("<wht>" + damage + "</wht>点伤害");//$N的攻击对$n
}
function damage_msg(damage, type, ob, iscrit, msg) {
    if (msg) {
        return msg + "\n$N对$n造成" + (iscrit ? ("<hir>" + damage + "</hir>点暴击伤害") : ("<wht>" + damage + "</wht>点伤害"));//$N的攻击对$n
    }

    if (damage === 0) return "结果没有造成任何伤害。";
    var sh = iscrit ? "<hir>" + damage + "</hir>点暴击伤害" : "<wht>" + damage + "</wht>点伤害";
    if (ob.hp > 0) {
        damage = damage * 100 / ob.hp;
    } else
        damage = 120;
    switch (type) {
        case WEAPON_TYPE.BLADE:
        case WEAPON_TYPE.WHIP:
            if (damage < 5) return "结果只是轻轻地划破$p的皮肉，造成" + sh + "。";
            else if (damage < 10) return "结果在$p$l划出一道细长的血痕，造成" + sh + "！";
            else if (damage < 20) return "结果「嗤」地一声划出一道伤口，造成" + sh + "！";
            else if (damage < 40) return "结果「嗤」地一声划出一道血淋淋的伤口，造成" + sh + "！";
            else if (damage < 80) return "结果「嗤」地一声划出一道又长又深的伤口，溅得$N满脸鲜血，造成" + sh + "！";
            else return "结果只听见$n一声惨嚎，$w已在$p$l划出一道深及见骨的可怕伤口，造成" + sh + "！！";
        case WEAPON_TYPE.SWORD:
            if (damage < 10) return "结果只是轻轻地刺破$p的皮肉，造成" + sh + "！";
            else if (damage < 20) return "结果在$p$l刺出一个创口，造成" + sh + "！";
            else if (damage < 40) return "结果「噗」地一声刺入了$n$l寸许，造成" + sh + "！";
            else if (damage < 60) return "结果「噗」地一声刺进$n的$l，使$p不由自主地退了几步，造成" + sh + "！";
            else if (damage < 80) return "结果「噗嗤」地一声，$w已在$p$l刺出一个血肉模糊的血窟窿，造成" + sh + "！";
            else return "结果只听见$n一声惨嚎，$w已在$p的$l对穿而出，鲜血溅得满地，造成" + sh + "！！";
        case WEAPON_TYPE.NONE:
        case WEAPON_TYPE.STAFF:
        case WEAPON_TYPE.CLUB:
            if (damage < 5) return "结果只是轻轻地碰到，比拍苍蝇稍微重了点，造成" + sh + "！";
            else if (damage < 10) return "结果在$p的$l造成一处瘀青，造成" + sh + "！";
            else if (damage < 25) return "结果一击命中，$n的$l登时肿了一块老高，造成" + sh + "！";
            else if (damage < 40) return "结果一击命中，$n闷哼了一声显然吃了不小的亏，造成" + sh + "！";
            else if (damage < 50) return "结果「砰」地一声，$n退了两步，造成" + sh + "！";
            else if (damage < 60) return "结果这一下「砰」地一声打得$n连退了好几步，差一点摔倒，造成" + sh + "！";
            else if (damage < 80) return "结果重重地击中，$n「哇」地一声吐出一口鲜血，造成" + sh + "！";
            else return "结果只听见「砰」地一声巨响，$n像一捆稻草般飞了出去，造成" + sh + "！！";
        case "force":
            if (damage < 10) return "结果只是把$n打得退了半步，毫发无损，造成" + sh + "！";
            else if (damage < 20) return "结果$n痛哼一声，在$p的$l造成一处瘀伤，造成" + sh + "！";
            else if (damage < 30) return "结果一击命中，把$n打得痛得弯下腰去，造成" + sh + "！";
            else if (damage < 40) return "结果$n闷哼了一声，脸上一阵青一阵白，显然受了点内伤，造成" + sh + "！";
            else if (damage < 60) return "结果$n脸色一下变得惨白，昏昏沉沉接连退了好几步，造成" + sh + "！";
            else if (damage < 75) return "结果重重地击中，$n「哇」地一声吐出一口鲜血，造成" + sh + "！";
            else if (damage < 90) return "结果「轰」地一声，$n全身气血倒流，口中鲜血狂喷而出，造成" + sh + "！";
            else return "结果只听见几声喀喀轻响，$n一声惨叫，像滩软泥般塌了下去，造成" + sh + "！！";

        case WEAPON_TYPE.THROWING:
            if (damage < 5) return "结果只是轻轻地划破$p的皮肉，造成" + sh + "。";
            else if (damage < 10) return "结果在$p$l划出一道细长的血痕，造成" + sh + "！";
            else if (damage < 20) return "结果「嗤」地一声划出一道伤口，造成" + sh + "！";
            else if (damage < 40) return "结果「嗤」地一声划出一道血淋淋的伤口，造成" + sh + "！";
            else if (damage < 80) return "结果「嗤」地一声划出一道又长又深的伤口，溅得$N满脸鲜血，造成" + sh + "！";
            else return "结果只听见$n一声惨嚎，$T已在$p$l划出一道深及见骨的可怕伤口，造成" + sh + "！！";
        default:
            //if (damage < 10) return "结果只是勉强造成一处轻微伤害！";
            //else if (damage < 20) return "结果造成轻微的伤害！";
            //else if (damage < 30) return "结果造成一处伤害！";
            //else if (damage < 50) return "结果造成一处严重伤害！";
            //else if (damage < 60) return "结果造成颇为严重的伤害！！";
            //else if (damage < 70) return "结果造成相当严重的伤害！！";
            //else if (damage < 80) return "结果造成十分严重的伤害！！";
            //else if (damage < 90) return "结果造成极其严重的伤害！！";
            //else return "结果造成非常可怕的严重伤害！！";
            return "<wht>结果造成" + sh + "。</wht>";
    }
}
