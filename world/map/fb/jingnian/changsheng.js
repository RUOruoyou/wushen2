this.inherits(ROOM);
this.name = "长生门";
this.desc = "钟楼下方的长生门是盗帅、僧王、少帅与困难僧王路线的终点。";
this.exits = { south: "fb/jingnian/zhonglou" };
this.on_enter = function (me) {
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["长生门"]) me.notify("你尚未完成跳入长生门的路线动作。");
};
this.register_jingnian_status_action();
