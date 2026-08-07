this.inherits(ROOM);
this.name = "鳄群二";
this.desc = "泥潭中两只巨鳄同时扑来，必须清理这片水洼。";
this.exits = { south: "fb/yunmeng/e1", north: "fb/yunmeng/e3" };
this.set_npc("fb/yunmeng/eyu", 2);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/eyu")) {
        me.notify("泥潭中的巨鳄还没有清除。\n");
        return false;
    }
};
