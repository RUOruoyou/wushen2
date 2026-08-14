this.inherits(NPC);
this.set({ name: "杨莲亭", desc: "杨莲亭守在黑木崖大门。", title: "杨莲亭", gender: 1, age: 35, hp: 120000, max_hp: 120000, mp: 20000, max_mp: 20000, score: 0, prop: { gj: 4500, mz: 3500, ds: 2700, fy: 3400 }, no_refresh: true });
this.skill_map(["dodge", 2400], ["parry", 2400], ["force", 2400], ["unarmed", 2400]);
this.set_drop({ obj: "money/silver", min: 50, max: 90 });
this.on_died = function (killer) { if (killer && killer.is_player && killer.environment && killer.environment.is_fb()) killer.environment.grant_fb_milestone(killer, "杨莲亭一", 10); };
