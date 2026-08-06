this.inherits(ROOM);
this.name = "虫窟";
this.desc = "虫窟里细小毒虫层层蠕动，窟壁尽头隐约可见五毒神殿的火光。";
this.exits = { "south": "fb/wudu/duzhen", "north": "fb/wudu/shendian" };
this.set_item("duchong", "毒虫", "毒虫密密麻麻铺在地面，若不先用解药驱散，根本无法通过。", [
    ["quchong", "驱散毒虫", function (me) {
        if (!me.query_temp("fb/wudu/yao")) return me.notify("你还没有配好解药，毒虫闻声便向你聚来。");
        if (me.query_temp("fb/wudu/chong")) return me.notify("毒虫已经退入石缝。");
        me.set_temp("fb/wudu/chong", 1);
        me.notify("你将解药洒在窟口，毒虫纷纷退入石缝，前路终于露了出来。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/wudu/chong")) {
        me.notify("虫窟里毒虫翻涌，必须先驱散毒虫。");
        return false;
    }
}
