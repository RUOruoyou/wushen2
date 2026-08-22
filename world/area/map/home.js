
this.inherits(AREA);
this.set({
    name: "住房",
    room_path: "home/",
    id: "home",
    is_copy: true,
    not_fb: true
});
this.map = [{ n: "卧室", id: "home/danjian", p: [0, 0] },
{ n: "卧室", id: "home/woshi", p: [4, 0] },
{ n: "院子", id: "home/yuanzi", p: [4, 1], exits: ["w", "e", "n"] },
{ n: "练功房", id: "home/liangong", p: [3, 1] },
{ n: "炼药房", id: "home/lianyao", p: [5, 1] },
{ n: "小花园", id: "home/huayuan", p: [5, 0] },
{ n: "矿场", id: "home/kuangchang", p: [4, 2] },
{ n: "药圃", id: "home/yaopu", p: [3, 0] },
{ n: "武馆", id: "home/wuguan", p: [5, 2] },
{ n: "学堂", id: "home/xuetang", p: [6, 2] },
{ n: "工坊", id: "home/gongfang", p: [3, 2] }
];

this.query_owner = function (me) {
    return me.id;
}

// 领地地图按住宅等级实时过滤：扩建后新房间才会显示，不走 map 命令的共享缓存。
this.render_map = function (me) {
    var map = this.map;
    if (me && typeof HOUSEHOLD !== "undefined" && HOUSEHOLD.filterMap) {
        map = HOUSEHOLD.filterMap(me, this.map);
    }
    me.send(JSON.stringify({ type: "map", path: "home", map: map }));
}

