this.inherits(ROOM);
this.name = "随机水路";
this.desc = "水路分岔，按挂画方向才能游到峭壁，每次尝试都会消耗气血。";
this.exits = { south: "fb/gumu/anhe", north: "fb/gumu/qiaobi" };
this.swim_gumu_waterway = function (me, par) {
    const expected = this.query_temp(me, "fb/gumu/direction", 0);
    if (!expected) return me.notify("你还没有查看挂画。");
    if (!par) return me.notify("请选择要游向的方向。");
    const maxHp = Math.max(1, Number(me.max_hp) || Number(me.hp) || 1);
    const damage = Math.max(1, Math.floor(maxHp / 10));
    const actualDamage = Math.min(damage, Math.max(0, (Number(me.hp) || 0) - 1));
    if (actualDamage > 0 && typeof me.add_hp === "function") me.add_hp(-actualDamage);
    if (String(par).trim() !== expected) {
        me.notify("你游错方向，被暗流推回当前水路，损失了" + actualDamage + "点气血。");
        return;
    }
    if (this.query_temp(me, "fb/gumu/swim", 0)) return me.notify("你已经沿正确方向游过暗河。");
    this.set_temp(me, "fb/gumu/swim", 1);
    this.grant_fb_milestone(me, "游水", 15);
    me.notify("你顶着水压沿正确方向游到峭壁，损失了" + actualDamage + "点气血。");
};
this.add_action("swim", "游水", function (me, par) {
    if (par) return this.swim_gumu_waterway(me, par);
    return me.notify("暗河分向东、南、西、北四方，请按卧室挂画的剑指方向选择。");
});
this.add_fb_click_choices("swim", [
    { id: "north", name: "向北游" },
    { id: "east", name: "向东游" },
    { id: "south", name: "向南游" },
    { id: "west", name: "向西游" }
], this.swim_gumu_waterway);
