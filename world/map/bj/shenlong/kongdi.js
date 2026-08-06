

this.inherits(ROOM);
this.name = "空地";
this.desc = "这是一片空地，四周都是乱石，杂草丛生。北边是一间小屋，南面是深深的灌木林，东面有一条工整的大道, 西面是一片草坪。";
this.set_npc(["bj/shenlong/dizi", 2]);
this.exits = { "south": "bj/shenlong/lin2", "north": "bj/shenlong/xiaowu", "east": "bj/shenlong/dadao" };
this.on_leave = function (me, dir) {
    if ((dir == "east" || dir == "north") && this.find_obj_bypath("bj/shenlong/dizi")) {
        me.notify("神龙教弟子围了上来，不让你继续深入。");
        return false;
    }
}
