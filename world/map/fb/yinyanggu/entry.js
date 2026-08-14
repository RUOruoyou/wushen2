this.inherits(ROOM);
this.name = "阴阳谷入口";
this.desc = "先选择烛龙或幽冥路线，再从入口跳下大石台。";
this.exits = { north: "fb/yinyanggu/dashi" };
this.choose_yinyanggu_route = function (me, par) { if (this.query_temp(me, "fb/yinyanggu/route", 0)) return me.notify("路线已经锁定。"); const route = String(par || "").trim(); if (!["烛龙", "幽冥"].includes(route)) return me.notify("请选择烛龙或幽冥路线。"); if (route === "幽冥" && me.query_skill("changshengjue", 0) < 1) return me.notify("幽冥路线需要先领悟长生诀。"); if (route === "烛龙" && !["xuehaimogong", "qiankundanuoyi", "changshengjue"].some(id => me.query_skill(id, 0) >= 1)) return me.notify("烛龙路线需要血海、乾坤或长生打法资格。"); this.set_temp(me, "fb/yinyanggu/route", route); this.set_fb_route(me, route); me.notify("你选择了" + route + "路线。"); };
this.add_action("choose", "选择路线", function (me, par) { if (par) return this.choose_yinyanggu_route(me, par); return me.notify("请直接点击烛龙或幽冥路线按钮。"); });
this.add_fb_click_choices("choose", [
    { id: "zhulong", name: "选择烛龙", value: "烛龙" },
    { id: "youming", name: "选择幽冥", value: "幽冥" }
], this.choose_yinyanggu_route);
this.add_action("jump", "跳下谷口", function (me) {
    if (!this.query_temp(me, "fb/yinyanggu/route", 0)) return me.notify("请先选择烛龙或幽冥路线。");
    if (this.query_temp(me, "fb/yinyanggu/jumped", 0)) return me.notify("你已经跳下谷口。");
    this.set_temp(me, "fb/yinyanggu/jumped", 1);
    me.notify("你纵身跳下谷口，落在压住水道的大石旁。");
});
this.on_leave = function (me, dir) {
    if (dir !== "north") return;
    if (!this.query_temp(me, "fb/yinyanggu/route", 0)) { me.notify("请先选择烛龙或幽冥路线。"); return false; }
    if (!this.query_temp(me, "fb/yinyanggu/jumped", 0)) { me.notify("必须先从谷口跳下去。"); return false; }
};
