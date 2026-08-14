this.inherits(NPC);
this.set({ name: "烛九阴", hp: 230000, max_hp: 230000, mp: 36000, max_mp: 36000, score: 0, prop: { gj: 6200, mz: 5000, ds: 3800, fy: 4700 }, no_refresh: true });
this.skill_map(["dodge", 3500], ["parry", 3500], ["force", 3500], ["unarmed", 3500]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const route = room.query_temp(killer, "fb/yinyanggu/route", 0);
    if (!["烛龙", "幽冥"].includes(route)) return;
    this.fbDeathResolved = true;
    if (route === "烛龙") return room.grant_fb_milestone(killer, "烛九阴", 30);
    if (room.grant_fb_milestone(killer, "烛九阴幽冥", 25) && typeof room.spawn_yin_twins === "function") {
        room.spawn_yin_twins(killer);
    }
};
