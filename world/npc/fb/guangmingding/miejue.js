this.inherits(NPC); this.set({ name: "灭绝师太", hp: 100000, max_hp: 100000, mp: 16000, max_mp: 16000, score: 0, prop: { gj: 3500, mz: 2900, ds: 2200, fy: 2700 }, no_refresh: true }); this.skill_map(["dodge", 1900], ["parry", 1900], ["force", 1900], ["sword", 1900]);
this.on_died = function (killer) {
    const room = this.die_room || this.environment || (killer && killer.environment);
    if (!room || !room.is_fb || !room.is_fb()) return;
    const me = killer && killer.is_player ? killer : (room.find_me && room.find_me());
    room.fail_fb_route(me, "灭绝师太阵亡，救援失败");
    room.notify("灭绝师太已经阵亡，本次救援无法完成。");
};
