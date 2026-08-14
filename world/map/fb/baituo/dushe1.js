this.inherits(ROOM);
this.name = "蛇路一";
this.desc = "第一条毒蛇盘在石阶上。";
this.exits = { west: "fb/baituo/yaofang", east: "fb/baituo/dushe2" };
this.set_npc("fb/baituo/dushe1");
this.on_leave = function (me, dir) { if (dir === "east" && this.find_obj_bypath("fb/baituo/dushe1")) { me.notify("毒蛇挡住了蛇路。"); return false; } };

