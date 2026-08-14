const TAOHUA_MAZE_LAYOUTS = [
    [8, 1, 6, 3, 5, 7, 4, 9, 2],
    [6, 1, 8, 7, 5, 3, 2, 9, 4],
    [4, 3, 8, 9, 5, 1, 2, 7, 6],
    [2, 7, 6, 9, 5, 1, 4, 3, 8],
    [4, 9, 2, 3, 5, 7, 8, 1, 6],
    [2, 9, 4, 7, 5, 3, 6, 1, 8],
    [8, 3, 4, 1, 5, 9, 6, 7, 2],
    [6, 7, 2, 1, 5, 9, 8, 3, 4]
];

const TAOHUA_MAZE_POSITIONS = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

const TAOHUA_MAZE_DIRECTIONS = [
    { id: "north", name: "向北走" },
    { id: "northeast", name: "向东北走" },
    { id: "east", name: "向东走" },
    { id: "southeast", name: "向东南走" },
    { id: "south", name: "向南走" },
    { id: "southwest", name: "向西南走" },
    { id: "west", name: "向西走" },
    { id: "northwest", name: "向西北走" }
];

const TAOHUA_MAZE_POSITION_NAMES = ["西北", "正北", "东北", "正西", "中宫", "正东", "西南", "正南", "东南"];

function taohuaDirection(fromIndex, toIndex) {
    const from = TAOHUA_MAZE_POSITIONS[fromIndex];
    const to = TAOHUA_MAZE_POSITIONS[toIndex];
    const dx = Math.sign(to[0] - from[0]);
    const dy = Math.sign(to[1] - from[1]);
    if (dx === 0 && dy < 0) return "north";
    if (dx > 0 && dy < 0) return "northeast";
    if (dx > 0 && dy === 0) return "east";
    if (dx > 0 && dy > 0) return "southeast";
    if (dx === 0 && dy > 0) return "south";
    if (dx < 0 && dy > 0) return "southwest";
    if (dx < 0 && dy === 0) return "west";
    if (dx < 0 && dy < 0) return "northwest";
    return "";
}

ROOM.prototype.query_taohua_layout = function (me) {
    let layoutIndex = Number(this.query_temp(me, "fb/taohuadao/maze_layout", 0)) - 1;
    if (layoutIndex < 0 || layoutIndex >= TAOHUA_MAZE_LAYOUTS.length) {
        layoutIndex = Math.max(0, Math.min(TAOHUA_MAZE_LAYOUTS.length - 1, Number(me.random(TAOHUA_MAZE_LAYOUTS.length)) || 0));
        this.set_temp(me, "fb/taohuadao/maze_layout", layoutIndex + 1);
    }
    return TAOHUA_MAZE_LAYOUTS[layoutIndex];
}

ROOM.prototype.move_taohua_player = function (me, path, leaveMessage, enterMessage) {
    const base = ROOM.Get(path);
    const target = base && this.owner && typeof base.query_copy === "function" ? base.query_copy(this.owner) : base;
    if (!target) return me.notify("桃花林暂时无法通行，请重新进入副本。");
    me.moveto(target, leaveMessage || me.name + "踏入桃花林。", enterMessage || me.name + "从桃影中走了出来。");
    return true;
}

ROOM.prototype.enter_taohua_maze = function (me) {
    const diff = Number(this.query_temp(me, "diff", 0)) || 0;
    const state = this.query_fb_state(me);
    if (diff > 0 && state && state.milestones["黄药师"]) return me.notify("困难桃花岛已经完成。");
    if (diff === 0 && this.query_temp(me, "fb/taohuadao/delivered", 0)) return me.notify("石匣已经交还黄蓉，桃花阵不再阻路。");
    const secondRun = diff === 0
        && this.query_temp(me, "fb/taohuadao/need_box", 0)
        && !this.query_temp(me, "fb/taohuadao/maze_second_done", 0);
    this.set_temp(me, "fb/taohuadao/maze_layout", (Number(me.random(TAOHUA_MAZE_LAYOUTS.length)) || 0) + 1);
    this.set_temp(me, "fb/taohuadao/maze_run", secondRun ? 2 : 1);
    this.set_temp(me, "fb/taohuadao/maze_step", 1);
    const layout = this.query_taohua_layout(me);
    const startIndex = layout.indexOf(1);
    me.notify("你踏入九宫桃花阵。先确认一棵桃树所在方位，再按一至九的顺序逐房辨认；到九后沿原方向继续走即可出阵。");
    return this.move_taohua_player(me, "fb/taohuadao/maze" + (startIndex + 1));
}

