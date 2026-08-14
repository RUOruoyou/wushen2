this.inherits(ROOM);
this.name = "谢逊石洞";
this.desc = "谢逊和张五侠在石洞中等待挑战。困难模式需要依次完成两场战斗。";
this.exits = { south: "fb/binghuo/central" };
this.set_npc("fb/binghuo/xiexun");
this.spawn_zhangwuxia = function (me) {
    if (!me || !me.is_player || (this.query_temp(me, "diff", 0) || 0) !== 1) return false;
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["谢逊"] || this.find_obj_bypath("fb/binghuo/zhangwuxia")) return false;
    const zhang = NPC.CLONE("fb/binghuo/zhangwuxia");
    if (!zhang) return false;
    if (typeof this.apply_fb_spawn_difficulty === "function") this.apply_fb_spawn_difficulty(me, zhang);
    this.item_changed(zhang, true);
    if (typeof me.send_room === "function") me.send_room("谢逊倒下后，张五侠上前接战。", zhang);
    return true;
};
this.on_enter = function (me) {
    this.spawn_zhangwuxia(me);
};
