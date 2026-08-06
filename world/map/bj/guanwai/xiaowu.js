this.inherits(ROOM);
this.name = "小屋";
this.desc = "小屋里炉火微弱，胡斐与平四在此落脚，似乎正在等阎基的消息。";
this.exits = { "west": "bj/guanwai/yaolu" };
this.set_npc("bj/guanwai/hufei", "bj/guanwai/asi");
this.on_enter = function (me) {
    if (!me.is_player) return;
    var obj = me.find_obj_bypath("sp/bj/yanji");
    if (obj) {
        var hu = this.find_obj_bypath("bj/guanwai/hufei");
        if (hu) {
            me.notify("胡斐盯着你手中的头颅，沉声道：这是阎基？快给我看看。");
            me.send_commands("give " + hu.id + " " + obj.id, "把阎基的头颅给胡斐");
        }
    }
}
