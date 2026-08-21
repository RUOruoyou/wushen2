import Setting from '../setting.js';
import Util from '../utils/util.js';
import SCRIPT from '../script.js';
import Combat from '../combat.js';

const EQUIPMENT_PARTS = ['武器', '衣服', '鞋', '头部', '披风', '戒指', '项链', '饰品', '护腕', '腰带', '暗器'];

export default {
    close: function () {
        this.hide();
        this.element.remove();
        //Dialog.footerElement.addClass("hide");
        this.isShow = false;
        this.skill_element_id = null;
        this.element.removeClass("hide-item");
    },
    hide: function () {
        if (this.objelement) {
            this.objelement.remove();
            this.objelement = null;
        }
        if (Dialog.element) Dialog.element.removeClass("dialog-pack-dialog");
        if (Dialog.footerElement) Dialog.footerElement.removeClass("pack-footer pack-cleanup-footer");
    },
    init: function () {
        if (!this.created) {
            Dialog.injectStyle(packet_css);
            Dialog.injectStyle(list_css);
        }
        this.created = true;
    },
    command_before: '',
    updateitem: function (data) {
        if (data.money != undefined) {
            this.money = data.money;
            this.show_moeny();
        }
        if (data.eq_group !== undefined) {
            this.eq_group = data.eq_group;
            this.show_moeny();
        }
        else if (data.eq != undefined && this.items) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].id == data.id) {
                    this.eqs[data.eq] = this.items[i];
                    this.items.splice(i, 1);

                    break;
                }
            }
            this.show_items();
        } else if (data.uneq != undefined && this.items) {
            var item = this.eqs[data.uneq];
            item.can_eq = 1;
            item.count = 1;
            this.items.push(item);
            this.eqs[data.uneq] = null;

            this.show_items();

        }
        else if (data.locked >= 0) {
            let item = this.get_item(data.id);
            if (item) {
                item.is_lock = data.locked;
                let elem = this.packElement.find('[oindex="' + data.id + '"]');
                item.is_lock ? elem.addClass('lock') : elem.removeClass('lock');
            }
        } else if (data.jldesc) {
            var str = [];
            str.push(data.jldesc);
            str.push("<span class='item-commands'>");
            str.push('<span cmd="' + this.command_before + 'jinglian ' + data.id + ' ok">精炼</span>');
            str.push('<span cmd="' + this.command_before + 'jinglian ' + data.id + ' full">精炼到满级</span>');
            str.push("</span>");
            this.show_sub(str.join(""), this.get_sub_title(data, "精炼"));
        } else if (data.xqdesc) {
            var str = [];
            str.push(data.xqdesc);
            var stones = data.stones || [];
            if (stones.length) {
                str.push("<div class='xq-stone-list'>");
                for (var i = 0; i < stones.length; i++) {
                    var st = stones[i];
                    str.push("<div class='xq-stone-item grade", st.grade || 0,
                        "' cmd=\"", this.command_before, "xiangqian ", data.id, " ", st.id, "\">");
                    str.push("<span class='xq-stone-name'>", st.name, "</span>");
                    if (st.count > 1) {
                        str.push("<span class='xq-stone-count'>×", st.count, "</span>");
                    }
                    str.push("<div class='xq-stone-prop'>", st.prop || "无特殊功效", "</div>");
                    str.push("</div>");
                }
                str.push("</div>");
                str.push("<div class='xq-stone-tip'>点击宝石即可镶嵌</div>");
            } else {
                str.push("<div class='xq-stone-empty'>身上没有可以镶嵌的宝石</div>");
            }
            this.show_sub(str.join(""), this.get_sub_title(data, "镶嵌"));
        }
        else if (data.desc) {
            var str = [];
            str.push(data.desc);
            str.push("<span class='item-commands'>");
            var from = data.from;
            var title = this.get_sub_title(data);
            if (from == "eq") {
                str.push('<span cmd="' + this.command_before + 'uneq ' + data.id + '">取消装备</span>');
                var eqCommands = data.commands || [];
                for (var eqIndex = 0; eqIndex < eqCommands.length; eqIndex++) {
                    var eqCommand = eqCommands[eqIndex];
                    if (eqCommand.extend) str.push('<span cmd="', eqCommand.cmd, '">', eqCommand.name, '</span>');
                }
            } else if (from == "item") {
                var obj = this.get_item(data.id);
                SCRIPT.LAST_OBJ = obj;
                if (obj) {
                    this.create_item_command(obj, str, data.commands);
                }
            } else if (from == "store") {
                str.push('<span cmd="_confirm qu ' + data.id + '">取出</span>');
            } else if (from == "sj") {
                str.push('<span cmd="_confirm qu ' + data.id + '">取出</span>');
            }
            else {
                str.push('<span cmd="_confirm buy 1 ' + data.id + ' from ' + Dialog.list.seller + '">购买</span>');
            }
            str.push("</span>");
            this.show_sub(str.join(""), title);
        } else if (data.remove && this.items) {//丢掉的
            var items = this.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == data.id) {
                    if (data.remove >= items[i].count) {
                        items.splice(i, 1);
                        Combat.DisObj(data);
                    } else {
                        items[i].count -= data.remove;
                    }
                    break;
                }
            }
            if (this.isShow)
                this.show_items();
            else return false;

        } else if (data.name && this.items) {//更新的
            var item = this.get_item(data.id);
            if (item) {
                item.count = data.count;
                item.name = data.name;
            } else {
                this.items.push(data);
            }
            if (this.isShow)
                this.show_items();
            else return false;
        } else if (data.max_item_count) {
            this.max_count = data.max_item_count;
            ReceiveMessage((Dialog.pack2.isShow ? Dialog.pack2.target_name : "你") + "的背包容量扩充为" + this.max_count + "。");
            this.show_items();
        } else return false;
        return true;
    },
    get_item: function (id, items) {
        items = items || this.items;
        if (!items) return;
        for (var i = 0; i < items.length; i++) {
            if (items[i] && items[i].id == id) return items[i];
        }
    },
    get_eq_item: function (id) {
        if (!this.eqs) return;
        for (var i = 0; i < this.eqs.length; i++) {
            if (this.eqs[i] && this.eqs[i].id == id) return this.eqs[i];
        }
    },
    get_sub_title: function (data, action) {
        var title = data && (data.color_name || data.name);
        if (!title && data && data.from == "eq") {
            var eq = this.get_eq_item(data.id);
            title = eq && eq.name;
        }
        if (!title && data) {
            var item = this.get_item(data.id);
            title = item && item.name;
        }
        title = title || "物品详情";
        return action ? title + " - " + action : title;
    },
    show_sub: function (str, title) {
        if (this.objelement) this.objelement.remove();
        var parent = Dialog.contentElement;
        var box = $("<div></div>").html(str || "");
        var commandBox = $("<span class='item-commands'></span>");
        box.find(".item-commands").each(function () {
            var contents = $(this).contents().clone();
            contents.filter("br").remove();
            contents.find("br").remove();
            commandBox.append(contents);
        });
        box.find(".item-commands").remove();
        var footer = commandBox.children().length ? "<div class='obj-desc-footer'>" + commandBox.prop("outerHTML") + "</div>" : "";
        var titleHtml = title || "物品详情";
        var closeSub = function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (this.objelement) this.objelement.remove();
            this.objelement = null;
        }.bind(this);
        this.objelement = $("<div class='obj-desc'><div class='obj-desc-panel'><div class='obj-desc-header'><div class='obj-desc-title'>" + titleHtml + "</div><span class='obj-desc-close'>关闭</span></div><div class='obj-desc-body'>" + box.html() + "</div>" + footer + "</div></div>").appendTo(parent);
        this.objelement.on("click", ".obj-desc-close", closeSub);
        this.objelement.on("click", "[cmd]", function () {
            setTimeout(closeSub, 0);
        });
        this.objelement.on("click", function (e) {
            if ($(e.target).is(".obj-desc")) closeSub(e);
        });
    }, onData: function (data) {
        if (data.items) {
            this.eqs = this.formatEqs(data.eqs || []);
            this.money = data.money;
            this.eq_group = data.eq_group;
            this.items = this.formatItems(data.items);
            this.max_count = data.max_item_count;
            if (this.isShow) {
                this.show_items();
                this.show_moeny();
            }
        } else {
            if (data.owner_id) return Dialog.pack2.onData(data);
            if (this.updateitem(data)) return;
        }
        if (!this.isShow) {
            if (Dialog.list.isShow) {
                return Dialog.list.update_pack(data);
            }
            if (Dialog.trade.isShow) {
                return Dialog.trade.update_pack(data);
            }
        }

    },
    formatPackItem: function (item) {
        return {
            name: item[0], id: item[1],
            count: item[2], grade: item[3],
            unit: item[4], value: item[5],
            can_eq: item[6], can_use: item[7],
            can_study: item[8], can_open: item[9],
            can_combine: item[10], is_lock: item[11],
            otype: item[12]
        };
    }
    , formatItems: function (data) {
        let items = [];
        for (let item of data) {
            items.push(this.formatPackItem(item));
        }
        return items;
    }, formatEqs: function (data) {
        let items = [];
        for (let item of data) {
            if (!item) items.push(item);
            else items.push({
                name: item[0], id: item[1],
                grade: item[2], can_use: item[3], is_lock: item[4]
            });
        }
        return items;
    },


    show_moeny: function () {
        if (!this.isShow) return;//+ "<span cmd='sell all'>清理包裹</span></div>"
        let mstr = Util.moneyToStr(this.money);
        let isCleanup = this.packElement.is('.cleanup');
        if (Dialog.footerElement) {
            Dialog.footerElement.addClass("pack-footer").toggleClass("pack-cleanup-footer", isCleanup);
        }
        let str = [];
        for (let i = 0; i < 3; i++) {
            str.push('<span class="footer-item eq-group',
                i === this.eq_group ? " select" : "", '" for="', i + 1, '">', i + 1, '</span>');
        }
        str.push("<div class='obj-money'>");
        if (isCleanup) {

            str.push("<span for='cancle' class='footer-item'>取消</span>");
            str.push("<span for='store' class='footer-item'>自动存仓</span>");
            str.push("<span for='sell' class='footer-item'>清理杂物</span>");
            str.push("<span for='cleanup' class='footer-item'>确定</span></div>");
        } else {
            str.push("<span class='obj-money-text'>你", (mstr ? "身上有"
                + mstr : "身上没有任何银两"), "</span>");
            str.push("<span for='cleanup' class='footer-item'>整理包裹</span></div>");
        }

        Dialog.footer(str.join(""));

    }, cleanup_cmds: { cleanup: true, cancle: true, store: true, sell: true },
    footerChanged: function (cmd, elem) {
        if (this.cleanup_cmds[cmd])
            return this.cleanup(cmd, elem);
        let index = parseInt(cmd) - 1;
        if (!(index >= 0 && index < 3)) return;
        SendCommand('eqgroup ' + index);
    },
    cleanup: function (cmd, elem) {
        let pack = this;
        elem.removeClass('select');
        if (!pack.packElement.is('.cleanup') && cmd == 'cleanup') {
            const owner = this.target_name && this.id
                ? { type: "follower", id: this.id, name: this.target_name }
                : { type: "player" };
            return Dialog.packmanage.requestOpen(owner);
        }
        if (pack.packElement.is('.cleanup')) {
            if (cmd == 'cleanup') {
                pack.packElement.find('.obj-item>.selected').
                    each(this.cleanup_item);
            } else if (cmd == 'store') {
                SendCommand((this.command_before ?? "") + 'store all');
            } else if (cmd == 'sell') {
                SendCommand((this.command_before ?? "") + 'sell all');
            }
            pack.packElement.removeClass("cleanup");
            this.show_moeny();
        }
        else {
            pack.packElement.find(".item-commands").remove();
            pack.packElement.addClass("cleanup");
            pack.show_items();
            this.show_moeny();
        }
    },
    cleanup_item: function (x, y) {
        let elem = $(y);
        let item = elem.parent().attr('oindex');
        let cmd = elem.attr('cmd');
        SendCommand(cmd + " " + item);
    },
    show_items: function () {
        if (!this.packElement) return;
        this.createItems();
        this.create_eqs();
        Dialog.icon("briefcase");
        var name = this.target_name || "你";
        var over_limit = this.items && this.max_count && this.items.length > this.max_count;
        Dialog.title((this.items && this.items.length) ? (name + "身上共有" + this.items.length + "/" + this.max_count + "件物品" + (over_limit ? "（已超出上限）" : "")) : (name + "身上没有任何东西"));

    },
    init_element: function () {
        if (!this.element) {
            let eqs = EQUIPMENT_PARTS.map(function (name) {
                return '<div class="eq-item"><span class="eq-type">' + name + '</span><span class="eq-name"></span></div>';
            }).join("");
            this.element = $('<div class="dialog-pack"><div class="eq-list">' + eqs + '</div><div class="obj-list"></div></div>');
            this.packElement = this.element.find(".obj-list");
            this.eqElement = this.element.find(".eq-list");
        }
    },
    show: function () {
        if (!Dialog.isShow) Dialog.show();
        Dialog.element.addClass("dialog-pack-dialog");
        if (this.objelement) {
            this.objelement.remove();
            this.objelement = null;
            this.packElement && this.packElement.show();
        }
        if (this.isShow) return SendCommand(this.items ? "pack none" : "pack");
        this.isShow = true;
        this.init_element();
        this.packElement.on("click", ".obj-item", Dialog.pack.item_click)
        this.eqElement.on("click", ".eq-item", Dialog.pack.eqitem_click);
        this.packElement.removeClass('cleanup');
        this.element.appendTo(Dialog.contentElement);

        if (!this.items) SendCommand("pack");
        else {
            SendCommand("pack none");
            this.show_items();
        }
    },

    create_eqs: function () {
        var items = this.eqElement.children();
        for (var i = 0; i < items.length; i++) {
            var eq = this.eqs[i];
            if (eq) {
                $(items[i]).attr('class',
                    'eq-item grade' + eq.grade).attr("oindex", i).find('.eq-name').html(eq.name);
            } else {
                $(items[i]).attr('class',
                    "eq-item empty").attr("oindex", "").find('.eq-name').html("");
            }
        }
    }, levels: {
        "wht": 0, "hig": 1, "hic": 2, "hiy": 3, "hiz": 4, "hio": 5, "ord": 6
    },
    sort_items: function (items) {
        if (!items || !Setting.auto_sortitem) return items;
        var list = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isok = false;
            for (var j = 0; j < list.length; j++) {
                if (item.grade < list[j].grade) {
                    list.splice(j, 0, item);
                    isok = true;
                    break;
                }
            }
            if (!isok) {
                list.push(item);
            }
        }
        return list;
    },
    createItems: function () {
        if (!this.items) return;
        var items = Dialog.pack.sort_items(this.items);
        var html = [];
        let is_cleanup = this.packElement?.is('.cleanup');
        var show_count = Math.max(this.max_count || 0, items.length);
        for (var i = 0; i < show_count; i++) {
            var item = items[i];

            if (item) {
                html.push('<div class="obj-item ', item.is_lock ? "lock " : "", 'grade', item.grade, '" oindex="');
                html.push(item.id);
                html.push('">');
                html.push("<span class='obj-name'>");
                html.push(item.name);
                html.push("</span>");
                if (this.show_type == 1) {
                    html.push("<span class='obj-value'>");
                    html.push("每");
                    html.push(item.unit);
                    html.push(Util.moneyToStr(item.value));
                    html.push("：");
                    html.push(item.count);
                    html.push(item.unit);
                    html.push('</span>');
                } else if (item.count > 1) {
                    html.push("<span class='obj-value'>");
                    html.push(item.count);
                    html.push(item.unit);
                    html.push('</span>');
                }
                if (is_cleanup) {
                    if (item.grade > 0) {
                        html.push("<span cmd='store' class='obj-oper"
                            , (item.can_study ? " selected" : " "), "'>存仓库</span>");
                    }
                    if (item.can_combine && item.count >= item.can_combine) {
                        html.push("<span cmd='combine' class='obj-oper'>合成</span>");
                    }
                    if (this.target_name) {
                        html.push("<span cmd='give ", Process.player,
                            ' ', item.count, "' class='obj-oper'>拿来</span>");
                    }
                    if (item.can_eq && item.grade > 0) {
                        html.push("<span cmd='sell' class='obj-oper'>卖掉</span>");
                        html.push("<span cmd='fenjie' class='obj-oper'>分解</span>");
                    } else if (item.value > 0) {
                        html.push("<span cmd='sell' class='obj-oper'>卖掉</span>");
                    } else if (!item.grade) {
                        html.push("<span cmd='drop' class='obj-oper'>丢掉</span>");
                    }
                }
            } else {
                html.push('<div class="obj-item" oindex="">');
            }
            html.push('</div>');
        }
        this.packElement.html(html.join(""));

    }, create_item_command: function (item, html, commands) {
        html.push('<span cmd="_confirm ' + this.command_before + 'drop ' + item.count + ' ' + item.id + '">丢掉</span>');
        //if (item.count > 1) {
        //    html.push('<span cmd="drop ' + item.count + " " + item.id + '">全部丢掉</span>');
        //}
        html.push('<span cmd="' + this.command_before + 'lockobj ' + item.id + '">', item.is_lock ? "解锁" : "锁定", '</span>');
        if (item.can_eq) {
            html.push('<span cmd="' + this.command_before + 'eq ' + item.id + '">装备</span>');
            if (!this.command_before) {
                html.push('<span cmd="jinglian ' + item.id + '">精炼</span>');
                html.push('<span cmd="xiangqian ' + item.id + '">镶嵌</span>');
                html.push('<span cmd="shortcut ' + item.id + '">设置快速装备</span>');
            }
            html.push('<span cmd="' + this.command_before + 'fenjie ' + item.id + '">分解</span>');

        }
        if (item.can_use) {
            html.push('<span cmd="' + this.command_before + 'use ' + item.id + '">使用</span>');
            if (!item.can_eq && !this.command_before) {
                html.push('<span cmd="shortcut ' + item.id + '">设置快速使用</span>');
            }
        }
        if (item.can_open) {
            html.push('<span cmd="' + this.command_before + 'open ' + item.id + '">打开</span>');
        }
        if (item.can_study) {
            html.push('<span cmd="' + this.command_before + 'study ' + item.id + '">学习</span>');
        }
        if (item.can_combine && item.count >= item.can_combine) {
            html.push('<span cmd="_confirm ' + this.command_before + 'combine ' + item.id + ' ' + item.can_combine + '">合成</span>');
        }
        if (this.command_before) {
            html.push('<span cmd="_confirm ' + this.command_before + 'give ' + Process.player + ' ' + item.count + ' ' + item.id + '">拿来</span>');
        }
        commands = commands || [];
        Dialog.extend.append(commands, 'pack', item);
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].extend)
                html.push('<span cmd="', commands[i].cmd, '">', commands[i].name, '</span>');
            else
                html.push('<span cmd="', this.command_before, 'packitem ', commands[i].cmd, ' ', item.id, '">', commands[i].name, '</span>');
        }
    }
    , item_click: function (e) {
        let elem = $(e.target);
        let is_cleanup = Dialog.pack.packElement.is('.cleanup');
        if (is_cleanup && elem.is('.obj-oper'))
            return Dialog.pack.item_cleanup(elem);
        elem = $(this);
        var obj = elem.attr("oindex");
        if (!obj) return;
        var item = Dialog.pack.get_item(obj);
        Dialog.pack.packElement.find(".item-commands").remove();
        if (!item) return;
        SCRIPT.LAST_OBJ = item;
        SendCommand("checkobj " + item.id + " from item");
        return false;
    },
    eqitem_click: function () {
        var item = Dialog.pack.eqs[$(this).attr("oindex")];
        if (!item) return;
        SendCommand("checkobj " + item.id + " from eq");
    }, item_cleanup: function (elem) {
        if (elem.is('.selected')) elem.removeClass('selected');
        else {
            elem.parent().find('.selected').removeClass('selected');
            elem.addClass('selected');
        }
        return false;
    }
};



