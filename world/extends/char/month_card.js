if (!CHARACTER.prototype.query_prop_without_month_card) {
    CHARACTER.prototype.query_prop_without_month_card = CHARACTER.prototype.query_prop;
    CHARACTER.prototype.query_prop = function (name) {
        let val = this.query_prop_without_month_card(name);
        if (this.is_player && this.query_temp && this.query_temp("month_card", 0)) {
            if (name === "study_per" || name === "lianxi_per" || name === "dazuo_per") {
                val += 100;
            } else if (name === "exp_per") {
                val += 20;
            }
        }
        return val;
    }
}

USER.prototype.query_month_card_expires = function () {
    let expires = 0;
    if (this.temp && this.temp.month_card && this.temp.month_card.e > expires) {
        expires = this.temp.month_card.e;
    }
    if (this.items) {
        for (let item of this.items) {
            if (item && item.path === "cash/month_card" && item.temp && item.temp.activated && item.temp.expires > expires) {
                expires = item.temp.expires;
            }
        }
    }
    return expires > Date.now() ? expires : 0;
}

USER.prototype.apply_month_card = function () {
    let expires = this.query_month_card_expires();
    if (expires > Date.now()) {
        this.set_temp("month_card", 1, expires - Date.now());
        this.add_title("月下听雨", "month_card", expires - Date.now());
        return true;
    }
    this.remove_temp("month_card");
    this.add_title(null, "month_card");
    return false;
}

function query_month_card_claim_key(now) {
    let dt = new Date(now || Date.now());
    if (dt.getHours() < 5) dt = new Date(dt.getTime() - 24 * 3600000);
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

USER.prototype.send_month_card_daily_mail = function () {
    if (!(this.query_month_card_expires() > Date.now())) return false;
    const claimKey = query_month_card_claim_key();
    if (this.query_temp("month_card_claim") === claimKey) return false;
    this.set_temp("month_card_claim", claimKey);
    COMMAND.DO("send", this.id, {
        from: "month_card",
        from_name: "月卡福利",
        title: "月卡每日奖励",
        summary: "今日月卡元宝已经送达，请领取附件。",
        content: "你的月卡今日福利已经送达，领取附件可获得100元宝。",
        dedupe: "month_card:" + claimKey,
        attach: [{ obj: "money/cash", count: 100 }]
    });
    this.notify("月卡每日奖励已发送至社交邮箱。");
    return true;
}
