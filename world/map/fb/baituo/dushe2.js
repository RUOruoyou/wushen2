this.inherits(ROOM);
this.name = "蛇路二";
this.desc = "第二条毒蛇守着岩洞入口。";
this.exits = { west: "fb/baituo/dushe1", east: "fb/baituo/yandong" };
this.set_npc("fb/baituo/dushe2");
this.on_leave = function (me, dir) { if (dir === "east" && this.find_obj_bypath("fb/baituo/dushe2")) { me.notify("第二条毒蛇仍在吐信。"); return false; } };

