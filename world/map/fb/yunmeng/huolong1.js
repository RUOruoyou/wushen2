this.inherits(ROOM);
this.name = "火龙一";
this.desc = "瑛姑方向的深处有一只火龙，鳞片间透着灼热火光。";
this.exits = { south: "fb/yunmeng/yinggu", north: "fb/yunmeng/huolong2" };
this.set_npc("fb/yunmeng/huolong", 1);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/huolong")) {
        me.notify("火龙挡住了沼泽深处的道路。\n");
        return false;
    }
};
