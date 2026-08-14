this.inherits(NPC);
this.set({ name: "崖底三人组", desc: "崖底三人组守住后山。", title: "崖底三人组", gender: 1, age: 40, hp: 130000, max_hp: 130000, mp: 22000, max_mp: 22000, score: 0, prop: { gj: 4200, mz: 3500, ds: 2700, fy: 3300 }, no_refresh: true });
this.skill_map(["dodge", 2400], ["parry", 2400], ["force", 2400], ["unarmed", 2400]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    if (room.query_temp(killer, "fb/jingnian/route", 0) !== "盗帅"
        || room.query_temp(killer, "fb/jingnian/sanren_done", 0)) return;
    room.set_temp(killer, "fb/jingnian/sanren_done", 1);
    room.grant_fb_milestone(killer, "崖底三人组", 20);
};
