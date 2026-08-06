this.inherits(ROOM);
this.name = "回雁桥";
this.desc = "回雁桥横跨山涧，两名衡山弟子守桥盘问来人。";
this.exits = { "south": "fb/hengshan2/shanmen", "north": "fb/hengshan2/qintai" };
this.set_npc(["fb/hengshan2/dizi", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/hengshan2/dizi")) {
        me.notify("衡山弟子守住桥头，不让你上琴台。");
        return false;
    }
}
