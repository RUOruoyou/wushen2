this.inherits(ROOM);
this.name = "前厅";
this.desc = "前厅中兵器架整齐排列，温家长老守在厅内，显然不愿让外人接近后园和石窟。";
this.exits = { "south": "fb/wenfu/damen", "north": "fb/wenfu/pianting", "east": "fb/wenfu/houyuan" };
this.set_npc("fb/wenfu/wenlaoda");
this.on_leave = function (me, dir) {
    if ((dir == "north" || dir == "east") && this.find_obj_bypath("fb/wenfu/wenlaoda")) {
        me.notify("温家长老沉声喝道：温府内院，岂容乱闯！");
        return false;
    }
}
