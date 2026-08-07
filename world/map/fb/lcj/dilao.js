this.inherits(ROOM);
this.name = "大牢";
this.desc = "阴冷大牢里铁链森森，墙角刻着零落剑诀。凌退思派来的狱卒守在此处，不许任何人接近死牢。";
this.exits = { "south": "fb/lcj/wanfu", "north": "fb/lcj/huangfen" };
this.set_npc("fb/lcj/lingtuisi");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/lcj/lingtuisi")) {
        me.notify("凌退思一挥手，狱卒立刻封住了牢门。");
        return false;
    }
}
