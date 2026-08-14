this.inherits(ROOM);
this.name = "拦僧道";
this.desc = "三名拦路僧守住通向铜殿的窄道，必须逐一实际击败。";
this.exits = { northwest: "fb/jingnian/baishi", east: "fb/jingnian/tongdian" };

this.spawn_blocking_monks = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王") return;
    const defeated = this.query_temp(me, "fb/jingnian/block_monk", 0) || 0;
    let current = this.count_jingnian_npcs("fb/jingnian/lanluseng");
    const needed = Math.max(0, 3 - defeated);
    while (current < needed) {
        const npc = NPC.CLONE("fb/jingnian/lanluseng");
        if (!npc) break;
        this.apply_fb_spawn_difficulty(me, npc);
        this.item_changed(npc, true);
        current++;
    }
};

this.on_enter = function (me) {
    this.spawn_blocking_monks(me);
};

this.on_leave = function (me, dir) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王") {
        me.notify("只有邪王路线进入拦僧道。");
        return false;
    }
    if (dir === "east" && (this.query_temp(me, "fb/jingnian/block_monk", 0) || 0) < 3) {
        me.notify("三名拦路僧尚未全部退下。");
        return false;
    }
};
this.register_jingnian_status_action();
