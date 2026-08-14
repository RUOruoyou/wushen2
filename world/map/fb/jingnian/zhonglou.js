this.inherits(ROOM);
this.name = "钟楼";
this.desc = "钟楼连接铜殿、后山与长生门，所有阶段提示都可通过查看阶段重新确认。";
this.exits = {
    south: "fb/jingnian/baishi",
    east: "fb/jingnian/tongdian",
    southwest: "fb/jingnian/houshan",
    north: "fb/jingnian/changsheng"
};

this.spawn_tian_seng = function (me) {
    const state = this.query_fb_state(me);
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "困难僧王"
        || !this.query_temp(me, "fb/jingnian/laoxu_dead", 0)
        || (state && state.milestones["拦路天僧"])) return null;
    const existing = this.find_obj_bypath("fb/jingnian/tian_seng");
    if (existing) return existing;
    const npc = NPC.CLONE("fb/jingnian/tian_seng");
    if (!npc) return null;
    this.apply_fb_spawn_difficulty(me, npc);
    this.item_changed(npc, true);
    if (typeof npc.do_kill === "function") npc.do_kill(me);
    return npc;
};

this.on_enter = function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!route) return me.notify("请先在正门选择路线。");
    if (route === "僧王" && this.query_temp(me, "fb/jingnian/white_stage", 0)
        && !this.query_temp(me, "fb/jingnian/shadow_done", 0)) {
        me.notify("钟楼仍可等到黑影赴铜殿的阶段，使用查看阶段可重新确认。");
    }
    if (route === "少帅" && !this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0)) {
        me.notify("后山方向有黑影闪过，仔细查看后即可追踪。");
    }
    if (route === "困难僧王" && this.query_temp(me, "fb/jingnian/laoxu_dead", 0)) {
        if (!this.query_temp(me, "fb/jingnian/entered_clock", 0)) {
            this.set_temp(me, "fb/jingnian/entered_clock", 1);
            this.grant_fb_milestone(me, "进入钟楼", 10);
        }
        this.spawn_tian_seng(me);
    }
};

this.on_leave = function (me, dir) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!route) {
        me.notify("请先选择路线。");
        return false;
    }
    if (dir === "east") {
        if (route === "盗帅" && this.query_temp(me, "fb/jingnian/jump_done", 0)) return;
        if (route === "僧王" && this.query_temp(me, "fb/jingnian/shadow_done", 0)) return;
        me.notify("当前路线尚未取得进入铜殿的阶段资格。");
        return false;
    }
    if (dir === "southwest") {
        if (route === "少帅" && this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0)) return;
        me.notify("当前路线不能从钟楼转入后山。");
        return false;
    }
    if (dir === "north") {
        const state = this.query_fb_state(me);
        if (!state || !state.milestones["长生门"]) {
            me.notify("你还没有完成当前路线的钟楼阶段。");
            return false;
        }
    }
};

this.add_action("wait_shadow", "等待黑影", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "僧王") return me.notify("只有僧王路线需要等待黑影。");
    if (!this.query_temp(me, "fb/jingnian/white_stage", 0)) return me.notify("白石阶段尚未完成。");
    if (this.query_temp(me, "fb/jingnian/shadow_done", 0)) return me.notify("黑影赴铜殿阶段已经完成。");
    this.set_temp(me, "fb/jingnian/shadow_done", 1);
    this.grant_fb_milestone(me, "黑影赴铜殿", 10);
    me.notify("你看清黑影扑向铜殿，向东即可追上老徐；目标缺失时重进铜殿会恢复。");
});

this.add_action("watch_houshan", "查看后山黑影", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return me.notify("当前路线不需要追踪后山黑影。");
    if (this.query_temp(me, "fb/jingnian/shaoshuai_hint", 0)) return me.notify("后山黑影的方向已经记下。");
    this.set_temp(me, "fb/jingnian/shaoshuai_hint", 1);
    me.notify("你看清黑影逃向后山，错过文字后仍可通过查看阶段确认方向。");
});

this.add_action("wait_laoxu", "等候老徐", function (me) {
    this.receive_jingnian_heshibi(me);
});

// 保留旧流程动作名；新拓扑中的邪王剧情应在铜殿原地完成。
this.add_action("xiewang", "完成邪王剧情", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王") return me.notify("当前不是邪王路线。");
    const state = this.query_fb_state(me);
    const required = ["主殿抗杀", "昏迷突破", "拦路僧", "推开铜殿", "五僧", "和氏璧"];
    if (!state || required.some(key => !state.milestones[key])) return me.notify("铜殿阶段尚未完成。");
    if (this.query_temp(me, "fb/jingnian/xiewang_done", 0)) return me.notify("邪王剧情已经完成。");
    this.set_temp(me, "fb/jingnian/xiewang_done", 1);
    this.grant_fb_milestone(me, "邪王剧情", 15);
    me.notify("邪王剧情已经完成。");
});

this.add_action("jump", "跳入长生门", function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    const state = this.query_fb_state(me);
    if (!state || !route) return me.notify("路线尚未锁定。");
    if (route === "邪王") return me.notify("邪王路线在铜殿原地完成，不进入长生门。");
    if (route === "盗帅" && ["崖底三人组", "轻功跳跃", "推开铜殿", "五僧", "和氏璧"].some(key => !state.milestones[key])) return me.notify("盗帅路线阶段尚未完成。");
    if (route === "僧王" && ["三次退出", "白石阶段", "黑影赴铜殿", "老徐", "和氏璧"].some(key => !state.milestones[key])) return me.notify("僧王路线阶段尚未完成。");
    if (route === "少帅" && ["入寺", "阿朱面具", "寇仲与伪装", "老徐归来", "钟楼突破"].some(key => !state.milestones[key])) return me.notify("少帅路线阶段尚未完成。");
    if (route === "困难僧王" && ["入寺", "老徐", "进入钟楼", "拦路天僧"].some(key => !state.milestones[key])) return me.notify("困难僧王路线阶段尚未完成。");
    if (state.milestones["长生门"]) return me.notify("你已经跳入长生门。");
    this.set_temp(me, "fb/jingnian/ready_jump", 1);
    this.grant_fb_milestone(me, "长生门", 20);
    me.notify("你从钟楼跃入长生门，净念禅宗路线完成。");
});
this.register_jingnian_status_action();
