this.inherits(NPC);
this.set({ name: "东方不败", desc: "东方不败守在闺房深处。", title: "东方不败", gender: 2, age: 30, hp: 230000, max_hp: 230000, mp: 32000, max_mp: 32000, score: 0, prop: { gj: 5200, mz: 4100, ds: 3600, fy: 4200 }, no_refresh: true });
this.skill_map(["dodge", 3000], ["parry", 3000], ["force", 3000], ["unarmed", 3000]);
this.set_drop({ obj: "money/silver", min: 80, max: 140 }, { obj: ["eq/fb/heimuya/shangguanyun_pifeng", "eq/fb/heimuya/tongbaixiong_jiezhi", "eq/fb/heimuya/yanglianting_xiangquan", "eq/fb/heimuya/jiabu_yaodai", "eq/fb/heimuya/dongfang_xiuhuazhen"], odds: 900 });
this.on_die = function (killer) {
    const room = this.environment;
    const yang = room && room.find_obj_bypath("fb/heimuya/yanglianting2");
    const isYangAlive = yang && (typeof yang.is_living === "function" ? yang.is_living() : yang.hp > 0);
    if (isYangAlive) {
        if (killer && killer.notify) killer.notify("杨莲亭仍在替东方不败挡住致命攻击。");
        return false;
    }
};
this.on_died = function (killer, corpse) {
    if (!killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const state = room.query_fb_state(killer);
    if (!state || state.failed) return;
    room.grant_fb_milestone(killer, "东方不败", 20);
    if ((room.query_temp(killer, "diff", 0) || 0) !== 2 || !corpse || room.query_temp(killer, "fb/heimuya/team_orange_granted", 0)) return;
    const page = OBJ.CREATE("book/bc#xuantiejianfa");
    if (!page) return;
    if (!corpse.items) corpse.items = [];
    corpse.items.push(page);
    room.set_temp(killer, "fb/heimuya/team_orange_granted", 1);
    killer.notify("组队手动通关保底：东方不败的尸体中留下一份玄铁剑法残页。");
};
