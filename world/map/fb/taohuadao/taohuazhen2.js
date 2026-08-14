this.inherits(ROOM);
this.name = "桃花阵深处";
this.desc = "第二座桃花阵比先前更窄，二、四、六或八棵桃树依次成阵，只有中宫五可以重复。";
this.exits = { south: "fb/taohuadao/huangrong2" };
this.add_action("walk_array", "破阵", function (me, par) {
    if (this.query_exits("north")) return me.notify("山洞入口已经打开。");
    const patterns = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 5],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 5],
        [2, 4, 6, 8, 5, 1, 3, 7, 9, 5],
        [8, 6, 4, 2, 5, 9, 7, 3, 1, 5]
    ];
    const patternKey = "fb/taohuadao/array3/pattern";
    const indexKey = "fb/taohuadao/array3/index";
    let patternValue = this.query_temp(me, patternKey, 0);
    if (!patternValue) {
        patternValue = me.random(patterns.length) + 1;
        this.set_temp(me, patternKey, patternValue);
        this.set_temp(me, indexKey, 0);
    }
    const patternIndex = patternValue - 1;
    const index = this.query_temp(me, indexKey, 0);
    if (!par) return me.notify("当前阵眼有" + [2, 4, 6, 8][patternIndex] + "棵桃树，请点击下一个阵眼编号。");
    const token = String(par).trim();
    if (!/^\d+$/.test(token) || token.split(/\s+/).length !== 1 || Number(token) !== patterns[patternIndex][index]) {
        this.set_temp(me, patternKey, 0);
        this.set_temp(me, indexKey, 0);
        return me.notify("阵眼踏错，桃花阵重新排列，请从第一棵桃树开始。");
    }
    const nextIndex = index + 1;
    this.set_temp(me, indexKey, nextIndex);
    if (nextIndex < patterns[patternIndex].length) return me.notify("阵眼" + token + "正确，还需继续辨认。");
    this.grant_fb_milestone(me, "破阵二", 15);
    this.add_exit("north", "fb/taohuadao/zhou2");
    me.notify("你走完" + [2, 4, 6, 8][patternIndex] + "棵桃树组成的九宫阵，山洞入口显现。");
});
this.add_fb_click_choices("walk_array", [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (number) {
    return { id: String(number), name: "踏阵眼" + number, value: number };
}), function (me, value) {
    return this.actions.walk_array.action.call(this, me, value);
});
