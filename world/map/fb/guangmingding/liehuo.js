this.inherits(ROOM);
this.name = "烈火旗";
this.desc = "辛然率明教守众围住了昆仑援军。";
this.exits = { west: "fb/guangmingding/lianwu", east: "fb/guangmingding/hongshui" };
this.set_npc("fb/guangmingding/xinran", ["fb/guangmingding/menpai_dizi#kunlun", 4], ["fb/guangmingding/mingjiao_dizi", 4]);
this.on_enter = function (me) {
    this.parent.start_order_battle(this, me, "kunlun", "fb/guangmingding/menpai_dizi#kunlun");
};
this.on_leave = function (me, dir) { if (dir === "east" && this.find_obj_bypath("fb/guangmingding/xinran")) { me.notify("辛然仍守着烈火旗。"); return false; } };
