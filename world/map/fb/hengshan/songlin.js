this.inherits(ROOM);
this.name = "松林";
this.desc = "松林中黑影闪动，几名黑衣人正往藏经阁方向潜去。";
this.exits = { "south": "fb/hengshan/shanmen", "north": "fb/hengshan/cangjing" };
this.set_npc(["fb/hengshan/heiyiren", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/hengshan/heiyiren")) {
        me.notify("黑衣人缠住你，不让你赶往藏经阁。");
        return false;
    }
}
