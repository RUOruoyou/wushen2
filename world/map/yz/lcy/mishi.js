this.inherits(ROOM);
this.name = "密室"
this.desc = "这是一间密室，房间很小，设备也很简陋，一张小床，一张单桌，一个大汉站在哪里小心的戒备这你。";
this.exits = { "out": "yz/lcy/fang2" };
this.set_npc("yz/lcy/maoshiba");

this.on_enter = function (me) {
    if (!me.is_player) return;
    var mao = this.find_by_path("yz/lcy/maoshiba");
    var shi = this.find_by_path("yz/lcy/shisong");
    if (!mao || !shi) return;
    me.notify("史松与茅十八在密室中对峙，双方都等着你表明立场。你可以自行选择帮助其中一方，也可以暂时不插手。");
    me.send_commands("kill " + shi.id, "帮助茅十八", "kill " + mao.id, "帮助史松");
}

