this.inherits(ROOM);
this.name = "第二太保";
this.desc = "第二道关隘上，两名太保一左一右封住山路。";
this.exits = { south: "fb/songshan/taibao1", north: "fb/songshan/taibao3" };
this.set_npc("fb/songshan/taibao2", 2);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/songshan/taibao2")) {
        me.notify("第二波太保仍在守关。\n");
        return false;
    }
};
