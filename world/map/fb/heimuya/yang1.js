this.inherits(ROOM);
this.name = "后厅石碗";
this.desc = "后厅石桌上放着一只石碗，转动后可开启密道入口。";
this.exits = { west: "fb/heimuya/damen", east: "fb/heimuya/midao" };
this.add_action("turn_bowl", "转动石碗", function (me) {
    if (this.query_temp(me, "fb/heimuya/bowl", 0)) return me.notify("石碗已经转到机关位置。");
    this.set_temp(me, "fb/heimuya/bowl", 1);
    this.set_temp(me, "fb/heimuya/firebrand", 1);
    me.notify("石碗转动，后厅露出密道，你同时在暗格中找到一枚火折子。");
});
this.on_leave = function (me, dir) { if (dir === "east" && !this.query_temp(me, "fb/heimuya/bowl", 0)) { me.notify("石碗机关尚未开启密道。"); return false; } };
