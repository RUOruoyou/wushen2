// Shared definitions for martial arts introduced with the public dungeon set.
// The reference values describe level 1000 skills, so flat attributes scale
// linearly and percentage attributes remain fixed.
const FB_SKILL_REFERENCE_LEVEL = 1000;

function scaleFbSkillValue(value, level) {
    return Math.floor(value * level / FB_SKILL_REFERENCE_LEVEL);
}

function buildFbSkillProps(reference, level) {
    const result = {};
    if (!reference) return result;
    for (const key in reference.scaled || {}) {
        result[key] = scaleFbSkillValue(reference.scaled[key], level);
    }
    for (const key in reference.fixed || {}) result[key] = reference.fixed[key];
    if (reference.desc) result.desc = reference.desc;
    return result;
}

function fbEnemies(me) {
    if (!me || !Array.isArray(me.enemy)) return [];
    return me.enemy.filter(target => target && target.hp > 0 && (!me.is_here || me.is_here(target)));
}

function fbAddStatus(target, status, from) {
    if (!target || !target.add_status) return false;
    target.add_status(Object.assign({ override: 2 }, status), from);
    return true;
}

function fbClearStatuses(target, downside) {
    if (!target || !target.remvoe_statuses) return 0;
    return target.remvoe_statuses(item => !!item.downside === downside) || 0;
}

function fbAttack(me, target, options) {
    if (!me || !target || target.hp <= 0 || !me.do_attack) return 0;
    const hits = Math.max(1, options.hits || 1);
    let landed = 0;
    let damage = 0;
    for (let index = 0; index < hits && target.hp > 0; index++) {
        const result = me.do_attack({
            target: target,
            gj: (me.gj || 0) * (options.multiplier || 1),
            mz: (me.mz || 0) * (options.accuracy || 1),
            diff_fy: options.diffFy || 0,
            no_parry: !!options.noParry,
            no_dodge: !!options.noDodge,
            no_weapon: options.enable === "unarmed",
            is_throwing: options.enable === "throwing",
            attack_msg: index === 0 ? options.message : ""
        });
        if (result) {
            landed++;
            damage += Number(result) || 0;
            if (options.onHit) options.onHit(me, target, result, index);
        }
    }
    if (me.end_attack) me.end_attack(target);
    return { landed: landed, damage: damage };
}

function fbAttackPerform(options) {
    return {
        name: options.name,
        enable_skill: options.enable,
        mp: options.mp,
        release_time: options.release,
        distime: options.cooldown,
        allow_busy: !!options.allowBusy,
        query_desc: function () { return options.desc; },
        use: function (me, target, level) {
            const runtime = options.runtime ? options.runtime(me, target, level) : options;
            return fbAttack(me, target, Object.assign({}, options, runtime));
        }
    };
}

function fbBuffPerform(options) {
    return {
        name: options.name,
        enable_skill: options.enable,
        mp: options.mp,
        release_time: options.release,
        distime: options.cooldown,
        use_type: 2,
        allow_busy: !!options.allowBusy,
        query_desc: function () { return options.desc; },
        use: function (me, target, level) {
            if (options.before) options.before(me, target, level);
            const prop = typeof options.prop === "function" ? options.prop(me, level) : options.prop;
            fbAddStatus(me, {
                id: options.id,
                name: options.name,
                desc: options.desc,
                duration: options.duration,
                prop: prop,
                ig_control: !!options.igControl,
                only_combat: !!options.onlyCombat
            }, me);
            if (options.after) options.after(me, target, level);
            return true;
        }
    };
}

function fbBusy(target, me, duration, id) {
    fbAddStatus(target, {
        id: id || "busy",
        name: "忙乱",
        desc: "穴道受制，暂时无法攻击和招架。",
        duration: duration,
        downside: true,
        is_busy: true
    }, me);
}

function fbFaint(target, me, duration, id) {
    fbAddStatus(target, {
        id: id || "faint",
        name: "昏迷",
        desc: "你暂时失去了行动能力。",
        duration: duration,
        downside: true,
        is_faint: true
    }, me);
}

function fbScaleSpec(canEnables, enableProps, options) {
    return Object.assign({ canEnables: canEnables, enableProps: enableProps }, options || {});
}

