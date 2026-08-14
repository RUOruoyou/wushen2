this.inherits(ROOM);
this.name = "半山腰";
this.desc = "张中率明教守众围住了武当援军。";
this.exits = { south: "fb/guangmingding/banshanting", north: "fb/guangmingding/linjian" };
this.set_npc("fb/guangmingding/zhangzhong", ["fb/guangmingding/menpai_dizi#wudang", 4], ["fb/guangmingding/mingjiao_dizi", 4]);
this.on_enter = function (me) {
    this.parent.start_order_battle(this, me, "wudang", "fb/guangmingding/menpai_dizi#wudang");
};
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/guangmingding/zhangzhong")) { me.notify("张中拦住了上山的路。"); return false; } };
