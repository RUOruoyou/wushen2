this.inherits(NPC);
this.set({ name: "魔龙", hp: 240000, max_hp: 240000, mp: 38000, max_mp: 38000, score: 0, prop: { gj: 6600, mz: 5400, ds: 4000, fy: 5200 }, no_refresh: true });
this.skill_map(["dodge", 3700], ["parry", 3800], ["force", 3900], ["unarmed", 3800]);
this.set_drop({ obj: "money/silver", min: 80, max: 140 }, { obj: "eq/fb/zhanshendian/molong_zhanjia", odds: 800 });
this.on_die = function (killer) {
    if (!killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    if ((room.query_temp(killer, "diff", 0) || 0) === 0 && !room.query_temp(killer, "fb/zhanshendian/molong_ridden", 0)) {
        killer.notify("魔龙濒死时缩入深潭，必须趁它昏迷时骑上龙背。");
        return false;
    }
};
this.on_died = function (killer) {
    if (this.fbDeathResolved || !killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    const room = killer.environment;
    const diff = room.query_temp(killer, "diff", 0) || 0;
    if (diff === 0) {
        this.fbDeathResolved = true;
        room.grant_fb_milestone(killer, "魔龙", 15);
        return;
    }
    if (diff !== 1) return;
    this.fbDeathResolved = true;
    room.set_temp(killer, "fb/zhanshendian/element_水石", 1);
    room.grant_fb_milestone(killer, "水石", 5);
};
