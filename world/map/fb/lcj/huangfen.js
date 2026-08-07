this.inherits(ROOM);
this.name = "荒坟";
this.desc = "荒坟前菊影萧疏，冷风卷起枯叶。一个衣冠楚楚的江湖名宿立在坟前，目光闪烁不定。";
this.exits = { "south": "fb/lcj/dilao", "north": "fb/lcj/xuegu" };
this.set_npc("fb/lcj/huatiegan");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/lcj/huatiegan")) {
        me.notify("花铁干脸色一沉，挡住你前往雪谷的方向。");
        return false;
    }
}
