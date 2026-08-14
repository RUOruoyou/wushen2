this.inherits(ROOM);
this.name = "黑木崖入口";
this.desc = "山谷北支通白虎堂，南支通青龙堂，三堂清理后才能前往吊篮。";
this.exits = { north: "fb/heimuya/baihutang", east: "fb/heimuya/qinglongtang" };
this.on_enter = function (me) {
    if (!me || !me.is_player || (this.query_temp(me, "diff", 0) || 0) !== 1) return;
    if (!me.query_temp("fbc_0_26", 0)) return this.fail_fb_route(me, "困难黑木崖需要先完成一次普通路线取得三堂资格");
    this.set_temp(me, "fb/heimuya/token1_owned", 1);
    this.set_temp(me, "fb/heimuya/token2_owned", 1);
    this.set_temp(me, "fb/heimuya/token3_owned", 1);
    me.notify("普通路线取得的三堂资格化为本实例的三枚临时令牌。");
};
