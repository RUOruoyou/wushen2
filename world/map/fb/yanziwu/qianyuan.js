this.inherits(ROOM);
this.name = "庄府前院";
this.desc = "包不同守在前院，南北两侧分别通向王夫人和慕容复。";
this.exits = { south: "fb/yanziwu/entry", west: "fb/yanziwu/wangfuren", east: "fb/yanziwu/murongfu", north: "fb/yanziwu/lingwei" };
this.set_npc("fb/yanziwu/babutong");
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const state = this.query_fb_state(me);
    if (!state || !state.milestones["包不同"] || !state.milestones["王夫人"] || !state.milestones["慕容复"]) {
        me.notify("前院的主事者尚未全部退开。");
        return false;
    }
};
