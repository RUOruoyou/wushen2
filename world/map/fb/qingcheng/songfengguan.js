this.inherits(ROOM);
this.name = "松风观";
this.desc = "松风观内香烟缭绕，于人豪横剑守在正殿门前，神色阴沉。";
this.exits = { "south": "fb/qingcheng/jiguanlang", "north": "fb/qingcheng/houtang" };
this.set_npc("fb/qingcheng/yu");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/qingcheng/yu")) {
        me.notify("于人豪横剑拦住后堂。");
        return false;
    }
}
