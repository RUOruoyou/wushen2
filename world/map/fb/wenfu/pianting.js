this.inherits(ROOM);
this.name = "偏院";
this.desc = "偏院一角堆着旧兵器和断裂蛇纹石碑，碑文似乎能和金蛇秘匣中的暗记互相印证。";
this.exits = { "south": "fb/wenfu/qianting", "north": "fb/wenfu/shiku" };
this.set_item("shibei", "蛇纹石碑", "石碑上的蛇形刻痕被苔痕盖住，只有对照秘匣暗记才能辨出通往石窟的路径。", [
    ["duizhao", "对照暗记", function (me) {
        if (!me.query_temp("fb/wenfu/box")) return me.notify("你还没找到金蛇秘匣，看不懂石碑上的蛇纹。");
        if (me.query_temp("fb/wenfu/anji")) return me.notify("你已经对照过蛇纹暗记。");
        me.set_temp("fb/wenfu/anji", 1);
        me.notify("你以金蛇秘匣中的暗记对照石碑，终于辨出石窟入口的真正方向。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/wenfu/anji")) {
        me.notify("石窟岔路复杂，你还没对照蛇纹暗记。");
        return false;
    }
}
