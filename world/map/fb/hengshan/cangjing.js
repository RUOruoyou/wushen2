this.inherits(ROOM);
this.name = "藏经阁";
this.desc = "藏经阁书架倾倒，几卷白云心法残篇散落在地，一名魔教香主正在翻找经卷。";
this.exits = { "south": "fb/hengshan/songlin", "north": "fb/hengshan/huilang" };
this.set_npc("fb/hengshan/xiangzhu");
this.set_item("jingjuan", "经卷", "散落在地的经卷沾了尘土，若再耽搁便会被人带走。", [
    ["hujing", "护住经卷", function (me) {
        if (this.find_obj_bypath("fb/hengshan/xiangzhu")) {
            me.notify("魔教香主守着经卷，你一时无法靠近。");
            return false;
        }
        if (me.query_temp("fb/hengshan/jing")) return me.notify("你已经把经卷收回书架。");
        me.set_temp("fb/hengshan/jing", 1);
        me.add_fbscore(20);
        me.notify("你将散落经卷逐一归位，藏经阁内重新安静下来。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/hengshan/jing")) {
        me.notify("藏经阁经卷尚未护好，你还不能离开。");
        return false;
    }
}
