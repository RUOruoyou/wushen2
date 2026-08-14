this.inherits(ROOM);
this.name = "魔龙潭";
this.desc = "瀑布下的深潭深不见底，连续潜水才会惊醒沉睡的魔龙。";
this.exits = { south: "fb/zhanshendian/mufeng", north: "fb/zhanshendian/finish" };
this.spawn_molong = function (me) {
    if (this.find_obj_bypath("fb/zhanshendian/molong") || this.query_temp(me, "fb/zhanshendian/molong_ridden", 0)) return;
    const dragon = NPC.CLONE("fb/zhanshendian/molong");
    if (!dragon) return;
    this.apply_fb_spawn_difficulty(me, dragon);
    this.item_changed(dragon, true, "深潭轰然炸开，魔龙破水而出！");
    if (typeof dragon.do_kill === "function") dragon.do_kill(me);
};
this.on_enter = function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 0) return;
    if ((this.query_temp(me, "fb/zhanshendian/dive", 0) || 0) >= 3) this.spawn_molong(me);
};
this.add_action("dive", "潜入深潭", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 0) return me.notify("困难路线的魔龙守在水元素潭。");
    if (this.query_temp(me, "fb/zhanshendian/molong_ridden", 0)) return me.notify("你已经骑乘魔龙离开深潭。");
    const count = Math.min(3, (this.query_temp(me, "fb/zhanshendian/dive", 0) || 0) + 1);
    this.set_temp(me, "fb/zhanshendian/dive", count);
    if (count < 3) return me.notify("你潜入深潭搜寻魔龙踪迹，还需要继续下潜。");
    this.spawn_molong(me);
});
this.add_action("mount", "骑上魔龙", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 0) return me.notify("困难路线不能骑乘魔龙。");
    if (this.query_temp(me, "fb/zhanshendian/molong_ridden", 0)) return me.notify("你已经骑乘过魔龙。");
    const dragon = this.find_obj_bypath("fb/zhanshendian/molong");
    if (!dragon) return me.notify("深潭中没有可以骑乘的魔龙。");
    if (!dragon.query_status || !dragon.query_status("faint")) return me.notify("必须先让魔龙陷入昏迷，才能跃上龙背。");
    this.set_temp(me, "fb/zhanshendian/molong_ridden", 1);
    this.grant_fb_milestone(me, "魔龙", 15);
    const base = ROOM.Get("fb/zhanshendian/finish");
    const target = base && base.copy_rooms && base.copy_rooms[this.owner];
    if (target) me.moveto(target, me.name + "跃上魔龙背脊。", me.name + "被魔龙甩落在暗河岸边。");
});
this.on_leave = function (me, dir) {
    if (dir === "north" && !this.query_temp(me, "fb/zhanshendian/molong_ridden", 0)) {
        me.notify("必须先昏迷并骑上魔龙，才能抵达暗河岸边。");
        return false;
    }
};
