this.inherits(NPC);
this.set({
    name: "火龙",
    desc: "火龙鳞片赤红，呼吸间喷出灼热毒气。",
    title: "洪荒火龙",
    gender: 1,
    age: 80,
    mp: 2800,
    max_mp: 5200,
    hp: 18000,
    max_hp: 18000,
    score: 10,
    prop: { gj: 850, mz: 650, ds: 500, fy: 620 }
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(["dodge", 500], ["parry", 500], ["force", 500], ["bite", 650], ["unarmed", 650], ["dushegongji", 650, "bite"]);
this.on_attack_over = function (me, target, par) {
    if (!par || par.is_dodge || par.is_parry) return;
    target.add_status({
        id: "huodu",
        name: "火毒",
        desc: "火毒在体内灼烧，每三秒损失气血。",
        duration: 3000,
        duration_count: 4,
        downside: true,
        on_interval: function (obj) {
            obj.from_attack(180, 999999, null, "<hir>$N体内火毒发作，灼痛难当。</hir>");
        }
    }, me);
};
this.set_drop({ obj: "res/huolongpi", min: 1, max: 2, odds: 6500 }, { obj: "money/silver", min: 5, max: 12 });
