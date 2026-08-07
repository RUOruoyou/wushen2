this.inherits(ROOM);
this.name = "第四太保";
this.desc = "第四波太保人数最多，卜沉和沙天翁在其中，战局最为凶险。";
this.exits = { south: "fb/songshan/taibao3", north: "fb/songshan/fengchantai" };
this.set_npc("fb/songshan/buchen");
this.set_npc("fb/songshan/shatianweng");
this.set_npc("fb/songshan/taibao4");
this.set_npc("fb/songshan/taibao3");
this.on_leave = function (me, dir) {
    if (dir === "north" && this.find_obj_bypath("fb/songshan/taibao4")) {
        me.notify("第四波太保尚未清空，封禅台暂不可达。\n");
        return false;
    }
};
