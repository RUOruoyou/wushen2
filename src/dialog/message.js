import { showFlag } from '../game/tool.js';

export default {
    selected_item: 0,
    footers: ["公告", "邮箱", "队伍", "关系", "帮派"],
    footerElements: ["notice", "mail", "team", "relation", "party"],
    messages: [],
    notices: [],
    unRead: 0,
    selectedMail: null,
    selectedMailKey: null,
    expandedNotices: new Set(),

    init: function () {
        Dialog.injectStyle(message_css);
    },

    show: function () {
        if (!this.element) this.element = this.createElement();
        this.isShow = true;
        this.expandedNotices.clear();
        Dialog.element.addClass("dialog-social");
        Dialog.title("社交");
        Dialog.icon("envelope");
        this.create_footer();
        this.showChild();
        SendCommand("message");
    },

    close: function () {
        if (this.selectedChild) {
            this.selectedChild.inner_close();
            this.selectedChild = null;
        }
        if (this.element) this.element.detach();
        this.selectedMail = null;
        this.selectedMailKey = null;
        Dialog.element.removeClass("dialog-social social-mailbox");
        this.isShow = false;
    },

    hide: function () {
        if (this.isMobileMailboxDetail()) {
            this.selectedMail = null;
            this.selectedMailKey = null;
            this.renderMailbox();
            return false;
        }
        this.close();
    },

    onData: function (data) {
        if (data.unRead !== undefined) this.unRead = data.unRead;
        if (data.notices) this.notices = data.notices;
        if (data.messages) {
            this.messages = data.messages;
            if (data.resetDetail) {
                this.selectedMail = null;
                this.selectedMailKey = null;
            }
        }
        if (data.notice) {
            this.addNotice(data.notice);
            this.showNoticeMessage(data.notice);
        }
        if (data.mail) {
            this.addMail(data.mail);
            if (data.mail.detail) {
                this.selectedMail = data.mail;
                this.selectedMailKey = this.mailKey(data.mail.from, data.mail.index);
            }
        }
        if (data.receive) this.updateMessageState(data.receive, data.index);
        this.showUnread();
        this.renderCurrent();
    },

    showUnread: function () {
        showFlag("message", this.unRead || 0);
    },

    addNotice: function (notice) {
        for (let i = 0; i < this.notices.length; i++) {
            if (this.notices[i].index === notice.index) {
                this.notices[i] = notice;
                return;
            }
        }
        this.notices.unshift(notice);
    },

    addMail: function (mail) {
        const key = this.mailKey(mail.from, mail.index);
        for (let i = 0; i < this.messages.length; i++) {
            if (this.mailKey(this.messages[i].from, this.messages[i].index) === key) {
                this.messages[i] = Object.assign({}, this.messages[i], mail);
                return;
            }
        }
        this.messages.unshift(mail);
        this.messages.sort((a, b) => b.time - a.time);
    },

    mailKey: function (from, index) {
        return from + ":" + index;
    },

    create_footer: function () {
        const html = [];
        for (let i = 0; i < this.footers.length; i++) {
            html.push("<span class='footer-item" + (i === this.selected_item ? " select" : "")
                + "' for='" + i + "'>" + this.footers[i] + "</span>");
        }
        html.push('<div class="item-commands social-commands"></div>');
        Dialog.footer(html.join(""));
    },

    footerChanged: function (index) {
        this.selected_item = parseInt(index);
        this.showChild();
    },

    showChild: function () {
        const name = this.footerElements[this.selected_item];
        Dialog.element.toggleClass("social-mailbox", name === "mail");
        if (name === "notice" || name === "mail") {
            if (this.selectedChild) {
                this.selectedChild.inner_close();
                this.selectedChild = null;
            }
            // Reusing the mounted node preserves its delegated click handlers.
            if (this.element.parent()[0] !== Dialog.contentElement[0]) {
                Dialog.contentElement.empty().append(this.element);
            }
            Dialog.title(name === "notice" ? "公告" : "邮箱");
            Dialog.icon(name === "notice" ? "flag" : "envelope");
            if (name === "notice") this.renderNotices();
            else this.renderMailbox();
            this.renderFooterActions();
            return;
        }

        this.element.detach();
        if (this.selectedChild) this.selectedChild.inner_close();
        const child = Dialog[name];
        if (!child.element) child.element = child.createElement();
        Dialog.contentElement.empty().append(child.element);
        child.inner_show();
        this.selectedChild = child;
        this.renderFooterActions();
    },

    renderCurrent: function () {
        if (!this.isShow || this.selectedChild) return;
        const name = this.footerElements[this.selected_item];
        if (name === "notice") this.renderNotices();
        if (name === "mail") this.renderMailbox();
    },

    renderFooterActions: function () {
        const commands = Dialog.footerElement.find(".social-commands");
        if (this.footerElements[this.selected_item] !== "mail") {
            commands.empty();
            return;
        }
        commands.html([
            '<span cmd="message readall" title="一键已读"><span class="glyphicon glyphicon-ok"></span> 已读</span>',
            '<span cmd="receive" title="一键领取全部附件"><span class="glyphicon glyphicon-saved"></span> 领取</span>',
            '<span cmd="message deleteall" title="删除已读且没有待领取附件的邮件"><span class="glyphicon glyphicon-trash"></span> 清理</span>'
        ].join(""));
    },

    renderNotices: function () {
        this.element.attr("class", "dialog-message notice-view");
        const html = ['<div class="notice-list">'];
        for (let notice of this.notices) {
            const expanded = this.expandedNotices.has(String(notice.index));
            html.push('<section class="notice-item', expanded ? ' expanded' : '', '" data-index="', notice.index, '">');
            html.push('<button type="button" class="notice-toggle" aria-expanded="', expanded ? 'true' : 'false', '">');
            html.push('<span class="notice-toggle-icon glyphicon ', expanded ? 'glyphicon-chevron-down' : 'glyphicon-chevron-right', '"></span>');
            html.push('<span class="notice-title">', notice.title || "系统公告", '</span>');
            html.push('<span class="notice-time">', this.formatDate(notice.time), '</span></button>');
            html.push('<div class="notice-summary">', notice.summary || "暂无摘要", '</div>');
            html.push('<div class="notice-content">', notice.content || "", '</div></section>');
        }
        if (!this.notices.length) html.push('<div class="empty">暂无公告</div>');
        html.push('</div>');
        this.element.html(html.join(""));
    },

    renderMailbox: function () {
        this.element.attr("class", "dialog-message mail-view");
        const html = ['<div class="mail-layout', this.selectedMail ? ' has-selection' : '', '">'];
        html.push('<div class="mail-list">');
        for (let mail of this.messages) {
            const key = this.mailKey(mail.from, mail.index);
            html.push('<button type="button" class="mail-item', mail.read ? '' : ' unread', key === this.selectedMailKey ? ' selected' : '',
                '" data-from="', mail.from, '" data-index="', mail.index, '">');
            html.push('<span class="mail-status" aria-hidden="true"></span>');
            html.push('<span class="mail-item-main"><span class="mail-item-heading"><span class="mail-item-title">',
                mail.title || mail.name || "系统邮件", '</span>');
            if (mail.hasAttach) {
                html.push('<span class="mail-attach-icon glyphicon glyphicon-file', mail.claimable ? ' claimable' : '',
                    '" title="', mail.claimable ? '附件待领取' : '附件已领取', '"></span>');
            }
            html.push('</span><span class="mail-item-summary">', mail.summary || "暂无摘要", '</span></span>');
            html.push('<span class="mail-item-time">', this.getTimedesc(mail.time), '</span></button>');
        }
        if (!this.messages.length) html.push('<div class="empty">邮箱中没有邮件</div>');
        html.push('</div><div class="mail-detail">', this.createMailDetail(), '</div></div>');
        this.element.html(html.join(""));
    },

    createMailDetail: function () {
        const mail = this.selectedMail;
        if (!mail) {
            return '<div class="mail-detail-empty"><span class="glyphicon glyphicon-envelope"></span><span>选择一封邮件查看详情</span></div>';
        }
        const html = [];
        html.push('<div class="mail-detail-toolbar"><button type="button" class="mail-back" title="返回邮件列表">',
            '<span class="glyphicon glyphicon-chevron-left"></span><span>返回</span></button>',
            '<button type="button" class="mail-delete" cmd="message delete ', mail.from, ' ', mail.index,
            '" title="删除当前邮件"><span class="glyphicon glyphicon-trash"></span><span>删除</span></button></div>');
        html.push('<div class="mail-detail-header"><h3>', mail.title || mail.name || "系统邮件", '</h3>');
        html.push('<div class="mail-detail-meta"><span>来自：', mail.name || "系统", '</span><span>',
            this.formatDateTime(mail.time), '</span></div></div>');
        html.push('<div class="mail-detail-content">', mail.content || "", '</div>');
        if (mail.attach && mail.attach.length) {
            html.push('<section class="mail-attachments"><div class="mail-attachments-title"><span class="glyphicon glyphicon-file"></span> 邮件附件</div>');
            for (let attach of mail.attach) {
                html.push('<div class="mail-attachment"><span>', attach.name || "附件", '</span></div>');
            }
            if (mail.rec) {
                html.push('<div class="mail-attachment-state"><span class="glyphicon glyphicon-ok"></span> 已领取</div>');
            } else {
                html.push('<button type="button" class="mail-claim" cmd="receive ', mail.from, ' ', mail.index,
                    '"><span class="glyphicon glyphicon-saved"></span><span>领取附件</span></button>');
            }
            html.push('</section>');
        } else {
            html.push('<div class="mail-no-attachment">此邮件没有附件</div>');
        }
        return html.join("");
    },

    showNoticeMessage: function (notice) {
        ReceiveMessage("\n<hiy>" + (notice.title || "系统公告") + "</hiy>\n<hic>"
            + notice.content + "\n</hic>");
    },

    updateMessageState: function (from, index) {
        const key = this.mailKey(from, index);
        for (let mail of this.messages) {
            if (this.mailKey(mail.from, mail.index) === key) {
                mail.claimable = false;
                break;
            }
        }
        if (this.selectedMailKey === key && this.selectedMail) {
            this.selectedMail.rec = true;
            this.selectedMail.claimable = false;
        }
    },

    createElement: function () {
        const element = $('<div class="dialog-message"></div>');
        element.on("click", ".notice-toggle", this.toggleNotice);
        element.on("click", ".mail-item", this.showMailDetail);
        element.on("click", ".mail-back", this.backToMailList);
        return element;
    },

    toggleNotice: function () {
        const item = $(this).closest(".notice-item");
        const index = String(item.attr("data-index"));
        const isExpanded = !Dialog.message.expandedNotices.has(index);
        if (isExpanded) Dialog.message.expandedNotices.add(index);
        else Dialog.message.expandedNotices.delete(index);
        item.toggleClass("expanded", isExpanded);
        $(this).attr("aria-expanded", String(isExpanded))
            .find(".notice-toggle-icon")
            .toggleClass("glyphicon-chevron-down", isExpanded)
            .toggleClass("glyphicon-chevron-right", !isExpanded);
    },

    showMailDetail: function () {
        const from = $(this).attr("data-from");
        const index = $(this).attr("data-index");
        if (!from || index === undefined) return;
        SendCommand("message read " + from + " " + index);
    },

    backToMailList: function () {
        Dialog.message.selectedMail = null;
        Dialog.message.selectedMailKey = null;
        Dialog.message.renderMailbox();
    },

    isMobileMailboxDetail: function () {
        return this.footerElements[this.selected_item] === "mail"
            && !!this.selectedMail
            && window.matchMedia("(max-width: 560px)").matches;
    },

    getTimedesc: function (value) {
        const now = new Date();
        const time = new Date(value);
        const diff = (now - time) / 1000;
        if (diff < 60) return "刚刚";
        if (diff < 3600) return parseInt(diff / 60) + "分钟前";
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const target = new Date(time.getFullYear(), time.getMonth(), time.getDate());
        const dayDiff = Math.round((today - target) / 86400000);
        const clock = this.add_zero(time.getHours()) + ":" + this.add_zero(time.getMinutes());
        if (dayDiff === 0) return "今天 " + clock;
        if (dayDiff === 1) return "昨天 " + clock;
        if (dayDiff === 2) return "前天 " + clock;
        return (time.getMonth() + 1) + "月" + time.getDate() + "日";
    },

    formatDate: function (value) {
        const time = new Date(value);
        return time.getFullYear() + "-" + this.add_zero(time.getMonth() + 1) + "-" + this.add_zero(time.getDate());
    },

    formatDateTime: function (value) {
        const time = new Date(value);
        return this.formatDate(value) + " " + this.add_zero(time.getHours()) + ":" + this.add_zero(time.getMinutes());
    },

    add_zero: function (num) {
        return num < 10 ? "0" + num : String(num);
    }
};

