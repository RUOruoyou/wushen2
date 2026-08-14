this.inherits(NPC);
this.set({ name: "天龙寺和尚", desc: "天龙寺守殿和尚。", title: "天龙寺和尚", gender: 1, age: 40, hp: 90000, max_hp: 90000, mp: 15000, max_mp: 15000, score: 0, prop: { gj: 3200, mz: 2700, ds: 2100, fy: 2500 }, no_refresh: true });
this.skill_map(["dodge", 1800], ["parry", 1800], ["force", 1800], ["unarmed", 1800]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    const state = room.query_fb_state(killer);
    if (!state || state.failed) return;
    const diff = room.query_temp(killer, "diff", 0) || 0;
    const count = (room.query_temp(killer, "fb/tianlongsi/monks", 0) || 0) + 1;
    room.set_temp(killer, "fb/tianlongsi/monks", count);
    const captured = Boolean(state.milestones["抓段誉"]);
    if (diff === 0 && !captured && count > 2) return room.fail_fb_route(killer, "普通路线进入核心区前只能击败两名和尚");
    if (diff === 1 && !captured) return room.fail_fb_route(killer, "困难路线抓人前不能击杀和尚");
    if (diff === 0 && !captured && count === 2) room.grant_fb_milestone(killer, "前置和尚", 10);
    if (diff === 0 && captured && count >= 5) room.grant_fb_milestone(killer, "余下和尚", 30);
    if (diff === 1 && captured && count >= 6) room.grant_fb_milestone(killer, "六名和尚", 30);
};
