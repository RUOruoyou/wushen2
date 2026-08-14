this.inherits(NPC);
this.set({
    name: "怜星",
    desc: "怜星守在副本路线中，击败后才可继续前进。",
    title: "怜星",
    gender: 1,
    age: 35,
    mp: 12000,
    max_mp: 12000,
    hp: 65000,
    max_hp: 65000,
    score: 0,
    prop: { gj: 2600, mz: 2200, ds: 1800, fy: 2000 },
    no_refresh: true
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
this.skill_map(["dodge", 1200], ["parry", 1200], ["force", 1200], ["unarmed", 1200]);
this.set_drop({ obj: "money/silver", min: 35, max: 70 });
this.on_died = function (killer) {
    if (!killer || !killer.is_player || !killer.environment || !killer.environment.is_fb()) return;
    killer.environment.grant_fb_milestone(killer, "怜星", 15);
};

