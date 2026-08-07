function add_fire_poison(me, target, par) {
    if (!par || par.is_dodge || par.is_parry) return;
    target.add_status({ id: "fire_poison", name: "火毒", desc: "火毒在体内灼烧，每三秒损失气血。", duration: 3000, duration_count: 4, downside: true, on_interval: function (obj) { obj.damage(220, me); } }, me);
}
this.inherits(EQUIPMENT);
this.set({ name: "火龙剑", desc: "这是一把在火龙王附近找到的宝剑，因为长期在充满火焰的地方，它本身也带了一些火毒", unit: "把", grade: 3, eq_type: EQUIP_TYPE.WEAPON, weapon_type: WEAPON_TYPE.SWORD, value: 120000, hole_count: 2, prop: { gj: 100, str: 10, dex: 10 } });
this.on_attack_over = add_fire_poison;
