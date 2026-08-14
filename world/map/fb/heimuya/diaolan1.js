this.inherits(ROOM);
this.name = "第一段吊篮";
this.desc = "吊篮悬在黑木崖间，机关令牌让它缓缓前行。";
this.exits = { west: "fb/heimuya/fengleitang", east: "fb/heimuya/diaolan2" };
this.on_leave = function (me, dir) {
    if (dir !== "east") return;
    if ((this.query_temp(me, "diff", 0) || 0) === 1 && ["shangguanyun", "jiabu", "tongbaixiong"].some(name => this.find_obj_bypath("fb/heimuya/" + name))) {
        me.notify("困难路线的三堂长老尚未同时击退。");
        return false;
    }
    if (!this.query_temp(me, "fb/heimuya/token1", 0)) { me.notify("第一段吊篮尚未插入白虎堂令牌。"); return false; }
};
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1) return;
    if (!this.query_temp(me, "fb/heimuya/elders_moved", 0)) {
        for (const pair of [["baihutang", "shangguanyun"], ["qinglongtang", "jiabu"], ["fengleitang", "tongbaixiong"]]) {
            const base = ROOM.Get("fb/heimuya/" + pair[0]);
            const source = base && base.copy_rooms && base.copy_rooms[this.owner];
            const npc = source && source.find_obj_bypath("fb/heimuya/" + pair[1]);
            if (npc) { source.item_changed(npc, false); this.item_changed(npc, true); }
        }
        this.set_temp(me, "fb/heimuya/elders_moved", 1);
        me.notify("三堂长老同时赶到吊篮前，黑木崖上杀机四伏。");
    }
    for (const name of ["shangguanyun", "jiabu", "tongbaixiong"]) {
        const elder = this.find_obj_bypath("fb/heimuya/" + name);
        if (elder && typeof elder.do_kill === "function") elder.do_kill(me);
    }
};
this.add_action("insert_token", "插入白虎令", function (me) {
    if (this.query_temp(me, "fb/heimuya/token1", 0)) return me.notify("白虎堂令牌已经插入第一段吊篮。");
    if (!this.query_temp(me, "fb/heimuya/token1_owned", 0)) return me.notify("你还没有取得白虎堂令牌。");
    if ((this.query_temp(me, "diff", 0) || 0) === 1 && ["shangguanyun", "jiabu", "tongbaixiong"].some(name => this.find_obj_bypath("fb/heimuya/" + name))) return me.notify("困难路线需要先在此同时击退三堂长老。");
    this.set_temp(me, "fb/heimuya/token1", 1);
    this.grant_fb_milestone(me, "吊篮一", 5);
    me.notify("你插入白虎堂令牌，第一段吊篮开始移动。");
});
