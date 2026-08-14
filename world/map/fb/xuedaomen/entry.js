this.inherits(ROOM);
this.name = "血刀门入口";
this.desc = "山口通往血刀门山洞，四名落花流水会依次触发老祖转移。";
this.exits = { north: "fb/xuedaomen/shandong" };
this.set_npc(["fb/xuedaomen/dizi", 2]);
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/xuedaomen/dizi")) { me.notify("血刀门弟子挡住了山洞入口。"); return false; } };
