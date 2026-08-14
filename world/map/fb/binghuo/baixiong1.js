this.inherits(ROOM);
this.name = "丛林浅滩";
this.desc = "第一只白熊堵住了丛林路。";
this.exits = { west: "fb/binghuo/central", north: "fb/binghuo/baixiong2" };
this.set_npc("fb/binghuo/baixiong1");
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/binghuo/baixiong1")) { me.notify("白熊还在咆哮。"); return false; } };

