function renderJhPills(title, items) {
    if (typeof items == "string") return items;
    if (!items || !items.length) return "";
    var html = ['<div class="jh-skill-section"><div class="jh-skill-title">', title, '</div><div class="jh-skill-pills">'];
    for (let item of items) {
        html.push('<span class="jh-skill-pill grade', item.grade || 0, '"');
        if (item.cmd) html.push(' cmd="', item.cmd, '"');
        html.push('>');
        html.push(item.color_name || item.name);
        html.push('</span>');
    }
    html.push('</div></div>');
    return html.join("");
}

const jh_fam = {
    name: "门派",
    items: null,
    selected_index: 0,
    type: "fam",
    onDetail: function (data) {
        var fb = this.items[data.index];
        if (!fb) return;
        fb.type = '门派';
        fb.desc = data.desc;
        fb.sp = data.sp;
        fb.actions = data.actions;
        fb.skills = data.skills;
        return this.showDetail(fb);
    },
    showDetail: function (fb) {
        var html = ["<pre><hig>"];
        html.push(fb.name);
        html.push("</hig>\n");
        html.push(fb.desc);
        if (fb.sp) {
            html.push("\n<hig>特点：");
            html.push(fb.sp);
            html.push("</hig>\n");
        }

        this.append_actions(html, fb);
        html.push('<div class="item-commands"><span cmd="jh fam ' + fb.index + ' start">进入地图</span>');
        let cmds = [];
        Dialog.extend.append(cmds, 'map', fb);
        for (let item of cmds) {
            html.push('<span cmd="', item.cmd, '">', item.name, '</span>');
        }
        html.push('</div>');
        if (fb.skills) {
            html.push(this.renderSkills(fb.skills));
        }

        html.push("</pre>");
        this.descElement.html(html.join(""));
        this.select(fb.index);
    },
    renderSkills: function (skills) {
        if (skills && typeof skills != "string") {
            skills = skills.map(function (item) {
                if (item.cmd) return item;
                return Object.assign({ cmd: "checkskill " + item.id + " jhhelp" }, item);
            });
        }
        return renderJhPills("门派武功", skills);
    },
    renderDrops: function (drops) {
        return renderJhPills("掉落或解谜奖励", drops);
    },
    append_actions: function (html, fb) {
        let actions = fb.actions ?? [];
        html.push('<div class="fb-actions">');
        for (let item of actions) {
            html.push('<div class="fb-action">');
            html.push('<span class="action-desc">', item[2] ?? "", "</span>");
            if (item[1])
                html.push('<span class="action-name"  cmd="', item[0], '">', item[1], "</span>");
            html.push('</div>');
        }

        html.push('</div>');
    },
    show: function (left_panel, right_panel) {
        var html = [];
        for (var i = 0; i < this.items.length; i++) {
            var fb = this.items[i];
            html.push('<div class="fam-item');
            html.push('" index="', i, '">', fb.name, "</div>");
            fb.index = i;
        }
        left_panel.html(html.join(""));
        this.listElement = left_panel;
        this.descElement = right_panel;
        this.onClickItem(this.selected_index);
    }, select: function (index) {
        var elem = this.listElement.find("div[index='" + index + "']");
        if (elem.length && !elem.is(".selected")) {
            var top = elem[0].offsetTop;
            var height = this.listElement.height();
            if (top > height / 2) {
                top = (height - elem.height()) / 2;
                this.listElement[0].scrollTop = top;
            }
            if (this.selectedItem) this.selectedItem.removeClass("selected");
            this.selectedItem = elem;
            this.selectedItem.addClass("selected");
            this.selected_index = index;
        }
    }, onClickItem: function (index) {
        const item = this.items[index];
        if (!item.desc) SendCommand("jh " + this.type + " " + index);
        else this.showDetail(item);
        this.select(index);
    },
    append_footer: function () {
        let fb = this.items[this.selected_index];
        Dialog.footerElement.find('.item-commands').
            html(`<span cmd="jh fam ${fb.index} start">进入地图</span>`);
    }
};
const jh_fb = {
    name: "副本",
    type: "fb",
    items: null,
    selected_index: -1,
    select: jh_fam.select,
    onClickItem: jh_fam.onClickItem,
    onDetail: function (data) {
        var fb = this.items[data.index];
        if (!fb) return;
        fb.type = '副本';
        fb.desc = data.desc;
        fb.reward = data.reward;
        fb.drops = data.drops;
        fb.diffs = data.diffs;
        fb.status = data.status;
        return this.showDetail(fb);
    }, update_unlock: function (unlock) {
        this.unlock = unlock;
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].unlock = unlock >= i;
        }
        if (this.selected_index < 0)
            this.selected_index = unlock;

    }, show: function (left_panel, right_panel) {
        this.listElement = left_panel;
        this.descElement = right_panel;
        var html = ["<div class='fb-content'>"];
        for (var i = 0; i < this.items.length; i++) {
            var fb = this.items[i];
            html.push('<div class="fb-item');
            if (!fb.unlock) {
                html.push(" lock");
            }
            fb.index = i;
            html.push('" index="', i, '">', fb.name, "</div>");
        }
        html.join("</div>");
        this.listElement.html(html.join(""));
        this.onClickItem(this.selected_index);
    },
    show_first: function (elem) {
        let text = elem.prev().html();
        text && ReceiveMessage(text);
    },
    fb_models: ['普通', '<red>困难</red>', '<cyn>组队</cyn>'],
    showDetail: function (fb) {
        var html = ["<pre>"];
        html.push(fb.name);
        if (fb.unlock) {
            html.push("\n<hig>已解锁</hig>\n");
        } else {
            html.push("\n<red>未解锁</red>\n");
        }
        html.push(fb.desc);
        this.append_status(html, fb);
        if (fb.unlock && fb.diffs) {
            html.push('<div class="item-commands">');
            for (let i = 0; i < fb.diffs.length; i++) {
                if (fb.diffs[i])
                    html.push('<span cmd="jh fb ',
                        fb.index, ' start', i + 1, '">', this.fb_buttons[i], '</span>');
            }
            let cmds = [];
            Dialog.extend.append(cmds, 'map', fb);
            for (let item of cmds) {
                html.push('<span cmd="', item.cmd, '">', item.name, '</span>');
            }
            html.push('</div>');
        }
        if (fb.reward) html.push("\n", fb.reward);
        html.push(jh_fam.renderDrops(fb.drops));
        html.push("</pre>");
        this.descElement.html(html.join(""));
        this.select(fb.index);

    }, append_status: function (html, fb) {
        const sts = fb.status ?? [];
        if (!sts.length) return;
        html.push('<div class="fb-actions">');
        for (let i = 0; i < sts.length; i++) {
            let status = sts[i];
            if (!status) continue;
            if (status[0] === 1) {
                html.push('<div class="fb-action finshed">');
                html.push('<span class="action-desc">由', status[1], "首次通过", "</span>");
                html.push('<span class="action-name" cmd="cr2 ', fb.index, ' ', i, '">', this.fb_models[i], "</span>");
                html.push('</div>');
            } else {
                html.push('<div class="fb-action">');
                html.push('<span class="action-desc">该模式尚未完成首杀',
                    status[1] ? "，称号奖励：" + status[1] : "",
                    "</span>");
                html.push('<span class="action-name"  cmd="cr2 ', fb.index, ' ', i, '">', this.fb_models[i], "</span>");
                html.push('</div>');
            }
        }
        html.push('</div>');
    },
    fb_buttons: ['进入副本', '困难模式', '组队进入'],
    append_footer: function () {
        let fb = this.items[this.selected_index];
        let html = [];
        if (fb.unlock) {
            for (let i = 0; i < fb.diffs.length; i++) {
                if (fb.diffs[i])
                    html.push('<span cmd="jh fb ',
                        fb.index, ' start', i + 1, '">', this.fb_buttons[i], '</span>');
            }
        }
        Dialog.footerElement.find('.item-commands').html(html.join(""));
    }
};
const jh_ar = {
    name: "禁地",
    items: null,
    type: "ar",
    selected_index: 0,
    select: jh_fam.select,
    onClickItem: jh_fam.onClickItem,
    append_status: jh_fb.append_status,
    append_actions: jh_fam.append_actions,
    fb_models: ['普通', '普通', '组队'],
    onDetail: function (data) {
        var fb = this.items[data.index];
        if (!fb) return;
        fb.type = '禁地';
        fb.desc = data.desc;
        fb.actions = data.actions;
        fb.status = data.status;
        fb.reward = data.reward;
        fb.drops = data.drops;
        return this.showDetail(fb);
    }, update_unlock: function (unlock) {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].unlock = (unlock & Math.pow(2, i)) !== 0;
        }
    }, show: function (left_panel, right_panel) {
        var html = ["<div class='fb-content'>"];
        let count = Math.max(this.items.length, 10);
        for (var i = 0; i < count; i++) {
            var fb = this.items[i];
            html.push('<div class="fb-item');
            if (fb) {
                if (!fb.unlock) {
                    html.push(" lock");
                }
                html.push('" index="', i, '">', fb.name, "</div>");
                fb.index = i;
            } else {
                html.push('">&nbsp;</div>');
            }
        }
        html.join("</div>");
        this.listElement = left_panel;
        this.descElement = right_panel;
        this.listElement.html(html.join(""));
        this.onClickItem(this.selected_index);

    }, showDetail: function (fb) {
        var html = ["<pre>"];
        html.push(fb.name);
        if (fb.unlock) {
            html.push("\n<hig>已解锁</hig>\n");
        } else {
            html.push("\n<red>未解锁</red>\n");
        }
        html.push(fb.desc, '\n');
        this.append_status(html, fb);
        this.append_actions(html, fb);
        if (fb.unlock) {
            html.push('<div class="item-commands">');
            html.push(`<span cmd="jh ar ${fb.index} start">进入地图</span>`);
            let cmds = [];
            Dialog.extend.append(cmds, 'map', fb);
            for (let item of cmds) {
                html.push('<span cmd="', item.cmd, '">', item.name, '</span>');
            }
            html.push('</div>');
        }
        if (fb.reward) html.push("\n", fb.reward);
        html.push(jh_fam.renderDrops(fb.drops));
        html.push("</pre>");
        this.descElement.html(html.join(""));
        this.select(fb.index);

    },
    append_footer: function () {
        let fb = this.items[this.selected_index];
        if (fb.unlock)
            Dialog.footerElement.find('.item-commands').
                html(`<span cmd="jh ar ${fb.index} start">进入地图</span>`);
        else
            Dialog.footerElement.find('.item-commands').empty();
    }
};

