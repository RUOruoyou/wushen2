this.inherits(ROOM);
this.name = "祁冰云山路";
this.desc = "祁冰云守在东侧山路，遗书阶段完成后可北上拦江岛。";
this.exits = { west: "fb/cihang/fenlu", northwest: "fb/cihang/jiangdao" };
this.spawn_qibingyun = function (me) {
    if (this.query_temp(me, "fb/cihang/qibingyun_dead", 0)) return null;
    const existing = this.find_obj_bypath("fb/cihang/qibingyun");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/cihang/qibingyun");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    return npc;
};
this.on_enter = function (me) {
    if (this.query_temp(me, "fb/cihang/qibingyun_challenge", 0)
        && !this.query_temp(me, "fb/cihang/qibingyun_dead", 0)) this.spawn_qibingyun(me);
};
this.add_action("challenge", "挑战祁冰云", function (me) {
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (!["浪子", "剑魔"].includes(route)) return me.notify("当前路线不是挑战祁冰云。");
    if (this.query_temp(me, "fb/cihang/qibingyun_challenge", 0)) return me.notify("祁冰云挑战阶段已经开始。");
    if (!this.spawn_qibingyun(me)) return me.notify("祁冰云暂未现身，请稍后重试。");
    this.set_temp(me, "fb/cihang/qibingyun_challenge", 1);
    if (route === "浪子") this.grant_fb_milestone(me, "祁冰云", 10);
    me.notify("祁冰云现身，击败她后取得遗书。");
});
this.add_action("deliver", "交付遗书", function (me) {
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (!["浪子", "剑魔"].includes(route)) return me.notify("当前路线没有遗书交付阶段。");
    if (!this.query_temp(me, "fb/cihang/qibingyun_dead", 0)) return me.notify("祁冰云尚未败退。");
    if (this.query_temp(me, "fb/cihang/deliver_done", 0)) return me.notify("遗书已经交付。");
    this.set_temp(me, "fb/cihang/deliver_done", 1);
    this.grant_fb_milestone(me, route === "剑魔" ? "遗书与挑战" : "遗书", 15);
    me.notify("你交付遗书，前往拦江岛的路线已经打开。");
});
this.on_leave = function (me, dir) {
    if (dir === "northwest" && !this.query_temp(me, "fb/cihang/deliver_done", 0)) { me.notify("请先完成祁冰云与遗书阶段。"); return false; }
};
