this.inherits(ROOM);
this.name = "怜星宫";
this.desc = "怜星宫主守着通往床榻机关的暗门。";
this.exits = { west: "fb/yihuagong/yaoyue", east: "fb/yihuagong/chuangta" };
this.set_npc("fb/yihuagong/lianxing");
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1 || !this.owner) return;
    const base = ROOM.Get("fb/yihuagong/yaoyue");
    const source = base && base.copy_rooms && base.copy_rooms[this.owner];
    const npc = source && source.find_obj_bypath("fb/yihuagong/yaoyue");
    if (npc) {
        source.item_changed(npc, false);
        this.item_changed(npc, true);
        me.send_room("邀月追入怜星宫，姐妹联手封住退路。");
    }
};
this.on_leave = function (me, dir) {
    if (dir !== "east") return;
    if (this.find_obj_bypath("fb/yihuagong/lianxing") || this.find_obj_bypath("fb/yihuagong/yaoyue")) {
        me.notify((this.query_temp(me, "diff", 0) || 0) === 1 ? "两位宫主仍在联手阻拦。" : "怜星仍守着暗门。");
        return false;
    }
};
