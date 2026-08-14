this.inherits(ROOM);
this.name = "双炎龙路";
this.desc = "两条火舌交错，第二只炎龙守在岩台。";
this.exits = { south: "fb/binghuo/yanlong1", north: "fb/binghuo/yanlongwang" };
this.set_npc("fb/binghuo/yanlong2");
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/binghuo/yanlong2")) { me.notify("第二只炎龙尚未败退。"); return false; } };

