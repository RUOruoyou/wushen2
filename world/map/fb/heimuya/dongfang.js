this.inherits(ROOM);
this.name = "东方闺房";
this.desc = "东方不败在绣架前转身，黑木崖最后的战斗开始了。";
this.exits = { west: "fb/heimuya/yang2" };
this.set_npc("fb/heimuya/dongfangbubai");
this.on_enter = function (me) {
    if (!me || !me.is_player) return;
    const state = this.query_fb_state(me);
    if (!state || state.failed || state.milestones["东方不败"]) return;
    let yang = this.find_obj_bypath("fb/heimuya/yanglianting2");
    if (state.milestones["杨莲亭二"] && !this.query_temp(me, "fb/heimuya/yang2_suppressed", 0) && !yang) {
        yang = NPC.CLONE("fb/heimuya/yanglianting2");
        if (yang) {
            this.apply_fb_spawn_difficulty(me, yang);
            this.item_changed(yang, true, "杨莲亭忽然从绣架后跃出，再次挡在东方不败身前。");
            me.notify("杨莲亭死而复生，替东方不败挡住了致命攻击。");
        }
    }
    const dongfang = this.find_obj_bypath("fb/heimuya/dongfangbubai");
    if (dongfang && typeof dongfang.do_kill === "function") dongfang.do_kill(me);
    if (yang && typeof yang.do_kill === "function") yang.do_kill(me);
};
