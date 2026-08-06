import SCRIPT from '../script.js';
import Util from '../utils/util.js';


export default {
    init: function () {
        Dialog.pack.init();
        this.cleanup_cmds = Dialog.pack.cleanup_cmds;
        this.formatEqs = Dialog.pack.formatEqs;
        this.formatItems = Dialog.pack.formatItems;
        this.formatPackItem = Dialog.pack.formatPackItem;
        this.createItems = Dialog.pack.createItems;
        this.create_eqs = Dialog.pack.create_eqs;
        this.init_element = Dialog.pack.init_element;
        this.show_items = Dialog.pack.show_items;
        this.updateitem = Dialog.pack.updateitem;
        this.footerChanged = Dialog.pack.footerChanged;
        this.cleanup = Dialog.pack.cleanup;
        this.item_cleanup = Dialog.pack.item_cleanup;

        this.show_sub = Dialog.pack.show_sub;
        this.get_sub_title = Dialog.pack.get_sub_title;
        this.close = Dialog.pack.close;
        this.get_item = Dialog.pack.get_item;
        this.create_item_command = Dialog.pack.create_item_command;
    },
    onData: function (data) {
        if (data.items) {
            this.show();
            this.eqs = this.formatEqs(data.eqs || []);
            this.money = data.money;
            this.id = data.id;
            this.command_before = "dc " + this.id + " ";
            this.items = this.formatItems(data.items);
            this.target_name = data.name;
            this.max_count = data.max_item_count;
            this.show_items();
            this.show_moeny();
        } else {
            if (!this.isShow || (data.owner_id && data.owner_id !== this.id)) return false;
            this.updateitem(data);
        }

    },
    show_moeny: function () {
        if (!this.isShow) return;//+ "<span cmd='sell all'>清理包裹</span></div>"
        let mstr = Util.moneyToStr(this.money);
        let isCleanup = this.packElement.is('.cleanup');
        if (Dialog.footerElement) {
            Dialog.footerElement.addClass("pack-footer").toggleClass("pack-cleanup-footer", isCleanup);
        }
        let str = [];
        str.push("<div class='obj-money'>");
        if (isCleanup) {

            str.push("<span for='cancle' class='footer-item'>取消</span>");
            str.push("<span for='store' class='footer-item'>自动存仓</span>");
            str.push("<span for='sell' class='footer-item'>清理杂物</span>");
            str.push("<span for='cleanup' class='footer-item'>确定</span></div>");
        } else {
            str.push("<span class='obj-money-text'>", this.target_name, (mstr ? "身上有"
                + mstr : "身上没有任何银两"), "</span>");
            str.push("<span for='cleanup' class='footer-item'>整理</span></div>");
        }
        Dialog.footer(str.join(""));

    },
    cleanup_item: function (x, y) {
        let elem = $(y);
        let item = elem.parent().attr('oindex');
        let cmd = elem.attr('cmd');
        SendCommand(Dialog.pack2.command_before + cmd + " " + item);
    },
    hide: function () {
        if (this.objelement) {
            this.objelement.remove();
            this.objelement = null;
        }
        if (Dialog.element) Dialog.element.removeClass("dialog-pack-dialog");
        if (Dialog.footerElement) Dialog.footerElement.removeClass("pack-footer pack-cleanup-footer");
        if (this.element) this.element.remove();
        this.isShow = false;
    },
    show: function () {
        if (!Dialog.isShow || Dialog.curItem !== "pack2") Dialog.select("pack2");
        Dialog.element.addClass("dialog-pack-dialog");
        if (this.objelement) {
            this.objelement.remove();
            this.objelement = null;
        }
        if (this.isShow) return;
        this.isShow = true;
        this.init_element();
        this.packElement.on("click", ".obj-item", this.item_click)
        this.eqElement.on("click", ".eq-item", this.eqitem_click);
        this.element.appendTo(Dialog.contentElement);
    }
    , item_click: function (e) {
        let elem = $(e.target);
        let is_cleanup = Dialog.pack2.packElement.is('.cleanup');
        if (is_cleanup && elem.is('.obj-oper'))
            return Dialog.pack2.item_cleanup(elem);
        elem = $(this);
        var obj = elem.attr("oindex");
        if (!obj) return;
        var item = Dialog.pack2.get_item(obj);
        Dialog.pack2.element.find(".item-commands").remove();
        if (!item) return;
        SCRIPT.LAST_OBJ = item;
        SendCommand(Dialog.pack2.command_before + 'checkobj ' + item.id + ' from item');
        return false;

    }, eqitem_click: function () {
        var item = Dialog.pack2.eqs[$(this).attr("oindex")];
        if (!item) return;
        SendCommand(Dialog.pack2.command_before + "checkobj " + item.id + " from eq");
    }

};
