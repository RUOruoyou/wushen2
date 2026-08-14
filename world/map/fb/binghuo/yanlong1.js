this.inherits(ROOM);
this.name = "炎龙浅滩";
this.desc = "单炎龙盘在火山脚下。";
this.exits = { east: "fb/binghuo/central", north: "fb/binghuo/yanlong2" };
this.set_npc("fb/binghuo/yanlong1");
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/binghuo/yanlong1")) { me.notify("炎龙挡住了火山路。"); return false; } };

