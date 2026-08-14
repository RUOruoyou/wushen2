this.inherits(ROOM);
this.name = "阴阳核心";
this.desc = "烛九阴和幽冥双子守在阴阳谷最深处。";
this.exits = { south: "fb/yinyanggu/cave" };
this.set_npc("fb/yinyanggu/zhuzhaoyin");
this.spawn_yin_twins = function (me) {
    const state = this.query_fb_state(me);
    if (!state || state.failed || !state.milestones["烛九阴幽冥"]) return;
    for (const path of ["fb/yinyanggu/shuangzi", "fb/yinyanggu/shuangzi2"]) {
        if (this.find_obj_bypath(path)) continue;
        const npc = NPC.CLONE(path);
        if (!npc) continue;
        this.apply_fb_spawn_difficulty(me, npc);
        this.item_changed(npc, true);
    }
};
this.on_enter = function (me) {
    const route = this.query_temp(me, "fb/yinyanggu/route", 0);
    if (!route) { me.notify("请先选择路线。"); return; }
    if (!this.query_temp(me, "fb/yinyanggu/cave", 0)) { me.notify("你还没有完成洞窟节点。"); return; }
    if (route === "幽冥") this.spawn_yin_twins(me);
};
this.on_leave = function (me, dir) { if (dir === "south") return; };
