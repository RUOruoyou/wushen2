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
AREA.prototype.query_record_index = function () {
    return this.record_index ?? this.fb_index;
}
AREA.ensure_record_indexes = function (me) {
    if (!me || me.query_temp("fb_record_index_v1", 0)) return;
    if (!AREA.FBS || !AREA.FBS.length) return;
    const unlocked = parseInt(me.query_temp("fb", 0)) || 0;
    const normalSweep = parseInt(me.query_temp("fb_sao0", 0)) || 0;
    const difficultSweep = parseInt(me.query_temp("fb_sao1", 0)) || 0;
    let migratedUnlock = unlocked;
    for (const area of AREA.FBS || []) {
        if (!area) continue;
        const recordIndex = area.query_record_index();
        if (recordIndex <= unlocked && area.fb_index > migratedUnlock) {
            migratedUnlock = area.fb_index;
        }
        let sweepLevel = 0;
        if (recordIndex < normalSweep) sweepLevel = 1;
        if (recordIndex < difficultSweep) sweepLevel = 2;
        const key = "fb_sao" + recordIndex;
        if (sweepLevel > (parseInt(me.query_temp(key, 0)) || 0)) {
            me.set_temp(key, sweepLevel);
        }
    }
    if (migratedUnlock > unlocked) me.set_temp("fb", migratedUnlock);
    me.set_temp("fb_record_index_v1", 1);
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


