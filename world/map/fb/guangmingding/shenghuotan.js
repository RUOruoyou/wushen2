this.inherits(ROOM);
this.name = "圣火坛";
this.desc = "张无忌站在圣火坛前，六大门派的伤亡会化作他的号令之势。";
this.exits = { south: "fb/guangmingding/shenghuotang" };
this.set_npc("fb/guangmingding/zhangwuji");
this.on_enter = function (me) {
    const state = this.query_fb_state(me);
    const zhangwuji = this.find_obj_bypath("fb/guangmingding/zhangwuji");
    if (!state || !zhangwuji || typeof zhangwuji.apply_order_level !== "function") return;
    const level = zhangwuji.apply_order_level(me);
    if (state.guangmingdingOrderAnnounced === level + 1) return;
    state.guangmingdingOrderAnnounced = level + 1;
    this.notify("张无忌当前身负" + level + "层号令。六大门派每阵亡一人，号令便更强一分。");
};
