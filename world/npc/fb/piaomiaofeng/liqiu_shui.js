this.inherits(NPC);
this.set({ name: "李秋水", desc: "李秋水守在仙愁门。", title: "李秋水", gender: 2, age: 50, hp: 180000, max_hp: 180000, mp: 26000, max_mp: 26000, score: 0, prop: { gj: 4500, mz: 3800, ds: 3000, fy: 3600 }, no_refresh: true });
this.skill_map(["dodge", 2600], ["parry", 2600], ["force", 2600], ["unarmed", 2600]);
this.set_drop({ obj: "money/silver", min: 70, max: 120 });
this.on_died = function (killer) {
    if (!killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const diff = room.query_temp(killer, "diff", 0) || 0;
    const state = room.query_fb_state(killer);
    if (!state || state.failed) return;
    if (!state.milestones["背女童"] || !state.milestones["铁索桥"]) return room.fail_fb_route(killer, "背负女童并通过铁索桥后才能挑战李秋水");
    if (diff === 1 && (!room.query_temp(killer, "fb/piaomiaofeng/carry_child", 0) || !(killer.query_status && killer.query_status("fb_piaomiaofeng_carry")))) {
        return room.fail_fb_route(killer, "困难路线必须在童姥仍在背负状态时击败李秋水");
    }
    room.grant_fb_milestone(killer, "李秋水", diff === 1 ? 30 : 25);
};
