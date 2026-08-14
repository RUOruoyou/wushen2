this.inherits(NPC);
this.set({ name: "蚩尤", hp: 260000, max_hp: 260000, mp: 42000, max_mp: 42000, score: 0, prop: { gj: 7000, mz: 5800, ds: 4500, fy: 5500 }, no_refresh: true });
this.skill_map(["dodge", 4000], ["parry", 4000], ["force", 4000], ["blade", 4000]);
const doKill = this.do_kill;
this.do_kill = function (target) {
    const room = this.environment;
    if (room && target && target.is_player && room.is_fb() && (room.query_temp(target, "diff", 0) || 0) === 1 && !room.query_temp(target, "fb/zhanshendian/chiyou_roar", 0)) {
        room.set_temp(target, "fb/zhanshendian/chiyou_roar", 1);
        const damage = typeof target.damage === "function" ? target.damage(12000000, this) : 0;
        target.notify("蚩尤发出震殿怒吼，你承受了" + (damage || 0) + "点伤害。");
        if (target.hp <= 0) {
            if (typeof target.die === "function") target.die(this);
            return;
        }
    }
    if (typeof doKill === "function") return doKill.call(this, target);
};
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    if ((killer.environment.query_temp(killer, "diff", 0) || 0) !== 1) return;
    this.fbDeathResolved = true;
    killer.environment.grant_fb_milestone(killer, "蚩尤", 10);
};
