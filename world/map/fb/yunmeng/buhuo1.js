this.inherits(ROOM);
this.name = "补火一";
this.desc = "洪荒古泽深处的火毒越来越重，额外火龙守在前方。";
this.exits = { south: "fb/yunmeng/honghuang", north: "fb/yunmeng/buhuo2" };
this.set_npc("fb/yunmeng/buhuo", 1);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/buhuo")) {
        me.notify("额外火龙尚未击败。\n");
        return false;
    }
};
