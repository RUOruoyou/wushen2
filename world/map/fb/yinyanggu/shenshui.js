this.inherits(ROOM);
this.name = "深水区";
this.desc = "下潜越深，水压越大，每一步都会消耗气血；气血过低时会停止下潜。";
this.exits = { south: "fb/yinyanggu/dashi", north: "fb/yinyanggu/xuanbing" };
this.add_action("dive", "下潜", function (me) {
    const state = this.query_fb_state(me);
    if (state && state.failed) return me.notify("路线已经失败，请离开副本后重新开始。");
    if (!this.query_temp(me, "fb/yinyanggu/stone", 0)) return me.notify("没有抱起大石，水道仍被封住。");
    const route = this.query_temp(me, "fb/yinyanggu/route", 0);
    if (!["烛龙", "幽冥"].includes(route)) return me.notify("请先选择阴阳谷路线。");
    const depth = this.query_temp(me, "fb/yinyanggu/depth", 0) || 0;
    if (depth >= 3) return me.notify("你已经到达光点。");
    const hp = Number(me.hp) || 0;
    const maxHp = Number(me.max_hp) || 0;
    const damage = Math.max(1, Math.floor(maxHp * 0.04));
    if (!Number.isFinite(damage) || damage <= 0 || hp <= 1) return me.notify("你的气血不足以承受下一次下潜，请先离开深水区。");
    const actualDamage = Math.min(damage, Math.max(0, hp - 1));
    if (typeof me.add_hp === "function") me.add_hp(-actualDamage);
    const nextDepth = depth + 1;
    this.set_temp(me, "fb/yinyanggu/depth", nextDepth);
    if (nextDepth === 2) this.set_temp(me, "fb/yinyanggu/light", 1);
    if (nextDepth === 3) {
        this.set_temp(me, "fb/yinyanggu/light", 2);
        if (route === "烛龙") this.grant_fb_milestone(me, "深度", 20);
    }
    if (hp <= damage) me.notify("水压逼近极限，你被迫保留最后一点气血。");
    me.notify("你下潜到第" + nextDepth + "层，水压造成" + actualDamage + "点气血损耗。" + (nextDepth >= 2 ? "水下出现了第" + (nextDepth - 1) + "处光点。" : ""));
});
this.add_action("swim_light", "游向光点", function (me) {
    if (this.query_temp(me, "fb/yinyanggu/route", 0) !== "幽冥") return me.notify("烛龙路线不进入第二处光点。");
    if ((this.query_temp(me, "fb/yinyanggu/light", 0) || 0) < 2) return me.notify("第二处光点尚未出现。");
    if (this.query_temp(me, "fb/yinyanggu/ice_entry", 0)) return me.notify("你已经找到玄冰洞入口。");
    this.set_temp(me, "fb/yinyanggu/ice_entry", 1);
    this.grant_fb_milestone(me, "深度", 20);
    me.notify("你游向第二处光点，玄冰洞入口在水幕之后显现。");
});
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    const route = this.query_temp(me, "fb/yinyanggu/route", 0);
    if (route === "幽冥" && !this.query_temp(me, "fb/yinyanggu/ice_entry", 0)) { me.notify("幽冥路线必须从第二处光点游入玄冰洞。"); return false; }
    if (route === "烛龙" && (this.query_temp(me, "fb/yinyanggu/depth", 0) || 0) < 3) { me.notify("你还没有到达幽莹所在深度。"); return false; }
};
