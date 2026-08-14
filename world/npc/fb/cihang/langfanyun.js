this.inherits(NPC);
this.set({ name: "浪翻云", desc: "浪翻云在拦江岛等待比试。", title: "浪翻云", hp: 175000, max_hp: 175000, mp: 29000, max_mp: 29000, score: 0, prop: { gj: 5200, mz: 4300, ds: 3400, fy: 4100 }, no_refresh: true });
this.skill_map(["dodge", 3100], ["parry", 3100], ["force", 3100], ["sword", 3100]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const route = room.query_temp(killer, "fb/cihang/route", 0);
    if (route === "浪子") {
        this.fbDeathResolved = true;
        room.set_temp(killer, "fb/cihang/langfanyun_done", 1);
        room.grant_fb_milestone(killer, "浪翻云", 15);
        const pangban = NPC.CLONE("fb/cihang/pangban");
        if (pangban) {
            if (typeof room.apply_fb_spawn_difficulty === "function") room.apply_fb_spawn_difficulty(killer, pangban);
            room.item_changed(pangban, true, "浪翻云败退，庞斑踏上拦江岛。");
        }
        return;
    }
    if (route === "国师" && room.query_temp(killer, "fb/cihang/pangban_duel_done", 0)) {
        this.fbDeathResolved = true;
        room.set_temp(killer, "fb/cihang/lang_phase", 1);
        room.grant_fb_milestone(killer, "浪翻云阶段", 40);
    }
};
