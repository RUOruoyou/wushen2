
import DialogScore from './score.js';
import DialogMap from './map.js';
import DialogKeys from './keys.js';
import DialogSetting from './setting.js';
import DialogExtend from './extend.js';
import DialogChannel from './channel.js';
import DialogPack from './packet.js';
import DialogSkills from './skills.js';
import DialogTasks from './tasks.js';
import DialogShop from './shop.js';
import DialogMessage from './message.js';
import DialogStats from './stats.js';
import DialogJh from './jh.js';
import DialogRelation from './relation.js';
import DialogTeam from './team.js';
import DialogParty from './party.js';
import DialogTrade from './trade.js';
import DialogEvents from './events.js';
import DialogPm from './paimai.js';
import DialogPack2 from './packet2.js';
import DialogMaster from './master.js';
import DialogList from './list.js';
import DialogItem from './item.js';
import DialogPackManage from './packmanage.js';

const dialogThemeOverrideCss = `
.dialog,
.dialog>.dialog-content {
    background-color: var(--theme-bg) !important;
    color: var(--theme-text) !important;
}

	.dialog>.dialog-header,
	.dialog>.dialog-footer {
	    background-color: var(--theme-surface-2) !important;
	    color: var(--theme-text) !important;
	    border-color: var(--theme-border) !important;
	}

	.dialog,
	.dialog-confirm,
	.warn-dialog,
	.dialog-content .obj-desc-panel,
	.dialog-content .jh-skill-detail {
	    border-radius: var(--popup-radius, 4px) !important;
	}

.dialog>.dialog-header>.dialog-title,
.dialog>.dialog-header>.dialog-icon,
.dialog-content .event-item h3,
.dialog-content .shop-item-title>.shop-item-name,
.dialog-content .dialog-message>.message-list>.message-item>.message-title,
.dialog-content .dialog-team>.team-item>.team-flag,
.dialog-content .detail-item>.detail-name,
.dialog-content .dialog-party>.party-notice,
.dialog-content .dialog-shop-footer>span {
    color: var(--theme-accent) !important;
}

.dialog>.dialog-header>.dialog-close,
.dialog>.dialog-footer>.footer-item,
.dialog>.dialog-footer>.trade_btn,
.dialog-content .empty,
.dialog-content .eq-list>.empty,
.dialog-content .dialog-message>.message-list>.empty,
.dialog-content .dialog-team>.empty,
.dialog-content .dialog-pms>.empty,
.dialog-content .detail-item>.detail-time,
.dialog-content .dialog-pms>.pm-item>.pm-mem,
.dialog-content .fb-actions>.fb-action>.action-desc,
.dialog-content .dialog-tasks>.task-item>.start,
.dialog-content .dialog-tasks>.none>.task-btn,
.dialog-content .obj-item>.obj-oper,
.dialog-content mem {
    color: var(--theme-muted) !important;
    border-color: var(--theme-border) !important;
}

.dialog-content .eq-list>.eq-item,
.dialog-content .obj-list>.obj-item,
.dialog-content .trade-list>.obj-item,
.dialog-content .dialog-list>.otype-list>.otype-item,
.dialog-content .dialog-skills>.skill-item,
.dialog-content .dialog-skills>.book-item,
.dialog-content .dialog-tasks>.task-item,
.dialog-content .dialog-events>.event-item,
.dialog-content .dialog-pms>.pm-item,
.dialog-content .stats-container-left>.stats-silder,
.dialog-content .dialog-stats>.top-item,
.dialog-content .fb-actions>.fb-action,
.dialog-content .dialog-fb>.fb-left>.fb-content>.fb-item,
.dialog-content .dialog-fb>.fb-left>.fam-item,
.dialog-content .dialog-shop>.shop-item,
.dialog-content .dialog-message>.message-list>.message-item,
.dialog-content .dialog-team>.team-item,
.dialog-content .dialog-relation>.relation-item,
.dialog-content .detail-item,
.dialog-content .dialog-party>.party-roles>.party-role,
.dialog-content .dialog-party>.party-item,
.dialog-content .dialog-score>.score-section,
.dialog-content .dialog-titles>.title-item {
    background-color: var(--theme-panel) !important;
    color: var(--theme-text) !important;
    border-color: var(--theme-border) !important;
}

.dialog>.dialog-footer>.eq-group,
.dialog>.dialog-footer>.sk-group,
.dialog-content .eq-list>.eq-item>.eq-type,
.dialog-content .obj-item>.obj-oper,
.dialog-content .dialog-skills>.book-item>.book-action,
.dialog-content .fb-actions>.fb-action>.action-name,
.dialog-content .dialog-relation>.relation-item>.relation-cmd,
.dialog-content .detail-item>.detail-rec,
.dialog-content .dialog-party>.party-item>.party-item-cmd,
.dialog-content .dialog-shop>.shop-item>.shop-btn {
    background-color: var(--theme-surface) !important;
    color: var(--theme-muted) !important;
    border-color: var(--theme-border) !important;
}

.dialog-content .dialog-party>.dialog-party-add>input {
    background-color: var(--theme-panel) !important;
    color: var(--theme-text) !important;
    border-color: var(--theme-border) !important;
}

.dialog-content .dialog-fb>.fb-left>.fb-content>.line {
    border-left-color: var(--theme-border) !important;
}

.dialog-content .dialog-fb>.fb-left>.fb-content>.lock {
    color: var(--theme-muted) !important;
    border-color: var(--theme-border) !important;
}

.dialog>.dialog-footer>.select,
.dialog-content .dialog-list>.otype-list>.select,
.dialog-content .stats-container-left>.select,
.dialog-content .dialog-pms>.selected {
    background-color: var(--theme-accent) !important;
    color: var(--theme-button-text) !important;
    border-color: var(--theme-accent) !important;
}

.dialog-content .cleanup>.obj-item>.selected,
.dialog-content .dialog-tasks>.finish,
.dialog-content .dialog-tasks>.finish>.task-btn,
.dialog-content .dialog-tasks>.task-item>.finish,
.dialog-content .fb-actions>.finshed,
.dialog-content .fb-actions>.finshed>.action-desc,
.dialog-content .dialog-fb>.fb-left>.fb-content .selected,
.dialog-content .dialog-fb>.fb-left>.selected,
.dialog-content .dialog-titles>.selected {
    background-color: var(--theme-surface) !important;
    color: var(--theme-accent) !important;
    border-color: var(--theme-accent) !important;
}

.dialog-content .dialog-tasks>.over,
.dialog-content .dialog-tasks>.over>.task-btn,
.dialog-content .dialog-tasks>.task-item>.over,
.dialog-content .dialog-pms>.pm-item>.pm-add {
    color: var(--theme-active) !important;
    border-color: var(--theme-active) !important;
}

.dialog-content .task-item>.task-btn:hover,
.dialog-content .dialog-pms>.pm-item>.pm-add:hover,
.dialog-content .fb-actions>.fb-action>.action-name:hover {
    background-color: var(--theme-surface-2) !important;
    color: var(--theme-text) !important;
}

.dialog-content .shop-item-title>.discount-tag,
.dialog-content .dialog-shop>.shop-item .shop-label {
    background: var(--theme-active) !important;
    color: var(--theme-button-text) !important;
    box-shadow: none !important;
    text-shadow: none !important;
}

.dialog-content .dialog-score2 .value,
.dialog-content .dialog-titles>.title-item>.btn-noused {
    background-color: var(--theme-surface) !important;
    color: var(--theme-accent) !important;
    border-color: var(--theme-border) !important;
}
`;



