this.inherits(ROOM);
this.name = "净念后山";
this.desc = "钟楼黑影逃入后山，少帅路线可在此诱出寇仲并等候老徐归来。";
this.exits = { southeast: "fb/jingnian/baishi", northeast: "fb/jingnian/zhonglou" };

this.on_enter = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") return;
    if (this.query_temp(me, "fb/jingnian/kouzhong_started", 0)
        && !this.query_temp(me, "fb/jingnian/kouzhong_dead", 0)) this.spawn_jingnian_kouzhong(me);
};

this.on_leave = function (me) {
    if (this.query_temp(me, "fb/jingnian/route", 0) !== "少帅") {
        me.notify("当前路线不能穿行净念后山。");
        return false;
    }
    if (!this.query_temp(me, "fb/jingnian/laoxu_return", 0)) {
        me.notify("老徐尚未归来，后山阶段还没有完成。");
        return false;
    }
};

this.add_action("get_mask", "取得阿朱面具", function (me) {
    this.take_jingnian_mask(me);
});
this.add_action("use_mask", "使用阿朱面具", function (me) {
    this.use_jingnian_mask(me);
});
this.add_action("lure", "诱出寇仲", function (me) {
    this.lure_jingnian_kouzhong(me);
});
this.add_action("disguise", "完成伪装", function (me) {
    this.complete_jingnian_disguise(me);
});
this.add_action("wait_laoxu", "等候老徐", function (me) {
    this.receive_jingnian_heshibi(me);
});
this.register_jingnian_status_action();
