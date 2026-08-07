this.inherits(ROOM);
this.name = "天宁寺";
this.desc = "天宁寺佛殿沉寂无声，尘封多年的机关暗藏其间。殿后石门半掩，隐约透出宝光。";
this.exits = { "south": "fb/lcj/xuegu", "north": "fb/lcj/baoku" };
this.set_npc(["fb/lcj/baokuweishi", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/lcj/baokuweishi")) {
        me.notify("宝库守卫守住石门，你一时无法进入宝库。");
        return false;
    }
}
