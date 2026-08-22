this.inherits(ROOM);
this.name = "家族工坊";
this.no_fight = true;
this.desc = "家族工坊堆放着矿石、药材和订单材料，生产与交付均由家族任务管理。";
this.exits = { northeast: "home/yuanzi" };
this.add_action("household", "家族经营", function (me) { return me.send(JSON.stringify({ type: "dialog", dialog: "household", data: HOUSEHOLD.view(me) })); });
this.on_enter = function (me) {
    if (me.master) {
        me.actions = [
            { cmd: "dismiss " + me.id, name: "遣散" + me.name }
        ];
        me.master_json = null;
    }
    if (!me || !me.is_player) return;
    if (typeof HOUSEHOLD === "undefined" || !HOUSEHOLD.roomUnlocked || HOUSEHOLD.roomUnlocked(me, this.path)) return;
    me.notify("这里还未修建，需要先扩建住宅。");
    var back = typeof ROOM !== "undefined" && ROOM.Get ? ROOM.Get("home/yuanzi") : null;
    back = back && back.query_copy(this.owner || me.id);
    if (back) me.moveto(back, null, me.name + "退了回来。");
};
this.on_leave = function (me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
};
