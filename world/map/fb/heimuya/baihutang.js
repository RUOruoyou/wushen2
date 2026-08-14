this.inherits(ROOM);
this.name = "白虎堂";
this.desc = "上官云守在白虎堂。";
this.exits = { south: "fb/heimuya/entry", east: "fb/heimuya/qinglongtang" };
this.set_npc("fb/heimuya/shangguanyun");
this.on_leave = function (me, dir) { if (dir === "east" && (this.query_temp(me, "diff", 0) || 0) !== 1 && this.find_obj_bypath("fb/heimuya/shangguanyun")) { me.notify("上官云还守着白虎堂。"); return false; } };
