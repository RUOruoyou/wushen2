this.inherits(NPC);
this.set({ name: "不平道人", desc: "不平道人挡住女童退路。", title: "不平道人", gender: 1, age: 45, hp: 90000, max_hp: 90000, mp: 15000, max_mp: 15000, score: 0, prop: { gj: 3300, mz: 2800, ds: 2100, fy: 2500 }, no_refresh: true });
this.skill_map(["dodge", 1800], ["parry", 1800], ["force", 1800], ["unarmed", 1800]);
this.set_drop({ obj: "money/silver", min: 45, max: 80 });
this.on_died = function (killer) { if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return; this.fbDeathResolved = true; const count = killer.environment.query_temp(killer, "fb/piaomiaofeng/child_guard", 0) || 0; killer.environment.set_temp(killer, "fb/piaomiaofeng/child_guard", count + 1); if (count + 1 >= 2) killer.environment.grant_fb_milestone(killer, "保护女童", 20); };
