this.inherits(ROOM);
this.name = "泰山山道";
this.desc = "山门之后云雾渐深，山道直上。";
this.exits = { south: "fb/taishan/shanmen", north: "fb/taishan/zhongtu" };
this.set_npc("fb/taishan/shouguan1");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/taishan/shouguan1")) {
        me.notify("第一名守关弟子尚未败退，不能继续登山。\n");
        return false;
    }
};
