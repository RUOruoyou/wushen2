import Util from './utils/util.js';

export const Confirm = {
    DEFAULT: {

        onOK: function () { },
        footer: true,
        // 默认以居中弹窗形式展示；需要恢复贴底横条时显式传 popup: false
        popup: true,

        btn_text: "确认"
    },
    Show: function (par) {
        this.Init();


        this.Parameter = Object.assign({}, this.DEFAULT, par);
        this.content.empty().append(this.Parameter.content);
        this.element.show();
        if (this.Parameter.popup) {
            this.element.addClass("popup");
            this.mask.show();
        } else {
            this.element.removeClass("popup");
            this.mask.hide();
        }
        if (this.Parameter.footer) {
            this.btn.show();
            this.btn.find(".btn-text").html(this.Parameter.btn_text);
        } else {
            this.btn.hide();
        }
        this.isShow = true;
    }, Close: function (isok) {
        if (!Confirm.isShow) return;
        Confirm.element.hide();
        Confirm.mask.hide();
        Confirm.isShow = false;
        if (!isok && this.Parameter.onCancle)
            this.Parameter.onCancle();
    },
    Init: function () {
        if (this._init) return;
        this.mask = $(`<div class="dialog-confirm-mask" style="display:none;"></div>`).appendTo(document.body);
        this.element = $(`<div class="dialog-confirm" style="display:none;">
        <div class="dialog-content"></div>
        <span class="dialog-btn btn-ok"><span class="glyphicon glyphicon-ok-circle btn-icon"></span><span
                class="btn-text">确认</span></span>
    </div>`).appendTo(document.body);
        this.content = this.element.find(".dialog-content");
        this.btn = this.element.find(".dialog-btn");
        this.mask.on("click", function (e) {
            if (Confirm.Parameter && Confirm.Parameter.popup) {
                Confirm.Close();
            }
            return false;
        });
        this.element.on("click", ".btn-ok", function (e) {
            if (Confirm.Parameter.content === Confirm.count_element) {
                var text = Confirm.count_element.find("input");
                var v = parseInt(text.val());
                if (v.toString() == "NaN") v = 0;
                if (v > Confirm.max_count) v = Confirm.max_count;
                Confirm.Parameter.onOK(v);
            } else {
                Confirm.Parameter.onOK();
            }
            if (Dialog.isShow) CmdPrompt.captureNext();
            Confirm.Close(true);
            return false;
        });
        this.element.on("click", ".btn", function (e) {
            var count = Confirm.max_count || 1000;
            var elem = $(e.target);
            var type = parseInt(elem.attr("ac"));
            var text = elem.parent().find("input");
            var v = parseInt(text.val());
            if (v.toString() == "NaN") v = 0;
            if (type == -10) {
                v -= 10;
            } else if (type == 10) {
                if (v == 1) v = 0;
                v += 10;
            } else if (type == 1) {
                v = count;
            } else {
                v = 1;
            }
            if (v < 1) v = 1;
            else if (v > count) v = count;
            text.val(v);
            return false;
        });
        this._init = true;
    }

    , Process: function (pars) {
        var cmd = pars[1];
        var npc = "";
        if (cmd == "dc") {
            cmd = pars[3];
            npc = pars.splice(1, 2);
            npc = npc[0] + " " + npc[1] + " ";
        }
        var func = this["Show_" + cmd];
        func && func.call(this, pars, npc);
    }, get_countelement: function (count, maxcount) {
        if (!this.count_element) {
            this.count_element = $('<div  class="confirm-count"><span class="btn" ac="0">最少</span><span ac="-10" class="btn">减10</span><input type="text" value="1" /><span class="btn"  ac="10" >加10</span><span class="btn" ac="1" >最多</span></div>');

        }
        if (count) this.count_element.find("input").val(count);
        else this.count_element.find("input").val(1);
        if (maxcount) maxcount = parseInt(maxcount);
        this.max_count = maxcount || 1000;
        return this.count_element;
    }, Show_shop: function (p, maxcount) {
        var objid = p[2];
        if (!objid) return;
        var obj = Dialog.shop.get_item(objid);
        if (!obj) return;
        let count = p[3] ? parseInt(p[3]) : -1;
        this.Show({
            content: this.get_countelement(1, count == -1 ? 9999 : count),
            btn_text: "购买" + obj.name,
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand("shop " + objid + " " + v);
            }
        });
    },
    Show_buy: function (p) {
        var objid = p[3];
        if (!objid) return;
        var count = parseInt(p[2]);

        this.Show({
            content: this.get_countelement(1, count == -1 ? 9999 : count),
            btn_text: "购买",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand("buy " + v + " " + objid + " from " + p[5]);
            }
        });
    },
    Show_greet: function (p) {
        this.Show({
            content: this.get_countelement(1, 99),
            btn_text: "送花",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand("greet " + v);
            }
        });
    }, Show_sell: function (p) {
        var objid = p[3];
        if (!objid) return;

        this.Show({
            content: this.get_countelement(p[2], p[2]),
            btn_text: "卖出",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand("sell " + v + " " + objid + " to " + p[5]);
            }
        });
    }, Show_store: function (p, npc) {
        var objid = p[3];
        if (!objid) return;
        if (p[2] == 1) {
            return SendCommand(npc + (Dialog.list.is_bookshelf ? "sj " : "") + "store " + objid);
        }
        this.Show({
            content: this.get_countelement(p[2], p[2]),
            btn_text: "存入",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand(npc + (Dialog.list.is_bookshelf ? "sj " : "") + "store " + v + " " + objid);
            }
        });
    }, Show_fenjie: function (p, npc) {
        var objid = p[2];
        if (!objid) return;
        var obj = Dialog.pack.isShow ? Dialog.pack.get_item(objid) : Dialog.pack2.get_item(objid);
        if (!obj) return;
        if (obj.name.indexOf("★") == -1) return SendCommand(npc + "fenjie " + objid);
        this.Show({
            content: "是否确认分解" + obj.name + "？",
            btn_text: "确认分解",
            onOK: function () {
                SendCommand(npc + "fenjie " + objid);
            }
        });

    }, Show_qu: function (p) {
        var objid = p[2];
        if (!objid) return;
        var obj = Dialog.list.find_item(3, objid);
        if (!obj) return;
        if (obj.count === 1) {
            return SendCommand((Dialog.list.is_bookshelf ? "sj " : "") + "qu 1 " + objid);
        }
        this.Show({
            content: this.get_countelement(obj.count, obj.count),
            btn_text: "取出",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand((Dialog.list.is_bookshelf ? "sj " : "") + "qu " + v + " " + objid);
            }
        });
    }, Show_drop: function (p, npc) {
        var objid = p[3];
        if (!objid) return;
        var obj = Dialog.pack.isShow ? Dialog.pack.get_item(objid) : Dialog.pack2.get_item(objid);
        if (!obj) return;
        this.Show({
            content: p[2] == 1 ? "是否确认丢掉" + obj.name + "？" : this.get_countelement(p[2], p[2]),
            btn_text: "丢掉",
            onOK: function (v) {
                if (p[2] == 1) {
                    return SendCommand(npc + "drop " + objid);
                }
                if (!(v > 0)) return;
                SendCommand(npc + "drop " + v + " " + objid);
            }
        });
    }, Show_give: function (p, npc) {
        var objid = p[4];
        if (!objid) return;
        var obj = Dialog.pack2.get_item(objid);
        if (!obj) return;
        if (obj.count == 1) return SendCommand(npc + "give " + Process.player + " 1 " + objid);
        this.Show({
            content: this.get_countelement(obj.count, obj.count),
            btn_text: "拿来",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand(npc + "give " + Process.player + " " + v + " " + objid);
            }
        });
    }, Show_trade_add: function (obj) {
        if (!obj) return;
        this.Show({
            content: this.get_countelement(obj.count, obj.count),
            btn_text: "确定",
            onOK: function (v) {
                if (!(v > 0)) return;
                var moveobj = Util.Clone(obj);
                moveobj.count = v;
                Dialog.trade.add_trade(moveobj);
            }
        });
    }, Show_fangqi: function (p, npc) {
        var objid = p[2];
        if (!objid) return;
        var skill = npc ? Dialog.master.skills[objid] : Dialog.skills.skills[objid];
        if (!skill) return;
        this.Show({
            content: "是否确认放弃技能" + skill.name + "？",
            onOK: function () {
                SendCommand(npc + "fangqi " + objid);
            }
        });
    }, Show_combine: function (p, npc) {
        var objid = p[2];
        if (!objid) return;
        var obj = Dialog.pack.get_item(objid);
        if (!obj) return;
        var com = parseInt(p[3]);
        if (!com) return;
        var max_count = parseInt(obj.count / com);
        if (max_count == 1) {
            return SendCommand("combine " + objid);
        }
        this.Show({
            content: this.get_countelement(max_count),
            btn_text: "合成",
            onOK: function (v) {
                if (!(v > 0)) return;
                SendCommand(npc + "combine " + objid + " " + v);
            }
        });
    }
    , Show_pay: function () {

        SendCommand('pay 0 ' + (/mobile/i.test(navigator.userAgent) ? "m" : "c"));
    }
};



