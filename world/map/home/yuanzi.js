this.inherits(ROOM);
this.name = "院子"
this.desc = "这是你家的大院，迎面是一个假山水池，池上摆着一块奇形怪状的石头，据说是之前人家留下来的，水池两旁种满了花草，东边是一颗槐树，郁郁葱葱，遮盖了大半个院子，背面是你的卧室，西面是练功房"
var FULL_EXITS = { "out": "yz/home", "west": "home/liangong", north: "home/woshi", east: "home/lianyao", northeast: "home/huayuan", south: "home/kuangchang", northwest: "home/yaopu", southeast: "home/wuguan", up: "home/xuetang", southwest: "home/gongfang" };
this.exits = FULL_EXITS;

this.on_before_enter = function (me) {
    if (!me || !me.is_player || this.owner !== me.id) return;
    if (typeof HOUSEHOLD === "undefined" || !HOUSEHOLD.filterExits) return;
    this.exits = HOUSEHOLD.filterExits(me, FULL_EXITS);
}

this.on_enter = function (me) {
    if (me.follower && this.owner === me.id && typeof HOUSEHOLD !== "undefined" && HOUSEHOLD.placeMembers) {
        HOUSEHOLD.placeMembers(me);
    }
    if (me.master) {
        me.actions = [
            { cmd: "dismiss " + me.id, name: "遣散" + me.name }
        ];
        me.master_json = null;
    }
}
this.on_leave = function (me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
}
