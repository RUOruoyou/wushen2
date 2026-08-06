this.inherits(COMMAND);
this.command = "message";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;

const MESSAGE = WORLD.MESSAGE;
this.regex = /^(\w+)(?:\s+(\w+))?(?:\s+(\d+))?$/;

this.enter = function (me, action, from, index) {
    if (!action) return this.send_state(me);
    if (action === "read") return this.read_mail(me, from, index);
    if (action === "readall") return this.read_all(me);
    if (action === "deleteall") return this.delete_all(me);
    if (action === "delete") return this.delete_mail(me, from, index);
    if (action === "notices") return this.send_notices(me);

    const obj = {
        type: "dialog",
        dialog: "message",
        id: action,
        items: MESSAGE.getMessageFromID(me, action)
    };
    me.send(JSON.stringify(obj));
}

this.create_state = function (me) {
    return {
        type: "dialog",
        dialog: "message",
        messages: MESSAGE.getUserMessages(me),
        notices: MESSAGE.getNotices(),
        unRead: MESSAGE.getUnreadCount(me)
    };
}

this.send_state = function (me, resetDetail) {
    const state = this.create_state(me);
    if (resetDetail) state.resetDetail = true;
    me.send(JSON.stringify(state));
}

this.send_notices = function (me) {
    me.send(JSON.stringify({
        type: "dialog",
        dialog: "message",
        notices: MESSAGE.getNotices()
    }));
}

this.read_mail = function (me, from, index) {
    if (!from || index === undefined) return me.send("没有这封邮件。");
    const mail = MESSAGE.getMailDetail(me, from, index);
    if (!mail) return me.send("没有这封邮件。");
    me.send(JSON.stringify({
        type: "dialog",
        dialog: "message",
        mail: mail,
        unRead: MESSAGE.getUnreadCount(me)
    }));
}

this.read_all = function (me) {
    const count = MESSAGE.markAllRead(me);
    this.send_state(me);
    me.notify(count > 0 ? "已将" + count + "封邮件设为已读。" : "没有未读邮件。");
}

this.delete_mail = function (me, from, index) {
    let result;
    if (index === undefined) {
        result = MESSAGE.deleteFrom(me, from);
    } else {
        result = MESSAGE.deleteMail(me, from, index);
    }
    if (result.error) return me.send(result.error);
    this.send_state(me, true);
    me.notify("邮件已删除。");
}

this.delete_all = function (me) {
    const count = MESSAGE.deleteEligible(me);
    this.send_state(me, true);
    me.notify(count > 0
        ? "已删除" + count + "封已读且无待领取附件的邮件。"
        : "没有可安全删除的邮件。");
}
