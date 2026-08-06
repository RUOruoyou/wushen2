this.inherits(ROOM);
this.name = "毒雾林";
this.desc = "毒雾林中蛇影游走，树根旁堆着白骨，东侧有一座简陋药棚。";
this.exits = { "south": "fb/wudu/shandao", "north": "fb/wudu/duzhen", "east": "fb/wudu/yaopeng" };
this.set_npc(["fb/wudu/dushe", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/wudu/dushe")) {
        me.notify("毒蛇从雾中窜出，逼得你无法穿过树林。");
        return false;
    }
}
