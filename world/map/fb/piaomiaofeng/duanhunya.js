this.inherits(ROOM);
this.name = "断魂崖";
this.desc = "乌老大和不平道人围住一名女童。";
this.exits = { south: "fb/piaomiaofeng/entry", north: "fb/piaomiaofeng/shizuyan" };
this.set_npc("fb/piaomiaofeng/wulaoda", "fb/piaomiaofeng/bupingdaoren", "fb/piaomiaofeng/tonglao");
this.on_enter = function (me) {
    if (!me || !me.is_player) return;
    const state = this.query_fb_state(me);
    if (!state || state.failed || state.milestones["保护女童"]) return;
    const child = this.find_obj_bypath("fb/piaomiaofeng/tonglao");
    if (!child) return this.fail_fb_route(me, "断魂崖上的女童已经遇害");
    for (const path of ["fb/piaomiaofeng/wulaoda", "fb/piaomiaofeng/bupingdaoren"]) {
        const enemy = this.find_obj_bypath(path);
        if (enemy && typeof enemy.do_kill === "function" && !enemy.fight_type) enemy.do_kill(child);
    }
};
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["保护女童"]) { me.notify("女童尚未脱险，不能离开断魂崖。"); return false; }
};
