this.inherits(ROOM);
this.name = "花月奴处";
this.desc = "花月奴挡在两组宫女之前。";
this.exits = { south: "fb/yihuagong/huajing", north: "fb/yihuagong/gongnu1" };
this.set_npc("fb/yihuagong/huayuenu");
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/yihuagong/huayuenu")) { me.notify("花月奴尚未退开。"); return false; } };
