this.inherits(NPC);
this.set({ name: "剑魔", hp: 260000, max_hp: 260000, mp: 38000, max_mp: 38000, score: 0, prop: { gj: 6500, mz: 1000000, ds: 5200, fy: 5200, diff_busy_per: 100 }, no_refresh: true });
this.skill_map(["dodge", 3800], ["parry", 3800], ["force", 3800], ["sword", 3800]);
this.on_die = function (killer) {
    const state = killer && killer.environment && killer.environment.query_fb_state(killer);
    if (!state || !state.milestones["海潮七击"]) {
        if (killer && killer.notify) killer.notify("尚未通过海潮七击，剑魔不会真正倒下。");
        return false;
    }
};
this.on_died = function (killer) {
    if (killer && killer.is_player && killer.environment && killer.environment.is_fb()) {
        killer.environment.grant_fb_milestone(killer, "剑魔", 15);
    }
};
