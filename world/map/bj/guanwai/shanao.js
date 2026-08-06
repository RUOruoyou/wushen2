this.inherits(ROOM);
this.name = "山坳";
this.desc = "山坳里留着巨大的爪印，一头黑熊正挡在雪路中央。";
this.exits = { "south": "bj/guanwai/xueling", "north": "bj/guanwai/yaolu" };
this.set_npc("bj/guanwai/xiong");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("bj/guanwai/xiong")) {
        me.notify("黑熊挡在山坳出口，咆哮着不肯退开。");
        return false;
    }
}
