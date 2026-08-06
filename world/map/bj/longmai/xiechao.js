this.inherits(ROOM);
this.name = "蝎巢";
this.desc = "这里碎石堆积，毒蝎藏在石缝中，尾钩泛着幽蓝寒光。";
this.exits = { "west": "bj/longmai/yongdao", "north": "bj/longmai/shimen" };
this.set_npc(["bj/lm/xiezi", 3]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("bj/lm/xiezi")) {
        me.notify("石甲蝎密密麻麻围住石门，你暂时过不去。");
        return false;
    }
}
