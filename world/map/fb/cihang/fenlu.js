this.inherits(ROOM);
this.name = "慈航分路";
this.desc = "七苦门后山路分为左右两支，西路可观浪翻云，东路通往祁冰云。";
this.exits = { south: "fb/cihang/qikumenu7", west: "fb/cihang/langlu", east: "fb/cihang/qibinglu" };
this.on_leave = function (me, dir) {
    if (dir === "south") return;
    if (!this.query_temp(me, "fb/cihang/qiku_done", 0)) { me.notify("七苦门尚未全部通过。"); return false; }
    const route = this.query_temp(me, "fb/cihang/route", 0);
    if (dir === "east" && !["浪子", "剑魔"].includes(route)) { me.notify("当前路线不经过祁冰云所在的东路。"); return false; }
    if (dir === "west" && !["国师", "魔师"].includes(route)) { me.notify("当前路线不经过观云西路。"); return false; }
};
