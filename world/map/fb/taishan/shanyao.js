this.inherits(ROOM);
this.name = "泰山山腰";
this.desc = "山腰风声如雷，最后一名守关者守着通往绝顶的石阶。";
this.exits = { south: "fb/taishan/zhongtu", north: "fb/taishan/jueding" };
this.set_npc("fb/taishan/shouguan3");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/taishan/shouguan3")) {
        me.notify("最后一名守关者尚未败退，山顶近在眼前却无法通过。\n");
        return false;
    }
};
