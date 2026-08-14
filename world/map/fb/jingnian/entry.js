this.inherits(ROOM);
this.name = "净念禅宗正门";
this.desc = "正门内是净念禅宗主殿。普通副本可走盗帅、僧王或少帅，困难副本可走邪王或困难僧王。";
this.exits = { north: "fb/jingnian/zhudian" };
this.choose_jingnian_route = function (me, par) {
    if (this.query_temp(me, "fb/jingnian/route", 0)) return me.notify("路线已经锁定。");
    const route = String(par || "").trim();
    const isDiff = Number(this.query_temp(me, "diff", 0)) > 0;
    const allowed = isDiff ? ["邪王", "困难僧王"] : ["盗帅", "僧王", "少帅"];
    if (!allowed.includes(route)) return me.notify("当前难度不可选择这条路线。");
    if (!this.set_fb_route(me, route)) return me.notify("路线已经锁定。");
    this.set_temp(me, "fb/jingnian/route", route);
    if (["少帅", "困难僧王"].includes(route)) this.grant_fb_milestone(me, "入寺", 10);
    me.notify("你选择了" + route + "路线。");
};
this.add_action("choose", "选择路线", function (me, par) {
    if (par) return this.choose_jingnian_route(me, par);
    const isDiff = Number(this.query_temp(me, "diff", 0)) > 0;
    return me.notify("本次可选路线：" + (isDiff ? "邪王、困难僧王" : "盗帅、僧王、少帅") + "。请直接点击路线按钮。");
});
this.add_fb_click_choices("choose", [
    { id: "daoshuai", name: "选择盗帅", value: "盗帅" },
    { id: "sengwang", name: "选择僧王", value: "僧王" },
    { id: "shaoshuai", name: "选择少帅", value: "少帅" },
    { id: "xiewang", name: "选择邪王", value: "邪王" },
    { id: "hard_sengwang", name: "选择困难僧王", value: "困难僧王" }
], this.choose_jingnian_route);
this.on_leave = function (me, dir) {
    if (dir === "north" && !this.query_temp(me, "fb/jingnian/route", 0)) {
        me.notify("请先选择本次净念禅宗路线。");
        return false;
    }
};
this.register_jingnian_status_action();
