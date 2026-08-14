this.inherits(NPC);
this.set({ name: "祁冰云", desc: "祁冰云守着慈航遗书。", title: "祁冰云", hp: 145000, max_hp: 145000, mp: 25000, max_mp: 25000, score: 0, prop: { gj: 4500, mz: 3900, ds: 2900, fy: 3500 }, no_refresh: true });
this.skill_map(["dodge", 2700], ["parry", 2700], ["force", 2700], ["sword", 2700]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const route = room.query_temp(killer, "fb/cihang/route", 0);
    if (!["浪子", "剑魔"].includes(route)) return;
    this.fbDeathResolved = true;
    room.set_temp(killer, "fb/cihang/qibingyun_dead", 1);
    room.set_temp(killer, "fb/cihang/yishu", 1);
};
