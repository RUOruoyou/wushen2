this.inherits(ROOM);
this.name = "风雷堂";
this.desc = "童百熊守在风雷堂。";
this.exits = { west: "fb/heimuya/qinglongtang", east: "fb/heimuya/diaolan1" };
this.set_npc("fb/heimuya/tongbaixiong");
this.on_leave = function (me, dir) { if (dir === "east" && (this.query_temp(me, "diff", 0) || 0) !== 1 && this.find_obj_bypath("fb/heimuya/tongbaixiong")) { me.notify("童百熊挡住了悬崖吊篮。"); return false; } };
