this.inherits(COMMAND);
this.command = "notice";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_level = 5;

const MESSAGE = WORLD.MESSAGE;

this.enter = async function (me, arg) {
    if (!arg) return me && me.send("请输入公告内容。");
    let data;
    if (typeof arg === "object") {
        data = arg;
    } else if (arg[0] === "{") {
        data = JSON.toObject(arg);
    } else {
        const parts = arg.split("|");
        data = parts.length >= 3
            ? { title: parts.shift(), summary: parts.shift(), content: parts.join("|") }
            : { title: "系统公告", content: arg };
    }
    if (!data || !data.content) return me && me.send("公告格式错误。");
    try {
        const notice = MESSAGE.createAdminNotice(data, {
            id: me && me.id,
            name: me && me.name || "游戏管理员"
        });
        await WORLD.DATA.save();
        MESSAGE.broadcastAdminNotices(notice, true);
        me && me.notify("公告已发布并保存。");
    } catch (error) {
        me && me.send("公告发布失败：" + (error.message || "未知错误"));
    }
}
