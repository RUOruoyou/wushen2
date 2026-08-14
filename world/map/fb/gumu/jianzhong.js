this.inherits(ROOM);
this.name = "剑冢";
this.desc = "通过海潮考验后，最后的剑灵或剑魔在剑冢中现身。";
this.exits = { south: "fb/gumu/qiaobi" };
this.set_npc("fb/gumu/jianling");
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1 || this.find_obj_bypath("fb/gumu/jianmo")) return;
    const npc = NPC.CLONE("fb/gumu/jianmo");
    if (!npc) return;
    const old = this.find_obj_bypath("fb/gumu/jianling");
    if (old) this.item_changed(old, false);
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
};
