this.inherits(ROOM);
this.name = "大门";
this.desc = "温府朱门紧闭，门前两个护院按着棍棒，冷眼打量每一个靠近的人。";
this.exits = { "north": "fb/wenfu/qianting" };
this.set_npc(["fb/wenfu/jiading", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/wenfu/jiading")) {
        me.notify("温府家丁把门堵住，不肯让你进去。");
        return false;
    }
}
