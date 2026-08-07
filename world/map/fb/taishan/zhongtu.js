this.inherits(ROOM);
this.name = "泰山中途";
this.desc = "山势更高，第二名守关者立在云雾之间。若曾被击落，仍需重新走过这段山道。";
this.exits = { south: "fb/taishan/shandao", north: "fb/taishan/shanyao" };
this.set_npc("fb/taishan/shouguan2");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/taishan/shouguan2")) {
        me.notify("第二名守关者挡住了上行之路。\n");
        return false;
    }
};
