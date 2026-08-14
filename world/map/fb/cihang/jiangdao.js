this.inherits(ROOM);
this.name = "拦江岛";
this.desc = "拦江岛按所选路线依次生成浪翻云、庞斑比试或三命庞斑。";
this.exits = { southwest: "fb/cihang/langlu", southeast: "fb/cihang/qibinglu", north: "fb/cihang/taoyuan" };

this.spawn_pangban = function (me) {
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (route === "国师" && this.query_temp(me, "fb/cihang/pangban_duel_done", 0)) return null;
    if (route !== "国师" && this.query_temp(me, "fb/cihang/pangban_done", 0)) return null;
    const existing = this.find_obj_bypath("fb/cihang/pangban");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/cihang/pangban");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    return npc;
};

this.spawn_langfanyun = function (me) {
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (route === "浪子" && this.query_temp(me, "fb/cihang/langfanyun_done", 0)) return null;
    if (route === "国师" && this.query_temp(me, "fb/cihang/lang_phase", 0)) return null;
    const existing = this.find_obj_bypath("fb/cihang/langfanyun");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/cihang/langfanyun");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    return npc;
};

this.on_enter = function (me) {
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (!route) return me.notify("请先选择慈航路线。");
    if (["浪子", "剑魔"].includes(route) && !this.query_temp(me, "fb/cihang/deliver_done", 0)) return me.notify("遗书阶段尚未完成。");
    if (route === "国师" && !this.query_temp(me, "fb/cihang/watch", 0)) return me.notify("请先完成观战求突破。");
    if (route === "魔师" && !this.query_temp(me, "fb/cihang/longsheng", 0)) return me.notify("请先确认长生资格。");

    if (route === "浪子") {
        if (!this.query_temp(me, "fb/cihang/langfanyun_done", 0)) this.spawn_langfanyun(me);
        else this.spawn_pangban(me);
        return;
    }
    if (route === "国师") {
        if (this.query_temp(me, "fb/cihang/pangban_duel_done", 0)) this.spawn_langfanyun(me);
        else if (this.query_temp(me, "fb/cihang/pangban_duel_started", 0)) this.spawn_pangban(me);
        return;
    }
    const pangban = this.spawn_pangban(me);
    if (route === "魔师" && pangban && !this.query_temp(me, "fb/cihang/island_fight", 0)) {
        this.set_temp(me, "fb/cihang/island_fight", 1);
        this.grant_fb_milestone(me, "拦江岛战斗", 15);
    }
};

this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (route === "浪子" && (!this.query_temp(me, "fb/cihang/langfanyun_done", 0)
        || !this.query_temp(me, "fb/cihang/pangban_done", 0))) {
        me.notify("浪翻云或三命庞斑尚未败退。");
        return false;
    }
    if (route === "国师" && (!this.query_temp(me, "fb/cihang/pangban_duel_done", 0)
        || !this.query_temp(me, "fb/cihang/lang_phase", 0))) {
        me.notify("国师路线的庞斑比试或浪翻云战斗尚未完成。");
        return false;
    }
    if (route === "剑魔" && (!this.query_temp(me, "fb/cihang/pangban_done", 0)
        || !this.query_temp(me, "fb/cihang/sword_demon", 0))) {
        me.notify("剑魔路线的三命庞斑或剑魔阶段尚未完成。");
        return false;
    }
    if (route === "魔师" && !this.query_temp(me, "fb/cihang/pangban_done", 0)) {
        me.notify("魔师路线的三命庞斑尚未完成。");
        return false;
    }
};

this.add_action("duel", "比试庞斑", function (me) {
    if (this.query_temp(me, "fb/cihang/route", 0) !== "国师") return me.notify("只有国师路线需要比试庞斑。");
    if (!this.query_temp(me, "fb/cihang/watch", 0)) return me.notify("先在观云山路完成观战求突破。");
    if (this.query_temp(me, "fb/cihang/pangban_duel_done", 0)) return me.notify("庞斑比试已经完成。");
    if (!this.spawn_pangban(me)) return me.notify("庞斑暂未现身，请稍后重试。");
    this.set_temp(me, "fb/cihang/pangban_duel", 1);
    this.set_temp(me, "fb/cihang/pangban_duel_started", 1);
    me.notify("庞斑现身，这次比试必须实际胜过他才会结算。");
});

// 保留旧动作名；现在只负责恢复浪翻云目标，不再直接授分。
this.add_action("lang_phase", "完成浪翻云阶段", function (me) {
    if (this.query_temp(me, "fb/cihang/route", 0) !== "国师") return me.notify("当前路线没有浪翻云阶段。");
    if (!this.query_temp(me, "fb/cihang/pangban_duel_done", 0)) return me.notify("先实际胜过庞斑。");
    if (this.query_temp(me, "fb/cihang/lang_phase", 0)) return me.notify("浪翻云阶段已经完成。");
    if (!this.spawn_langfanyun(me)) return me.notify("浪翻云暂未现身，请稍后重试。");
    me.notify("浪翻云已经现身，必须实际胜过他才能完成阶段。");
});

this.add_action("sword_demon", "获得剑魔阶段", function (me) {
    if (this.query_temp(me, "fb/cihang/route", 0) !== "剑魔") return me.notify("当前路线没有剑魔阶段。");
    if (!this.query_temp(me, "fb/cihang/pangban_done", 0)) return me.notify("先完成庞斑三命之战。");
    if (this.query_temp(me, "fb/cihang/sword_demon", 0)) return me.notify("剑魔阶段已经完成。");
    this.set_temp(me, "fb/cihang/sword_demon", 1);
    this.grant_fb_milestone(me, "剑魔阶段", 15);
    me.notify("剑魔阶段已经完成，石窟领悟之门打开。");
});
