this.inherits(COMMAND);
this.command = "raid";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.enter = function (me, arg) { const task = TASK.GET("qimie_event"); if (!task || !task.query_event()) return me.notify("当前没有七灭天劫实例。"); const text = String(arg || "").trim(); if (!text) return me.notify("用法：raid <战团消息>"); return task.raid_message(me, text) || me.notify("你必须是活跃参战者才能发言。"); };
