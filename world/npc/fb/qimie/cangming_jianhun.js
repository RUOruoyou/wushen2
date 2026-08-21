this.inherits(MONSTER);
this.set({ name: "苍溟剑魂", title: "苍溟剑魂", desc: "东坛问剑台上凝成的一缕苍溟剑意。", gender: 0, hp: 1000000, max_hp: 1000000, prop: { gj: 9000, mz: 8000, ds: 7000, fy: 7000 } });
this.no_refresh = true;
this.aspectId = "cangming_jianhun";
this.damage = function (amount, from, diffFy, par) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage.call(this, amount, from, diffFy, par)); };
this.damage2 = function (amount, from) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage2.call(this, amount, from)); };
this.damage3 = function (amount, from, par) { const ev = this.qimie_event; if (!ev) return 0; return ev.accept_damage(this, amount, from, () => CHARACTER.prototype.damage3.call(this, amount, from, par)); };
this.on_died = function (killer) { if (this.qimie_event) this.qimie_event.aspect_dead(this, killer); };