const message_css = `
.dialog-message {
    height: 100%;
    min-height: 0;
    overflow: hidden;
    color: var(--theme-text);
}

.dialog-message .empty {
    color: var(--theme-muted);
    padding: 2em 1em;
    text-align: center;
}

.notice-list {
    height: 100%;
    overflow-y: auto;
}

.notice-item {
    margin-bottom: 0.55em;
    border: 1px solid var(--theme-border);
    border-left: 3px solid var(--theme-accent);
    border-radius: 4px;
    background-color: var(--theme-panel);
    overflow: hidden;
}

.notice-toggle {
    width: 100%;
    min-height: 2.6em;
    display: grid;
    grid-template-columns: 1.2em minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.4em;
    padding: 0.5em 0.7em;
    border: 0;
    color: var(--theme-text);
    background: transparent;
    text-align: left;
    cursor: pointer;
}

.notice-toggle-icon {
    color: var(--theme-accent);
}

.notice-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
}

.notice-time {
    color: var(--theme-muted);
    font-size: 0.82em;
}

.notice-summary,
.notice-content {
    padding: 0 0.8em 0.7em 2.3em;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.notice-summary {
    color: var(--theme-muted);
}

.notice-content {
    display: none;
    padding-top: 0.8em;
    border-top: 1px solid var(--theme-border);
    color: var(--theme-text);
    line-height: 1.65;
}

.notice-item.expanded .notice-summary {
    display: none;
}

.notice-item.expanded .notice-content {
    display: block;
}

.mail-layout {
    display: grid;
    grid-template-columns: minmax(12em, 36%) minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--theme-panel);
}

.mail-list,
.mail-detail {
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
}

.mail-list {
    border-right: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.mail-item {
    width: 100%;
    min-height: 4.7em;
    display: grid;
    grid-template-columns: 0.5em minmax(0, 1fr) auto;
    gap: 0.45em;
    align-items: start;
    padding: 0.65em 0.55em;
    border: 0;
    border-bottom: 1px solid var(--theme-border);
    color: var(--theme-muted);
    background: transparent;
    text-align: left;
    cursor: pointer;
}

.mail-item:hover,
.mail-item.selected {
    background-color: var(--theme-surface-2);
}

.mail-item.unread {
    color: var(--theme-text);
    background-color: var(--theme-panel);
}

.mail-status {
    width: 0.48em;
    height: 0.48em;
    margin-top: 0.35em;
    border-radius: 50%;
    background-color: transparent;
}

.mail-item.unread .mail-status {
    background-color: var(--theme-active);
}

.mail-item-main {
    min-width: 0;
    display: block;
}

.mail-item-heading {
    display: flex;
    align-items: center;
    gap: 0.35em;
}

.mail-item-title,
.mail-item-summary {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mail-item-title {
    flex: 1;
    font-weight: bold;
}

.mail-item-summary {
    margin-top: 0.45em;
    color: var(--theme-muted);
    font-size: 0.86em;
}

.mail-attach-icon {
    color: var(--theme-muted);
}

.mail-attach-icon.claimable {
    color: var(--theme-warning);
}

.mail-item-time {
    color: var(--theme-muted);
    font-size: 0.76em;
    white-space: nowrap;
}

.mail-detail {
    padding: 0.9em 1em 1.2em;
    background-color: var(--theme-bg);
}

.mail-detail-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.7em;
    color: var(--theme-muted);
}

.mail-detail-empty .glyphicon {
    font-size: 2em;
}

.mail-detail-toolbar {
    display: flex;
    justify-content: space-between;
    min-height: 2em;
}

.mail-back,
.mail-delete,
.mail-claim {
    min-height: 2.2em;
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    padding: 0 0.7em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    color: var(--theme-text);
    background-color: var(--theme-surface);
    cursor: pointer;
}

.mail-back {
    visibility: hidden;
}

.mail-delete {
    color: var(--theme-danger);
}

.mail-detail-header h3 {
    margin: 0.8em 0 0.4em;
    font-size: 1.15em;
    letter-spacing: 0;
    color: var(--theme-accent);
    overflow-wrap: anywhere;
}

.mail-detail-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.8em;
    padding-bottom: 0.8em;
    border-bottom: 1px solid var(--theme-border);
    color: var(--theme-muted);
    font-size: 0.84em;
}

.mail-detail-content {
    min-height: 5em;
    padding: 1em 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.65;
}

.mail-attachments {
    padding: 0.75em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-panel);
}

.mail-attachments-title {
    margin-bottom: 0.6em;
    color: var(--theme-accent);
    font-weight: bold;
}

.mail-attachment {
    display: inline-block;
    margin: 0 0.45em 0.45em 0;
    padding: 0.35em 0.55em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-surface);
}

.mail-claim {
    display: flex;
    width: max-content;
    margin-top: 0.45em;
    color: var(--theme-button-text);
    background-color: var(--theme-accent);
    border-color: var(--theme-accent);
}

.mail-attachment-state,
.mail-no-attachment {
    margin-top: 0.65em;
    color: var(--theme-muted);
}

.social-commands .glyphicon {
    margin-right: 0.15em;
}

.dialog-team,
.dialog-party,
.dialog-relation {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    box-sizing: border-box;
}

.dialog-team>.empty {
    color: var(--theme-muted);
    padding-top: 1em;
    text-align: center;
}

.dialog-team>.team-item {
    min-height: 2.4em;
    padding-left: 0.5em;
    border: 1px solid var(--theme-border);
    border-left: 2px solid var(--theme-accent);
    border-radius: 4px;
    margin: 0.5em 0;
    background-color: var(--theme-panel);
    line-height: 2em;
    cursor: pointer;
}

.dialog-team>.team-item>.item-commands {
    padding-left: 2em;
}

.dialog-team>.team-item>.team-flag {
    width: 2em;
    display: inline-block;
    text-align: center;
    color: var(--theme-accent);
}

.dialog-relation>.relation-item {
    min-height: 2.4em;
    display: flex;
    margin: 0.5em 0;
    padding-left: 0.5em;
    border: 1px solid var(--theme-border);
    border-left: 2px solid var(--theme-accent);
    border-radius: 4px;
    background-color: var(--theme-panel);
    line-height: 2em;
}

.dialog-relation>.relation-item>.relation-desc {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dialog-relation>.relation-item>.relation-cmd {
    flex: none;
    padding: 0 0.8em;
    border-left: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    cursor: pointer;
}

@media (max-width: 560px) {
    .mail-layout {
        display: block;
    }

    .mail-layout .mail-detail {
        display: none;
        height: 100%;
    }

    .mail-layout.has-selection .mail-list {
        display: none;
    }

    .mail-layout.has-selection .mail-detail {
        display: block;
    }

    .mail-back {
        visibility: visible;
    }

    .notice-toggle {
        grid-template-columns: 1.2em minmax(0, 1fr);
    }

    .notice-time {
        grid-column: 2;
    }

    .notice-summary,
    .notice-content {
        padding-left: 2.3em;
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer {
        flex: 0 0 5em;
        height: 5em;
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        grid-template-rows: 2.5em 2.5em;
        overflow: hidden;
        white-space: normal;
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer>.footer-item {
        width: auto;
        min-width: 0;
        grid-row: 1;
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer>.social-commands {
        grid-column: 1 / -1;
        grid-row: 2;
        float: none;
        display: flex;
        margin: 0;
        border-top: 1px solid var(--theme-border);
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer>.social-commands>span {
        flex: 1;
        margin: 0;
        text-align: center;
    }

    .social-commands span {
        font-size: 0.9em;
    }
}
`;
