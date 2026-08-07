this.inherits(NPC);
this.set({
    name: "补路火龙",
    desc: "洪荒古泽中的补路火龙，必须击杀两只才能补足进度。",
    title: "洪荒火龙",
    gender: 1,
    age: 80,
    mp: 3000,
    max_mp: 5600,
    hp: 19000,
    max_hp: 19000,
    score: 30,
    prop: { gj: 900, mz: 680, ds: 500, fy: 640 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(["dodge", 500], ["parry", 500], ["force", 520], ["bite", 680], ["unarmed", 680], ["dushegongji", 680, "bite"]);
this.on_attack_over = function (me, target, par) {
    if (!par || par.is_dodge || par.is_parry) return;
    target.add_status({ id: "huodu", name: "火毒", duration: 3000, duration_count: 5, downside: true, on_interval: function (obj) { obj.damage(240, me); } }, me);
};
this.set_drop({ obj: "res/huolongpi", min: 1, max: 3, odds: 7000 }, { obj: "money/silver", min: 6, max: 14 });
