this.inherits(ROOM);
this.name = "半山亭";
this.desc = "冷谦率明教守众围住了少林援军。";
this.exits = { south: "fb/guangmingding/entry", north: "fb/guangmingding/banshanyao" };
this.set_npc("fb/guangmingding/lengqian", ["fb/guangmingding/menpai_dizi#shaolin", 4], ["fb/guangmingding/mingjiao_dizi", 4]);
this.on_enter = function (me) {
    this.parent.start_order_battle(this, me, "shaolin", "fb/guangmingding/menpai_dizi#shaolin");
};
this.on_leave = function (me, dir) { if (dir === "north" && this.find_obj_bypath("fb/guangmingding/lengqian")) { me.notify("冷谦还守在亭中。"); return false; } };
