this.inherits(NPC);
this.set({
    name: "双儿",
    desc: "她是一位约莫二十岁的清秀姑娘，一张雪白的脸庞，眉弯嘴小，笑靥如花，正落落大方地看着你。",
    title: "<hiw>天下无双</hiw>",
    gender: 2,
    age: 20,
    per: 39,
    mp: 400,
    max_mp: 400,
    hp: 1500,
    max_hp: 1500
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
], [
    "eq/lv0/dao", 1, 1
]);
this.skill_map(
    ["dodge", 150],
    ["parry", 150],
    ["force", 150],
    ["unarmed", 150],
    ["sword", 150],
    ["huashanjianfa", 150, "sword"],
    ["shenxingbaibian", 150, "dodge"]);

this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 20
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
    odds: 8000
}, {
    obj: ["book/bc#shenxingbaibian", "book/bc#huashanjianfa", "book/bc#shenlongjian"],
    odds: 3000
});

this.set_ask("跟我走吧", function (me) {
    if (me.query_temp("fb/zhuang/shuang")) {
        me.notify("<hiy>双儿说道：夫人待我恩重如山，恩公对庄家又有大恩。夫人准我随你同行，我愿与你彼此照应。</hiy>");
        var obj = me.add_obj("sp/npc#shuang");
        if (obj) {
            me.notify("你获得了" + obj.unit_name(1) + "。");

        }
        me.remove_temp("fb/zhuang/shuang");
        this.destroy();
    } else {
        me.notify("双儿摇了摇头说道：夫人还没有同意，我不能就这样离开。");
    }
});
