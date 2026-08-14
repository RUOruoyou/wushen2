const itemCss = `
.dialog-item {
    min-height: 8em;
}

.dialog.dialog-item-dialog>.dialog-content {
    position: relative;
}

.dialog.dialog-item-dialog {
    width: min(30rem, calc(100% - 4rem));
}

@media (max-width: 480px) {
    .dialog.dialog-item-dialog {
        width: calc(100% - 2.5rem);
    }
}

.dialog-item>.item-desc {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
}

.dialog-item-subdialog-mask {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75em;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}

.dialog-item-subdialog {
    width: min(26rem, 100%);
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    box-shadow: 0 1em 2em rgba(0, 0, 0, 0.28);
}

.dialog-item-subdialog-header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.55em 0.7em;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.dialog-item-subdialog-title {
    flex: 1;
    color: var(--theme-accent);
    font-weight: bold;
}

.dialog-item-subdialog-close {
    flex: none;
    cursor: pointer;
    color: var(--theme-muted);
    user-select: none;
}

.dialog-item-subdialog-body {
    flex: 1 1 auto;
    min-height: 4em;
    max-height: 18em;
    margin: 0;
    padding: 0.8em;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
}

.dialog-item-subdialog-actions {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25em;
    min-height: 2.5em;
    margin: 0;
    padding: 0.2em 0.4em;
    max-width: 100%;
    overflow: hidden;
    white-space: normal;
    border-top: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.dialog-item-subdialog-actions>span {
    flex: 0 0 auto;
    margin: 0;
    padding: 0 0.4em;
    height: 2em;
    line-height: 2em;
}

.dialog-item-actions {
    float: none;
    display: inline-flex;
    flex-wrap: wrap;
    flex: 0 0 auto;
    max-width: 100%;
    align-items: center;
    gap: 0.25em;
    justify-content: flex-end;
    margin-left: auto;
    text-align: right;
    white-space: normal;
    padding: 0;
}

.dialog-item-actions>span {
    flex: 0 0 auto;
    margin: 0;
    padding: 0 0.35em;
}

.dialog.dialog-item-dialog>.dialog-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 0.25em;
}

@media (max-width: 480px) {
    .dialog-item-actions {
        gap: 0.2em;
    }

    .dialog-item-actions>span {
        min-width: auto;
        padding: 0 0.3em;
        font-size: 0.92em;
    }

    .dialog-item-subdialog-mask {
        padding: 0.55em;
    }

    .dialog-item-subdialog {
        width: 100%;
    }

    .dialog-item-subdialog-body {
        max-height: 15em;
    }

    .dialog-item-subdialog-actions {
        gap: 0.2em;
    }

    .dialog-item-subdialog-actions>span {
        min-width: auto;
        padding: 0 0.3em;
        font-size: 0.92em;
    }
}
`;

