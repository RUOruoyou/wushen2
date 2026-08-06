this.inherits(ROOM);
this.name = "琴台";
this.desc = "琴台上古琴横陈，琴弦旁落着暗器，嵩山刺客正欲毁去琴谱。";
this.exits = { "south": "fb/hengshan2/huiyanqiao", "north": "fb/hengshan2/zhujing" };
this.set_npc("fb/hengshan2/cike");
this.set_item("guqin", "古琴", "古琴弦上留着半阕曲谱，曲意似在指点通往流云峰的步法。", [
    ["ting", "听琴谱", function (me) {
        if (this.find_obj_bypath("fb/hengshan2/cike")) {
            me.notify("嵩山刺客压住琴弦，你听不清曲谱。");
            return false;
        }
        if (me.query_temp("fb/hengshan2/qin")) return me.notify("你已经听懂琴谱中的步法。");
        me.set_temp("fb/hengshan2/qin", 1);
        me.add_fbscore(15);
        me.notify("你凝神细听，琴谱中的转折暗合衡山步法，流云峰路径已明。");
    }]
]);
this.on_leave = function (me, dir) {
    if (dir == "north" && !me.query_temp("fb/hengshan2/qin")) {
        me.notify("你还没听懂琴谱，贸然上峰只会迷路。");
        return false;
    }
}
