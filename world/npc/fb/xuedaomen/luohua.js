this.inherits(NPC);
this.set({ name: "落花流水", desc: "落花流水阻挡血刀门去路。", title: "落花流水", gender: 1, age: 45, hp: 100000, max_hp: 100000, mp: 16000, max_mp: 16000, score: 0, prop: { gj: 3500, mz: 3000, ds: 2300, fy: 2700 }, no_refresh: true });
this.skill_map(["dodge", 1900], ["parry", 1900], ["force", 1900], ["unarmed", 1900]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    const diff = room.query_temp(killer, "diff", 0) || 0;
    const now = Date.now();
    const lastDeath = room.query_temp(killer, "fb/xuedaomen/last_luohua_death", 0) || 0;
    if (diff === 2 && lastDeath && now - lastDeath < 10000) {
        room.add_temp(killer, "fb/xuedaomen/frenzy", 1);
        const replacement = NPC.CLONE("fb/xuedaomen/luohua");
        if (replacement) {
            if (typeof room.apply_fb_spawn_difficulty === "function") room.apply_fb_spawn_difficulty(killer, replacement);
            room.item_changed(replacement, true, "血刀老祖嗜血更盛，另一名落花流水补上空位。");
        }
        return;
    }
    room.set_temp(killer, "fb/xuedaomen/last_luohua_death", now);
    const count = (killer.environment.query_temp(killer, "fb/xuedaomen/shift_count", 0) || 0) + 1;
    killer.environment.set_temp(killer, "fb/xuedaomen/shift_count", count);
    const keys = ["落水转移", "水牢转移", "忘忧谷转移", "最终转移"];
    if (count <= keys.length) {
        killer.environment.set_temp(killer, "fb/xuedaomen/shift" + count, 1);
        killer.environment.grant_fb_milestone(killer, keys[count - 1], 15);
        if (count === 4) killer.environment.grant_fb_milestone(killer, "老祖到谷", 10);
    }
};
