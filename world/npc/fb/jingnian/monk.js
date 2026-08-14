this.inherits(NPC);
this.set({ name: "净念禅宗僧人", desc: "铜殿僧人守着临时和氏璧。", title: "净念禅宗僧人", gender: 1, age: 40, hp: 120000, max_hp: 120000, mp: 20000, max_mp: 20000, score: 0, prop: { gj: 4000, mz: 3400, ds: 2600, fy: 3200 }, no_refresh: true });
this.skill_map(["dodge", 2300], ["parry", 2300], ["force", 2300], ["unarmed", 2300]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    const route = room.query_temp(killer, "fb/jingnian/route", 0);
    if (!["盗帅", "邪王"].includes(route)) return;
    const count = (room.query_temp(killer, "fb/jingnian/monks", 0) || 0) + 1;
    room.set_temp(killer, "fb/jingnian/monks", count);
    if (count >= 5 && !room.query_temp(killer, "fb/jingnian/monks_done", 0)) {
        room.set_temp(killer, "fb/jingnian/monks_done", 1);
        room.grant_fb_milestone(killer, "五僧", 25);
    }
};
