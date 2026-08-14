this.inherits(ROOM);
this.name = "卧室";
this.desc = "临水卧室位于大厅北面。普通路线可向黄蓉询问石匣，困难路线则由黄药师在此镇守。";
this.exits = { south: "fb/taohuadao/dating" };
this.on_before_enter = function (me) {
    const diff = Number(this.query_temp(me, "diff", 0)) || 0;
    const state = this.query_fb_state(me);
    const path = diff > 0 ? "fb/taohuadao/huangyaoshi" : "fb/taohuadao/huangrong";
    if (diff > 0 && state && state.milestones["黄药师"]) return;
    if (this.find_obj_bypath(path)) return;
    const npc = NPC.CLONE(path);
    if (npc) this.item_changed(npc, true);
};
this.add_action("ask_box", "询问石匣", function (me) {
    if ((Number(this.query_temp(me, "diff", 0)) || 0) > 0) return me.notify("困难路线需要击败黄药师。");
    if (!this.query_temp(me, "fb/taohuadao/maze_first_done", 0)) return me.notify("你还没有走出第一遍桃花阵。");
    if (this.query_temp(me, "fb/taohuadao/need_box", 0)) return me.notify("黄蓉已经请你重返海滩，再走一次桃花阵寻找山洞石匣。");
    this.grant_fb_milestone(me, "石匣线索", 10);
    this.set_temp(me, "fb/taohuadao/need_box", 1);
    me.notify("黄蓉请你返回海滩，再走一次桃花阵。阵图变化后会多出一条通往山洞的路。");
});
this.add_action("deliver", "交付石匣", function (me) {
    if ((Number(this.query_temp(me, "diff", 0)) || 0) > 0) return me.notify("困难路线没有石匣任务。");
    if (this.query_temp(me, "fb/taohuadao/delivered", 0)) return me.notify("石匣已经交给黄蓉。");
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["周伯通石匣"]) return me.notify("你还没有从周伯通手中取得石匣。");
    this.set_temp(me, "fb/taohuadao/delivered", 1);
    this.grant_fb_milestone(me, "交付黄蓉", 15);
    me.notify("黄蓉收下石匣，桃花岛机关全部闭合。现在可以完成副本。");
});
