this.inherits(ROOM);
this.name = "火折子密道";
this.desc = "密道尽头通往东方不败的闺房。";
this.exits = { west: "fb/heimuya/yang1", east: "fb/heimuya/yang2" };
this.on_leave = function (me, dir) { if (dir === "east" && !this.query_temp(me, "fb/heimuya/midao", 0)) { me.notify("密道铁环尚未拉开。"); return false; } };
this.add_action("light", "点燃火折子", function (me) {
    if (this.query_temp(me, "fb/heimuya/lit", 0)) return me.notify("密道已经被火折子照亮。");
    if (!this.query_temp(me, "fb/heimuya/bowl", 0) || !this.query_temp(me, "fb/heimuya/firebrand", 0)) return me.notify("你还没有转动石碗并取得火折子。");
    this.set_temp(me, "fb/heimuya/firebrand", 0);
    this.set_temp(me, "fb/heimuya/lit", 1);
    me.notify("火折子照亮密道，墙上的铁环显露出来。");
});
this.add_action("pull_ring", "拉动铁环", function (me) {
    if (this.query_temp(me, "fb/heimuya/midao", 0)) return me.notify("密道铁环已经拉开。");
    if (!this.query_temp(me, "fb/heimuya/lit", 0)) return me.notify("密道太暗，还看不见铁环。");
    this.set_temp(me, "fb/heimuya/midao", 1);
    this.grant_fb_milestone(me, "密道链", 15);
    me.notify("你拉动铁环，小花园与东方闺房的通路缓缓开启。");
});
