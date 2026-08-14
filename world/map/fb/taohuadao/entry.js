this.inherits(ROOM);
this.name = "海滩";
this.desc = "海浪拍打礁石，北面的桃花林按九宫方位重重排列。";
this.exits = {};
this.set_npc("fb/taohuadao/yufu");
this.add_action("enter_maze", "进入桃花林", function (me) {
    return this.enter_taohua_maze(me);
});
