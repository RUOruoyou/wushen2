this.inherits(ROOM);
this.name = "铜殿";
this.desc = "铜殿五僧守着临时和氏璧；僧王路线则会在黑影提示后于此遭遇老徐。";
this.exits = {
    west: "fb/jingnian/zhonglou",
    south: "fb/jingnian/baishi",
    southwest: "fb/jingnian/lanlu"
};
this.set_npc(["fb/jingnian/monk", 5]);

this.query_strength = function (me) {
    return (me.str || 0) + (me.query_prop ? me.query_prop("str") : 0);
};

this.spawn_normal_laoxu = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "僧王"
        || !this.query_temp(me, "fb/jingnian/shadow_done", 0)
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
    if (route === "僧王") {
        this.remove_jingnian_npcs("fb/jingnian/monk");
        this.spawn_normal_laoxu(me);
    }
};

this.on_leave = function (me, dir) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!["盗帅", "僧王", "邪王"].includes(route)) {
        me.notify("当前路线不从铜殿通行。");
        return false;
    }
    if (route === "僧王") {
        if (dir !== "west") {
            me.notify("僧王路线只能从铜殿返回钟楼。");
            return false;
        }
        if (!this.query_temp(me, "fb/jingnian/laoxu_dead", 0)) {
            me.notify("老徐尚未退下。");
            return false;
        }
        return;
    }
    if (route === "邪王" && dir === "southwest") return;
    if (route === "邪王" && dir !== "southwest") {
        me.notify("邪王路线在铜殿原地完成，不通往钟楼。");
        return false;
    }
    if (dir === "west") {
        if (!this.query_temp(me, "fb/jingnian/push_done", 0)) {
            me.notify("铜殿尚未被推开。");
            return false;
        }
        if (!this.query_temp(me, "fb/jingnian/monks_done", 0)) {
            me.notify("铜殿五僧尚未清理。");
            return false;
        }
        if (!this.query_temp(me, "fb/jingnian/heshibi", 0)) {
            me.notify("临时和氏璧尚未取得。");
            return false;
        }
    }
};

this.add_action("push", "推开铜殿", function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!["盗帅", "邪王"].includes(route)) return me.notify("当前路线不需要推开铜殿。");
    if (this.query_temp(me, "fb/jingnian/push_done", 0)) return me.notify("铜殿已经被推开。");
    const required = route === "邪王" ? 10000 : 9000;
    if (this.query_strength(me) < required) return me.notify("你的臂力不足 " + required + "，无法推开铜殿。");
    if (route === "邪王" && (this.query_temp(me, "fb/jingnian/block_monk", 0) || 0) < 3) return me.notify("先实际击败拦僧道的三名僧人。");
    this.set_temp(me, "fb/jingnian/push_done", 1);
    this.grant_fb_milestone(me, "推开铜殿", 10);
    me.notify("你以臂力推开沉重铜殿。");
});

this.add_action("take_he", "取得和氏璧", function (me) {
    const route = this.query_temp(me, "fb/jingnian/route", 0);
    if (!["盗帅", "邪王"].includes(route)) return me.notify("当前路线的和氏璧由剧情交付。");
    if (!this.query_temp(me, "fb/jingnian/push_done", 0)) return me.notify("铜殿尚未被推开。");
    if (!this.query_temp(me, "fb/jingnian/monks_done", 0)) return me.notify("五僧尚未清理。");
    if (this.query_temp(me, "fb/jingnian/heshibi", 0)) return me.notify("和氏璧已经收好。");
    this.set_temp(me, "fb/jingnian/heshibi", 1);
    this.grant_fb_milestone(me, "和氏璧", route === "邪王" ? 10 : 15);
    me.notify("你取得了只存在于副本实例中的和氏璧。");
});

this.add_action("xiewang", "完成邪王剧情", function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "邪王") return me.notify("当前不是邪王路线。");
    const state = this.query_fb_state(me);
    const required = ["主殿抗杀", "昏迷突破", "拦路僧", "推开铜殿", "五僧", "和氏璧"];
    if (!state || required.some(key => !state.milestones[key])) return me.notify("邪王路线的铜殿前置尚未完成。");
    if (this.query_temp(me, "fb/jingnian/xiewang_done", 0)) return me.notify("邪王剧情已经完成。");
    this.set_temp(me, "fb/jingnian/xiewang_done", 1);
    this.grant_fb_milestone(me, "邪王剧情", 15);
    me.notify("邪王现身取走执念，困难邪王路线在铜殿完成。");
});
this.register_jingnian_status_action();
