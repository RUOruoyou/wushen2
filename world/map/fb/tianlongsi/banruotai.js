this.inherits(ROOM);
this.name = "般若台";
this.desc = "般若台通向牟尼堂，普通路线在此补足一名和尚，困难路线补足两名。";
this.exits = { south: "fb/tianlongsi/shelidian", north: "fb/tianlongsi/munitang" };
this.on_enter = function (me) {
    const diff = this.query_temp(me, "diff", 0) || 0;
    if (diff === 1 && !this.query_temp(me, "fb/tianlongsi/disguise", 0)) {
        this.fail_fb_route(me, "困难路线未完成伪装就进入般若台");
        return;
    }
    const count = diff === 1 ? 2 : 1;
    let existing = (this.items || []).filter(item => item && item.path === "fb/tianlongsi/monk").length;
    if (existing >= count) {
        this.set_temp(me, "fb/tianlongsi/core_spawned", 1);
        return;
    }
    while (existing < count) {
        const monk = NPC.CLONE("fb/tianlongsi/monk");
        if (!monk) break;
        this.apply_fb_spawn_difficulty(me, monk);
        this.item_changed(monk, true);
        existing++;
    }
    if (existing >= count) this.set_temp(me, "fb/tianlongsi/core_spawned", 1);
};
