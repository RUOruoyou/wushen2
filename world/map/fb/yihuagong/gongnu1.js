this.inherits(ROOM);
this.name = "第一组宫女";
this.desc = "宫女结阵守在花径中央。";
this.exits = { south: "fb/yihuagong/huaynu", north: "fb/yihuagong/gongnu2" };
this.set_npc(["fb/yihuagong/gongnu1", 2]);
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/yihuagong/gongnu1")) { me.notify("第一组宫女仍在结阵。"); return false; } };

