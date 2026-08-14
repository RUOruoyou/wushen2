this.inherits(NPC);
this.set({
    name: "谢逊",
    desc: "谢逊守在副本路线中，击败后才可继续前进。",
    title: "谢逊",
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
    const diff = killer.environment.query_temp(killer, "diff", 0) || 0;
    const values = { "炎龙一": 10, "炎龙二": 15, "炎龙王": 20, "白熊一": 10, "白熊二": 15, "谢逊": diff ? 15 : 30, "张五侠": diff ? 15 : 0 };
    killer.environment.grant_fb_milestone(killer, "谢逊", values["谢逊"] || 0);
    if (diff === 1 && typeof killer.environment.spawn_zhangwuxia === "function") {
        killer.environment.spawn_zhangwuxia(killer);
    } else if (diff === 1 && !killer.environment.find_obj_bypath("fb/binghuo/zhangwuxia")) {
        const zhang = NPC.CLONE("fb/binghuo/zhangwuxia");
        if (zhang) {
            if (typeof killer.environment.apply_fb_spawn_difficulty === "function") killer.environment.apply_fb_spawn_difficulty(killer, zhang);
            killer.environment.item_changed(zhang, true);
            killer.send_room("谢逊倒下后，张五侠上前接战。", zhang);
        }
    }
};
