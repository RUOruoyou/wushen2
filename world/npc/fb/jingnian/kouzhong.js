this.inherits(NPC);
this.set({ name: "寇仲", desc: "寇仲被少帅路线诱出。", title: "寇仲", hp: 145000, max_hp: 145000, mp: 23000, max_mp: 23000, score: 0, prop: { gj: 4400, mz: 3700, ds: 2800, fy: 3400 }, no_refresh: true });
this.skill_map(["dodge", 2500], ["parry", 2500], ["force", 2500], ["unarmed", 2500]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    if (room.query_temp(killer, "fb/jingnian/route", 0) === "少帅") room.set_temp(killer, "fb/jingnian/kouzhong_dead", 1);
};
