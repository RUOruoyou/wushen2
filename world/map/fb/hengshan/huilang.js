this.inherits(ROOM);
this.name = "回廊";
this.desc = "回廊尽头悬着一口小钟，钟下石牌写着“护经者鸣钟入戒台”。";
this.exits = { "south": "fb/hengshan/cangjing", "north": "fb/hengshan/jietai" };
this.set_item("xiaozhong", "小钟", "这口小钟声音清越，是恒山弟子传讯守阁的信物。", [
    ["mingzhong", "鸣钟", function (me) {
        if (!me.query_temp("fb/hengshan/jing")) return me.notify("藏经阁经卷尚未护好，现在鸣钟也无人回应。");
        if (me.query_temp("fb/hengshan/zhong")) return me.notify("钟声已经传到戒台。");
        me.set_temp("fb/hengshan/zhong", 1);
        me.notify("你轻轻鸣钟，钟声沿回廊传向戒台，远处有人应了一声佛号。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/hengshan/zhong")) {
        me.notify("你还没鸣钟通报，戒台前无人放行。");
        return false;
    }
}
