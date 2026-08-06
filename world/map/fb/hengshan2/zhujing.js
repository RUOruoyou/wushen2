this.inherits(ROOM);
this.name = "竹径";
this.desc = "竹径曲折入云，山风吹过竹叶，隐约和琴台曲谱中的节拍相合。";
this.exits = { "south": "fb/hengshan2/qintai", "north": "fb/hengshan2/liuyunfeng" };
this.set_item("zhulin", "竹林", "竹影错落，若按琴谱节拍行走，似乎能避开迷路的岔道。", [
    ["xunpu", "循谱行走", function (me) {
        if (!me.query_temp("fb/hengshan2/qin")) return me.notify("你还没听懂琴谱，只觉竹径四处都是岔路。");
        if (me.query_temp("fb/hengshan2/bufa")) return me.notify("你已经记住竹径步法。");
        me.set_temp("fb/hengshan2/bufa", 1);
        me.notify("你按琴谱节拍穿过竹影，流云峰的山路终于清晰起来。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/hengshan2/bufa")) {
        me.notify("竹径曲折难辨，你还没按琴谱找出步法。");
        return false;
    }
}
