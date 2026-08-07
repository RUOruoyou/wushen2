this.inherits(ROOM);
this.name = "第一太保";
this.desc = "第一道关隘只有一名太保，横剑守在石阶前。";
this.exits = { south: "fb/songshan/shanmen", north: "fb/songshan/taibao2" };
this.set_npc("fb/songshan/taibao1");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/songshan/taibao1")) {
        me.notify("第一太保尚未败退，不能继续上山。\n");
        return false;
    }
};
