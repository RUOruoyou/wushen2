this.inherits(ROOM);
this.name = "荆州城";
this.desc = "荆州城中风声甚紧，街头巷尾都在传万府旧案。一个万家弟子守在路口，似乎不愿外人继续查问。";
this.exits = { "north": "fb/lcj/wanfu" };
this.set_npc("fb/lcj/wangui");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/lcj/wangui")) {
        me.notify("万家弟子横剑拦路，不许你前往万府。");
        return false;
    }
}
