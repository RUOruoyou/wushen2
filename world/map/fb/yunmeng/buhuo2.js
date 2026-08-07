this.inherits(ROOM);
this.name = "补火二";
this.desc = "第二只补路火龙守在洪荒古泽尽头，火毒几乎凝成实质。";
this.exits = { south: "fb/yunmeng/buhuo1", north: "fb/yunmeng/huolongwang" };
this.set_npc("fb/yunmeng/buhuo", 1);
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/yunmeng/buhuo")) {
        me.notify("第二只额外火龙尚未击败。\n");
        return false;
    }
    if (dir === "north" && me.query_temp("fb/yunmeng/missed")) {
        me.remove_temp("fb/yunmeng/missed");
        me.notify("两只补路火龙已经击败，绕过的进度已经补足。\n");
    }
};
