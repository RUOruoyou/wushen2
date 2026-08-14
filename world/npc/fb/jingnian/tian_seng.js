this.inherits(NPC);
this.set({ name: "拦路天僧", desc: "困难僧王路线的天僧封住钟楼。", title: "拦路天僧", hp: 190000, max_hp: 190000, mp: 30000, max_mp: 30000, score: 0, prop: { gj: 5200, mz: 4300, ds: 3300, fy: 4100 }, no_refresh: true });
this.skill_map(["dodge", 3000], ["parry", 3000], ["force", 3000], ["unarmed", 3000]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    if (room.query_temp(killer, "fb/jingnian/route", 0) !== "困难僧王") return;
    room.set_temp(killer, "fb/jingnian/tian_seng_done", 1);
    room.grant_fb_milestone(killer, "拦路天僧", 30);
};
