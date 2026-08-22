this.inherits(COMMAND);
this.command = "household";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.regex = /^(view|look|member|members|assign|work|stop|collect|take|upgrade|rest|train|playertrain|practice|pay|withdraw|use|buy|sell|donate|event|order|achievement|warehouse|help)?(?:\s+([^\s]+))?(?:\s+([^\s]+))?(?:\s+([^\s]+))?$/;

function sendView(me, message) {
    if (message) me.notify(message);
    me.send(JSON.stringify({ type: "dialog", dialog: "household", data: HOUSEHOLD.view(me) }));
}

function followerId(me, value) {
    if (!value) return null;
    const target = FOLLOWER.GET(me, { id: value });
    return target ? target.id : value;
}

this.enter = function (me, action, arg, extra, more) {
    action = String(action || "view").toLowerCase();
    if (action === "help") {
        return me.notify("家族命令：household view、assign <随从> <岗位> [周期1-8]、stop <随从>、collect、buy <材料> [数量]、sell <产物> [数量]、donate <金额>、upgrade <住宅|设施>、rest <随从>、train <随从>、pay、event <事件> <continue|invest|rest>、order accept/complete <订单>、achievement claim <成就>、withdraw <产出> <数量>、playertrain。派工为有时限派遣，到期自动结束并回待命。");
    }
    if (action === "view" || action === "look" || action === "member" || action === "members" || action === "warehouse") {
        return sendView(me);
    }
    if (action === "assign" || action === "work") {
        if (!arg || !extra) return me.notify("请指定随从和岗位，例如：household assign follower mining 2。");
        const result = HOUSEHOLD.assign(me, followerId(me, arg), extra, more);
        if (!result.ok) return me.notify(result.message);
        const hours = Math.round(result.period * result.cycles / 60 / 60 / 1000 * 10) / 10;
        me.notify("已安排家族成员" + result.jobName + " " + result.cycles + "个周期（约" + hours + "小时），到期自动结束，产出进入待领取。");
        return sendView(me);
    }
    if (action === "stop") {
        if (!arg) return me.notify("请指定要停止工作的随从。");
        const result = HOUSEHOLD.stop(me, followerId(me, arg));
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已停止该成员工作，已有产出仍可领取。");
    }
    if (action === "collect" || action === "take") {
        const result = HOUSEHOLD.collect(me, arg);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已将产出收入家族仓库。");
    }
    if (action === "upgrade") {
        if (!arg) return me.notify("请指定升级目标，例如 household upgrade 住宅 或 household upgrade 仓库。");
        const result = HOUSEHOLD.upgrade(me, arg);
        if (!result.ok) return me.notify(result.message);
        if (result.expanded && result.expanded.length) return sendView(me, "扩建完成，领地新增：" + result.expanded.join("、") + "，打开地图可查看新领地。");
        return sendView(me, "升级完成。");
    }
    if (action === "rest") {
        if (!arg) return me.notify("请指定需要休息的随从。");
        const result = HOUSEHOLD.rest(me, followerId(me, arg));
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "成员已安排休息，疲劳和心情会逐步恢复。");
    }
    if (action === "train") {
        if (!arg) return me.notify("请指定需要培训的随从。");
        const result = HOUSEHOLD.train(me, followerId(me, arg));
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "培训完成，成员获得了职业经验。");
    }
    if (action === "playertrain" || action === "practice") {
        const result = HOUSEHOLD.trainPlayer(me);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "练功房训练完成，你获得了" + result.pot + "点潜能。");
    }
    if (action === "pay") {
        const result = HOUSEHOLD.payUpkeep(me, arg);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已支付" + result.paid + "两维护费，剩余欠费" + result.remaining + "两。");
    }
    if (action === "withdraw" || action === "use") {
        if (!arg) return me.notify("请指定要领取的产出，例如 household withdraw ore 1。");
        const result = HOUSEHOLD.withdraw(me, arg, extra);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已领取" + (result.itemName || (HOUSEHOLD.label ? HOUSEHOLD.label(result.key) : result.key)) + " x" + result.count + "。");
    }
    if (action === "buy") {
        if (!arg) return me.notify("请指定材料和数量，例如 household buy tool 5（可买：工具/种子/药材/宣传费）。");
        const result = HOUSEHOLD.buy(me, arg, extra);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已购买" + HOUSEHOLD.label(result.key) + " x" + result.count + "，花费家族资金" + result.cost + "两。");
    }
    if (action === "sell") {
        if (!arg) return me.notify("请指定产物和数量，例如 household sell ore 5（可卖：矿石/药材/丹药）。");
        const result = HOUSEHOLD.sell(me, arg, extra);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已出售" + HOUSEHOLD.label(result.key) + " x" + result.count + "，获得家族资金" + result.income + "两。订单交付的单价更优，优先接单。");
    }
    if (action === "donate") {
        if (!arg) return me.notify("请指定存入金额（两），例如 household donate 100。1两家族资金需要100文。");
        const result = HOUSEHOLD.donate(me, arg);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "已向家族存入" + result.funds + "两资金。");
    }
    if (action === "event") {
        if (!arg || !extra) return me.notify("请指定事件和处理方式，例如 household event 事件ID invest。");
        const result = HOUSEHOLD.handleEvent(me, arg, extra);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, result.event.result);
    }
    if (action === "order") {
        if (!arg) return sendView(me);
        const result = HOUSEHOLD.order(me, arg, extra);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, arg === "accept" ? "已接取订单。" : arg === "complete" || arg === "deliver" || arg === "claim" ? "订单已交付。" : "订单列表已刷新。");
    }
    if (action === "achievement") {
        if (arg !== "claim" || !extra) return sendView(me);
        const result = HOUSEHOLD.claimAchievement(me, extra);
        if (!result.ok) return me.notify(result.message);
        return sendView(me, "成就奖励已领取。");
    }
    return me.notify("未知家族命令，请输入 household help 查看帮助。");
};