const FB_BOOK_SKILL_SPECS = {
    zhaixinggong: fbScaleSpec(["dodge"], { dodge: { scaled: { ds: 1800, dex: 260 } } }),
    feixingshu: fbScaleSpec(["throwing"], { throwing: { scaled: { gj: 1404, ds: 1404 } } }, {
        performs: {
            xingyu: fbAttackPerform({ name: "星雨", enable: "throwing", mp: 20, release: 4000, cooldown: 10000,
                desc: "使用暗器对敌人发动攻击，你的命中和对方的躲闪差距越大命中的暗器数量越多。",
                runtime: function (me, target) {
                    const gap = Math.max(0, (me.mz || 0) - (target.ds || 0));
                    return { hits: Math.min(8, 3 + Math.floor(gap / Math.max(1, target.ds || 1))), multiplier: 0.75,
                        accuracy: 1.25, message: "<hic>$N扬手洒出漫天星雨般的暗器，罩向$n周身。</hic>" };
                } })
        }
    }),
    shenjianjue: fbScaleSpec(["sword"], { sword: { scaled: { mz: 2100 }, fixed: { bj_per: 4 } } }, {
        performs: {
            jianmang: fbBuffPerform({ id: "shenjian_jianmang", name: "剑芒", enable: "sword", mp: 50,
                release: 500, cooldown: 30000, duration: 8000, prop: { bj_per: 8 },
                desc: "催动内力使你的剑锋芒毕露，8秒内增加8%的暴击率。" }),
            jianqi: fbAttackPerform({ name: "剑气", enable: "sword", mp: 50, release: 3700, cooldown: 20000,
                multiplier: 1.5, accuracy: 1.2, desc: "以剑气从数里之外伤人，对敌人造成150%伤害；如果暴击则冷却立刻完成。",
                message: "<hic>$N剑锋一振，一道凌厉剑气破空袭向$n。</hic>" })
        }
    }),
    tiannanbu: fbScaleSpec(["dodge"], { dodge: { scaled: { ds: 1630, int: 166 } } }),
    anyingfuxiang: fbScaleSpec(["dodge"], { dodge: { scaled: { ds: 2100, mz: 1600 } } }, {
        performs: {
            anying: fbBuffPerform({ id: "anying", name: "暗影", enable: "dodge", mp: 20, release: 500,
                cooldown: 32000, duration: 10000, prop: { mz_per: 25 }, desc: "10秒内增加你25%命中。" })
        }
    }),
    luoyingshenjian: fbScaleSpec(["sword"], { sword: { scaled: { gj: 1410, mz: 1420, dex: 127 } } }, {
        performs: {
            luoying: fbAttackPerform({ name: "落英缤纷", enable: "sword", mp: 20, release: 4000, cooldown: 10000,
                hits: 5, multiplier: 0.9, accuracy: 1.1, desc: "快速攻击敌人5次，等级越高冷却时间越短。",
                message: "<him>$N剑势骤分，五道落英般的剑光接连卷向$n。</him>" })
        }
    }),
    sanyinwugongzhao: fbScaleSpec(["unarmed", "parry"], {
        unarmed: { scaled: { gj: 1620, mz: 1520, dex: 143 } },
        parry: { scaled: { zj: 1520, fy: 1020 } }
    }, {
        performs: {
            sanyin: fbAttackPerform({ name: "三阴毒爪", enable: "unarmed", mp: 20, release: 4000, cooldown: 18000,
                hits: 3, multiplier: 0.8, desc: "快速攻击敌人三爪，每爪附加你7%的毒质内力。",
                message: "<hig>$N运起三阴毒劲，三记蜈蚣爪连环抓向$n。</hig>",
                onHit: function (me, target) { if (target.damage2) target.damage2(Math.floor((me.max_mp || 0) * 0.07), me); } }),
            zhuihun: fbAttackPerform({ name: "追魂爪", enable: "unarmed", mp: 20, release: 4000, cooldown: 18000,
                desc: "对敌人造成200%的伤害，敌人气血每降低1%，伤害增加2%。",
                runtime: function (me, target) {
                    const missing = target.max_hp > 0 ? (target.max_hp - target.hp) * 100 / target.max_hp : 0;
                    return { multiplier: 2 * (1 + missing * 0.02), message: "<hir>$N五指如钩，一式追魂爪直取$n要害。</hir>" };
                } })
        }
    }),
    tianyuqijian: fbScaleSpec(["sword"], { sword: { scaled: { gj: 1320, mz: 1220 }, fixed: { bj_per: 5 } } }, {
        performs: {
            sannv: fbAttackPerform({ name: "天女散花", enable: "sword", mp: 37, release: 4000, cooldown: 20000,
                desc: "进行数次攻击，敌人的防御越低抵挡的数量越少。",
                runtime: function (me, target) { return { hits: Math.max(2, Math.min(6, 6 - Math.floor((target.fy || 0) / Math.max(1, me.gj || 1)))), multiplier: 0.85,
                    message: "<him>$N剑光散作漫天花雨，从四面八方袭向$n。</him>" }; } }),
            tianyu: fbAttackPerform({ name: "天羽诀", enable: "sword", mp: 48, release: 4000, cooldown: 15000,
                hits: 4, multiplier: 0.9, accuracy: 1.35, diffFy: 100, noParry: true, noDodge: true,
                desc: "使用天羽四奇剑攻击敌人：梅剑无视防御，兰剑无法招架，竹剑无法躲闪，菊剑必定暴击。",
                message: "<hiy>$N并指御剑，梅兰竹菊四道剑意依次斩向$n。</hiy>" })
        }
    }),
    shenghuoshengong: fbScaleSpec(["force"], { force: { scaled: { max_hp: 15000, fy: 1000, limit_mp: 100000 },
        desc: "唯一：将你内力的70%转化为气血" } }, {
        forceRad: 0.7,
        performs: {
            huti: fbBuffPerform({ id: "shenghuo_huti", name: "圣火护体", enable: "force", mp: 20, release: 500,
                cooldown: 60000, duration: 20000, prop: { gj_per: 20, fy_per: 20 },
                desc: "增加自身防御，20秒内提升自身攻击和防御20%。" })
        }
    }),
    duanjiajian: fbScaleSpec(["sword"], { sword: { scaled: { gj: 1510, mz: 1610 } } }, {
        performs: {
            yiyang: fbBuffPerform({ id: "duanjia_yiyang", name: "一阳剑气", enable: "sword", mp: 20, release: 4000,
                cooldown: 35000, duration: 10100, prop: { add_sh_per: 40 }, desc: "将内力贯入武器，10.1秒内增加伤害40%。" }),
            wuxing: fbAttackPerform({ name: "无形剑气", enable: "sword", mp: 20, release: 4000, cooldown: 35000,
                multiplier: 3.1, accuracy: 2, desc: "将内力贯入武器，以剑气伤人，对敌方造成310%的伤害，命中增加100%。",
                message: "<hic>$N将一阳真气贯入剑锋，无形剑气直透$n周身。</hic>" })
        }
    }),
    yunvxinjing: fbScaleSpec(["force"], { force: { scaled: { gj: 1404, ds: 1404, per: 3, limit_mp: 100000 },
        desc: "唯一：将你内力的80%转化为气血" } }, {
        forceRad: 0.8,
        performs: {
            qingwu: fbBuffPerform({ id: "yunv_qingwu", name: "轻舞", enable: "force", mp: 20, release: 4000,
                cooldown: 28000, duration: 15000, prop: { gj_per: 13, ds_per: 13, per: 3 },
                desc: "15秒内提高你13%的攻击、躲闪，并增加你的容貌。" })
        }
    }),
    yinsuojinling: fbScaleSpec(["whip"], { whip: { scaled: { gj: 1010, mz: 1210, dex: 210, con: 210 } } }, {
        performs: {
            dianxue: fbAttackPerform({ name: "隔空点穴", enable: "whip", mp: 20, release: 4000, cooldown: 30000,
                multiplier: 1.1, accuracy: 1.35, desc: "命中后使敌人10秒内处于忙乱状态。",
                message: "<hiy>$N手中银索一抖，金铃轻响，劲力隔空点向$n穴道。</hiy>",
                onHit: function (me, target) { fbBusy(target, me, 10000, "yinsuo_dianxue"); } })
        }
    }),
    tanzhishentong: fbScaleSpec(["unarmed"], { unarmed: { scaled: { gj: 1820, str: 201, mz: 1000 } } }, {
        performs: {
            jinglei: fbAttackPerform({ name: "弹指惊雷", enable: "unarmed", mp: 20, release: 4000, cooldown: 20000,
                multiplier: 2, accuracy: 1.2, desc: "对敌人造成200%攻击力的伤害，命中后减少对方15%的内力。",
                message: "<hiy>$N屈指轻弹，指风如惊雷般直击$n。</hiy>",
                onHit: function (me, target) { if (target.add_mp) target.add_mp(-Math.floor((target.mp || 0) * 0.15)); } }),
            dianxue: fbAttackPerform({ name: "点穴", enable: "unarmed", mp: 20, release: 4000, cooldown: 30000,
                multiplier: 1.1, accuracy: 1.35, desc: "弹指神通之点穴大法，命中后造成伤害，并使敌人忙乱10秒。",
                message: "<hic>$N指劲一凝，隔空点向$n周身大穴。</hic>",
                onHit: function (me, target) { fbBusy(target, me, 10000, "tanzhi_dianxue"); } })
        }
    }),
    lingshezhangfa: fbScaleSpec(["staff", "parry"], {
        staff: { scaled: { gj: 1210, mz: 1000, dex: 100, zj: 1000 } },
        parry: { scaled: { zj: 1605, fy: 2010 } }
    }, {
        performs: {
            chudong: fbAttackPerform({ name: "灵蛇出洞", enable: "staff", mp: 20, release: 4000, cooldown: 10000,
                hits: 3, multiplier: 0.9, accuracy: 1.15, desc: "灵蛇出洞，瞬间攻击3次，攻击中必定触发毒蛇攻击。",
                message: "<hig>$N杖头毒蛇骤然昂首，三道蛇影同时扑向$n。</hig>",
                onHit: function (me, target) { if (target.damage2) target.damage2(scaleFbSkillValue(3356, me.query_skill ? me.query_skill("lingshezhangfa", 1000) : 1000), me); } })
        }
    }),
    hamagong: fbScaleSpec(["force", "unarmed"], {
        force: { scaled: { fy: 2100, gj: 1635, limit_mp: 150000 }, desc: "唯一：将你内力的70%转化为气血" },
        unarmed: { scaled: { gj: 1412, mz: 1412, str: 200 } }
    }, {
        forceRad: 0.7,
        performs: {
            xiqi: {
                name: "蛤蟆吸气", enable_skill: "force", mp: 20, release_time: 500, distime: 20000, use_type: 2,
                query_desc: function () { return "趴在地上蓄力运功，可最多蓄力9秒；蓄力期间增加25%伤害减免，无法躲闪、招架。"; },
                use: function (me) {
                    me.set_temp("fb/hamagong/charge", Date.now(), 9000);
                    fbAddStatus(me, { id: "hama_xiqi", name: "蛤蟆吸气", duration: 9000,
                        desc: "伏地蓄力，增加25%伤害减免，但无法躲闪和招架。",
                        prop: { diff_sh_per: 25 }, is_busy: false, only_combat: true }, me);
                    return true;
                }
            },
            chongji: {
                name: "蛤蟆冲击", enable_skill: "unarmed", mp: 20, release_time: 4000, distime: 5000,
                query_desc: function () { return "蓄力后可冲击敌人，每蓄力多1秒，增加15%伤害、15%命中，并增加一次攻击。"; },
                use: function (me, target) {
                    const started = me.query_temp("fb/hamagong/charge");
                    const seconds = started ? Math.max(1, Math.min(9, Math.floor((Date.now() - started) / 1000) + 1)) : 1;
                    me.remove_status("hama_xiqi", true);
                    me.remove_temp("fb/hamagong/charge");
                    return fbAttack(me, target, { enable: "unarmed", hits: seconds, multiplier: 1 + seconds * 0.15,
                        accuracy: 1 + seconds * 0.15, message: "<hiy>$N猛然蹬地而起，蛤蟆冲击挟雷霆之势撞向$n。</hiy>" });
                }
            }
        }
    }),
    huagongdafa: fbScaleSpec(["force"], { force: { scaled: { fy: 1510, gj: 1510, limit_mp: 155000 },
        desc: "命中后吸取对方内力；唯一：将你内力的75%转化为气血" } }, {
        forceRad: 0.75,
        performs: {
            huadu: fbBuffPerform({ id: "huagong_huadu", name: "化毒", enable: "force", mp: 0, release: 500,
                cooldown: 30000, duration: 6000, prop: { gj: 1500, fy: 1500 },
                desc: "6秒内增加自身1500点攻击和防御，被敌人击中后会减少敌方10333点内力。" }),
            huagong: {
                name: "化功", enable_skill: "force", mp: 0, release_time: 500, distime: 20000,
                query_desc: function () { return "10秒内内力化毒布满四周，使周围敌人的攻击和命中降低20%。"; },
                use: function (me) {
                    for (const target of fbEnemies(me)) fbAddStatus(target, { id: "huagong", name: "化功", duration: 10000,
                        downside: true, prop: { gj_per: -20, mz_per: -20 }, desc: "攻击和命中降低20%。" }, me);
                    return true;
                }
            }
        }
    }),
    canhezhi: fbScaleSpec(["unarmed"], { unarmed: { scaled: { gj: 1520, mz: 1520, int: 169 }, fixed: { bj_per: 4 } } }, {
        performs: {
            shang: fbAttackPerform({ name: "参合之殇", enable: "unarmed", mp: 20, release: 4000, cooldown: 20000,
                desc: "对敌人造成伤害，每层参合状态增加30%伤害；对方层数大于4层时昏迷5秒。",
                runtime: function (me, target) { const count = target.query_status ? target.query_status("canhe_mark") : 0;
                    return { multiplier: 1 + count * 0.3, accuracy: 1.2, message: "<him>$N凝聚参合指力，一指洞穿$n周身气机。</him>",
                        onHit: function () { if (count > 4) fbFaint(target, me, 5000, "canhe_faint"); } }; } })
        },
        onAttackOver: function (me, target, par) {
            if (par && !par.is_dodge && !par.is_parry) fbAddStatus(target, { id: "canhe_mark", name: "参合", duration: 30000,
                downside: true, override: 1, max_count: 10, desc: "参合指劲不断叠加。" }, me);
        }
    }),
    kuihuashengong: fbScaleSpec(["force", "dodge"], {
        force: { scaled: { gj: 2100, mz: 1510, limit_mp: 280000 }, desc: "唯一：将你内力的70%转化为气血" },
        dodge: { scaled: { ds: 2012, dex: 200 } }
    }, {
        forceRad: 0.7,
        performs: {
            guimei: fbBuffPerform({ id: "kuihua_guimei", name: "鬼魅", enable: "dodge", mp: 20, release: 500,
                cooldown: 30000, duration: 13000, prop: { ds_per: 20 }, igControl: true, allowBusy: true,
                before: function (me) { fbClearStatuses(me, true); },
                desc: "清除自身负面状态，13秒内无视控制技能；忙乱时也可使用。" })
        }
    }),
    kumushengong: fbScaleSpec(["force"], { force: { scaled: { max_hp: 10000, fy: 2000, con: 254, limit_mp: 180000 },
        desc: "唯一：将你内力的90%转化为气血" } }, {
        forceRad: 0.9,
        performs: {
            fengchun: {
                name: "枯木逢春", enable_skill: "force", mp: 20, release_time: 500, distime: 60000, use_type: 2,
                query_desc: function () { return "恢复你20%气血，移除你自身的负面状态。"; },
                use: function (me) { if (me.do_recover) me.do_recover(Math.floor(me.max_hp * 0.2)); else me.add_hp(Math.floor(me.max_hp * 0.2));
                    fbClearStatuses(me, true); return true; }
            }
        }
    }),
    yiyangzhi: fbScaleSpec(["unarmed"], { unarmed: { scaled: { gj: 1820, str: 201, mz: 1000 } } }, {
        performs: {
            qiankun: fbAttackPerform({ name: "一指乾坤", enable: "unarmed", mp: 20, release: 4000, cooldown: 20000,
                multiplier: 1.5, diffFy: 100, noParry: true, desc: "对敌人造成150%攻击力的伤害，无法防御。",
                message: "<hiy>$N一阳正气凝于指端，一指乾坤直取$n命门。</hiy>" }),
            dianxue: fbAttackPerform({ name: "点穴", enable: "unarmed", mp: 20, release: 4000, cooldown: 30000,
                multiplier: 1.1, accuracy: 1.35, desc: "一阳指之点穴大法，命中后造成伤害，并使敌人忙乱10秒。",
                message: "<hic>$N一指点出，纯阳指力封向$n周身大穴。</hic>",
                onHit: function (me, target) { fbBusy(target, me, 10000, "yiyang_dianxue"); } })
        }
    }),
    xuanxubu: fbScaleSpec(["dodge"], { dodge: { scaled: { ds: 2100, dex: 251 }, fixed: { ds_per: 4 },
        desc: "躲闪成功后顺势反击敌人" } }, {
        performs: {
            huanying: fbBuffPerform({ id: "xuanxu_huanying", name: "幻影", enable: "dodge", mp: 20, release: 500,
                cooldown: 45000, duration: 8000, prop: { ds_per: 15, diff_sh_per: 15 },
                desc: "8秒内提高你15%的躲闪，并减少你受到的伤害15%。" })
        },
        onDodgeOver: function (me, target) {
            if (!me.query_temp("fb/xuanxu/counter")) {
                me.set_temp("fb/xuanxu/counter", 1, 5000);
                fbAttack(me, target, { enable: "unarmed", multiplier: 0.8, accuracy: 1.2,
                    message: "<hic>$N借玄虚步避开来势，旋身反击$n。</hic>" });
            }
        }
    }),
    bianjianfa: fbScaleSpec(["sword", "parry"], {
        sword: { scaled: { gj: 2010, mz: 1620, dex: 127 }, fixed: { mz_per: 8 } },
        parry: { scaled: { zj: 2310, dex: 127 }, fixed: { mz_per: 4 } }
    }, {
        performs: {
            jiu: fbAttackPerform({ name: "彼岸九式", enable: "sword", mp: 40, release: 3000, cooldown: 35000,
                hits: 9, multiplier: 0.55, accuracy: 1.15, desc: "彼岸九式，九道剑意连绵不绝。",
                message: "<him>$N剑意横渡彼岸，九式剑光首尾相接卷向$n。</him>" })
        }
    }),
    douzhuanxingyi: fbScaleSpec(["parry"], { parry: { scaled: { zj: 2200, fy: 2200, dex: 333 }, fixed: { diff_bj: 4 } } }, {
        performs: {
            xingyi: fbBuffPerform({ id: "douzhuan_xingyi", name: "星移", enable: "parry", mp: 50, release: 4000,
                cooldown: 30000, duration: 10000, prop: { zj_per: 40 }, desc: "10秒内增加40%招架，招架成功后将伤害的150%转移给敌人。" }),
            douzhuan: fbAttackPerform({ name: "斗转", enable: "parry", mp: 90, release: 4000, cooldown: 30000,
                multiplier: 1, accuracy: 1.2, desc: "使用前一个攻击你的武器或拳脚绝招攻击敌人，效果取斗转星移等级的100%。",
                message: "<hiy>$N借势挪移，将$n方才的攻势原样奉还。</hiy>" })
        },
        onParryOver: function (me, target, par) {
            if (par && par.is_parry && me.query_status && me.query_status("douzhuan_xingyi")) {
                const value = Math.floor(((par.gj || target.gj || 0) * 1.5));
                if (value > 0 && target.damage2) target.damage2(value, me);
            }
        }
    }),
    bulaochangchungong: fbScaleSpec(["force"], { force: { scaled: { max_hp: 20100, con: 338, limit_mp: 285000 },
        fixed: { age: -9, hp_per: 8, diff_fy_per: 6 }, desc: "命中后按年龄附加伤害；唯一：将你内力的95%转化为气血" } }, {
        forceRad: 0.95,
        performs: {
            changchun: {
                name: "不老长春", enable_skill: "force", mp: 20, release_time: 4000, distime: 28000,
                query_desc: function () { return "对附近敌人造成200%的伤害，并吸收伤害转化为自身气血。"; },
                use: function (me) { let total = 0; for (const target of fbEnemies(me)) { const result = fbAttack(me, target, { multiplier: 2,
                    message: "<hig>$N长春真气奔涌而出，席卷四周敌人。</hig>" }); total += result.damage || 0; }
                    if (me.add_hp) me.add_hp(Math.floor(total * 0.2)); return true; }
            },
            duzun: {
                name: "唯我独尊", enable_skill: "force", mp: 40, release_time: 4000, distime: 40000,
                query_desc: function () { return "震慑附近敌人，17秒内技能释放速度和冷却时间减慢3秒。"; },
                use: function (me) { for (const target of fbEnemies(me)) fbAddStatus(target, { id: "bulao_duzun", name: "唯我独尊",
                    duration: 17000, downside: true, prop: { releasetime: -3000, distime: -3000 }, desc: "绝招释放与冷却减慢3秒。" }, me); return true; }
            }
        }
    }),
    liumaishenjian: fbScaleSpec(["unarmed"], { unarmed: { scaled: { gj: 2005, mz: 2010 }, fixed: { add_sh_per: 4, diff_fy_per: 4 },
        desc: "命中敌人后会对附近一名敌人产生溅射伤害" } }, {
        performs: {
            wuxing: fbAttackPerform({ name: "无形剑气", enable: "unarmed", mp: 30, release: 4000, cooldown: 30000,
                multiplier: 1.8, accuracy: 1.2, desc: "以强劲内力化为无形剑气；敌方招架时仍受伤，否则昏迷7秒。",
                message: "<hic>$N六脉真气自指尖激荡而出，无形剑气贯向$n。</hic>",
                onHit: function (me, target) { fbFaint(target, me, 7000, "liumai_faint"); } }),
            zongheng: {
                name: "六脉纵横", enable_skill: "unarmed", mp: 30, release_time: 4000, distime: 20000,
                query_desc: function () { return "六脉齐射，随机攻击敌人；每次命中降低对方4%防御，持续10秒。"; },
                use: function (me, target) { const list = fbEnemies(me); if (!list.length && target) list.push(target); for (let i = 0; i < 6; i++) {
                    const enemy = list[Math.floor(Math.random() * list.length)]; if (!enemy) break;
                    fbAttack(me, enemy, { enable: "unarmed", multiplier: 0.65, accuracy: 1.2, message: i ? "" : "<hiy>$N六脉剑气纵横激射，席卷群敌。</hiy>",
                        onHit: function () { fbAddStatus(enemy, { id: "liumai_pofang", name: "六脉破防", duration: 10000,
                            downside: true, override: 1, max_count: 6, prop: { fy_per: -4 }, desc: "防御降低4%。" }, me); } }); }
                    return true; }
            }
        }
    }),
    anranxiaohunzhang: fbScaleSpec(["unarmed"], { unarmed: { scaled: { gj: 2320, mz: 1720, int: 262, con: 262 }, fixed: { diff_downside_per: 10 } } }, {
        performs: {
            wuzhong: fbAttackPerform({ name: "无中生有", enable: "unarmed", mp: 34, release: 4000, cooldown: 20000,
                multiplier: 2, desc: "对敌人造成200%的伤害，命中后偷取敌人的一个正面状态附加自身。",
                message: "<him>$N黯然神伤，掌势却无中生有般击向$n。</him>",
                onHit: function (me, target) { if (!target.status) return; const buff = target.status.find(item => !item.downside && item.prop);
                    if (!buff) return; fbAddStatus(me, { id: "anran_steal", name: "无中生有", duration: Math.min(10000, buff.duration || 10000),
                        prop: Object.assign({}, buff.prop), desc: "偷取而来的正面状态。" }, me); target.remove_status(buff.id, true); } }),
            mudai: fbAttackPerform({ name: "呆若木鸡", enable: "unarmed", mp: 20, release: 4000, cooldown: 36000,
                multiplier: 2.66, accuracy: 2, desc: "超高命中的一击，造成266%伤害，并降低对方60%攻击速度和技能释放速度。",
                message: "<hiy>$N神色木然，一掌却以不可思议的角度击中$n。</hiy>",
                onHit: function (me, target) { fbAddStatus(target, { id: "anran_mudai", name: "呆若木鸡", duration: 10000,
                    downside: true, prop: { gjsd_per: -60, releasetime_per: -60 }, desc: "攻击和绝招释放速度降低60%。" }, me); } })
        }
    }),
    xuantiejianfa: fbScaleSpec(["sword", "parry"], {
        sword: { scaled: { gj: 2010, mz: 2020, str: 335 }, fixed: { diff_fy_per: 8 }, desc: "每次攻击附加最大内力1%的伤害" },
        parry: { scaled: { zj: 2010, fy: 2310, max_hp: 20000 }, fixed: { fy_per: 13 } }
    }, {
        performs: {
            haichao: {
                name: "海潮汹涌", enable_skill: "sword", mp: 0, release_time: 4000, distime: 30000,
                query_desc: function () { return "快速对附近敌人攻击多次，每次攻击附加并消耗当前内力的4%。"; },
                use: function (me, target) { const list = fbEnemies(me); if (!list.length && target) list.push(target); for (const enemy of list) {
                    for (let i = 0; i < 4 && me.mp > 0; i++) { const cost = Math.floor(me.mp * 0.04); me.add_mp(-cost);
                        fbAttack(me, enemy, { enable: "sword", multiplier: 0.8, message: i ? "" : "<hic>$N玄铁重剑掀起层层海潮般的剑势。</hic>",
                            onHit: function () { if (enemy.damage2) enemy.damage2(cost, me); } }); } } return true; }
            },
            wufeng: fbAttackPerform({ name: "重剑无锋", enable: "sword", mp: 40, release: 4000, cooldown: 30000,
                multiplier: 2, accuracy: 1.2, desc: "重剑打击敌人，命中后降低其战斗属性20%和攻击速度20%。",
                message: "<hiy>$N重剑平平推出，大巧不工的剑势压向$n。</hiy>",
                onHit: function (me, target) { fbAddStatus(target, { id: "xuantie_canque", name: "残缺", duration: 10000,
                    downside: true, prop: { gj_per: -20, fy_per: -20, mz_per: -20, ds_per: -20, zj_per: -20, gjsd_per: -20 },
                    desc: "战斗属性和攻击速度降低20%。" }, me); } })
        }
    }),
    jiuyinshengong: fbScaleSpec(["force"], { force: { scaled: { max_hp: 20000, mz: 2200, limit_mp: 285000 },
        fixed: { diff_fy_per: 6 }, desc: "命中后削弱敌人攻击、躲闪和命中；唯一：将你内力的90%转化为气血" } }, {
        forceRad: 0.9,
        performs: {
            zhuihun: {
                name: "追魂", enable_skill: "force", mp: 20, release_time: 4000, distime: 30000,
                query_desc: function () { return "引爆敌人身上的九阴劲气，每层造成真实伤害；层数大于5层时昏迷6秒。"; },
                use: function (me, target) { const count = target.query_status ? target.query_status("jiuyin_mark") : 0;
                    if (target.damage2) target.damage2(Math.floor((me.gj || 0) * 0.084 * Math.max(1, count)), me);
                    if (count > 5) fbFaint(target, me, 6000, "jiuyin_faint"); target.remove_status("jiuyin_mark", true); return true; }
            },
            nizhuan: fbBuffPerform({ id: "jiuyin_nizhuan", name: "逆转九阴", enable: "force", mp: 20, release: 500,
                cooldown: 60000, duration: 11000, prop: { gj_per: 40, diff_fy_per: 40, gjsd_per: 20, fy_per: -40, diff_sh_per: -40 },
                desc: "11秒内增加40%攻击、40%忽视防御和20%攻击速度，同时降低40%防御和伤害减免。" })
        },
        onAttackOver: function (me, target, par) {
            if (par && !par.is_dodge && !par.is_parry) fbAddStatus(target, { id: "jiuyin_mark", name: "九阴劲气", duration: 30000,
                downside: true, override: 1, max_count: 10, prop: { gj_per: -1, ds_per: -1, mz_per: -1 },
                desc: "攻击、躲闪和命中降低1%。" }, me);
        }
    }),
    taixuangong: fbScaleSpec(["force"], { force: { scaled: { gj: 2100, limit_mp: 286000 }, fixed: { add_sh_per: 8, diff_busy_per: 4 },
        desc: "命中后造成内功附加伤害，不可招架；唯一：将你内力的80%转化为气血" } }, {
        forceRad: 0.8,
        performs: {
            shibu: {
                name: "十步杀一人", enable_skill: "force", mp: 20, release_time: 4000, distime: 30000, allow_busy: true,
                query_desc: function () { return "对附近敌人快速攻击，突破40%防御；命中后增加攻击次数，并可在忙乱中使用。"; },
                use: function (me, target) { const list = fbEnemies(me); if (!list.length && target) list.push(target); for (const enemy of list) {
                    let hits = 3; for (let i = 0; i < hits && i < 6; i++) { const result = fbAttack(me, enemy, { multiplier: 0.8, diffFy: 40,
                        message: i ? "" : "<hiy>$N踏歌而行，十步之间杀意纵横。</hiy>" }); if (result.landed) hits++; } } return true; }
            },
            baishou: fbBuffPerform({ id: "taixuan_baishou", name: "白首太玄", enable: "force", mp: 20, release: 4000,
                cooldown: 45000, duration: 13000, prop: { add_sh_per: 8 },
                desc: "13秒内太玄功附加伤害加倍，命中后恢复自身攻击力40%的气血。" })
        }
    }),
    wunianchangong: fbScaleSpec(["force"], { force: { scaled: { max_hp: 30000, fy: 3005, limit_mp: 250000 },
        fixed: { hp_per: 13, fy_per: 13, diff_sh_per: 8 }, desc: "唯一：将你内力的100%转化为气血" } }, {
        forceRad: 1,
        performs: {
            jingnian: {
                name: "净念", enable_skill: "force", mp: 50, release_time: 500, distime: 30000, use_type: 2,
                query_desc: function () { return "清除你的负面状态和敌人的正面状态。"; },
                use: function (me, target) { fbClearStatuses(me, true); if (target) fbClearStatuses(target, false); return true; }
            },
            wunian: fbBuffPerform({ id: "wunian", name: "无念", enable: "force", mp: 40, release: 4000,
                cooldown: 30000, duration: 10000, prop: { diff_sh_per: 33 },
                desc: "10秒内增加33%伤害减免，每次攻击附加最大内力1%的伤害。" }),
            bikou: {
                name: "闭口禅", enable_skill: "force", mp: 80, release_time: 500, distime: 50000,
                query_desc: function () { return "造成15%内力伤害，12秒内禁止对方下个绝招。"; },
                use: function (me, target) { if (target.damage2) target.damage2(Math.floor((me.max_mp || 0) * 0.15), me);
                    fbAddStatus(target, { id: "bikou", name: "闭口禅", duration: 12000, downside: true, prop: { no_pfm: 1 },
                        desc: "下一个绝招无法产生效果。" }, me); return true; }
            }
        }
    }),
    rulaishenzhang: fbScaleSpec(["unarmed"], { unarmed: { scaled: { gj: 1605, mz: 1805 }, fixed: { mz_per: 8, gj_per: 8 } } }, {
        performs: {
            wanfo: {
                name: "万佛朝宗", enable_skill: "unarmed", mp: 120, release_time: 4000, distime: 25000,
                query_desc: function () { return "对附近敌人造成内力伤害，并将造成的伤害转化为自身气血。"; },
                use: function (me, target) { let total = 0; const list = fbEnemies(me); if (!list.length && target) list.push(target); for (const enemy of list) {
                    const damage = Math.floor((me.max_mp || 0) * 0.08); if (enemy.damage2) enemy.damage2(damage, me); total += damage; }
                    if (me.add_hp) me.add_hp(total); return true; }
            },
            miemo: fbAttackPerform({ name: "灭魔", enable: "unarmed", mp: 120, release: 4000, cooldown: 48000,
                desc: "一式从天而降的掌法，对敌人造成大量伤害并使其昏迷；自身防御与伤害减免会增加伤害和命中。",
                runtime: function (me) { const bonus = Math.max(0, (me.fy || 0) / Math.max(1, me.gj || 1)) + Math.max(0, me.diff_sh_per || 0) / 100;
                    return { multiplier: 2.5 + bonus, accuracy: 1.5 + bonus, message: "<hiy>$N凌空而下，一式灭魔神掌轰向$n。</hiy>",
                        onHit: function (attacker, target) { fbFaint(target, attacker, 5000, "rulai_faint"); } }; } })
        }
    }),
    lingxibu: fbScaleSpec(["dodge"], { dodge: { scaled: { ds: 2300, mz: 2300, dex: 281, int: 261 }, fixed: { diff_downside_per: 15 } } }, {
        performs: {
            biyi: fbBuffPerform({ id: "lingxi_biyi", name: "比翼", enable: "dodge", mp: 120, release: 500,
                cooldown: 60000, duration: 10000, prop: {}, igControl: true,
                desc: "10秒内不受负面状态影响。" })
        }
    }),
    changshengjue: fbScaleSpec(["force"], { force: { scaled: { limit_mp: 1000000 },
        fixed: { fy_per: 15, hp_per: 15, diff_sh_per: 10 },
        desc: "震慑附近敌人降低15%伤害；濒死时触发不灭；唯一：将你内力的150%转化为气血" } }, {
        forceRad: 1.5,
        performs: {
            tiandi: {
                name: "天地决", enable_skill: "force", mp: 3700, release_time: 4000, distime: 60000, use_type: 2,
                query_desc: function () { return "恢复自身全部气血，清除负面状态，并重置所有技能冷却。"; },
                use: function (me) { me.add_hp(me.max_hp); fbClearStatuses(me, true); if (me.temp) for (const key of Object.keys(me.temp)) {
                    if (key.indexOf("pfm/") === 0) me.temp[key] = null; } return true; }
            },
            hundun: fbBuffPerform({ id: "changsheng_hundun", name: "混沌诀", enable: "force", mp: 2320, release: 4000,
                cooldown: 60000, duration: 13000, prop: { diff_sh_per: 50 },
                desc: "13秒内单次受到的伤害不超过最大气血13%，超出部分转化为气血和内力。" })
        },
        onDamage: function (me, from, damage) {
            if (!me.query_status || !me.query_status("changsheng_hundun")) return damage;
            const cap = Math.floor(me.max_hp * 0.13);
            if (damage <= cap) return damage;
            const overflow = damage - cap;
            me.add_hp(Math.floor(overflow / 2)); me.add_mp(Math.floor(overflow / 2)); return cap;
        }
    }),
    cihangjiandian: fbScaleSpec(["force"], { force: { scaled: { gj: 3100, mz: 3100, limit_mp: 900000 },
        fixed: { mz_per: 10, add_sh_per: 10, diff_fy_per: 10 },
        desc: "震慑附近敌人降低15%躲闪和招架；开战5秒内无法被控制；唯一：将你内力的120%转化为气血" } }, {
        forceRad: 1.2,
        performs: {
            lingxi: fbBuffPerform({ id: "cihang_lingxi", name: "心有灵犀", enable: "force", mp: 1150, release: 4000,
                cooldown: 30000, duration: 10000, prop: { mz_per: 20 }, igControl: true,
                desc: "10秒内攻击命中后触发多次，并且不会被控制。" }),
            tongming: fbBuffPerform({ id: "cihang_tongming", name: "剑心通明", enable: "force", mp: 2600, release: 4000,
                cooldown: 60000, duration: 10000, prop: { gjsd_per: 80, releasetime_per: 80, distime_per: 80, mz_per: 100, zj_per: 100, add_sh_per: 40 },
                desc: "10秒内出招与冷却速度缩减到极限，绝对命中招架；装备剑时伤害增加40%。" })
        }
    }),
    yinyangjiuzhuan: fbScaleSpec(["force"], { force: { scaled: { limit_mp: 950000 },
        fixed: { hp_per: 15, add_sh_per: 10, diff_fy_per: 10, diff_sh_per: 10 },
        desc: "唯一：将你内力的125%转化为气血" } }, {
        forceRad: 1.25,
        performs: {
            zhuan: {
                name: "转阴阳", enable_skill: "force", mp: 120, release_time: 4000, distime: 30000, use_type: 2,
                query_desc: function () { return "转换阴阳二气：九烛增加55%最大气血和伤害减免；九幽增加40%攻击、破防和20%攻击速度。"; },
                use: function (me) { const isJiuyou = !!me.query_status("yinyang_jiuzhu"); me.remove_status("yinyang_jiuzhu", true);
                    me.remove_status("yinyang_jiuyou", true); fbAddStatus(me, isJiuyou ? { id: "yinyang_jiuyou", name: "九幽", duration: 30000,
                        prop: { gj_per: 40, diff_fy_per: 40, gjsd_per: 20 }, desc: "攻击、破防和攻击速度提升。" }
                        : { id: "yinyang_jiuzhu", name: "九烛", duration: 30000, prop: { hp_per: 55, diff_sh_per: 55 },
                            desc: "最大气血和伤害减免提升。" }, me); return true; }
            },
            qiankun: {
                name: "定乾坤", enable_skill: "force", mp: 2100, release_time: 4000, distime: 60000,
                query_desc: function () { return "压制附近敌人，4秒内封印敌方技能。"; },
                use: function (me) { for (const target of fbEnemies(me)) fbAddStatus(target, { id: "yinyang_fengyin", name: "定乾坤",
                    duration: 4000, downside: true, prop: { no_pfm: 1 }, desc: "绝招被封印。" }, me); return true; }
            },
            tiandi: {
                name: "镇天地", enable_skill: "force", mp: 1650, release_time: 4000, distime: 60000,
                query_desc: function () { return "5秒内大幅增加减伤，并每秒攻击单个敌人；再次使用可取消镇守状态。"; },
                use: function (me, target) { if (me.query_status("yinyang_zhentiandi")) { me.remove_status("yinyang_zhentiandi", true); return true; }
                    fbAddStatus(me, { id: "yinyang_zhentiandi", name: "镇天地", duration: 5000, prop: { diff_sh_per: 70 },
                        desc: "镇守天地，大幅提高伤害减免。", on_interval: function () {}, duration_count: 5 }, me);
                    for (let i = 1; i <= 5; i++) me.call_out(function () { if (!target || target.hp <= 0) return;
                        target.damage2(Math.floor((me.gj || 0) + target.hp * 0.01), me); }, i * 1000); return true; }
            }
        }
    }),
    zhanshentulu: fbScaleSpec(["force"], { force: { scaled: { str: 1000, dex: 1000, con: 1000, int: 1000, limit_mp: 1050000 },
        desc: "震慑附近敌人降低15%防御和免伤；攻击附加最大内力伤害；唯一：将你内力的140%转化为气血" } }, {
        forceRad: 1.4,
        performs: {
            zhanshen: fbBuffPerform({ id: "zhanshen_futi", name: "战神决", enable: "force", mp: 920, release: 4000,
                cooldown: 60000, duration: 12000, prop: { gj_per: 60, mz_per: 60, fy_per: 40, ds_per: 40, zj_per: 40 }, igControl: true,
                desc: "战神附体，短时间内大幅增加战力并免疫控制。" }),
            yanmie: {
                name: "湮灭", enable_skill: "force", mp: 1270, release_time: 4000, distime: 45000,
                query_desc: function () { return "一拳造成最大内力11%的伤害，清除目标持续状态，并降低其伤害和破防。"; },
                use: function (me, target) { if (target.damage2) target.damage2(Math.floor(me.max_mp * 0.11), me); if (target.clear_status) target.clear_status();
                    fbAddStatus(target, { id: "zhanshen_yanmie", name: "湮灭", duration: 10000, downside: true,
                        prop: { add_sh_per: -20, diff_fy_per: -20 }, desc: "最终伤害和破防降低20%。" }, me); return true; }
            },
            posui: {
                name: "破碎九重天", enable_skill: "force", mp: 0, release_time: 4000, distime: 60000,
                query_desc: function () { return "消耗25%当前内力，对附近敌人造成同等伤害，并使他们昏迷7秒。"; },
                use: function (me, target) { const cost = Math.floor(me.mp * 0.25); me.add_mp(-cost); const list = fbEnemies(me); if (!list.length && target) list.push(target);
                    for (const enemy of list) { if (enemy.damage2) enemy.damage2(cost, me); fbFaint(enemy, me, 7000, "zhanshen_posui"); } return true; }
            }
        }
    })
};

