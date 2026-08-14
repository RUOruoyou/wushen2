this.inherits(ROOM);
this.name = "邀月宫";
this.desc = "邀月宫主立在花影中。";
this.exits = { south: "fb/yihuagong/gongnu2", east: "fb/yihuagong/lianxing" };
this.set_npc("fb/yihuagong/yaoyue");
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1 || !this.owner) return;
    const base = ROOM.Get("fb/yihuagong/lianxing");
    const source = base && base.copy_rooms && base.copy_rooms[this.owner];
    const npc = source && source.find_obj_bypath("fb/yihuagong/lianxing");
    if (npc) {
        source.item_changed(npc, false);
        this.item_changed(npc, true);
        me.send_room("怜星赶来与邀月并肩，宫中杀机骤起。");
    }
};
this.on_leave = function (me, dir) {
    if (dir !== "east") return;
    if (this.find_obj_bypath("fb/yihuagong/yaoyue") || this.find_obj_bypath("fb/yihuagong/lianxing")) {
        me.notify((this.query_temp(me, "diff", 0) || 0) === 1 ? "两位宫主仍在联手阻拦。" : "邀月仍在宫中。");
        return false;
    }
};
