this.inherits(NPC);
this.set({ name: "七灭天官", title: "七灭天官", desc: "身披玄色法衣、手执天劫玉简的天官，静候封魔台再开。", gender: 1, age: 800 });
this.qimie_task = function () { return TASK.GET("qimie_event"); };
this.add_action("qimie_join", "参战", function (me) { const t = this.qimie_task(); if (!t) return me.notify("七灭天劫暂未加载。"); return t.join(me); });
this.add_action("qimie_status", "战况", function (me) { const t = this.qimie_task(), e = t && t.query_event(); if (!e) return me.notify("七灭天劫当前没有开放的实例。"); me.send(JSON.stringify(t.query_state())); return true; });
this.add_action("qimie_leave", "离场", function (me) { const t = this.qimie_task(); return !t || t.leave(me); });
this.add_action("qimie_help", "查看天劫", function (me) { me.notify("每日20:30集结30秒。参战后可使用‘观劫’查看状态，输入 raid <内容>发送战团消息。四坛法身必须同时处理。"); return true; });
