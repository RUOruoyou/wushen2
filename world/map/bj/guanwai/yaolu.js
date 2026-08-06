this.inherits(ROOM);
this.name = "药庐";
this.desc = "这间药庐药味刺鼻，桌上摊着几页残缺刀谱，阎基正冷冷地看着你。";
this.exits = { "south": "bj/guanwai/shanao", "east": "bj/guanwai/xiaowu" };
this.set_npc("bj/guanwai/yanji");
this.on_leave = function (me, dir) {
    if (dir == "east" && this.find_obj_bypath("bj/guanwai/yanji")) {
        me.notify("阎基冷笑一声，横刀拦住你：想去见胡斐？先过我这关。");
        return false;
    }
}
