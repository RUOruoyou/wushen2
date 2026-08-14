this.inherits(NPC);
this.set({ name: "杨过", hp: 130000, max_hp: 130000, mp: 22000, max_mp: 22000, score: 0, prop: { gj: 4300, mz: 3600, ds: 2800, fy: 3300 }, no_refresh: true });
this.skill_map(["dodge", 2400], ["parry", 2400], ["force", 2400], ["sword", 2400]);
const addStatus = this.add_status;
this.add_status = function (buff, from) {
    const result = addStatus.call(this, buff, from);
    if (!buff || !buff.is_faint || !this.is_faint || !from || !from.is_player || !this.environment || !this.environment.is_fb()) return result;
    const state = this.environment.query_fb_state(from);
    if (!state || state.failed || !state.milestones["小龙女"]) return result;
    this.environment.grant_fb_milestone(from, "昏迷杨过", 10);
    return result;
};
this.on_die = function (killer) {
    if (killer && killer.notify) killer.notify("杨过只能被昏迷后绕过，不能在此击杀。");
    return false;
};
