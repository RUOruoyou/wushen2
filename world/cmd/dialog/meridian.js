this.inherits(COMMAND);
this.command = "meridian";
this.allow_fight = false;
this.regex = /^(\w+)\s+(\d+)$/;

this.enter = async function (me, id, expectedProgress) {
    if (!me || !me.practice_meridian) return false;
    const result = await me.practice_meridian(id, Number(expectedProgress));
    if (result.message) {
        if (result.ok) me.notify("<hig>" + result.message + "</hig>");
        else me.notify_fail(result.message);
    }
    me.send(JSON.stringify({
        type: "dialog",
        dialog: "score",
        meridians: me.query_meridian_view(),
        meridianResult: { ok: result.ok }
    }));
    return true;
};
