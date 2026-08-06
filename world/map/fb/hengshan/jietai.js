this.inherits(ROOM);
this.name = "戒台";
this.desc = "戒台前青石平整，定逸师太持掌而立，要试试来人是否真有护经之力。";
this.exits = { "south": "fb/hengshan/huilang", "north": "fb/hengshan/baiyunan" };
this.set_npc("fb/hengshan/dingyi");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/hengshan/dingyi")) {
        me.notify("定逸师太拦住去路：先接贫尼几掌。");
        return false;
    }
}
