this.inherits(ROOM);
this.name = "家族学堂";
this.no_fight = true;
this.desc = "安静的家族学堂，成员培训和玩家有限的练功房训练都在家族面板中登记。";
this.exits = { west: "home/wuguan", south: "home/yuanzi" };
this.add_action("practice", "练功房训练", function (me) {
    const result = HOUSEHOLD.trainPlayer(me);
    if (!result.ok) return me.notify(result.message);
    return me.notify("训练完成，你获得了" + result.pot + "点潜能。");
});
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
