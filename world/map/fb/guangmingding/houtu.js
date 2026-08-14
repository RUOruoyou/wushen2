this.inherits(ROOM);
this.name = "厚土旗";
this.desc = "颜垣率明教守众围住了华山援军。";
this.exits = { east: "fb/guangmingding/ding", west: "fb/guangmingding/jumu" };
this.set_npc("fb/guangmingding/yanyuan", ["fb/guangmingding/menpai_dizi#huashan", 4], ["fb/guangmingding/mingjiao_dizi", 4]);
this.on_enter = function (me) {
    this.parent.start_order_battle(this, me, "huashan", "fb/guangmingding/menpai_dizi#huashan");
};
this.on_leave = function (me, dir) { if (dir === "west" && this.find_obj_bypath("fb/guangmingding/yanyuan")) { me.notify("颜垣仍守着厚土旗。"); return false; } };
