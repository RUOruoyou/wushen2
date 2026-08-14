this.inherits(NPC);
this.set({ name: "火猊", hp: 225000, max_hp: 225000, mp: 36000, max_mp: 36000, score: 0, prop: { gj: 6500, mz: 5350, ds: 3950, fy: 5100 }, no_refresh: true });
this.skill_map(["dodge", 3650], ["parry", 3750], ["force", 3800], ["unarmed", 3750]);
this.set_drop({ obj: "money/silver", min: 80, max: 140 }, { obj: "eq/fb/zhanshendian/huoni_doupeng", odds: 800 });
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    if ((room.query_temp(killer, "diff", 0) || 0) !== 1) return;
    this.fbDeathResolved = true;
    room.set_temp(killer, "fb/zhanshendian/element_火石", 1);
    room.grant_fb_milestone(killer, "火石", 5);
};
