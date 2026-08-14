this.inherits(ROOM);
this.name = "山洞外";
this.desc = "周伯通在洞口探头探脑，见到你便挥拳相迎。";
this.exits = { south: "fb/taohuadao/huangrong1", north: "fb/taohuadao/huangrong2" };
this.set_npc("fb/taohuadao/zhoubotong1");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/taohuadao/zhoubotong1")) {
        me.notify("周伯通还没有和你分出胜负。");
        return false;
    }
};

