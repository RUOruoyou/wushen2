this.inherits(AREA);
this.set({
    id: "duanjianzhong",
    name: "断剑冢",
    desc: "荒冢之中断剑遍地，残存的剑意化作一道道不肯散去的残魂。",
    first: "mijing/duanjianzhong",
    is_copy: true,
    not_fb: true,
    no_team: true,
    room_path: "mijing/",
    mijing: true
});
this.query_owner = function (me) {
    return me && me.id;
};
this.map = [
    { n: "断剑台", id: "mijing/duanjianzhong", p: [0, 0], exits: ["n", "e", "s", "w"] },
    { n: "葬锋坡", id: "mijing/zangfengpo", p: [0, -1], exits: ["s"] },
    { n: "残刃林", id: "mijing/canrenlin", p: [1, 0], exits: ["w"] },
    { n: "洗剑池", id: "mijing/xijianchi", p: [0, 1], exits: ["n"] },
    { n: "无名冢", id: "mijing/wumingzhong", p: [-1, 0], exits: ["e"] }
];
this.on_login = function (me) {
    const task = TASK.GET("duanjianzhong");
    task && task.restore(me);
};
this.on_leaved = function (me) {
    const task = TASK.GET("duanjianzhong");
    task && task.on_area_leaved(me);
};
