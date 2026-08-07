this.inherits(SKILL);
this.name = "五毒钩法";
this.id = "wudugoufa";
this.grade = 3;
this.desc = "五毒教的高级剑法，阴狠毒辣";
this.can_enables = ["sword"];
this.learn_condition = {
    max_mp: 30000,
    skill: { sword: 350 }
};
this.query_enable_prop = function (lv) {
    return {
        sword: {
            str: 201,
            mz: parseInt(lv * 1.41)
        }
    };
};
this.on_attack_over = function (me, target, par) {
    if (!par || par.is_dodge || par.is_parry) return;
    target.damage2(parseInt(me.gj * 0.1), me);
};
this.pfm = {
    jingou: {
        name: "金钩锁魂",
        distime: 25000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 20,
        release_time: 4000,
        use: function (me, target, lv) {
            var weap = target.query_weapon();
            if (!weap || weap.weapon_type === WEAPON_TYPE.NONE) {
                return me.notify("对方没有兵器，你不用担心。");
            }
            if (lv + me.random(me.mz) <= target.ds) {
                return me.send_room("<cyn>$N使出金钩锁魂，可是$n早有防备，兵刃未被夺下。</cyn>", target);
            }
            target.unequip(weap, true, 10000);
            me.send_room("<hic>$N使出金钩锁魂，$n手中兵刃脱手而出，紧接着连攻四次！</hic>", target);
            for (var i = 0; i < 4 && target.hp > 0; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_append: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function () {
            return "打掉对方兵器，成功后继续攻击对方4次，等级越高成功率越高";
        }
    }
};
