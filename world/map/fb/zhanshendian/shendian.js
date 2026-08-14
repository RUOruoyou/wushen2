this.inherits(ROOM);
this.name = "神殿祭坛";
this.desc = "困难路线从祭拜战神像开始，水潭、矿坑、融火窟和木凤巢分列四方。";
this.exits = {
    north: "fb/zhanshendian/elements",
    up: "fb/zhanshendian/shuishi",
    west: "fb/zhanshendian/jinkuang",
    down: "fb/zhanshendian/ronghuo",
    east: "fb/zhanshendian/mufeng_hard"
};
this.add_action("worship", "祭拜", function (me) {
    if ((this.query_temp(me, "diff", 0) || 0) !== 1) return me.notify("普通路线不进入祭坛。");
    if (this.query_temp(me, "fb/zhanshendian/worship", 0)) return me.notify("你已经完成祭拜。");
    this.set_temp(me, "fb/zhanshendian/worship", 1);
    this.grant_fb_milestone(me, "祭拜", 5);
    me.notify("战神像前四道元素光芒依次亮起。");
});
this.on_leave = function (me) {
    if (!this.query_temp(me, "fb/zhanshendian/worship", 0)) {
        me.notify("请先祭拜战神像。");
        return false;
    }
};
