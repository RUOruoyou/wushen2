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
AREA.prototype.has_completion = function (me) {
    if (!me) return false;
    const recordIndex = this.query_record_index();
    return [0, 1, 2].some((diff) => (parseInt(me.query_temp("fbc_" + diff + "_" + recordIndex, 0)) || 0) > 0);
}
AREA.ensure_record_indexes = function (me) {
    if (!me || me.query_temp("fb_unlock_order_v3", 0)) return;
    if (!AREA.FBS || !AREA.FBS.length) return;
    const originalUnlock = parseInt(me.query_temp("fb", 0)) || 0;
    const normalSweep = parseInt(me.query_temp("fb_sao0", 0)) || 0;
    const difficultSweep = parseInt(me.query_temp("fb_sao1", 0)) || 0;
    // Legacy fb_sao0/fb_sao1 stored the next display index. The last four
    // entries had different record indexes, so migrate through the historical
    // display-order mapping instead of comparing record numbers directly.
    const legacyRecordIndexes = new Map();
    for (let displayIndex = 0; displayIndex <= 15; displayIndex++) {
        legacyRecordIndexes.set(displayIndex, displayIndex);
    }
    legacyRecordIndexes.set(16, 17); // 泰山
    legacyRecordIndexes.set(17, 18); // 嵩山
    legacyRecordIndexes.set(18, 19); // 云梦沼泽
    const migratedLevels = new Map();
    for (let displayIndex = 0; displayIndex < Math.max(normalSweep, difficultSweep); displayIndex++) {
        const recordIndex = legacyRecordIndexes.get(displayIndex);
        if (recordIndex === undefined) continue;
        const level = displayIndex < difficultSweep ? 2 : 1;
        migratedLevels.set(recordIndex, Math.max(migratedLevels.get(recordIndex) || 0, level));
    }
    for (const [recordIndex, sweepLevel] of migratedLevels) {
        const key = "fb_sao" + recordIndex;
        if (sweepLevel > (parseInt(me.query_temp(key, 0)) || 0)) me.set_temp(key, sweepLevel);
    }

    for (const key of ["fbc_0_16", "fbc_1_16", "fbc_2_16", "fb_sao16", "fb_lcj_unlocked"]) {
        me.remove_temp(key);
    }

    let unlocked = originalUnlock;
    if (originalUnlock >= 19) {
        unlocked = 19;
        for (let displayIndex = 19; displayIndex <= 36; displayIndex++) {
            const area = AREA.FBS[displayIndex];
            if (!area || !area.has_completion(me)) break;
            unlocked = displayIndex + 1;
        }
    }
    if (unlocked !== originalUnlock) me.set_temp("fb", unlocked);
    // v1 was the previous order migration marker. Keep it for diagnostics,
    // but always record that the record-index based migration is complete.
    me.set_temp("fb_record_index_v1", 1);
    me.set_temp("fb_record_index_v2", 1);
    me.set_temp("fb_unlock_order_v3", 1);
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