function queryMijingTime(status) {
    if (!status || !status.active || !(status.expiresAt > 0)) return "未开始";
    const seconds = Math.max(0, Math.ceil((status.expiresAt - Date.now()) / 1000));
    if (!seconds) return "即将结算";
    const minutes = Math.floor(seconds / 60);
    return minutes + "分" + String(seconds % 60).padStart(2, "0") + "秒";
}

const MIJING_DROPS = [
    { name: "潜能", color_name: "潜能", grade: 2 },
    { name: "经验", color_name: "经验", grade: 2 }
];

const jh_mj = {
    name: "秘境",
    type: "mj",
    items: null,
    selected_index: 0,
    select: jh_fam.select,
    onClickItem: function (index) {
        const item = this.items && this.items[index];
        if (!item) return;
        if (!item.desc) SendCommand("jh mj " + index);
        else this.showDetail(item);
        this.select(index);
    },
    onDetail: function (data) {
        const item = this.items && this.items[data.index];
        if (!item) return;
        item.type = "秘境";
        item.desc = data.desc;
        item.drops = data.drops || MIJING_DROPS;
        item.status = data.status || item.status;
        item.actions = data.actions;
        this.showDetail(item);
    },
    show: function (left_panel, right_panel) {
        this.listElement = left_panel;
        this.descElement = right_panel;
        const html = ["<div class='fb-content'>"];
        const items = this.items || [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.index = i;
            html.push('<div class="fb-item mj-item" index="', i, '">', item.name, "</div>");
        }
        html.push("</div>");
        this.listElement.html(html.join(""));
        const selected = this.items && this.items[this.selected_index];
        if (selected) selected.desc = null;
        this.onClickItem(this.selected_index);
        this.startTimer();
    },
    showDetail: function (item) {
        const status = item.status || {};
        const html = ["<pre>", "<hig>", item.name, "</hig>\n"];
        html.push(item.desc || "");
        html.push("\n\n<hiy>挑战状态</hiy>\n");
        if (status.active) {
            html.push("进行中：击杀 ", status.kills || 0, "/", status.maxKills || 100,
                "，剩余 ", queryMijingTime(status), "。\n");
        } else {
            html.push("今日挑战：", status.dailyCount || 0, "/", status.dailyLimit || 1,
                "，归墟种：", status.ticket || 0, "枚。\n");
        }
        html.push(renderJhPills("掉落物", item.drops));
        html.push("</pre>");
        this.descElement.html(html.join(""));
        this.select(item.index);
        this.append_footer();
    },
    append_footer: function () {
        const item = this.items && this.items[this.selected_index];
        if (!item) return Dialog.footerElement.find(".item-commands").empty();
        const status = item.status || {};
        let html = [];
        if (status.active) {
            html.push('<span cmd="mijing over">结束挑战</span>');
        } else if ((status.dailyCount || 0) >= (status.dailyLimit || 1)) {
            html.push('<span class="disabled">今日挑战次数已用尽</span>');
        } else if ((status.ticket || 0) > 0) {
            html.push('<span cmd="jh mj ', item.index, ' start">进入秘境</span>');
        } else {
            html.push('<span cmd="shop">购买归墟种</span>');
        }
        Dialog.footerElement.find(".item-commands").html(html.join(""));
    },
    updateStatus: function (status, index) {
        const item = this.items && this.items[index];
        if (!item) return;
        item.status = status;
        if (this.selected_index === index && this.descElement) this.showDetail(item);
    },
    startTimer: function () {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            const item = this.items && this.items[this.selected_index];
            if (item && item.status && item.status.active && this.descElement && this.isVisible()) {
                this.showDetail(item);
            }
        }, 1000);
    },
    isVisible: function () {
        return this.listElement && this.listElement.closest(".dialog-fb").length > 0;
    },
    close: function () {
        clearInterval(this.timer);
        this.timer = null;
    }
};
const MAP_TYPES = {
    fb: jh_fb,
    fam: jh_fam,
    ar: jh_ar,
    mj: jh_mj
};
export default {
    init: function () {
        Dialog.injectStyle(jh_css);
    },
    close: function () {
        jh_mj.close();
        this.hideSkillDetail();
        this.element.remove();
        this.isShow = false;
    },
    onData: function (data) {
        if (data.close) {
            return Dialog.isShow && Dialog.hide();
        }
        if (data.skill) return this.showSkillDetail(data.skill);
        if (data.drop) return this.showDropDetail(data.drop);
        if (data.desc) {
            const dialog = MAP_TYPES[data.t] || this.selected_item;
            return dialog && dialog.onDetail(data);
        }

        if (data.t === "mj") {
            if (data.status) {
                jh_mj.updateStatus(data.status, data.index || 0);
            }
            return;
        }

        if (data.unlock !== undefined || data.unlock2 !== undefined) {
            return this.update_lock(data);
        }
        if (data.refresh !== undefined && this.isLoad) {
            let dialog = MAP_TYPES[data.t];
            let item = dialog.items[data.refresh];
            if (item && item.desc) {
                item.desc = null;
                let index = dialog.items.indexOf(item);
                if (dialog.selected_index == index) {
                    dialog.onClickItem(index);
                }
            }
            return;
        }
        if (!data.fbs && !data.mijings) return;
        jh_fam.items = (data.families || []).map(function (x) { return { name: x, unlock: false }; });
        jh_fb.items = (data.fbs || []).map(function (x) { return { name: x }; });
        jh_ar.items = (data.areas || []).map(function (x) { return { name: x, unlock: false }; });
        jh_mj.items = (data.mijings || []).map(function (x) { return { name: x }; });
        this.selected_item.show(this.listElement, this.descElement);
    },
    show: function () {
        if (this.isShow) return;
        if (!this.element)
            this.element = $("<div class='dialog-fb'><div class='fb-left'></div><div class='fb-right'></div></div>");
        this.listElement = this.element.find(".fb-left").off("click.jhList").on("click.jhList",
            ".fb-item,.fam-item,.mj-item", this.item_click);
        this.descElement = this.element.find(".fb-right");
        this.element.off("click.jhSkill")
            .on("click.jhSkill", ".jh-skill-detail-close,.jh-skill-detail-mask", this.skill_detail_close)
            .on("click.jhSkill", ".jh-skill-detail", function (e) { e.stopPropagation(); });
        Dialog.title("江湖");
        Dialog.icon("home");
        this.element.appendTo(Dialog.contentElement);
        this.isShow = true;
        if (this.isLoad) {
            SendCommand("jh fb lock");
        } else {
            SendCommand("jh");
            this.isLoad = true;
            this.selected_item = this.footers[0];
        }
        this.create_footer();
    },
    selected_item: null,
    footers: [jh_fam, jh_fb, jh_ar, jh_mj],
    create_footer: function () {
        var html = [];
        for (var i = 0; i < this.footers.length; i++) {
            let item = this.footers[i];
            html.push("<span class='footer-item" +
                (item == this.selected_item ? " select" : "") + "' for='" + i + "'>"
                + this.footers[i].name + "</span>");
        }
        html.push('<div class="item-commands"></div>');
        Dialog.footerElement.html(html.join(""));
    }, item_click: function () {
        var elem = $(this);
        if (elem.is(".selected")) return;
        let index = elem.attr("index");
        if (index !== undefined)
            Dialog.jh.selected_item.onClickItem(index);
    },
    skill_detail_close: function () {
        Dialog.jh.hideSkillDetail();
    },
    hideSkillDetail: function () {
        if (this.skillDetailElement) {
            this.skillDetailElement.remove();
            this.skillDetailElement = null;
        }
    },
    showSkillDetail: function (skill) {
        this.showDetailPopup(skill);
    },
    showDropDetail: function (drop) {
        this.showDetailPopup(drop);
    },
    showDetailPopup: function (item) {
        this.hideSkillDetail();
        var html = ['<div class="jh-skill-detail-mask"><div class="jh-skill-detail grade',
            item.grade || 0, '">'];
        html.push('<div class="jh-skill-detail-header"><span class="jh-skill-detail-title">');
        html.push(item.color_name || item.name);
        html.push('</span><span class="jh-skill-detail-close">关闭</span></div>');
        html.push('<pre class="jh-skill-detail-body">');
        html.push(item.desc);
        html.push('</pre></div></div>');
        this.skillDetailElement = $(html.join("")).appendTo(this.element);
    },
    update_lock: function (data) {
        if (data.unlock >= 0 && jh_fb.items) {
            jh_fb.update_unlock(data.unlock);
            if (this.selected_item === jh_fb)
                jh_fb.show(this.listElement, this.descElement);
        }
        if (data.unlock2 >= 0 && jh_ar.items) {
            jh_ar.update_unlock(data.unlock2);
            if (this.selected_item === jh_ar)
                jh_ar.show(this.listElement, this.descElement);
        }

    },
    footerChanged: function (index) {
        let item = this.footers[index];
        if (item == this.selected_item) return;
        this.selected_item = item;
        Dialog.footerElement.find('.item-commands').empty();
        item.show(this.listElement, this.descElement);
    }
};

