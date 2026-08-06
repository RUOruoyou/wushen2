this.inherits(ROOM);
this.name = "雪林";
this.desc = "雪林里积雪没膝，树影间不时传来猛兽低吼。";
this.exits = { "south": "bj/guanwai/matou", "north": "bj/guanwai/xueling" };
this.set_npc("bj/guanwai/hu", "bj/guanwai/diao");
this.on_leave = function (me, dir) {
    if (dir == "north" && (this.find_obj_bypath("bj/guanwai/hu") || this.find_obj_bypath("bj/guanwai/diao"))) {
        me.notify("猛兽在雪林中扑击，你没法继续北上。");
        return false;
    }
}
