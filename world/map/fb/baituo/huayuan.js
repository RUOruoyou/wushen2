this.inherits(ROOM);
this.name = "白驼花园";
this.desc = "花园中央站着欧阳锋和白衣少女。";
this.exits = { east: "fb/baituo/liangongfang", north: "fb/baituo/huayuan2" };
this.set_npc("fb/baituo/ouyangfeng", "fb/baituo/baiyushaonu");
this.on_leave = function (me, dir) {
    if (dir === "north" && (this.find_obj_bypath("fb/baituo/ouyangfeng") || this.find_obj_bypath("fb/baituo/baiyushaonu"))) {
        me.notify("花园中的主事者还没有退开。");
        return false;
    }
};

