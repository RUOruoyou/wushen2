this.inherits(ROOM);
this.name = "毒阵";
this.desc = "五根毒幡围成阵势，地面爬满细小毒虫，一名护法守在阵眼。";
this.exits = { "south": "fb/wudu/duwu", "north": "fb/wudu/chongku" };
this.set_npc("fb/wudu/hufa");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/wudu/hufa")) {
        me.notify("五毒护法催动毒幡，挡住阵眼。");
        return false;
    }
    if (dir == "north" && !me.query_temp("fb/wudu/yao")) {
        me.notify("毒阵腥气逼人，你没有解药，不敢硬闯。");
        return false;
    }
}
