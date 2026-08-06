this.inherits(ROOM);
this.name = "后园";
this.desc = "后园荒草极深，藤蔓攀满假山，隐约露出一块刻着蛇纹的青石。";
this.exits = { "west": "fb/wenfu/qianting" };
this.set_item("qingshi", "蛇纹青石", "青石上刻着弯曲蛇纹，纹路尽头似乎压着一只铁匣。", [
    ["search", "搜查", function (me) {
        if (me.query_temp("fb/wenfu/box")) return me.notify("你已经取出了青石下的金蛇秘匣。");
        me.set_temp("fb/wenfu/box", 1);
        me.add_fbscore(20);
        me.notify("你拨开藤蔓，从青石下取出金蛇秘匣，匣中暗记指向石窟深处。");
    }]
]);
