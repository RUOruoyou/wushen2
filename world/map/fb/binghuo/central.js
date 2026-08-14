this.inherits(ROOM);
this.name = "海边岩石";
this.desc = "西侧火山路，东侧丛林路，北方被冰火岛石洞挡住。";
this.exits = { south: "fb/binghuo/entry", west: "fb/binghuo/yanlong1", east: "fb/binghuo/baixiong1", north: "fb/binghuo/shixun" };
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const state = this.query_fb_state(me);
    const required = ["炎龙一", "炎龙二", "炎龙王", "白熊一", "白熊二"];
    if (!state || required.some(key => !state.milestones[key])) {
        me.notify("火山和丛林的主线尚未清理完。");
        return false;
    }
};
