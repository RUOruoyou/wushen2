this.inherits(MONSTER);
this.set({ name: "离火灵魄", title: "离火灵魄", desc: "南坛焚天台上的离火精魄。", gender: 0, hp: 1000000, max_hp: 1000000, prop: { gj: 9000, mz: 8000, ds: 7000, fy: 7000 } });
this.no_refresh = true;
this.aspectId = "lihuo_lingpo";
this.damage = function (amount, from, diffFy, par) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage.call(this, amount, from, diffFy, par)); };
this.damage2 = function (amount, from) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage2.call(this, amount, from)); };
this.damage3 = function (amount, from, par) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage3.call(this, amount, from, par)); };
this.on_died = function (killer) { if (this.qimie_event) this.qimie_event.aspect_dead(this, killer); };
