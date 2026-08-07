this.inherits(ROOM);
this.name = "万府";
this.desc = "万府厅中灯火通明，墙上挂着旧日剑谱。万震山端坐堂上，神色阴沉，显然早有准备。";
this.exits = { "south": "fb/lcj/jingzhou", "north": "fb/lcj/dilao" };
this.set_npc("fb/lcj/wanzhenshan");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/lcj/wanzhenshan")) {
        me.notify("万震山冷笑一声，挡住了通往大牢的去路。");
        return false;
    }
}
