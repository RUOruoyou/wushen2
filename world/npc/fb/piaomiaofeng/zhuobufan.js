this.inherits(NPC);
this.set({ name: "卓不凡", desc: "卓不凡守在失足岩。", title: "卓不凡", gender: 1, age: 40, hp: 105000, max_hp: 105000, mp: 18000, max_mp: 18000, score: 0, prop: { gj: 3700, mz: 3100, ds: 2400, fy: 2800 }, no_refresh: true });
this.skill_map(["dodge", 2000], ["parry", 2000], ["force", 2000], ["sword", 2000]);
this.set_drop({ obj: "money/silver", min: 45, max: 80 }, { obj: "drug/age", odds: 1800 });
this.on_died = function (killer) { if (killer && killer.is_player && killer.environment && killer.environment.is_fb()) killer.environment.grant_fb_milestone(killer, "卓不凡", 10); };
