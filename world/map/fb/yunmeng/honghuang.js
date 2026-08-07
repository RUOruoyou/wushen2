this.inherits(ROOM);
this.name = "洪荒古泽";
this.desc = "洪荒古泽毒雾弥漫。若此前漏过瑛姑方向的巨鳄，需要深入这里击杀额外火龙补足进度。";
this.exits = { south: "fb/yunmeng/e3", north: "fb/yunmeng/buhuo1" };
this.set_npc("fb/yunmeng/huolong", 1);
this.on_leave = function (me, dir) {
    if (dir === "north" && me.query_temp("fb/yunmeng/missed")) {
        me.notify("你绕过了瑛姑方向的巨鳄，必须深入洪荒古泽补足进度。\n");
    }
};
