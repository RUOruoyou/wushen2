this.inherits(NPC);
this.set({
    name: "天山童姥",
    desc: "外表如女童的天山童姥正遭人围攻，需要玩家保护并护送。",
    title: "受困女童",
    gender: 2,
    age: 12,
    hp: 120000,
    max_hp: 120000,
    mp: 18000,
    max_mp: 18000,
    score: 0,
    prop: { gj: 2500, mz: 2400, ds: 3200, fy: 2600 },
    no_refresh: true
});
this.skill_map(["dodge", 2200], ["parry", 1800], ["force", 2000], ["unarmed", 1800]);
this.on_died = function (killer) {
    const room = (killer && killer.environment) || this.die_room;
    if (!room || !room.is_fb || !room.is_fb() || !room.find_me) return;
    const me = room.find_me();
    if (me && room.fail_fb_route) room.fail_fb_route(me, "保护阶段的天山童姥已经遇害");
};
