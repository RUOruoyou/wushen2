this.inherits(ROOM);
this.name = "四元素窟";
this.desc = "中央圆盘留有水、金、火、木四处凹槽，元素石只记录在当前副本实例。";
this.exits = { south: "fb/zhanshendian/shendian", north: "fb/zhanshendian/souls" };
this.add_action("embed", "嵌入圆盘", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1) return me.notify("普通路线没有元素圆盘。");
    for (const key of ["水石", "金石", "火石", "木石"]) if (!this.query_temp(me, "fb/zhanshendian/element_" + key, 0)) return me.notify("四元素石尚未集齐。");
    if (this.query_temp(me, "fb/zhanshendian/embedded", 0)) return me.notify("元素石已经嵌入。");
    this.set_temp(me, "fb/zhanshendian/embedded", 1);
    this.grant_fb_milestone(me, "圆盘", 5);
    me.notify("四元素石嵌入圆盘，三魂殿开启。");
});
this.on_leave = function (me, dir) {
    if (dir === "north" && !this.query_temp(me, "fb/zhanshendian/embedded", 0)) { me.notify("中央圆盘尚未开启。"); return false; }
};
