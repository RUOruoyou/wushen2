this.inherits(NPC);
this.set({ name: "血刀老祖", desc: "血刀老祖在山谷外借落花流水转移伤害。", title: "血刀老祖", gender: 1, age: 60, hp: 240000, max_hp: 240000, mp: 32000, max_mp: 32000, score: 0, prop: { gj: 5200, mz: 4300, ds: 3200, fy: 4200 }, no_refresh: true });
this.skill_map(["dodge", 2800], ["parry", 2800], ["force", 2800], ["blade", 2800]);
this.on_die = function (killer) { if (!this.environment || this.environment.path !== "fb/xuedaomen/shangu" || !killer || !this.environment.query_temp(killer, "fb/xuedaomen/shift4", 0)) { if (killer && killer.notify) killer.notify("血刀老祖尚未完成四次转移，无法被击杀。"); return false; } };
this.on_died = function (killer) { if (killer && killer.is_player && killer.environment && killer.environment.is_fb()) killer.environment.grant_fb_milestone(killer, "血刀老祖", 20); };
