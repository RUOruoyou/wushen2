this.inherits(ROOM);
this.name = "第二组宫女";
this.desc = "第二组宫女把守邀月宫和怜星宫。";
this.exits = { south: "fb/yihuagong/gongnu1", north: "fb/yihuagong/yaoyue" };
this.set_npc(["fb/yihuagong/gongnu2", 2]);
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/yihuagong/gongnu2")) { me.notify("第二组宫女尚未退开。"); return false; } };

