this.inherits(ROOM);
this.name = "第三太保";
this.desc = "第三道关隘上，三名太保结阵而立。";
this.exits = { south: "fb/songshan/taibao2", north: "fb/songshan/taibao4" };
this.set_npc("fb/songshan/taibao3", 3);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/songshan/taibao3")) {
        me.notify("第三波太保还未清空。\n");
        return false;
    }
};