ROOM.prototype.finish_taohua_maze = function (me) {
    const diff = Number(this.query_temp(me, "diff", 0)) || 0;
    const run = Number(this.query_temp(me, "fb/taohuadao/maze_run", 1)) || 1;
    this.set_temp(me, "fb/taohuadao/maze_step", 0);
    if (diff > 0) {
        this.grant_fb_milestone(me, "破阵一", 25);
        me.notify("你走出桃花阵，黄药师已经在卧室等候。");
        return this.move_taohua_player(me, "fb/taohuadao/huangrong1");
    }
    if (run === 2 && this.query_temp(me, "fb/taohuadao/need_box", 0)) {
        this.grant_fb_milestone(me, "回报黄蓉", 15);
        this.grant_fb_milestone(me, "破阵二", 15);
        this.set_temp(me, "fb/taohuadao/maze_second_done", 1);
        me.notify("桃影间多出一条通往山洞的路，周伯通正在里面守着石匣。");
        return this.move_taohua_player(me, "fb/taohuadao/zhou2");
    }
    this.grant_fb_milestone(me, "破阵一", 15);
    this.set_temp(me, "fb/taohuadao/maze_first_done", 1);
    me.notify("你走出桃花林，前方小路通往桃花岛庄院。");
    return this.move_taohua_player(me, "fb/taohuadao/taolin_exit");
}

ROOM.prototype.walk_taohua_maze = function (me, positionIndex, direction) {
    const layout = this.query_taohua_layout(me);
    const currentNumber = layout[positionIndex];
    const currentStep = Number(this.query_temp(me, "fb/taohuadao/maze_step", 1)) || 1;
    if (currentNumber !== currentStep) {
        const startIndex = layout.indexOf(1);
        this.set_temp(me, "fb/taohuadao/maze_step", 1);
        me.notify("桃林方位已经错乱，你被送回一棵桃树所在的阵门。");
        return this.move_taohua_player(me, "fb/taohuadao/maze" + (startIndex + 1));
    }
    if (currentNumber < 9) {
        const targetIndex = layout.indexOf(currentNumber + 1);
        const expected = taohuaDirection(positionIndex, targetIndex);
        if (direction !== expected) {
            const startIndex = layout.indexOf(1);
            this.set_temp(me, "fb/taohuadao/maze_step", 1);
            me.notify("方向错误，桃花阵重新合拢，你回到一棵桃树所在的阵门。");
            return this.move_taohua_player(me, "fb/taohuadao/maze" + (startIndex + 1));
        }
        this.set_temp(me, "fb/taohuadao/maze_step", currentNumber + 1);
        return this.move_taohua_player(me, "fb/taohuadao/maze" + (targetIndex + 1));
    }
    const eightIndex = layout.indexOf(8);
    const expectedExit = taohuaDirection(eightIndex, positionIndex);
    if (direction !== expectedExit) {
        const startIndex = layout.indexOf(1);
        this.set_temp(me, "fb/taohuadao/maze_step", 1);
        me.notify("九宫出口方向判断错误，桃花阵将你送回起点。");
        return this.move_taohua_player(me, "fb/taohuadao/maze" + (startIndex + 1));
    }
    return this.finish_taohua_maze(me);
}

ROOM.prototype.setup_taohua_maze_room = function (positionIndex) {
    if (!Number.isInteger(positionIndex) || positionIndex < 0 || positionIndex >= 9) {
        throw new Error("桃花阵房间位置无效: " + positionIndex);
    }
    this.name = "桃花林·" + TAOHUA_MAZE_POSITION_NAMES[positionIndex];
    this.desc = "桃影重重，必须按九宫次序辨认此处桃树数量。";
    this.exits = {};
    this.on_before_enter = function (me) {
        const layout = this.query_taohua_layout(me);
        this.name = "桃花林·" + TAOHUA_MAZE_POSITION_NAMES[positionIndex];
        this.desc = "你位于九宫格的" + TAOHUA_MAZE_POSITION_NAMES[positionIndex] + "，此处共有<hiy>" + layout[positionIndex] + "</hiy>棵桃树。下一步必须寻找" + (layout[positionIndex] < 9 ? layout[positionIndex] + 1 : "出口") + "。";
        this.json = null;
    };
    for (const direction of TAOHUA_MAZE_DIRECTIONS) {
        this.add_action("maze_" + direction.id, direction.name, function (me) {
            return this.walk_taohua_maze(me, positionIndex, direction.id);
        });
    }
}