function applyFbSkillHooks(skill, spec) {
    if (spec.onAttackOver) skill.on_attack_over = spec.onAttackOver;
    if (spec.onDodgeOver) skill.on_dodge_over = spec.onDodgeOver;
    if (spec.onParryOver) skill.on_parry_over = spec.onParryOver;
    if (spec.onDamage) skill.on_damage = spec.onDamage;

    if (skill.id === "huagongdafa") {
        skill.on_attack_over = function (me, target, par) {
            if (!par || par.is_dodge || par.is_parry) return;
            const drain = Math.min(target.mp || 0, Math.max(1, scaleFbSkillValue(1000, me.query_skill(skill.id, 1000))));
            target.add_mp(-drain);
            me.add_mp(drain);
        };
        skill.on_damage = function (me, from, damage) {
            if (me.query_status && me.query_status("huagong_huadu") && from && from.add_mp) from.add_mp(-10333);
            return damage;
        };
    }
    if (skill.id === "xuantiejianfa") {
        skill.on_attack_over = function (me, target, par) {
            if (!par || par.is_dodge || par.is_parry || !target.damage2) return;
            target.damage2(Math.floor((me.max_mp || 0) * 0.01), me);
        };
    }
    if (skill.id === "taixuangong") {
        skill.on_attack_over = function (me, target, par) {
            if (!par || par.is_dodge || par.is_parry) return;
            if (target.damage2) target.damage2(scaleFbSkillValue(4000, me.query_skill(skill.id, 1000)), me);
            if (me.query_status && me.query_status("taixuan_baishou")) me.add_hp(Math.floor((me.gj || 0) * 0.4));
        };
    }
    if (skill.id === "wunianchangong") {
        skill.on_attack_over = function (me, target, par) {
            if (par && !par.is_dodge && !par.is_parry && me.query_status && me.query_status("wunian") && target.damage2) {
                target.damage2(Math.floor((me.max_mp || 0) * 0.01), me);
            }
        };
    }
    if (skill.id === "cihangjiandian") {
        skill.on_attack_over = function (me, target, par) {
            if (!par || par.is_dodge || par.is_parry || !me.query_status || !me.query_status("cihang_lingxi")) return;
            if (!me.query_temp("fb/cihang/extra")) {
                me.set_temp("fb/cihang/extra", 1, 1000);
                fbAttack(me, target, { multiplier: 0.8, accuracy: 1.5, message: "<hic>心有灵犀，剑意再发。</hic>" });
            }
        };
    }
}

