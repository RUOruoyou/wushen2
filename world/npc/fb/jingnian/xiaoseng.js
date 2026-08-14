this.inherits(NPC);
this.set({
    name: "执杖小僧",
    desc: "邪王路线必须将这名指定和尚昏迷，而不是击杀。",
    title: "净念禅宗执杖僧",
    gender: 1,
    age: 28,
    hp: 135000,
    max_hp: 135000,
    mp: 22000,
    max_mp: 22000,
    score: 0,
    prop: { gj: 4300, mz: 3600, ds: 2800, fy: 3400 },
    no_refresh: true
});
this.skill_map(["dodge", 2500], ["parry", 2500], ["force", 2500], ["unarmed", 2500]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    if (room.query_temp(killer, "fb/jingnian/route", 0) === "邪王"
        && !room.query_temp(killer, "fb/jingnian/xiewang_knockout", 0)) {
        room.fail_fb_route(killer, "指定和尚被击杀，无法完成昏迷突破");
    }
};
