this.inherits(ROOM);
this.name = "流云峰";
this.desc = "流云峰上山风极急，一名刘门客守在石阶前，试探你的来意。";
this.exits = { "south": "fb/hengshan2/zhujing", "north": "fb/hengshan2/zhangmenju" };
this.set_npc("fb/hengshan2/liumenke");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/hengshan2/liumenke")) {
        me.notify("刘门客拔剑拦路：先过我这一关。");
        return false;
    }
}
