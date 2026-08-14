this.inherits(ROOM);
this.name = "白驼山出口";
this.desc = "两条主线在这里汇合，完成五项战斗后可以离开。";
this.exits = { west: "fb/baituo/yandong" };
this.on_enter = function (me) {
    const state = this.query_fb_state(me);
    if (state && state.score < 100) me.notify("花园和蛇路的主线尚未全部完成，当前完成度" + state.score + "。");
};

