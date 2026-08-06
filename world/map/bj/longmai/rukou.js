this.inherits(ROOM);
this.name = "地宫入口";
this.desc = "一处隐蔽石缝通向地下，石壁上残留着四十二章经地图中的纹路。";
this.exits = { "down": "bj/longmai/yongdao" };
this.set_item("bi", "石壁", "石壁上刻着半幅龙脉地形，和四十二章经封皮里的地图纹路很像。", [
    ["kan", "查看", function (me) {
        if (me.query_temp("fb/longmai/map")) return me.notify("你已经记下了石壁上的地宫路线。");
        me.set_temp("fb/longmai/map", 1);
        me.add_fbscore(10);
        me.notify("你把石壁纹路和记忆中的经书地图对上了，地宫路线逐渐清晰。");
    }]
]);
