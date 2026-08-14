this.inherits(ROOM);
this.name = "十字花径";
this.desc = "花径每前进一步都会牵动机关，累计十二步才能走出。";
this.exits = { south: "fb/yihuagong/entry" };
this.add_action("step", "前进", function (me) {
    if (!this.query_temp(me, "fb/yihuagong/flower_count", 0)) {
        this.set_temp(me, "fb/yihuagong/flower_count", me.random(6) + 5);
    }
    const count = this.query_temp(me, "fb/yihuagong/steps", 0) || 0;
    if (count >= 12) return me.notify("你已经走出花径。");
    const maxHp = Math.max(1, Number(me.max_hp) || Number(me.hp) || 1);
    const damage = Math.max(1, Math.floor(maxHp / 20));
    const actualDamage = Math.min(damage, Math.max(0, (Number(me.hp) || 0) - 1));
    if (actualDamage > 0 && typeof me.add_hp === "function") me.add_hp(-actualDamage);
    const next = count + 1;
    this.set_temp(me, "fb/yihuagong/steps", next);
    if (next === 12) { this.grant_fb_milestone(me, "花径", 10); this.add_exit("north", "fb/yihuagong/huaynu"); me.notify("你忍受失血走完十二步花径，前方宫门打开。"); }
    else me.notify("你踏出第" + next + "步，花径机关割伤了你，损失" + actualDamage + "点气血。");
});
