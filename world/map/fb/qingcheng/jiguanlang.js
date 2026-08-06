this.inherits(ROOM);
this.name = "机关廊";
this.desc = "机关廊两壁藏着短弩，地砖上刻着八卦纹路，必须按归位后的阵势通过。";
this.exits = { "south": "fb/qingcheng/baguatai", "north": "fb/qingcheng/songfengguan" };
this.set_item("dizhuan", "八卦地砖", "地砖乾坤错落，和八卦台石盘相互呼应，踩错一步便会触动短弩。", [
    ["tanlu", "探路", function (me) {
        if (!me.query_temp("fb/qingcheng/bagua")) return me.notify("八卦石盘尚未归位，你看不出机关廊的步法。");
        if (me.query_temp("fb/qingcheng/jiguan")) return me.notify("你已经探清机关廊的步法。");
        me.set_temp("fb/qingcheng/jiguan", 1);
        me.notify("你沿乾坎艮震之位试探地砖，机关廊里的短弩声渐渐停息。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/qingcheng/jiguan")) {
        me.notify("机关廊短弩未停，你还不能贸然前进。");
        return false;
    }
}
