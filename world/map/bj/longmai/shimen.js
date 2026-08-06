this.inherits(ROOM);
this.name = "石门";
this.desc = "厚重石门半开半掩，门前的披甲俑卫手执锈刀，挡住去路。";
this.exits = { "south": "bj/longmai/xiechao", "north": "bj/longmai/suolongjing" };
this.set_npc("bj/lm/yongwei");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("bj/lm/yongwei")) {
        me.notify("披甲俑卫横刀挡在石门前。");
        return false;
    }
    if (dir == "north" && !me.query_temp("fb/longmai/map")) {
        me.notify("你还没看懂地宫路线，贸然前进恐怕会迷失在地下。");
        return false;
    }
}