const packet_css = `

.dialog.dialog-pack-dialog {
    top: 50%;
    max-height: calc(100% - 4rem);
}

@media (min-width: 481px) {
    .dialog.dialog-pack-dialog {
        max-height: 62vh;
    }
}

.dialog.dialog-pack-dialog>.dialog-content {
    overflow: hidden;
    position: relative;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.35em;
    padding: 0 0.35em;
    box-sizing: border-box;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.eq-group {
    flex: 0 0 auto;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money {
    float: none;
    margin-left: auto;
    padding-right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.35em;
    min-width: 0;
    flex: 1 1 auto;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.obj-money-text {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.footer-item {
    width: auto;
    min-width: 3em;
    flex: 0 0 auto;
    margin: 0;
    padding: 0 0.55em;
    border-left: 1px solid var(--theme-border);
    line-height: 2em;
    box-sizing: border-box;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.footer-item:first-child {
    border-left: 0;
}

.dialog-pack {
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(10rem, 0.9fr) minmax(13rem, 1.1fr);
    gap: 0.75em;
    overflow: hidden;
    padding-top: 0.25em;
    box-sizing: border-box;
}


.dialog-pack>.obj-list {
    min-width: 0;
    width: auto;
    display: block;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    height: 100%;
    min-height: 0;
}


.obj-list>.obj-item {
    margin-left: 0;
}
    
.dialog.dialog-pack-dialog .obj-desc {
    position: absolute;
    inset: 0;
    z-index: 5;
    padding: 0.75em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}

.dialog.dialog-pack-dialog .obj-desc-panel {
    width: min(28rem, 100%);
    max-height: 100%;
    min-width: 0;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    box-shadow: 0 1.1em 2.4em rgba(0, 0, 0, 0.28);
    display: flex;
    flex-direction: column;
}

.obj-desc-panel>.obj-desc-header {
    flex: 0 0 2.5em;
    min-height: 2.5em;
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0 0.7em 0 0.8em;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    box-sizing: border-box;
}

.obj-desc-panel .obj-desc-title {
    flex: 1 1 auto;
    min-width: 0;
    color: var(--theme-accent);
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.obj-desc-panel .obj-desc-close {
    flex: 0 0 auto;
    cursor: pointer;
    user-select: none;
    color: var(--theme-muted);
    line-height: 2em;
}

.obj-desc-panel .obj-desc-close:hover {
    color: var(--theme-accent);
}

.obj-desc-panel>.obj-desc-body {
    flex: 1 1 auto;
    min-height: 0;
    margin: 0;
    padding: 0.9em;
    box-sizing: border-box;
    white-space: pre-wrap;
    line-height: 1.55em;
    color: var(--theme-text);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}

/* 自制装备等操作按钮较多时需要自动换行，避免横向溢出 */
.obj-desc-panel>.obj-desc-footer {
    flex: 0 0 auto;
    min-height: 2.5em;
    padding: 0.25em 0.7em;
    border-top: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
}

.xq-stone-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11em, 1fr));
    gap: 0.4em;
    margin: 0.5em 0 0;
}

.xq-stone-item {
    border: 1px solid var(--border-color, gray);
    border-radius: 0.4em;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    padding: 0.4em 0.5em;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
}

.xq-stone-item:hover {
    background-color: var(--theme-surface);
}

.xq-stone-item:active {
    background-color: var(--theme-surface-2);
}

.xq-stone-item>* {
    pointer-events: none;
}

.xq-stone-item>.xq-stone-name {
    font-weight: bold;
    word-break: break-all;
}

.xq-stone-item>.xq-stone-count {
    float: right;
    color: var(--theme-muted);
    font-size: 0.86em;
    margin-left: 0.35em;
}

.xq-stone-item>.xq-stone-prop {
    color: var(--theme-muted);
    font-size: 0.86em;
    line-height: 1.45em;
    margin-top: 0.15em;
    word-break: break-all;
}

.xq-stone-tip {
    color: var(--theme-muted);
    font-size: 0.82em;
    text-align: center;
    margin-top: 0.5em;
}

.xq-stone-empty {
    color: var(--theme-muted);
    text-align: center;
    padding: 1em 0;
}

.obj-desc-panel>.obj-desc-footer>.item-commands {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 1 auto;
    flex-wrap: wrap;
    gap: 0.35em;
    margin: 0;
    padding: 0;
    white-space: normal;
}

.obj-desc-panel>.obj-desc-footer>.item-commands>span {
    height: 2em;
    line-height: 2em;
    margin: 0;
    padding: 0 0.4em;
}


.eq-list {
    min-width: 0;
    width: auto;
    display: block;
    float: none;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    height: 100%;
    min-height: 0;
}

.eq-list>.eq-item {
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    min-height: 2em;
}

.eq-list>.empty {
    border-color: var(--theme-border);
    color: var(--theme-muted);
}

.eq-list>.eq-item>.eq-name {
    white-space: nowrap;
    padding-left: 0.3125em;
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.eq-list>.eq-item>.eq-type {
    background-color: var(--theme-surface);
    color: var(--theme-muted);
    line-height: 1.875em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 3.25em;
    height: 1.875em;
    text-align: center;
}

.obj-list>.obj-item {
    background-color: var(--theme-panel);
    color: var(--theme-text);
    line-height: 1.875em;
    min-height: 1.875em;
    padding: 0 0.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.obj-item.lock>.obj-name:before {
    content: "\e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}

.obj-item>.obj-oper {
    float: right;
    margin: 0.2em 0.35em 0 0;
    padding: 0 0.5em;
    line-height: 1.5em;
    background-color: var(--theme-surface);
    border: 1px solid var(--theme-border);
    border-radius: 0.5em;
    color: var(--theme-muted);
    display: none;
    cursor: pointer;
    user-select: none;
}

.cleanup>.obj-item>.obj-oper {
    display: inline-block;
}

.cleanup>.obj-item>.selected {
    color: var(--theme-accent);
    border-color: var(--theme-accent);
}



.obj-item>.obj-count,
.obj-item>.obj-value {
    float: right;
    margin-right: 0.625em;
    color: var(--theme-muted);
}

.cleanup>.obj-item>.obj-value,
.cleanup>.obj-item>.obj-count {
    display: none;
}


.obj-list>.disabled {
    opacity: 0.5;
}

@media (max-width: 480px) {
    .dialog.dialog-pack-dialog {
        max-height: calc(100% - 3.5rem);
    }

    .dialog-pack {
        grid-template-columns: 1fr;
        grid-template-rows: auto minmax(0, 1fr);
        gap: 0.55em;
        height: calc(100vh - 9.5em);
        max-height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
    }

    .dialog.dialog-pack-dialog>.dialog-content {
        overflow: hidden;
        padding: 0.55em;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer {
        justify-content: flex-end;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-cleanup-footer>.eq-group {
        display: none;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money {
        margin-left: auto;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.obj-money-text {
        display: none;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.footer-item {
        min-width: 2.6em;
        padding: 0 0.4em;
    }

    .dialog-pack>.eq-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        align-content: start;
        gap: 0.35em;
        height: auto;
        max-height: min(42vh, 16rem);
        overflow-y: auto;
    }

    .eq-list>.eq-item {
        margin-bottom: 0;
        min-height: 1.9em;
    }

    .dialog-pack>.obj-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-content: start;
        gap: 0.45em;
        min-height: 0;
        height: auto;
        max-height: none;
        overflow-y: auto;
    }

    .obj-list>.obj-item,
    .trade-list>.obj-item {
        min-height: 3.6em;
        margin-bottom: 0;
        padding: 0.45em 0.5em;
        line-height: 1.25em;
    }

    .cleanup>.obj-item {
        min-height: 2.25em;
    }

    .obj-item>.obj-name {
        display: block;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .obj-item>.obj-count,
    .obj-item>.obj-value {
        float: none;
        display: block;
        margin: 0.15em 0 0;
        font-size: 0.86em;
        line-height: 1.45em;
    }

    .dialog.dialog-pack-dialog .obj-desc {
        padding: 0.5em;
        align-items: stretch;
    }

    .dialog.dialog-pack-dialog .obj-desc-panel {
        width: 100%;
    }

    .obj-desc-panel>.obj-desc-body {
        max-height: calc(100vh - 11em);
    }
}



`;

const list_css = `

.dialog-list {
    width: 100%;
    height: 100%;
    min-height: 0;
    white-space: nowrap;
    overflow-x: auto;
    padding-top: 0.5em;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}

.dialog-list>.otype-list {
    width: 6em;
}

.dialog-list>.otype-list>.otype-item {
    white-space: nowrap;
    line-height: 2em;
    width: 5em;
    text-align: center;
    background-color: #111;
    border-radius: 4px;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    margin-left: 0.5em;
    text-align: center;
    cursor: pointer;
}

.dialog-list>.otype-list>.select {
    background-color: #222;
    color: var(--theme-grade-1);
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-grade-1);
}

.dialog-list>.trade-list,
.dialog-list>.obj-list {

    height: 100%;
    min-height: 0;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}


.dialog-list>.obj-desc {
    padding: 0.25em;
    margin: 0px;
    white-space: pre-wrap;
    flex: 1;
    overflow-y: auto;
}

.dialog-list>.trade-list {

    height: 100%;
    min-height: 0;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}
.trade-list>.obj-item {
    background-color: #111;
    line-height: 1.875em;
    min-height: 1.875em;
    padding-left: 0.3125em;

    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.trade-list>.obj-item.lock>.obj-name:before {
    content: "\e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}`;
