this.inherits(NPC);
this.set({ name: "张无忌", title: "<hiy>明教教主</hiy>", hp: 160000, max_hp: 160000, mp: 26000, max_mp: 26000, score: 0, prop: { gj: 4700, mz: 3800, ds: 3000, fy: 3600 }, no_refresh: true });
this.skill_map(["dodge", 2600], ["parry", 2600], ["force", 2600], ["unarmed", 2600]);
this.apply_order_level = function (me) {
    const room = this.environment;
    const state = room && room.query_fb_state ? room.query_fb_state(me) : null;
    if (!state) return 0;
    const level = Math.max(0, Math.min(24, parseInt(state.guangmingdingOrderLevel) || 0));
    if (!this.fbOrderBase) {
        this.fbOrderBase = {};
        for (const key of ["gj", "mz", "ds", "fy"]) this.fbOrderBase[key] = this.query_prop(key);
    }
    if (this.fbOrderLevel === level) return level;
    const rate = Math.pow(1.1, level);
    for (const key of ["gj", "mz", "ds", "fy"]) this.prop[key] = Math.ceil(this.fbOrderBase[key] * rate);
    this.fbOrderLevel = level;
    if (typeof this.recount === "function") this.recount();
    return level;
};
this.on_died = function (killer) { if (killer && killer.is_player && killer.environment && killer.environment.is_fb()) killer.environment.grant_fb_milestone(killer, "张无忌", 15); };
