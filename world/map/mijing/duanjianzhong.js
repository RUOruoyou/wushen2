this.inherits(ROOM);
this.name = "断剑台";
this.desc = "断剑插满了灰白色的荒土，冢心的剑气凝成一具具断剑残魂。这里没有退路，只有击破残魂，才能从归墟裂隙中脱身。";
this.exits = {
    north: "mijing/zangfengpo",
    east: "mijing/canrenlin",
    south: "mijing/xijianchi",
    west: "mijing/wumingzhong"
};
this.add_action("mijing_over", "结束挑战", function (me) {
    const task = TASK.GET("duanjianzhong");
    return task && task.leave(me);
});
this.on_enter = function (obj) {
    const task = TASK.GET("duanjianzhong");
    task && task.on_enter_room(obj);
};
this.on_relogin = function (obj) {
    const task = TASK.GET("duanjianzhong");
    task && task.restore(obj);
};
this.on_leave = function (me, dir) {
    if (!me || !me.is_player) return true;
    const task = TASK.GET("duanjianzhong");
    return !task || task.can_leave(me, dir);
};
