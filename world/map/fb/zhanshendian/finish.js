this.inherits(ROOM);
this.name = "乘龙渡河";
this.desc = "魔龙将你甩落在地下暗河岸边，湍流上方只有一线可越。";
this.exits = { south: "fb/zhanshendian/molong" };
this.add_action("wear_nest", "穿戴鸟窝", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 0) return me.notify("困难路线不经过地下暗河。");
    if (!this.query_temp(me, "fb/zhanshendian/bird_nest", 0)) return me.notify("你还没有从木凤巢取得鸟窝。");
    if (!this.query_temp(me, "fb/zhanshendian/molong_ridden", 0)) return me.notify("你尚未骑乘魔龙抵达暗河岸边。");
    if (this.query_temp(me, "fb/zhanshendian/bird_nest_worn", 0)) return me.notify("鸟窝已经护在身上。");
    this.set_temp(me, "fb/zhanshendian/bird_nest_worn", 1);
    me.notify("你将鸟窝护在身上，足以抵挡跃河时的罡风。");
});
this.add_action("ride", "骑龙渡河", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 0) return me.notify("困难路线不经过骑龙渡河。");
    const state = this.query_fb_state(me);
    if (!state || state.failed || !state.milestones["木凤"] || !state.milestones["魔龙"] || !this.query_temp(me, "fb/zhanshendian/molong_ridden", 0)) return me.notify("木凤鸟窝或魔龙骑乘阶段尚未完成。");
    if (!this.query_temp(me, "fb/zhanshendian/bird_nest_worn", 0)) return me.notify("先穿戴鸟窝护住身体，再尝试渡河。");
    if (state.milestones["完成剧情"]) return me.notify("你已经完成骑龙渡河。");
    this.grant_fb_milestone(me, "完成剧情", 10);
    me.notify("你借鸟窝护身，驾驭魔龙跃过地下暗河。");
});
