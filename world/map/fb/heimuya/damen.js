this.inherits(ROOM);
this.name = "黑木崖大门";
this.desc = "杨莲亭守在大门前。";
this.exits = { west: "fb/heimuya/diaolan3", east: "fb/heimuya/yang1" };
this.set_npc("fb/heimuya/yanglianting1");
this.on_leave = function (me, dir) { if (dir === "east" && this.find_obj_bypath("fb/heimuya/yanglianting1")) { me.notify("杨莲亭挡住了大门后的通路。"); return false; } };
