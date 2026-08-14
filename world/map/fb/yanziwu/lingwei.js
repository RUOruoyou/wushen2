this.inherits(ROOM);
this.name = "慕容氏灵位";
this.desc = "灵位前有一处暗格，连续拜祭三次才能开启还施水阁。";
this.exits = { south: "fb/yanziwu/qianyuan" };
this.add_action("worship", "拜祭", function (me) { const count = this.query_temp(me, "fb/yanziwu/worship", 0) || 0; if (count >= 3) return me.notify("暗格已经打开。"); const next = count + 1; this.set_temp(me, "fb/yanziwu/worship", next); if (next === 3) { this.grant_fb_milestone(me, "拜祭灵位", 15); this.add_exit("north", "fb/yanziwu/huanshi"); me.notify("三次拜祭完成，灵位后的暗格缓缓打开。"); } else me.notify("你在灵位前拜祭了第" + next + "次。"); });

