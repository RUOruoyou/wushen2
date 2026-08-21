this.inherits(NPC);
this.set({
    name: "鉴宝师",
    title: "药王谷",
    desc: "一位白发老者正在灯下辨认宝材纹理，案上整齐摆着各式饰品模具。",
    gender: 1,
    age: 67,
    per: 28,
    mp: 3000,
    max_mp: 3000,
    hp: 3000,
    max_hp: 3000
});

this.add_action("custom_equipment", "制作饰品暗器", function (me) {
    return WORLD.COMMANDS.duanzao.enter(me);
});