const Dialog = {
    isShow: false,
    curItem: null,
    score: DialogScore,
    map: DialogMap,
    keys: DialogKeys,
    setting: DialogSetting,
    extend: DialogExtend,
    channel: DialogChannel,
    pack: DialogPack,
    skills: DialogSkills,
    tasks: DialogTasks,
    shop: DialogShop,
    message: DialogMessage,
    stats: DialogStats,
    jh: DialogJh,
    relation: DialogRelation,
    team: DialogTeam,
    party: DialogParty,
    trade: DialogTrade,
    events: DialogEvents,
    pm: DialogPm,
    pack2: DialogPack2,
    master: DialogMaster,
    list: DialogList,
    item: DialogItem,
    packmanage: DialogPackManage,
    themeStyleElement: null,

    show: function (name, data) {
        if (!name) return;
        const dialog = this[name];
        if (!dialog) throw new Error('没有' + name);
        if (!dialog.created) {
            dialog.init();
            dialog.created = true;
        }
        if (!data) {
            if (this.isShow && name == this.curItem) return this.hide();
            if (this.curItem && name != this.curItem) {
                Dialog[Dialog.curItem].close && Dialog[Dialog.curItem].close();
                Dialog[Dialog.curItem].isShow = false;
                Dialog.contentElement.empty();
            }
            this.init();
            this.curItem = name;
            dialog.show(data);
            Process.message.scroll2end();
        } else {
            dialog.onData(data);
        }
    },
    select: function (name) {
        if (this.isShow && name == this.curItem) return this.hide();
        if (this.curItem && name != this.curItem) {
            Dialog[Dialog.curItem].close && Dialog[Dialog.curItem].close();
            Dialog[Dialog.curItem].isShow = false;
            Dialog.contentElement.empty();
        }
        this.init();
        this.curItem = name;
    },
    init: function () {
        if (this.isShow) return;
        if (!this.isInit) {
            this.contentElement = $(".dialog>.dialog-content");
            this.titleElement = $(".dialog>.dialog-header>.dialog-title");
            this.iconElement = $(".dialog>.dialog-header>.dialog-icon");
            this.footerElement = $(".dialog>.dialog-footer")
                .on("click", ".footer-item", Dialog.footerClick);
            this.hiddenElement = $(".hidden-item");
            this.element = $(".dialog");
            $(".dialog>.dialog-header>.dialog-close").on("click", Dialog.hide);
            this.isInit = true;
        }
        $(".container").addClass("dialog-open");
        $(".content-room").removeClass("hide");
        this.element.removeClass("hide");
        this.isShow = true;
    },
    hide: function () {
        if (Dialog[Dialog.curItem].hide && Dialog[Dialog.curItem].hide() == false) return;
        Dialog.close();
    },
    footerClick: function () {
        var elem = $(this);
        if (elem.is(".select")) return;
        var cmd = elem.attr("for");
        elem.parent().find(".footer-item.select").removeClass("select");
        elem.addClass("select");
        Dialog[Dialog.curItem].footerChanged(cmd, elem);
    },
    title: function (title) {
        Dialog.titleElement.html(title);
    },
    icon: function (css) {
        this.iconElement.attr("class", "dialog-icon glyphicon glyphicon-" + css);
    },
    footer: function (html) {
        html ? this.footerElement.html(html) : this.footerElement.empty();
    },
    close: function () {
        if (!Dialog.isShow) return;
        Dialog.isShow = false;
        $(".container").removeClass("dialog-open");
        $(".content-room").removeClass("hide");
        Dialog.element.addClass("hide");
    },
    injectStyle: function (css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.append(style);
        this.refreshThemeStyle();
    },
    refreshThemeStyle: function () {
        if (!this.themeStyleElement) {
            this.themeStyleElement = document.createElement("style");
            this.themeStyleElement.id = "dialog-theme-overrides";
            this.themeStyleElement.textContent = dialogThemeOverrideCss;
        } else {
            this.themeStyleElement.remove();
        }
        document.head.append(this.themeStyleElement);
    },
};

export default Dialog;
