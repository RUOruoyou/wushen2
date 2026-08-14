this.inherits(NPC);
this.set({ name: "木凤", hp: 210000, max_hp: 210000, mp: 34000, max_mp: 34000, score: 0, prop: { gj: 6100, mz: 5200, ds: 4600, fy: 4700 }, no_refresh: true });
this.skill_map(["dodge", 3700], ["parry", 3500], ["force", 3500], ["unarmed", 3500]);
this.set_drop({ obj: "money/silver", min: 80, max: 140 }, { obj: "eq/fb/zhanshendian/mufeng_yuxue", odds: 800 });
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const diff = room.query_temp(killer, "diff", 0) || 0;
    if (diff === 0) {
        this.fbDeathResolved = true;
        room.set_temp(killer, "fb/zhanshendian/bird_nest", 1);
        room.grant_fb_milestone(killer, "木凤", 15);
        return;
    }
    if (diff !== 1) return;
    this.fbDeathResolved = true;
    room.set_temp(killer, "fb/zhanshendian/element_木石", 1);
    room.grant_fb_milestone(killer, "木石", 5);
};
