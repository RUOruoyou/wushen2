this.inherits(ROOM);
this.name = "封禅台";
this.desc = "封禅台上寒风猎猎，左冷禅的身影在殿门后若隐若现。";
this.exits = { south: "fb/songshan/taibao4", north: "fb/songshan/mengzhudian" };
this.set_npc("fb/songshan/zuolengchan");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/songshan/zuolengchan")) {
        me.notify("左冷禅尚未被击败，盟主殿的大门紧闭。\n");
        return false;
    }
};
