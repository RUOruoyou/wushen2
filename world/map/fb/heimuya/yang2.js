this.inherits(ROOM);
this.name = "杨莲亭二";
this.desc = "杨莲亭在闺房外作最后抵抗。";
this.exits = { west: "fb/heimuya/midao", east: "fb/heimuya/dongfang" };
this.set_npc("fb/heimuya/yanglianting2");
this.on_leave = function (me, dir) { if (dir === "east" && this.find_obj_bypath("fb/heimuya/yanglianting2")) { me.notify("杨莲亭仍守在闺房外。"); return false; } };
