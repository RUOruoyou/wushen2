this.inherits(NPC);
this.set({ name: "庞斑", hp: 180000, max_hp: 180000, mp: 30000, max_mp: 30000, score: 0, prop: { gj: 5600, mz: 4600, ds: 3500, fy: 4300 }, no_refresh: true });
this.skill_map(["dodge", 3200], ["parry", 3200], ["force", 3200], ["unarmed", 3200]);
this.on_died = function (killer) {
    if (this.fbLifeResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const route = room.query_temp(killer, "fb/cihang/route", 0);
    if (!["浪子", "国师", "剑魔", "魔师"].includes(route)) return;
    if (route === "国师") {
        if ((!room.query_temp(killer, "fb/cihang/pangban_duel_started", 0)
            && !room.query_temp(killer, "fb/cihang/pangban_duel", 0))
            || room.query_temp(killer, "fb/cihang/pangban_duel_done", 0)) return;
        this.fbLifeResolved = true;
        room.set_temp(killer, "fb/cihang/pangban_duel_done", 1);
        room.grant_fb_milestone(killer, "比试庞斑", 15);
        const lang = NPC.CLONE("fb/cihang/langfanyun");
        if (lang) {
            if (typeof room.apply_fb_spawn_difficulty === "function") room.apply_fb_spawn_difficulty(killer, lang);
            room.item_changed(lang, true, "庞斑比试败退，浪翻云踏上拦江岛。");
        }
        return;
    }
    if (route === "浪子" && !room.query_temp(killer, "fb/cihang/langfanyun_done", 0)) return;
    if (["浪子", "剑魔"].includes(route) && !room.query_temp(killer, "fb/cihang/deliver_done", 0)) return;
    if (route === "魔师" && !room.query_temp(killer, "fb/cihang/island_fight", 0)) return;
    this.fbLifeResolved = true;
    const count = (room.query_temp(killer, "fb/cihang/pangban_life", 0) || 0) + 1;
    room.set_temp(killer, "fb/cihang/pangban_life", count);
    if (count >= 3) {
        if (room.query_temp(killer, "fb/cihang/pangban_done", 0)) return;
        room.set_temp(killer, "fb/cihang/pangban_done", 1);
        if (route === "浪子") room.grant_fb_milestone(killer, "庞斑三命", 25);
        if (route === "剑魔") room.grant_fb_milestone(killer, "庞斑三命", 40);
        if (route === "魔师") room.grant_fb_milestone(killer, "魔师战斗", 45);
        return;
    }
    const next = NPC.CLONE("fb/cihang/pangban");
    if (!next) return;
    if (typeof room.apply_fb_spawn_difficulty === "function") room.apply_fb_spawn_difficulty(killer, next);
    room.item_changed(next, true, "庞斑再次现身，三命之战尚未结束。");
};
