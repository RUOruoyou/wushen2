this.inherits(ROOM);
this.name = "林间小屋";
this.desc = "周颠率明教守众围住了峨眉援军。";
this.exits = { south: "fb/guangmingding/banshanyao", north: "fb/guangmingding/ding" };
this.set_npc("fb/guangmingding/zhoudian", ["fb/guangmingding/menpai_dizi#emei", 4], ["fb/guangmingding/mingjiao_dizi", 4]);
this.on_enter = function (me) {
    this.parent.start_order_battle(this, me, "emei", "fb/guangmingding/menpai_dizi#emei");
};
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/guangmingding/zhoudian")) { me.notify("周颠还没有让开。"); return false; } };