export default {
    isShow: false,
    item: null,
    commandKeys: null,
    interactionCommandKeys: null,
    subdialogElement: null,
    capturePrompt: false,
    capturePromptUntil: 0,
    interactionPromptUntil: 0,
    init: function () {
        Dialog.injectStyle(itemCss);
        this.commandKeys = {};
    },
    open: function (item) {
        if (!this.created) {
            this.init();
            this.created = true;
        }
        if (!(Dialog.isShow && Dialog.curItem === "item")) Dialog.select("item");
        Dialog.element.addClass("dialog-item-dialog");
        this.item = item;
        this.commandKeys = {};
        this.interactionCommandKeys = {};
        this.closeInteractionDialog();
        this.render(item);
        this.isShow = true;
    },
    hide: function () {
        this.isShow = false;
        this.item = null;
        this.commandKeys = {};
        this.interactionCommandKeys = {};
        this.capturePrompt = false;
        this.capturePromptUntil = 0;
        this.interactionPromptUntil = 0;
        this.closeInteractionDialog();
        Dialog.element && Dialog.element.removeClass("dialog-item-dialog");
    },
    close: function () {
        this.hide();
    },
    render: function (item) {
        Dialog.title(item.name || "查看");
        Dialog.icon(item.p || item.me ? "user" : "info-sign");
        Dialog.contentElement.html("<div class='dialog-item'><pre class='item-desc'></pre></div>");
        Dialog.contentElement.find(".item-desc").html(item.desc || item.name || "");
        this.setCommands(item.commands || []);
    },
    captureNextPrompt: function () {
        this.capturePrompt = true;
        this.capturePromptUntil = Date.now() + 3000;
        this.interactionPromptUntil = 0;
    },
    appendPrompt: function (text) {
        if (!text || !(Dialog.isShow && Dialog.curItem === "item") || !this.isShow) return false;
        var now = Date.now();
        if (!this.capturePrompt && (!this.subdialogElement || now > this.interactionPromptUntil)) return false;
        if (this.capturePrompt && now > this.capturePromptUntil) {
            this.capturePrompt = false;
            this.capturePromptUntil = 0;
            return false;
        }
        if (this.capturePrompt && this.isInteractionEcho(text)) {
            return true;
        }
        this.capturePrompt = false;
        this.capturePromptUntil = 0;
        this.interactionPromptUntil = now + 1500;
        if (this.subdialogElement && this.subdialogElement.length) this.appendInteractionPrompt(text);
        else this.openInteractionDialog(text);
        return true;
    },
    isInteractionEcho: function (text) {
        if (!text) return false;
        var plain = text.replace(/<[^>]+>/g, "").trim();
        if (!plain) return true;
        var name = this.item && this.item.name ? this.item.name.replace(/<[^>]+>/g, "") : "";
        return plain.indexOf("你向") === 0 && (!name || plain.indexOf(name) >= 0) &&
            (plain.indexOf("问道") >= 0 || plain.indexOf("打听") >= 0 || plain.indexOf("说道") >= 0);
    },
    isCapturingInteraction: function () {
        if (!(Dialog.isShow && Dialog.curItem === "item") || !this.isShow) return false;
        if (this.subdialogElement && this.subdialogElement.length) return true;
        if (!this.capturePrompt) return false;
        if (Date.now() <= this.capturePromptUntil) return true;
        this.capturePrompt = false;
        this.capturePromptUntil = 0;
        return false;
    },
    openInteractionDialog: function (text) {
        if (!this.subdialogElement || !this.subdialogElement.length) {
            var html = [
                "<div class='dialog-item-subdialog-mask'>",
                "<div class='dialog-item-subdialog'>",
                "<div class='dialog-item-subdialog-header'>",
                "<span class='dialog-item-subdialog-title'>提示</span>",
                "<span class='dialog-item-subdialog-close'>关闭</span>",
                "</div>",
                "<pre class='dialog-item-subdialog-body'></pre>",
                "<div class='item-commands dialog-item-subdialog-actions'></div>",
                "</div>",
                "</div>"
            ];
            this.subdialogElement = $(html.join("")).appendTo(Dialog.contentElement);
            this.subdialogElement.on("click", ".dialog-item-subdialog-close", this.closeInteractionDialog.bind(this));
        }
        this.interactionCommandKeys = {};
        this.subdialogElement.find(".dialog-item-subdialog-body").html(text || "");
        this.subdialogElement.find(".dialog-item-subdialog-actions").empty();
        this.subdialogElement.find(".dialog-item-subdialog-body")[0].scrollTop = 0;
    },
    appendInteractionPrompt: function (text) {
        var body = this.subdialogElement && this.subdialogElement.find(".dialog-item-subdialog-body");
        if (!body || !body.length) return;
        var current = body.html();
        body.html(current ? current + "\n" + text : text);
        body[0].scrollTop = body[0].scrollHeight;
    },
    closeInteractionDialog: function () {
        if (this.subdialogElement) {
            this.subdialogElement.remove();
            this.subdialogElement = null;
        }
        this.capturePrompt = false;
        this.capturePromptUntil = 0;
        this.interactionPromptUntil = 0;
        this.interactionCommandKeys = {};
    },
    appendInteractionCommands: function (commands) {
        if (!commands) return;
        if (!this.subdialogElement || !this.subdialogElement.length) {
            this.openInteractionDialog("");
        }
        this.appendCommandButtons(this.subdialogElement.find(".dialog-item-subdialog-actions"), commands, this.interactionCommandKeys);
    },
    setCommands: function (commands) {
        Dialog.footer("<div class='item-commands dialog-item-actions'></div>");
        this.appendCommands(commands);
    },
    appendCommands: function (commands) {
        this.appendCommandButtons(Dialog.footerElement.find(".dialog-item-actions"), commands, this.commandKeys);
    },
    appendCommandButtons: function (target, commands, commandKeys) {
        if (!commands) return;
        if (!Array.isArray(commands)) commands = [commands];
        if (!commandKeys) commandKeys = {};
        var html = [];
        for (var i = 0; i < commands.length; i++) {
            var item = commands[i];
            if (!item || !item.cmd) continue;
            if (this.item && item.cmd === "look " + this.item.id) continue;
            var key = item.cmd + "\u0000" + (item.name || "");
            if (commandKeys[key]) continue;
            commandKeys[key] = true;
            html.push("<span cmd='");
            html.push(item.cmd);
            html.push("'>");
            html.push(item.name || item.cmd);
            html.push("</span>");
        }
        if (html.length) target.append(html.join(""));
    }
};
