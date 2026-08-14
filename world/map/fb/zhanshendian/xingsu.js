this.inherits(ROOM);
this.name = "星宿石室";
this.desc = "神石显出八个星宿，八方石板等待按星宿移位后的方位逐块点亮。";
this.exits = { south: "fb/zhanshendian/entry", north: "fb/zhanshendian/guard1" };
this.star_directions = {
    "角": "northeast", "亢": "northeast", "氐": "east", "房": "east", "心": "east", "尾": "southeast", "箕": "southeast",
    "井": "southwest", "鬼": "southwest", "柳": "south", "星": "south", "张": "south", "翼": "south", "轸": "southeast",
    "奎": "northwest", "娄": "northwest", "胃": "west", "昴": "west", "毕": "west", "觜": "west", "参": "southwest",
    "斗": "northwest", "牛": "northwest", "女": "north", "虚": "north", "危": "north", "室": "northeast", "壁": "north"
};
this.direction_names = {
    north: "北", northeast: "东北", east: "东", southeast: "东南",
    south: "南", southwest: "西南", west: "西", northwest: "西北"
};
this.query_star_sequence = function (me) {
    let sequence = this.query_temp(me, "fb/zhanshendian/star_sequence", null);
    if (Array.isArray(sequence) && sequence.length === 8) return sequence;
    const pool = Object.keys(this.star_directions);
    sequence = [];
    while (sequence.length < 8 && pool.length) {
        const randomIndex = Number(me.random(pool.length)) || 0;
        const index = Math.max(0, Math.min(pool.length - 1, randomIndex));
        sequence.push(pool.splice(index, 1)[0]);
    }
    this.set_temp(me, "fb/zhanshendian/star_sequence", sequence);
    return sequence;
};
this.query_star_answer = function (me) {
    return this.query_star_sequence(me).map(star => this.star_directions[star]);
};
this.normalize_star_direction = function (value) {
    const input = String(value || "").trim().toLowerCase();
    const aliases = {
        "北": "north", "东北": "northeast", "东": "east", "东南": "southeast",
        "南": "south", "西南": "southwest", "西": "west", "西北": "northwest"
    };
    return aliases[input] || (Object.prototype.hasOwnProperty.call(this.direction_names, input) ? input : "");
};
this.add_action("observe", "查看星宿", function (me) {
    const sequence = this.query_star_sequence(me);
    const progress = this.query_temp(me, "fb/zhanshendian/star_progress", 0) || 0;
    me.notify("神石依次显出：" + sequence.join("、") + "。青龙角亢北移、尾箕南落；朱雀井鬼西行、轸宿东望；白虎奎娄北移、参宿南落；玄武斗牛西行、室宿东望。当前已点亮" + progress + "块石板。");
});
this.solve_star_board = function (me, par) {
    if (this.query_temp(me, "fb/zhanshendian/solved", 0)) return me.notify("星宿石板已经解开。");
    const answer = this.query_star_answer(me);
    const direction = this.normalize_star_direction(par);
    if (!direction) return me.notify("请选择北、东北、东、东南、南、西南、西或西北石板。");
    const progress = this.query_temp(me, "fb/zhanshendian/star_progress", 0) || 0;
    if (direction !== answer[progress]) {
        this.set_temp(me, "fb/zhanshendian/star_progress", 0);
        return me.notify("方位错误，已经点亮的石板全部熄灭，请从第一宿重新开始。");
    }
    const next = progress + 1;
    this.set_temp(me, "fb/zhanshendian/star_progress", next);
    if (next < answer.length) return me.notify("第" + next + "块石板亮起，继续选择下一宿方位。");
    this.set_temp(me, "fb/zhanshendian/solved", 1);
    const diff = this.query_temp(me, "diff", 0) || 0;
    this.grant_fb_milestone(me, "星宿八卦", diff === 1 ? 10 : 20);
    me.notify("八块星宿石板依次亮起，第一波守卫现身。");
};
this.add_action("solve", "点按石板", function (me, par) {
    if (par) return this.solve_star_board(me, par);
    return me.notify("请选择北、东北、东、东南、南、西南、西或西北石板。");
});
this.add_fb_click_choices("solve", Object.keys(this.direction_names).map(function (direction) {
    return { id: direction, name: "点按" + this.direction_names[direction] + "方", value: direction };
}, this), this.solve_star_board);
this.on_leave = function (me, dir) { if (dir === "north" && !this.query_temp(me, "fb/zhanshendian/solved", 0)) { me.notify("星宿八卦尚未解开。"); return false; } };
