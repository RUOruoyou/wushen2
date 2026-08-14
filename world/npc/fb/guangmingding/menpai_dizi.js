this.inherits(NPC);
this.set({
    name: "六大门派弟子",
    title: "<hig>六大门派</hig>",
    desc: "这名弟子正与明教守众殊死相搏，若其阵亡，张无忌便会增加一层号令。",
    gender: 1,
    age: 28,
    hp: 60000,
    max_hp: 60000,
    mp: 10000,
    max_mp: 10000,
    score: 0,
    prop: { gj: 1800, mz: 1700, ds: 1400, fy: 1500 },
    no_fight: true,
    no_refresh: true,
    is_drop: false
});
this.skill_map(["dodge", 1200], ["parry", 1200], ["force", 1200], ["unarmed", 1200]);
this.on_create = function (path, par) {
    const key = par ? par.substr(1) : "shaolin";
    const factions = {
        shaolin: ["少林弟子", "SHAOLIN"],
        wudang: ["武当弟子", "WUDANG"],
        emei: ["峨眉弟子", "EMEI"],
        huashan: ["华山弟子", "HUASHAN"],
        kunlun: ["昆仑弟子", "NONE"],
        kongtong: ["崆峒弟子", "NONE"]
    };
    const faction = factions[key] || factions.shaolin;
    this.name = faction[0];
    this.family = FAMILIES[faction[1]] || FAMILIES.NONE;
};
this.on_died = function (killer) {
    if (this.fbCasualtyCounted) return;
    const room = this.die_room || this.environment || (killer && killer.environment);
    if (!room || !room.is_fb || !room.is_fb() || !room.parent || room.parent.id !== "guangmingding") return;
    const state = room.query_fb_state();
    if (!state || state.failed) return;
    if (!state.guangmingdingCasualties) state.guangmingdingCasualties = {};
    const casualtyId = this.id || this.uid || this.path;
    if (state.guangmingdingCasualties[casualtyId]) return;
    this.fbCasualtyCounted = true;
    state.guangmingdingCasualties[casualtyId] = 1;
    state.guangmingdingOrderLevel = Math.min(24, (parseInt(state.guangmingdingOrderLevel) || 0) + 1);
    room.notify(this.name + "阵亡，张无忌的号令增至" + state.guangmingdingOrderLevel + "层。");
};
