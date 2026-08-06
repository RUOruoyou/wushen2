AREA.prototype.notify_update = function () {
    this.json = null;
    if (this.is_area)
        WORLD.send(`{type:"dialog",dialog:"jh",t:"fam",refresh:${this.index}}`);
    else
        WORLD.send(`{type:"dialog",dialog:"jh",t:"fb",refresh:${this.fb_index}}`);
}
AREA.prototype.query_owner = function (me) {
    return me.query_teamid();
}
AREA.prototype.is_record = function (diff) {
    return this["record_" + diff] !== false;
}
AREA.prototype.fb_daily_limit = 50;
AREA.prototype.query_daily_fb_count = function (me) {
    if (!me) return 0;
    return me.query_temp("fb_count_day_" + this.id, 0);
}
AREA.prototype.add_daily_fb_count = function (me) {
    if (!me) return 0;
    return me.add_temp("fb_count_day_" + this.id, 1, UTIL.diff_time());
}
AREA.prototype.clear_copy = function (me) {
    var room = ROOM.Get(this.first)?.query_copy2(me);
    if (room)
        room.clear_copy(me);
}
AREA.prototype.is_unlock = function (me) {
    if (this.jd_index >= 0)
        return me.isenable_area(this);
    return (this.unlock_index ?? this.fb_index) <= me.query_temp("fb", 0);
}


