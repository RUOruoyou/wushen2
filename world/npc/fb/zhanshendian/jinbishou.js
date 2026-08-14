this.inherits(NPC);
this.set({ name: "金狴兽", hp: 220000, max_hp: 220000, mp: 35000, max_mp: 35000, score: 0, prop: { gj: 6400, mz: 5300, ds: 3900, fy: 5000 }, no_refresh: true });
this.skill_map(["dodge", 3600], ["parry", 3700], ["force", 3700], ["unarmed", 3700]);
this.set_drop({ obj: "money/silver", min: 80, max: 140 }, { obj: "eq/fb/zhanshendian/jinbi_guguan", odds: 800 });
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    if ((room.query_temp(killer, "diff", 0) || 0) !== 1) return;
    this.fbDeathResolved = true;
    room.set_temp(killer, "fb/zhanshendian/element_金石", 1);
    room.grant_fb_milestone(killer, "金石", 5);
};
