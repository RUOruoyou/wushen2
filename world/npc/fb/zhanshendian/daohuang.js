this.inherits(NPC);
this.set({ name: "刀皇", hp: 245000, max_hp: 245000, mp: 40000, max_mp: 40000, score: 0, prop: { gj: 6800, mz: 5600, ds: 4200, fy: 5300 }, no_refresh: true });
this.skill_map(["dodge", 3900], ["parry", 4000], ["force", 4000], ["blade", 4100]);
this.on_died = function (killer) {
    if (this.fbLifeResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    if ((room.query_temp(killer, "diff", 0) || 0) !== 1) return;
    const state = room.query_fb_state(killer);
    if (!state || state.failed || room.query_temp(killer, "fb/zhanshendian/daohuang_done", 0)) return;
    this.fbLifeResolved = true;
    const life = (room.query_temp(killer, "fb/zhanshendian/daohuang_life", 0) || 0) + 1;
    room.set_temp(killer, "fb/zhanshendian/daohuang_life", life);
    if (life >= 2) {
        if (room.grant_fb_milestone(killer, "刀皇", 10)) {
            room.set_temp(killer, "fb/zhanshendian/daohuang_done", 1);
        }
        return;
    }
    const next = NPC.CLONE("fb/zhanshendian/daohuang");
    if (!next) return;
    if (typeof room.apply_fb_spawn_difficulty === "function") room.apply_fb_spawn_difficulty(killer, next);
    room.item_changed(next, true, "刀皇的第二道元神重新凝聚，双命之战尚未结束。");
};
