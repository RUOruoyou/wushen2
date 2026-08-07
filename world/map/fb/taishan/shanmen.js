this.inherits(ROOM);
this.name = "泰山山门";
this.desc = "泰山山门前云气缭绕，陡峭山道一直向上。登山需有足够的轻功根基。";
this.exits = { north: "fb/taishan/shandao" };
this.on_leave = function (me, dir) {
    if (dir === "north" && me.query_skill("dodge", 0) < 801) {
        me.notify("山道陡峭，你的轻功还不足以登上泰山。需要特殊轻功达到801级。\n");
        return false;
    }
};
