this.inherits(ROOM);
this.name = "鳄群三";
this.desc = "第三片水泽分出两条路：向东是瑛姑方向，向北通往洪荒古泽。";
this.exits = { south: "fb/yunmeng/e2", east: "fb/yunmeng/yinggu", north: "fb/yunmeng/honghuang" };
this.set_npc("fb/yunmeng/eyu", 2);
this.on_leave = function (me, dir) {
    if (dir === "east" && this.find_obj_bypath("fb/yunmeng/eyu")) {
        me.notify("东侧泥潭的两只巨鳄还未清除。\n");
        return false;
    }
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/eyu")) {
        me.notify("你可以绕往洪荒古泽，但漏掉的瑛姑方向巨鳄会让进度少一段。\n");
        me.set_temp("fb/yunmeng/missed", 1);
    }
};
