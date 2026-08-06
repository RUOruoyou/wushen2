this.inherits(ROOM);
this.name = "内室";
this.desc = "这里是一个空荡荡的房间，除了<cmd cmd='look floor'>地板(floor)</cmd>，什么也没有。";
this.exits = { "east": "bj/tdh/hct" };
this.set_npc("bj/tdh/guan");
this.set_item("floor", "地板", "你试著敲了敲地板，声响清脆，下面似乎是空心的。", [
    ["open", "移开", function (me) {
        me.from_attack(300, 100,
            "$N掀开地板，只听“唰”的一声, 地道里突然白光一闪，一柄长剑倏的伸出，刺向你的小腹",
            "<hir>$N匆忙间闪避不急，一声惨嚎，被长剑刺了个正着。</hir>",
            "$N赶紧向旁边一跳，躲了过去。");
        me.send_room("一个道人从洞里探出头来，看了$N一眼，又伸手把地板关上了。");
    }]
]);;
this.add_action("knock", "敲地板", function (me) {
    if (this.query_exits("down")) {
        me.notify("地板下的暗道已经打开了。");
        return me.send_commands("go down", "进入暗道");
    }
    var npc = this.find_by_path("bj/tdh/guan");
    if (npc) {
        me.notify("关夫子对你喝到：你想干什么？");
        npc.do_kill(me);
        return;
    }
    me.send_room("$N在木板上咚地敲了一下。");
    this.knock_count = Math.min((this.knock_count || 0) + 1, 3);
    if (this.knock_count >= 3) {
        me.send_room("从地板里边伸出一双手把地板掀开了。");
        this.add_exit("down","bj/tdh/andao1");
    }
});
