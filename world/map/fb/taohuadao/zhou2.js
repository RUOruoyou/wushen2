this.inherits(ROOM);
this.name = "山洞";
this.desc = "桃花阵变化后显出的山洞里放着石匣，周伯通挡在洞口不肯让路。";
this.exits = { south: "fb/taohuadao/entry" };
this.set_npc("fb/taohuadao/zhoubotong2");
this.on_before_enter = function (me) {
    this.grant_fb_milestone(me, "周伯通初遇", 15);
};
this.on_leave = function (me, dir) {
    if (dir === "south" && this.find_obj_bypath("fb/taohuadao/zhoubotong2")) {
        me.notify("周伯通还守着石匣。");
        return false;
    }
};
