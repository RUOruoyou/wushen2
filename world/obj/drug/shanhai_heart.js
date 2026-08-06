this.inherits(OBJ);
this.set({
    unit: "颗",
    name: "异兽之心",
    grade: 5,
    desc: "山海异兽体内凝结的精华，蕴含磅礴的异境之力。使用后永久增加100点内力上限，并在30分钟内打坐、学习、练习效率提升100%。",
    value: 50000,
});
this.transable = true;

this.on_use = function (me) {
    me.send_room("<hir>$N服下了一颗异兽之心，周身泛起淡淡的光芒，气势陡然攀升。</hir>");

    me.limit_mp += 100;
    me.notify("<hiw>你的内力上限永久增加了100点！</hiw>");

    me.add_status({
        id: "shanhai_heart",
        name: "异兽之心",
        desc: "异兽之心的力量在体内流转，打坐、学习、练习效率提升100%。",
        duration: 1800000,
        prop: {
            dazuo_per: 100,
            study_per: 100,
            lianxi_per: 100
        },
        override: 2
    });
    me.notify("<hiy>异兽之心的力量在你体内流转，30分钟内打坐、学习、练习效率翻倍！</hiy>");
    return true;
}