globalThis.CREATE_FB_BOOK_SKILL = function (skill, config) {
    const spec = FB_BOOK_SKILL_SPECS[config.id] || {};
    skill.inherits(SKILL);
    skill.id = config.id;
    skill.name = config.name;
    skill.grade = config.grade;
    skill.desc = spec.desc || config.desc;
    skill.can_enables = (spec.canEnables || config.canEnables).slice();
    skill.learn_condition = {
        max_mp: config.grade * 1200,
        skill: Object.fromEntries(skill.can_enables.map(id => [id, config.grade * 50]))
    };
    if (spec.forceRad) skill.force_rad = spec.forceRad;
    skill.query_enable_prop = function (level) {
        const result = {};
        for (const type of this.can_enables) {
            const reference = spec.enableProps && spec.enableProps[type];
            if (reference) result[type] = buildFbSkillProps(reference, level);
            else if (type === "force") result[type] = { max_mp: parseInt(level * (1 + this.grade * 0.12)), fy: parseInt(level * 0.45) };
            else if (type === "dodge") result[type] = { ds: parseInt(level * (1 + this.grade * 0.12)), mz: parseInt(level * 0.25) };
            else if (type === "parry") result[type] = { zj: parseInt(level * (1 + this.grade * 0.12)), fy: parseInt(level * 0.4) };
            else result[type] = { gj: parseInt(level * (1 + this.grade * 0.12)), mz: parseInt(level * 0.8) };
        }
        return result;
    };
    if (spec.performs) skill.pfm = spec.performs;
    if (skill.can_enables.some(type => ["unarmed", "sword", "staff", "whip", "throwing"].includes(type))) {
        skill.attack_actions = ["$N运起" + skill.name + "，一式凌厉攻势直取$n的$l"];
    }
    applyFbSkillHooks(skill, spec);
};
