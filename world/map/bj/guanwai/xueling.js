this.inherits(ROOM);
this.name = "雪岭";
this.desc = "山势渐高，风雪更急，几只金雕在枯树顶上盘旋。";
this.exits = { "south": "bj/guanwai/xuelin", "north": "bj/guanwai/shanao" };
this.set_npc(["bj/guanwai/diao", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("bj/guanwai/diao")) {
        me.notify("金雕盘旋俯冲，逼得你无法穿过雪岭。");
        return false;
    }
}
