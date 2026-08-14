this.inherits(NPC);
this.set({ name: "石破天", hp: 220000, max_hp: 220000, mp: 36000, max_mp: 36000, score: 0, prop: { gj: 6800, mz: 5600, ds: 4300, fy: 5200 }, no_refresh: true });
this.skill_map(["dodge", 3800], ["parry", 3800], ["force", 3800], ["unarmed", 3800]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    if (room.query_temp(killer, "fb/xiakedao/route", 0) !== "赏善"
        || !room.query_temp(killer, "fb/xiakedao/shangshan/duel", 0)) return;
    this.fbDeathResolved = true;
    room.grant_fb_milestone(killer, "比试", 20);
};