const jh_css = `


.dialog-fb {
    position: relative;
    height: 100%;
    min-height: 0;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
}

.dialog-fb>.fb-left {
    width: 12.5em;
    height: 100%;
    text-align: center;
    margin-top: 0.5em;
    overflow-y: auto;
}

.dialog-fb>.fb-right {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding-left: 0.5em;
}

.fb-actions {
    margin-top: 0.5em;
}

.fb-actions>.fb-action {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.fb-actions>.fb-action>.action-desc {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: gray;
    overflow: hidden;
}

.fb-actions>.fb-action>.action-name {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

.fb-actions>.fb-action>.action-name:hover {
    background-color: #333;
}

.fb-actions>.finshed {
    border-left-color: var(--theme-grade-1);
}

.fb-actions>.finshed>.action-desc {
    color: var(--theme-grade-1);
}

.dialog-fb>.fb-right>pre {
    white-space: pre-wrap;
    margin: 0.5em 0.5em 2em 0.5em;
}

.jh-skill-section {
    margin-top: 1em;
}

.jh-skill-title {
    margin-bottom: 0.5em;
    color: var(--theme-muted);
}

.jh-skill-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
}

.jh-skill-pill {
    display: inline-flex;
    align-items: center;
    min-height: 1.8em;
    padding: 0 0.9em;
    border: 1px solid var(--border-color, var(--theme-border));
    border-radius: 999px;
    background-color: var(--theme-panel);
    color: var(--border-color, var(--theme-text));
    line-height: 1.8em;
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}

.jh-skill-pill:hover {
    background-color: var(--theme-surface);
    color: var(--theme-accent);
}

.jh-skill-detail-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75em;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 2;
}

.jh-skill-detail {
    width: min(28rem, 100%);
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color, var(--theme-border));
    border-radius: var(--popup-radius, 4px);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    box-shadow: 0 1em 2em rgba(0, 0, 0, 0.28);
}

.jh-skill-detail-header {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.55em 0.7em;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.jh-skill-detail-title {
    flex: 1;
    color: var(--border-color, var(--theme-accent));
    font-weight: bold;
}

.jh-skill-detail-close {
    flex: none;
    color: var(--theme-muted);
    cursor: pointer;
    user-select: none;
}

.jh-skill-detail-close:hover {
    color: var(--theme-accent);
}

.jh-skill-detail-body {
    flex: 1;
    margin: 0;
    padding: 0.9em;
    overflow: auto;
    white-space: pre-wrap;
}

@media (max-width: 480px) {
    .jh-skill-detail-mask {
        padding: 0.55em;
    }

    .jh-skill-detail {
        width: 100%;
    }
}

.dialog-fb>.fb-left>.fb-content {
    height: 100%;
    overflow: auto;
}

.dialog-fb>.fb-left>.fb-content>.fb-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}


.dialog-fb>.fb-left>.fam-item {
    line-height: 2em;
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}

.dialog-fb>.fb-left>.fb-content>.line {
    height: 1.25em;
    width: 0px;
    border-left: 1px solid #343434;
    margin-left: auto;
    margin-right: auto;
    margin-top: -1em;
    margin-bottom: -1em;
}

.dialog-fb>.fb-left>.fb-content>.lock {
    border-color: #bebebe;
    color: #bebebe !important;
    opacity: 0.6;
}

.dialog-fb>.fb-left>.fb-content .selected,
.dialog-fb>.fb-left>.selected {
    border-color: var(--theme-grade-1);
    color: var(--theme-grade-1);
}

.dialog-fb .item-commands .disabled {
    color: var(--theme-muted);
    cursor: default;
}

.dialog-fb>.fb-left>.fb-content>.lock:before {
    font-family: 'Glyphicons Halflings';
    content: "\\e033";
    float: left;
    margin-left: 0.25em;
    opacity: 0.6;
}
`;
