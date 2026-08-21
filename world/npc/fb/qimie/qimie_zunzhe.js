this.inherits(MONSTER);
this.set({ name: "七灭尊者", title: "七灭尊者", desc: "万法归墟中的灭劫尊者，周身缠绕着七道沉重劫印。", gender: 1, age: 1000, hp: 10000000, max_hp: 10000000, mp: 500000, max_mp: 500000, prop: { gj: 12000, mz: 9000, ds: 8000, fy: 9000 } });
this.no_refresh = true;
this.qimie_boss = true;
this.eventId = "";
this.damage = function (amount, from, diffFy, par) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage.call(this, amount, from, diffFy, par)); };
this.damage2 = function (amount, from) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage2.call(this, amount, from)); };
this.damage3 = function (amount, from, par) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage3.call(this, amount, from, par)); };
this.qimie_attack = function (target) {
    const ev = this.qimie_event;
    if (!ev || !ev.boss_attack_allowed || !ev.boss_attack_allowed(ev.query_event && ev.query_event(), this, target)) return 0;
    if (!this.fight_type || !this.is_fighting || !this.is_fighting(target)) {
        if (this.begin_attack) this.begin_attack(target, 2);
        if (this.attack_handler) clearTimeout(this.attack_handler);
        this.attack_handler = null;
    }
    if (!this.fight_type || !this.do_attack) return 0;
    const dealt = CHARACTER.prototype.do_attack.call(this, { target: target, no_weapon: true, gj: this.gj, mz: this.mz, qimie: true });
    this.end_attack && this.end_attack(target);
    return dealt;
};
this.on_died = function (killer) { if (this.qimie_event) this.qimie_event.kill(this, killer); };
