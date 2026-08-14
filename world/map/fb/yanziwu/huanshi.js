this.inherits(ROOM);
this.name = "还施水阁";
this.desc = "水阁中藏着慕容氏的最后一重机关，慕容博从暗处现身。";
this.exits = { south: "fb/yanziwu/lingwei" };
this.add_action("search", "搜索水阁", function (me) { if (this.query_exits("north")) return me.notify("你已经找到了水阁中的暗门。"); this.grant_fb_milestone(me, "还施水阁", 10); this.add_exit("north", "fb/yanziwu/murongbo"); });

