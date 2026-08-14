this.inherits(ROOM);
this.name = "刀皇殿";
this.desc = "刀皇以两道元神挡在蚩尤殿之前。";
this.exits = { south: "fb/zhanshendian/souls", north: "fb/zhanshendian/chiyou_room" };
this.set_npc("fb/zhanshendian/daohuang");
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1) return;
    if (this.query_temp(me, "fb/zhanshendian/daohuang_done", 0) || this.find_obj_bypath("fb/zhanshendian/daohuang")) return;
    const npc = NPC.CLONE("fb/zhanshendian/daohuang");
    if (!npc) return;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true, this.query_temp(me, "fb/zhanshendian/daohuang_life", 0) ? "刀皇的第二道元神重新凝聚。" : "刀皇挡住了通往蚩尤殿的道路。");
};
this.on_leave = function (me, dir) {
    if (dir === "north" && !this.query_temp(me, "fb/zhanshendian/daohuang_done", 0)) {
        me.notify("刀皇的两道元神尚未全部击破。");
        return false;
    }
};
