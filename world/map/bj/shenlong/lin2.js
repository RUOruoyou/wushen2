

this.inherits(ROOM);
this.name = "灌木林";
this.desc = "这是一片灌木林。走了不远,你就可以看得见前面的空地了。";
this.set_npc("bj/shenlong/dushe", "bj/shenlong/zyshe");
this.exits = { "south": "bj/shenlong/lin1", "north": "bj/shenlong/kongdi" };
this.on_leave = function (me, dir) {
    if (dir == "north" && (this.find_obj_bypath("bj/shenlong/dushe") || this.find_obj_bypath("bj/shenlong/zyshe"))) {
        me.notify("毒蛇从草丛中窜出，挡住了去路。");
        return false;
    }
}
