this.inherits(ROOM);
this.name = "雪谷";
this.desc = "雪谷中寒风如刀，四下白茫茫一片。血刀老祖提刀而立，刀锋上的血色在雪光里格外刺眼。";
this.exits = { "south": "fb/lcj/huangfen", "north": "fb/lcj/tianningsi" };
this.set_npc("fb/lcj/xuedaolaozu");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/lcj/xuedaolaozu")) {
        me.notify("血刀老祖怪笑一声，血刀横在你面前。");
        return false;
    }
}
