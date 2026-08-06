this.inherits(OBJ);
this.set({
    name: "月卡",
    desc: "激活后30天内每日通过社交邮箱发放100元宝，学习、练习、打坐效率增加100%，经验获得率增加20%，并获得30日称号【月下听雨】。",
    unit: "张",
    value: 0,
    grade: 5,
    combined: false,
    no_drop: true,
    no_consume: true,
    showAction: true
});

const MONTH_CARD_DAYS = 30;
const MONTH_CARD_DURATION = MONTH_CARD_DAYS * 24 * 3600000;

function query_days_left(expires) {
    return Math.max(1, Math.ceil((expires - Date.now()) / 86400000));
}

function find_active_card(me) {
    if (!me.items) return null;
    var now = Date.now(), target = null, expires = 0;
    for (var i = 0; i < me.items.length; i++) {
        var item = me.items[i];
        if (!item || item.path !== "cash/month_card") continue;
        if (!item.temp || !item.temp.activated || !(item.temp.expires > now)) continue;
        if (item.temp.expires > expires) {
            expires = item.temp.expires;
            target = item;
        }
    }
    return target;
}

function claim_daily(me) {
    if (!me.send_month_card_daily_mail) return false;
    return me.send_month_card_daily_mail();
}

this.on_use = function (me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");

    var now = Date.now();
    var active_card = find_active_card(me);

    if (this.temp && this.temp.activated) {
        if (this.temp.expires > now) {
            if (me.apply_month_card) me.apply_month_card();
            claim_daily(me);
            me.notify("你的月卡还剩约" + query_days_left(this.temp.expires) + "天。");
            me.items_changed(this);
            return true;
        }

        if (me.apply_month_card) me.apply_month_card();
        me.notify("这张月卡已经过期。");
        me.remove_obj(this, 1);
        return false;
    }

    var base_expires = now;
    if (me.query_month_card_expires) {
        base_expires = Math.max(base_expires, me.query_month_card_expires());
    }

    if (active_card && active_card !== this) {
        active_card.temp.expires = Math.max(active_card.temp.expires, base_expires) + MONTH_CARD_DURATION;
        if (me.apply_month_card) me.apply_month_card();
        claim_daily(me);
        me.items_changed(active_card);
        me.notify("你使用月卡为当前月卡续期" + MONTH_CARD_DAYS + "天，剩余约" + query_days_left(active_card.temp.expires) + "天。");
        me.remove_obj(this, 1);
        return false;
    }

    this.temp = {
        activated: 1,
        expires: base_expires + MONTH_CARD_DURATION
    };
    if (me.apply_month_card) me.apply_month_card();
    claim_daily(me);
    me.notify("你激活了月卡，" + MONTH_CARD_DAYS + "天内可享受月卡加成。");
    me.items_changed(this);
    return true;
}
