this.inherits(NPC);
this.set({ name: "老徐", desc: "老徐在钟楼边等候时机。", title: "净念禅宗老徐", hp: 150000, max_hp: 150000, mp: 24000, max_mp: 24000, score: 0, prop: { gj: 4500, mz: 3700, ds: 2800, fy: 3400 }, no_refresh: true });
this.skill_map(["dodge", 2500], ["parry", 2500], ["force", 2500], ["unarmed", 2500]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    const route = room.query_temp(killer, "fb/jingnian/route", 0);
    if (!["僧王", "困难僧王"].includes(route) || room.query_temp(killer, "fb/jingnian/laoxu_dead", 0)) return;
    room.set_temp(killer, "fb/jingnian/laoxu_dead", 1);
    room.set_temp(killer, "fb/jingnian/heshibi", 1);
    room.grant_fb_milestone(killer, "老徐", route === "困难僧王" ? 30 : 35);
    if (route === "僧王") room.grant_fb_milestone(killer, "和氏璧", 10);
};
