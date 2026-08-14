this.inherits(ROOM);
this.name = "蚩尤殿";
this.desc = "蚩尤守在踏九重天之前，初次叫杀会发出震殿怒吼。";
this.exits = { south: "fb/zhanshendian/daohuang", north: "fb/zhanshendian/jiuzhong" };
this.set_npc("fb/zhanshendian/chiyou");
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1) return;
    const chiyou = this.find_obj_bypath("fb/zhanshendian/chiyou");
    if (chiyou && typeof chiyou.do_kill === "function") chiyou.do_kill(me);
};
this.on_leave = function (me, dir) {
    if (dir === "north") {
        const state = this.query_fb_state(me);
        if (!state || !state.milestones["蚩尤"]) {
            me.notify("蚩尤尚未倒下。");
            return false;
        }
    }
};