export const Warn = {
    Elemes: [],
    Show: function (data) {
        var html = ["<div class='warn-dialog'>"];

        html.push("<div class='warn-content'>");
        html.push(data.content);
        html.push("</div>");
        html.push("<div class='item-commands'>");
        for (var i = 0; i < data.cmds.length; i++) {
            var cmd = data.cmds[i];
            html.push("<span cmd='");
            html.push(cmd.cmd);
            html.push("'>");
            html.push(cmd.name);
            html.push("</span>");
        }
        html.push("</div>");
        var elem = $(html.join("")).appendTo(".bottom-bar");
        this.Elemes.push(elem);
        this.Settop();
        var func = this.Close.bind(this, elem);
        if (data.time) {
            window.setTimeout(func, data.time);
        }
        elem.on("click", "span", func);
    }
    , Close: function (elem) {
        if (this.Elemes.indexOf(elem) > -1) {
            elem.remove();
            this.Elemes.Remove(elem);
            this.Settop();
        }
    }, Settop: function () {
        var height = $('.bottom-bar').height() + 8;
        for (var i = 0; i < Warn.Elemes.length; i++) {
            var elem = Warn.Elemes[i];
            elem.css("bottom", height);
            height += elem.height() + 14;
        }
    }
};


// 通用交互弹窗：Dialog 弹窗打开期间，承接服务端 cmds 按钮与配对的文字提示，
// 避免交互内容落入被弹窗遮罩盖住的主信息面板（捕获窗口模式取自 item 弹窗）。
export const CmdPrompt = {
    isShow: false,
    captureUntil: 0,
    chainUntil: 0,

    Init: function () {
        if (this._init) return;
        this.mask = $(`<div class="dialog-confirm-mask" style="display:none;"></div>`).appendTo(document.body);
        this.element = $(`<div class="cmd-prompt" style="display:none;">
        <div class="cmd-prompt-header"><span class="cmd-prompt-title">提示</span><span class="cmd-prompt-close">关闭</span></div>
        <pre class="cmd-prompt-body"></pre>
        <div class="item-commands cmd-prompt-actions"></div>
    </div>`).appendTo(document.body);
        this.body = this.element.find(".cmd-prompt-body");
        this.actions = this.element.find(".cmd-prompt-actions");
        this.element.on("click", ".cmd-prompt-close", function () {
            CmdPrompt.Close();
            return false;
        });
        this.mask.on("click", function () {
            CmdPrompt.Close();
            return false;
        });
        this.element.on("click", ".cmd-prompt-actions [cmd]", function () {
            var cmd = $(this).attr("cmd");
            CmdPrompt.actions.empty();
            CmdPrompt.captureNext();
            SendCommand(cmd);
            return false;
        });
        this._init = true;
    },

    Show: function (items) {
        this.Init();
        if (!Array.isArray(items)) items = [items];
        var html = [];
        for (var i = 0; i < items.length; i++) {
            if (!items[i] || !items[i].cmd) continue;
            html.push("<span cmd='" + items[i].cmd + "'>" + (items[i].name || items[i].cmd) + "</span>");
        }
        this.actions.html(html.join(""));
        this.body.toggle(this.body.html() !== "");
        this.element.show();
        this.mask.show();
        this.isShow = true;
        this.body[0].scrollTop = this.body[0].scrollHeight;
    },

    captureNext: function () {
        if (!(Dialog.isShow || this.isShow)) return;
        this.captureUntil = Date.now() + 3000;
    },

    appendText: function (text) {
        if (!text) return false;
        if (!(Dialog.isShow || this.isShow)) return false;
        var now = Date.now();
        if (now > this.captureUntil && !(this.isShow && now <= this.chainUntil)) return false;
        if (now <= this.captureUntil) this.captureUntil = 0;
        this.Init();
        this.chainUntil = now + 1500;
        var current = this.body.html();
        this.body.html(current ? current + "\n" + text : text);
        this.body.show();
        if (!this.isShow) {
            this.element.show();
            this.mask.show();
            this.isShow = true;
        }
        this.body[0].scrollTop = this.body[0].scrollHeight;
        return true;
    },

    Close: function () {
        if (!this._init) return;
        this.element.hide();
        this.mask.hide();
        this.body.empty();
        this.actions.empty();
        this.isShow = false;
        this.captureUntil = 0;
        this.chainUntil = 0;
    }
};
