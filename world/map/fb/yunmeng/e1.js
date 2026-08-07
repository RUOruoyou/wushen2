this.inherits(ROOM);
this.name = "鳄群一";
this.desc = "第一片浅滩有一只巨鳄堵住去路。";
this.exits = { south: "fb/yunmeng/rukou", north: "fb/yunmeng/e2" };
this.set_npc("fb/yunmeng/eyu", 1);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/eyu")) {
        me.notify("巨鳄尚未退去。\n");
        return false;
    }
};
