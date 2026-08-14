this.inherits(ROOM);
this.name = "星宿海";
this.desc = "狮吼子守着通往日月洞的道路。";
this.exits = { south: "fb/xingxiu/fork", north: "fb/xingxiu/ridong" };
this.set_npc("fb/xingxiu/shihouzi");
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/xingxiu/shihouzi")) { me.notify("狮吼子还守着日月洞。"); return false; } };

