this.inherits(ROOM);
this.name = "锐金旗";
this.desc = "庄铮率明教守众围住了崆峒援军。";
this.exits = { east: "fb/guangmingding/jumu" };
this.set_npc("fb/guangmingding/zhuangzheng", ["fb/guangmingding/menpai_dizi#kongtong", 4], ["fb/guangmingding/mingjiao_dizi", 4]);
this.on_enter = function (me) {
    this.parent.start_order_battle(this, me, "kongtong", "fb/guangmingding/menpai_dizi#kongtong");
};
