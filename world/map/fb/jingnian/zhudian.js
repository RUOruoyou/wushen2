this.inherits(ROOM);
this.name = "净念禅宗主殿";
this.desc = "主殿佛灯森然，僧王路线会反复被送回殿前，邪王路线则要扛住护殿僧围攻。";
this.exits = { south: "fb/jingnian/entry", north: "fb/jingnian/baishi" };

this.spawn_xiewang_guards = function (me) {
    const state = this.query_fb_state(me);
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王"
        || (state && state.milestones["主殿抗杀"])) return;
    let count = this.count_jingnian_npcs("fb/jingnian/hudianseng");
    while (count < 2) {
        const npc = NPC.CLONE("fb/jingnian/hudianseng");
        if (!npc) break;
        this.apply_fb_spawn_difficulty(me, npc);
        this.item_changed(npc, true);
        count++;
    }
    if (count === 2) this.set_temp(me, "fb/jingnian/xiewang_guards_ready", 1);
    for (const item of (this.items || [])) {
        if (item && item.path === "fb/jingnian/hudianseng" && typeof item.do_kill === "function") item.do_kill(me);
    }
};

this.on_enter = function (me) {
    this.spawn_xiewang_guards(me);
};

this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!route) {
        me.notify("请先在正门选择路线。");
        return false;
    }
    if (route === "僧王" && (this.query_temp(me, "fb/jingnian/forced_exit", 0) || 0) < 4) {
        me.notify("僧王路线还没有出现第四次强制退出后的新提示。");
        return false;
    }
    if (route === "邪王") {
        if (!this.query_temp(me, "fb/jingnian/xiewang_guards_ready", 0)) {
            me.notify("护殿僧尚未完整现身，请重新进入主殿后再试。");
            return false;
        }
        if ((me.hp || 0) <= 0) {
            me.notify("你没有扛住主殿围攻。");
            return false;
        }
        this.set_temp(me, "fb/jingnian/xiewang_main", 1);
        this.grant_fb_milestone(me, "主殿抗杀", 15);
    }
};

this.add_action("force_exit", "强制退出", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "僧王") return me.notify("只有僧王路线需要反复强制退出。");
    const count = this.query_temp(me, "fb/jingnian/forced_exit", 0) || 0;
    if (count >= 4) return me.notify("第四次退出后的提示已经记下。");
    this.set_temp(me, "fb/jingnian/forced_exit", count + 1);
    if (count + 1 === 4) {
        this.grant_fb_milestone(me, "三次退出", 15);
        me.notify("第四次退出时，黑影指向白石广场，新的路线提示已经记录。");
    } else {
        me.notify("你被寺门强制送回主殿，这是第" + (count + 1) + "次退出。");
    }
});

this.add_action("advance", "推进阶段", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "僧王") return me.notify("当前路线没有可推进的主殿阶段。");
    if ((this.query_temp(me, "fb/jingnian/forced_exit", 0) || 0) < 4) return me.notify("先等到第四次强制退出后的新提示。");
    if (this.query_temp(me, "fb/jingnian/white_stage", 0)) return me.notify("白石阶段已经完成。");
    this.set_temp(me, "fb/jingnian/white_stage", 1);
    this.grant_fb_milestone(me, "白石阶段", 10);
    me.notify("你循着可恢复的提示进入白石广场。");
});

this.add_action("get_mask", "取得阿朱面具", function (me) {
    this.take_jingnian_mask(me);
});
this.add_action("use_mask", "使用阿朱面具", function (me) {
    this.use_jingnian_mask(me);
});
this.register_jingnian_status_action();
