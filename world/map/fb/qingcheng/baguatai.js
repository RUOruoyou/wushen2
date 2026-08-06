this.inherits(ROOM);
this.name = "八卦台";
this.desc = "八卦台中央嵌着一面石盘，乾坤震巽各有刻痕，罗人杰和洪人雄分立两侧。";
this.exits = { "south": "fb/qingcheng/qianmen", "north": "fb/qingcheng/jiguanlang" };
this.set_npc("fb/qingcheng/luo", "fb/qingcheng/hong");
this.set_item("shipan", "八卦石盘", "石盘上八门错位，若能转正阵眼，松风观的机关便会停下。", [
    ["zhuan", "转动石盘", function (me) {
        if (this.find_obj_bypath("fb/qingcheng/luo") || this.find_obj_bypath("fb/qingcheng/hong")) {
            me.notify("青城四秀守在石盘两侧，不让你靠近。");
            return false;
        }
        if (me.query_temp("fb/qingcheng/bagua")) return me.notify("八卦石盘已经归位。");
        me.set_temp("fb/qingcheng/bagua", 1);
        me.add_fbscore(15);
        me.notify("你按乾、坎、艮、震之序转动石盘，松风观内的机关声渐渐停了。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/qingcheng/bagua")) {
        me.notify("八卦石盘尚未归位，松风观前机关未停。");
        return false;
    }
}
