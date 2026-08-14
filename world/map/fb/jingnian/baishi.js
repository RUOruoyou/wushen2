this.inherits(ROOM);
this.name = "白石广场";
this.desc = "白石广场分别通向崖底、钟楼、后山、拦僧道和铜殿，各路线只能进入自己的节点。";
this.exits = {
    south: "fb/jingnian/zhudian",
    west: "fb/jingnian/yadi",
    north: "fb/jingnian/zhonglou",
    northwest: "fb/jingnian/houshan",
    southeast: "fb/jingnian/lanlu",
    east: "fb/jingnian/tongdian"
};

this.spawn_xiewang_monk = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王"
        || this.query_temp(me, "fb/jingnian/xiewang_knockout", 0)) return null;
    const existing = this.find_obj_bypath("fb/jingnian/xiaoseng");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/jingnian/xiaoseng");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    if (typeof npc.do_kill === "function") npc.do_kill(me);
    return npc;
};

this.spawn_difficult_laoxu = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "困难僧王"
        || this.query_temp(me, "fb/jingnian/laoxu_dead", 0)) return null;
    const existing = this.find_obj_bypath("fb/jingnian/laoxu");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/jingnian/laoxu");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    if (typeof npc.do_kill === "function") npc.do_kill(me);
    return npc;
};

this.on_enter = function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (route === "僧王" && (this.query_temp(me, "fb/jingnian/forced_exit", 0) || 0) >= 4
        && !this.query_temp(me, "fb/jingnian/white_stage", 0)) {
        this.set_temp(me, "fb/jingnian/white_stage", 1);
        this.grant_fb_milestone(me, "白石阶段", 10);
        me.notify("第四次强制退出后的提示仍然清晰，你进入了白石阶段。");
    }
    if (route === "邪王") this.spawn_xiewang_monk(me);
    if (route === "困难僧王") this.spawn_difficult_laoxu(me);
};

this.on_leave = function (me, dir) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!route && dir !== "south") {
        me.notify("请先在正门选择路线。");
        return false;
    }
    if (dir === "west" && route !== "盗帅") {
        me.notify("只有盗帅路线进入崖底。");
        return false;
    }
    if (dir === "east") {
        if (route !== "盗帅") {
            me.notify("只有盗帅路线从白石广场直入铜殿。");
            return false;
        }
        if (!this.query_temp(me, "fb/jingnian/jump_done", 0)) {
            me.notify("先从崖底跳上钟楼探明铜殿入口。");
            return false;
        }
    }
    if (dir === "northwest") {
        if (route !== "少帅") {
            me.notify("只有少帅路线进入后山。");
            return false;
        }
        if (!this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0)) {
            me.notify("先去钟楼看清黑影逃走的方向。");
            return false;
        }
    }
    if (dir === "southeast") {
        if (route !== "邪王") {
            me.notify("只有邪王路线进入拦僧道。");
            return false;
        }
        if (!this.query_temp(me, "fb/jingnian/xiewang_knockout", 0)) {
            me.notify("先昏迷白石广场的指定和尚。");
            return false;
        }
    }
    if (dir !== "north") return;
    if (route === "僧王" && !this.query_temp(me, "fb/jingnian/white_stage", 0)) {
        me.notify("僧王路线还没有进入白石阶段。");
        return false;
    }
    if (route === "僧王") return;
    if (route === "少帅") {
        const hasHint = this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0);
        if (hasHint && !this.query_temp(me, "fb/jingnian/laoxu_return", 0)) {
            me.notify("少帅路线还没有等到老徐归来。");
            return false;
        }
        if (hasHint && !this.query_temp(me, "fb/jingnian/clock_breakthrough", 0)) {
            this.set_temp(me, "fb/jingnian/clock_breakthrough", 1);
            this.grant_fb_milestone(me, "钟楼突破", 20);
        }
        return;
    }
    if (route === "困难僧王") {
        if (!this.query_temp(me, "fb/jingnian/laoxu_dead", 0)) {
            me.notify("困难僧王路线还没有击败老徐。");
            return false;
        }
        return;
    }
    me.notify("当前路线不从白石广场直接进入钟楼。");
    return false;
};

this.complete_baishi_stage = function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (route === "僧王") {
        if ((this.query_temp(me, "fb/jingnian/forced_exit", 0) || 0) < 4) return me.notify("先等到第四次强制退出后的新提示。");
        if (this.query_temp(me, "fb/jingnian/white_stage", 0)) return me.notify("白石阶段已经完成。");
        this.set_temp(me, "fb/jingnian/white_stage", 1);
        this.grant_fb_milestone(me, "白石阶段", 10);
        return me.notify("白石阶段已经恢复并完成。");
    }
    if (route !== "邪王") return me.notify("当前路线没有可推进的白石阶段。");
    if (this.query_temp(me, "fb/jingnian/xiewang_knockout", 0)) return me.notify("邪王路线的昏迷突破已经完成。");
    const monk = this.find_obj_bypath("fb/jingnian/xiaoseng");
    if (!monk) return me.notify("指定和尚暂未现身，请重新进入白石广场后再试。");
    this.item_changed(monk, false);
    this.set_temp(me, "fb/jingnian/xiewang_knockout", 1);
    this.grant_fb_milestone(me, "昏迷突破", 10);
    me.notify("你昏迷指定和尚，通往拦僧道的路线已经开启。");
};

this.add_action("advance", "推进阶段", function (me) {
    this.complete_baishi_stage(me);
});
this.add_action("knockout", "昏迷和尚", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王") return me.notify("只有邪王路线需要昏迷指定和尚。");
    this.complete_baishi_stage(me);
});
this.add_action("get_mask", "取得阿朱面具", function (me) {
    this.take_jingnian_mask(me);
});
this.add_action("use_mask", "使用阿朱面具", function (me) {
    this.use_jingnian_mask(me);
});
this.add_action("lure", "诱出寇仲", function (me) {
    this.lure_jingnian_kouzhong(me);
});
this.add_action("disguise", "完成伪装", function (me) {
    this.complete_jingnian_disguise(me);
});
this.add_action("block_monks", "击杀拦路僧", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王") return me.notify("当前不是邪王路线。");
    me.notify("拦路僧已移至东南方的拦僧道，必须实际击败三人。");
});
this.add_action("summon_laoxu", "召出老徐", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "困难僧王") return me.notify("只有困难僧王路线在此召出老徐。");
    if (this.query_temp(me, "fb/jingnian/laoxu_dead", 0)) return me.notify("老徐已经被击败。");
    if (!this.spawn_difficult_laoxu(me)) return me.notify("老徐暂未现身，请稍后重试。");
    me.notify("老徐现身白石广场，击败他后才能进入钟楼。");
});
this.register_jingnian_status_action();
