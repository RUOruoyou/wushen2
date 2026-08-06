

this.inherits(ROOM);
this.name = "大道";
this.desc = "这是一条宽敞的大道。全由乱石堆成,显然曾花了不少人力。东面是一个宽阔的练武场, 西边是一片开阔地。";
this.set_npc("bj/shenlong/xu");
this.exits = { "west": "bj/shenlong/kongdi", "east": "bj/shenlong/wuchang" };
this.on_leave = function (me, dir) {
    if (dir == "east" && this.find_obj_bypath("bj/shenlong/xu")) {
        me.notify("许雪亭拦住你，说道：前面不是你能去的地方。");
        return false;
    }
}
