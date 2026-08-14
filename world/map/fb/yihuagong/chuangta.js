this.inherits(ROOM);
this.name = "床榻机关";
this.desc = "床榻按花数排列，正确操作后会露出二层暗道。";
this.exits = { west: "fb/yihuagong/lianxing" };
this.query_flower_count = function (me) {
    let flowers = this.query_temp(me, "fb/yihuagong/flower_count", 0);
    if (!flowers) {
        flowers = (Number(me.random(6)) || 0) + 5;
        this.set_temp(me, "fb/yihuagong/flower_count", flowers);
    }
    return flowers;
};
this.on_before_enter = function (me) {
    const flowers = this.query_flower_count(me);
    this.desc = "床榻四周共有<hiy>" + flowers + "</hiy>朵雕花，按下对应花数即可露出二层暗道。";
    this.json = null;
};
this.unlock_flower_bed = function (me, par) {
    if (this.query_exits("east")) return me.notify("床榻已经移开。");
    const flowers = this.query_flower_count(me);
    const answer = parseInt(par, 10);
    if (!Number.isFinite(answer) || answer !== flowers) {
        return me.notify("花数不符，床榻机关没有移动。请点击与雕花数量一致的按钮。");
    }
    this.grant_fb_milestone(me, "床榻机关", 10);
    this.add_exit("east", "fb/yihuagong/erceng");
    me.notify("你按下正确的花数，床榻移开，露出二层暗道。");
};
this.add_action("unlock", "解开机关", function (me, par) {
    if (par !== undefined && par !== null && par !== "") return this.unlock_flower_bed(me, par);
    return me.notify("床榻四周共有" + this.query_flower_count(me) + "朵雕花，请点击对应花数。");
});
this.add_fb_click_choices("unlock", [5, 6, 7, 8, 9, 10].map(function (count) {
    return { id: String(count), name: "按下" + count + "朵", value: count };
}), this.unlock_flower_bed);
