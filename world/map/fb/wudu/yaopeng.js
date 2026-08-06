this.inherits(ROOM);
this.name = "药棚";
this.desc = "药棚中摆满瓶罐，几味解毒草药被锁在竹柜里，五毒使者正守在旁边。";
this.exits = { "west": "fb/wudu/duwu" };
this.set_npc("fb/wudu/shizhe");
this.set_item("zhugui", "竹柜", "竹柜内分放雄黄、蛇血和几枚青色药丸，可配成破毒阵的解药。", [
    ["peiyao", "配解药", function (me) {
        if (this.find_obj_bypath("fb/wudu/shizhe")) {
            me.notify("五毒使者冷笑着按住竹柜，不让你取药。");
            return false;
        }
        if (me.query_temp("fb/wudu/yao")) return me.notify("你已经配好解药。");
        me.set_temp("fb/wudu/yao", 1);
        me.add_fbscore(15);
        me.notify("你按药柜旁的旧方配出解药，毒阵中的腥甜气息顿时不再那么刺鼻。");
    }]
]);
