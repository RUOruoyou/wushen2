ROOM.prototype.query_jingnian_next_stage = function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    const state = this.query_fb_state(me);
    const milestones = state ? state.milestones : {};
    if (!route) return "在正门选择本次路线";
    if (state && state.failed) return "本路线已经失败，请离开副本后重新开始";

    if (route === "盗帅") {
        if (!milestones["崖底三人组"]) return "前往崖底击败三人组";
        if (!milestones["轻功跳跃"]) return "在崖底以四千轻功跳上钟楼";
        if (!milestones["推开铜殿"]) return "从钟楼进入铜殿并以九千臂力推门";
        if (!milestones["五僧"]) return "击败铜殿五僧";
        if (!milestones["和氏璧"]) return "在铜殿取得临时和氏璧";
        if (!milestones["长生门"]) return "返回钟楼跳入长生门";
    }
    if (route === "僧王") {
        const exits = this.query_temp(me, "fb/jingnian/forced_exit", 0) || 0;
        if (!milestones["三次退出"]) return "在主殿继续触发强制退出（当前 " + exits + "/4）";
        if (!milestones["白石阶段"]) return "从主殿进入白石广场";
        if (!milestones["黑影赴铜殿"]) return "进入钟楼等待黑影赴铜殿";
        if (!milestones["老徐"]) return "从钟楼进入铜殿击败老徐";
        if (!milestones["和氏璧"]) return "确认僧王状态与临时和氏璧";
        if (!milestones["长生门"]) return "返回钟楼跳入长生门";
    }
    if (route === "少帅") {
        if (!milestones["入寺"]) return "进入净念禅宗主殿";
        if (!milestones["阿朱面具"]) return "取得并使用阿朱面具";
        if (!this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0)) return "进入钟楼查看后山黑影";
        if (!milestones["寇仲与伪装"]) return "前往后山诱出寇仲并完成伪装";
        if (!milestones["老徐归来"]) return "在后山等候老徐归来";
        if (!milestones["钟楼突破"]) return "回到白石广场后突破进入钟楼";
        if (!milestones["长生门"]) return "从钟楼跳入长生门";
    }
    if (route === "邪王") {
        if (!milestones["主殿抗杀"]) return "在主殿扛住护殿僧围攻并进入白石广场";
        if (!milestones["昏迷突破"]) return "在白石广场昏迷指定和尚";
        const monks = this.query_temp(me, "fb/jingnian/block_monk", 0) || 0;
        if (!milestones["拦路僧"]) return "在拦僧道击败三名拦路僧（当前 " + monks + "/3）";
        if (!milestones["推开铜殿"]) return "以一万臂力推开铜殿";
        if (!milestones["五僧"]) return "击败铜殿五僧";
        if (!milestones["和氏璧"]) return "取得临时和氏璧";
        if (!milestones["邪王剧情"]) return "在铜殿完成邪王剧情";
    }
    if (route === "困难僧王") {
        if (!milestones["入寺"]) return "进入净念禅宗主殿";
        if (!milestones["老徐"]) return "在白石广场击败老徐";
        if (!milestones["进入钟楼"]) return "从白石广场进入钟楼";
        if (!milestones["拦路天僧"]) return "击败钟楼拦路天僧";
        if (!milestones["长生门"]) return "从钟楼跳入长生门";
    }
    return "本路线已经完成";
};

ROOM.prototype.register_jingnian_status_action = function () {
    this.add_action("status", "查看阶段", function (me) {
        const route = this.query_temp(me, "fb/jingnian/route", 0);
        const state = this.query_fb_state(me);
        const hasHeShiBi = Boolean(this.query_temp(me, "fb/jingnian/heshibi", 0));
        me.notify("路线：" + (route || "未选择")
            + "；完成度：" + (state ? state.score : 0)
            + "；临时和氏璧：" + (hasHeShiBi ? "已取得" : "未取得")
            + "；下一步：" + this.query_jingnian_next_stage(me) + "。");
    });
};

ROOM.prototype.take_jingnian_mask = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return me.notify("只有少帅路线需要阿朱面具。");
    if (this.query_temp(me, "fb/jingnian/azhu_mask", 0)) return me.notify("阿朱面具已经在本实例中备好。");
    this.set_temp(me, "fb/jingnian/azhu_mask", 1);
    me.notify("你取得了只在本副本实例中使用的阿朱面具。");
};

ROOM.prototype.use_jingnian_mask = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return me.notify("当前不是少帅路线。");
    if (!this.query_temp(me, "fb/jingnian/azhu_mask", 0)) return me.notify("你还没有阿朱面具。");
    if (this.query_temp(me, "fb/jingnian/mask_used", 0)) return me.notify("你已经戴上阿朱面具。");
    this.set_temp(me, "fb/jingnian/mask_used", 1);
    this.grant_fb_milestone(me, "阿朱面具", 10);
    me.notify("你戴上阿朱面具，容貌足以诱出寇仲。");
};

ROOM.prototype.spawn_jingnian_kouzhong = function (me) {
    if (this.query_temp(me, "fb/jingnian/kouzhong_dead", 0)) return null;
    const existing = this.find_obj_bypath("fb/jingnian/kouzhong");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/jingnian/kouzhong");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    return npc;
};

ROOM.prototype.lure_jingnian_kouzhong = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return me.notify("当前不是少帅路线。");
    if (!this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0)) return me.notify("先在钟楼看清黑影逃向后山的方向。");
    if (!this.query_temp(me, "fb/jingnian/mask_used", 0)) return me.notify("先使用阿朱面具。");
    if (this.query_temp(me, "fb/jingnian/kouzhong_dead", 0)) return me.notify("寇仲已经被击败。");
    if (this.find_obj_bypath("fb/jingnian/kouzhong")) return me.notify("寇仲已经被诱出。");
    if (!this.spawn_jingnian_kouzhong(me)) return me.notify("寇仲暂未现身，请稍后重试。");
    this.set_temp(me, "fb/jingnian/kouzhong_started", 1);
    me.notify("寇仲被诱到后山，击败他后才能完成伪装。");
};

ROOM.prototype.complete_jingnian_disguise = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return me.notify("当前不是少帅路线。");
    if (!this.query_temp(me, "fb/jingnian/kouzhong_dead", 0)) return me.notify("寇仲尚未被击败。");
    if (this.query_temp(me, "fb/jingnian/disguise", 0)) return me.notify("伪装阶段已经完成。");
    this.set_temp(me, "fb/jingnian/disguise", 1);
    this.grant_fb_milestone(me, "寇仲与伪装", 25);
    me.notify("你换上寇仲的身份，成功完成伪装。");
};

ROOM.prototype.receive_jingnian_heshibi = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return me.notify("当前路线不需要等候老徐。");
    if (!this.query_temp(me, "fb/jingnian/disguise", 0)) return me.notify("少帅伪装阶段尚未完成。");
    if (this.query_temp(me, "fb/jingnian/laoxu_return", 0)) return me.notify("老徐已经归来。");
    this.set_temp(me, "fb/jingnian/laoxu_return", 1);
    this.set_temp(me, "fb/jingnian/heshibi", 1);
    this.grant_fb_milestone(me, "老徐归来", 15);
    me.notify("老徐归来并留下临时和氏璧，你可以返回白石广场。");
};

ROOM.prototype.remove_jingnian_npcs = function (path) {
    if (!this.items) return;
    for (const item of this.items.slice()) {
        if (item && item.path === path) this.item_changed(item, false);
    }
};

ROOM.prototype.count_jingnian_npcs = function (path) {
    if (!this.items) return 0;
    return this.items.filter(item => item && item.path === path).length;
};
