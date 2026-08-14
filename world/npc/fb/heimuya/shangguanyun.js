this.inherits(NPC);
this.set({ name: "上官云", desc: "上官云守在白虎堂。", title: "上官云", gender: 1, age: 40, hp: 110000, max_hp: 110000, mp: 18000, max_mp: 18000, score: 0, prop: { gj: 4200, mz: 3300, ds: 2600, fy: 3200 }, no_refresh: true });
this.skill_map(["dodge", 2200], ["parry", 2200], ["force", 2200], ["unarmed", 2200]);
this.set_drop({ obj: "money/silver", min: 50, max: 90 });
this.on_died = function (killer) { if (killer && killer.is_player && killer.environment && killer.environment.is_fb()) { killer.environment.set_temp(killer, "fb/heimuya/token1_owned", 1); killer.environment.grant_fb_milestone(killer, "上官云", 10); } };
