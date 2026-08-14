this.inherits(ROOM);
this.name = "慈航静斋入口";
this.desc = "慈航七苦门每个实例随机排序；普通可选浪子或国师，困难可选剑魔或魔师。";
this.exits = { north: "fb/cihang/qikumenu" };
this.choose_cihang_route = function (me, par) {
    if (this.query_temp(me, "fb/cihang/route", 0)) return me.notify("路线已经锁定。");
    const route = String(par || "").trim();
    const isDiff = Number(this.query_temp(me, "diff", 0)) > 0;
    const allowed = isDiff ? ["剑魔", "魔师"] : ["浪子", "国师"];
    if (!allowed.includes(route)) return me.notify("当前难度不可选择这条路线。");
    if (["国师", "魔师"].includes(route) && me.query_skill("changshengjue", 0) < 1) return me.notify("这条路线需要先领悟长生诀。");
    if (!this.set_fb_route(me, route)) return me.notify("路线已经锁定。");
    this.set_temp(me, "fb/cihang/route", route);
    me.notify("你选择了" + route + "路线。");
};
this.add_action("choose", "选择路线", function (me, par) {
    if (par) return this.choose_cihang_route(me, par);
    const isDiff = Number(this.query_temp(me, "diff", 0)) > 0;
    return me.notify("本次可选路线：" + (isDiff ? "剑魔、魔师" : "浪子、国师") + "。请直接点击路线按钮。");
});
this.add_fb_click_choices("choose", [
    { id: "langzi", name: "选择浪子", value: "浪子" },
    { id: "guoshi", name: "选择国师", value: "国师" },
    { id: "jianmo", name: "选择剑魔", value: "剑魔" },
    { id: "moshi", name: "选择魔师", value: "魔师" }
], this.choose_cihang_route);
