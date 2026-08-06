this.inherits(ROOM);
this.name = "甬道";
this.desc = "狭长甬道两侧立着披甲石俑，脚步声一响，石俑眼中泛起暗红光芒。";
this.exits = { "up": "bj/longmai/rukou", "east": "bj/longmai/xiechao" };
this.set_npc(["bj/lm/yongwei", 2]);
this.on_leave = function (me, dir) {
    if (dir == "east" && this.find_obj_bypath("bj/lm/yongwei")) {
        me.notify("披甲俑卫踏前一步，锈刀交错封住甬道。");
        return false;
    }
}
