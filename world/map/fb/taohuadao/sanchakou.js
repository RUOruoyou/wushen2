this.inherits(ROOM);
this.name = "三岔口";
this.desc = "三条小路通向桃花阵。阵门上可能只有二、四、六或八棵桃树，阵眼必须逐步辨认。";
this.exits = { south: "fb/taohuadao/entry" };
const patterns = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 5],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 5],
    [2, 4, 6, 8, 5, 1, 3, 7, 9, 5],
    [8, 6, 4, 2, 5, 9, 7, 3, 1, 5]
];
const advanceArray = function (room, me, key, exit, milestone, amount, par) {
    if (room.query_exits("north")) return me.notify("你已经找到了桃花阵的入口。");
    const patternKey = key + "/pattern";
    const indexKey = key + "/index";
    let patternValue = room.query_temp(me, patternKey, 0);
    if (!patternValue) {
        patternValue = me.random(patterns.length) + 1;
        room.set_temp(me, patternKey, patternValue);
        room.set_temp(me, indexKey, 0);
    }
    const patternIndex = patternValue - 1;
    const index = room.query_temp(me, indexKey, 0);
    if (!par) return me.notify("当前阵眼有" + [2, 4, 6, 8][patternIndex] + "棵桃树，请点击下一个阵眼编号。");
    const token = String(par).trim();
    if (!/^\d+$/.test(token) || token.split(/\s+/).length !== 1 || Number(token) !== patterns[patternIndex][index]) {
        room.set_temp(me, patternKey, 0);
        room.set_temp(me, indexKey, 0);
        return me.notify("阵眼判断错误，桃花阵重置，请从当前阵门重新辨认。");
    }
    const nextIndex = index + 1;
    room.set_temp(me, indexKey, nextIndex);
    if (nextIndex < patterns[patternIndex].length) return me.notify("阵眼" + token + "正确，还需继续辨认下一棵桃树。");
    if (milestone) room.grant_fb_milestone(me, milestone, amount);
    room.add_exit("north", exit);
    me.notify("你走完" + [2, 4, 6, 8][patternIndex] + "棵桃树组成的九宫阵，出口显现。");
};
this.add_action("break_array", "破阵", function (me, par) {
    advanceArray(this, me, "fb/taohuadao/array1", "fb/taohuadao/taohuazhen1", "", 0, par);
});
this.add_fb_click_choices("break_array", [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (number) {
    return { id: String(number), name: "踏阵眼" + number, value: number };
}), function (me, value) {
    return advanceArray(this, me, "fb/taohuadao/array1", "fb/taohuadao/taohuazhen1", "", 0, value);
});
