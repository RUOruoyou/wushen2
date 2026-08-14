this.inherits(NPC);
this.set({ name: "剑灵", hp: 180000, max_hp: 180000, mp: 28000, max_mp: 28000, score: 0, prop: { gj: 5000, mz: 4200, ds: 3400, fy: 4000 }, no_refresh: true });
this.skill_map(["dodge", 2900], ["parry", 2900], ["force", 2900], ["sword", 2900]);
this.on_die = function (killer) {
    const state = killer && killer.environment && killer.environment.query_fb_state(killer);
    if (!state || !state.milestones["海潮七击"]) {
        if (killer && killer.notify) killer.notify("尚未通过海潮七击，剑灵不会真正倒下。");
        return false;
    }
};
this.on_died = function (killer) {
    if (!killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const diff = killer.environment.query_temp(killer, "diff", 0) || 0;
    if (diff === 1) return killer.environment.fail_fb_route(killer, "困难路线应挑战剑魔");
    killer.environment.grant_fb_milestone(killer, "剑灵", 15);
};
