this.inherits(ROOM);
this.name = "青龙堂";
this.desc = "贾布守在青龙堂。";
this.exits = { west: "fb/heimuya/baihutang", south: "fb/heimuya/entry", east: "fb/heimuya/fengleitang" };
this.set_npc("fb/heimuya/jiabu");
this.on_leave = function (me, dir) { if (dir === "east" && (this.query_temp(me, "diff", 0) || 0) !== 1 && this.find_obj_bypath("fb/heimuya/jiabu")) { me.notify("贾布还没有退开。"); return false; } };
