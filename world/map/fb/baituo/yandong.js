this.inherits(ROOM);
this.name = "岩洞";
this.desc = "岩洞深处有一条怪蟒，蛇血和洞后的出口都被它守着。";
this.exits = { west: "fb/baituo/dushe2", east: "fb/baituo/exit" };
this.set_npc("fb/baituo/guamang");
this.on_leave = function (me, dir) { if (dir === "east" && this.find_obj_bypath("fb/baituo/guamang")) { me.notify("怪蟒还没有倒下。"); return false; } };

