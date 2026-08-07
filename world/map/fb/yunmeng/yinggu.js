this.inherits(ROOM);
this.name = "瑛姑方向";
this.desc = "瑛姑方向的泥滩里又有两只巨鳄，漏掉它们会影响副本进度。";
this.exits = { south: "fb/yunmeng/e3", north: "fb/yunmeng/huolong1" };
this.set_npc("fb/yunmeng/eyu_yinggu", 2);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/eyu_yinggu")) {
        me.notify("瑛姑方向的两只巨鳄还未击杀。\n");
        return false;
    }
};
