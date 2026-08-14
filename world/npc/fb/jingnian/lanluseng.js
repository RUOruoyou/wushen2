this.inherits(NPC);
this.set({
    name: "拦路僧",
    desc: "三名拦路僧结阵封住铜殿入口。",
    title: "净念禅宗拦路僧",
    gender: 1,
    age: 38,
    hp: 145000,
    max_hp: 145000,
    mp: 24000,
    max_mp: 24000,
    score: 0,
    prop: { gj: 4500, mz: 3800, ds: 2900, fy: 3500 },
    no_refresh: true
});
this.skill_map(["dodge", 2600], ["parry", 2600], ["force", 2600], ["unarmed", 2600]);
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    this.fbDeathResolved = true;
    const room = killer.environment;
    if (room.query_temp(killer, "fb/jingnian/route", 0) !== "邪王") return;
    const count = Math.min(3, (room.query_temp(killer, "fb/jingnian/block_monk", 0) || 0) + 1);
    room.set_temp(killer, "fb/jingnian/block_monk", count);
    if (count === 3) room.grant_fb_milestone(killer, "拦路僧", 15);
};
