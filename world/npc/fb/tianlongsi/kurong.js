this.inherits(NPC);
this.set({ name: "枯荣大师", desc: "枯荣大师守护着牟尼堂。", title: "枯荣大师", gender: 1, age: 70, hp: 150000, max_hp: 150000, mp: 25000, max_mp: 25000, score: 0, prop: { gj: 4300, mz: 3600, ds: 2800, fy: 3500 }, no_refresh: true });
this.skill_map(["dodge", 2500], ["parry", 2500], ["force", 2500], ["unarmed", 2500]);
this.on_died = function (killer) {
    if (!killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const state = room.query_fb_state(killer);
    if (!state || state.failed) return;
    if (!state.milestones["抓段誉"]) return room.fail_fb_route(killer, "抓住段誉前击杀了枯荣");
    room.grant_fb_milestone(killer, "枯荣", 15);
};
