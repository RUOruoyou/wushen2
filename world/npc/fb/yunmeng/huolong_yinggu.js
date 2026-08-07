this.inherits(NPC);
this.set({
    name: "瑛姑方向火龙",
    desc: "瑛姑方向的火龙，必须击杀两只才能保住十成进度。",
    title: "洪荒火龙",
    gender: 1,
    age: 80,
    mp: 2800,
    max_mp: 5200,
    hp: 18000,
    max_hp: 18000,
    score: 5,
    prop: { gj: 850, mz: 650, ds: 500, fy: 620 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(["dodge", 500], ["parry", 500], ["force", 500], ["bite", 650], ["unarmed", 650], ["dushegongji", 650, "bite"]);
this.on_attack_over = function (me, target, par) {
    if (!par || par.is_dodge || par.is_parry) return;
    target.add_status({ id: "huodu", name: "火毒", duration: 3000, duration_count: 4, downside: true, on_interval: function (obj) { obj.damage(180, me); } }, me);
};
this.set_drop({ obj: "res/huolongpi", min: 1, max: 2, odds: 6500 }, { obj: "money/silver", min: 5, max: 12 });
