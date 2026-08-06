this.inherits(COMMAND);
this.command = "path";

this.enter = function (me, target) {
    if (!me || !me.environment) return;
    if (!target) return path_fail(me, "你要去哪里？");
    target = target.trim();
    if (!/^\w+(?:\/\w+)*$/.test(target)) return path_fail(me, "你要去哪里？");
    if (!WORLD.ROOMS[target]) return path_fail(me, "没有这个地方。");
    if (me.environment.path == target) return path_fail(me, "你已经在这里了。");

    var path = find_path(me.environment.path, target);
    if (!path || !path.length) return path_fail(me, "没有找到可行路线。");

    me.auto_path_token = (me.auto_path_token || 0) + 1;
    walk_path.call(this, me, {
        target: target,
        path: path,
        index: 0,
        token: me.auto_path_token
    });
}

function walk_path(me, state) {
    if (!me || !me.environment || me.auto_path_token != state.token) return;
    if (me.environment.path == state.target) return;

    var step = state.path[state.index];
    if (!step || step.from != me.environment.path) {
        state.path = find_path(me.environment.path, state.target);
        state.index = 0;
        step = state.path && state.path[0];
    }
    if (!step) return path_fail(me, "自动寻路已停止，当前位置无法到达目标。");

    var before = me.environment;
    me.do_command("go", step.dir);
    if (!me.environment || me.environment == before || me.environment.path == step.from) {
        return path_fail(me, "自动寻路已停止，无法继续移动。");
    }

    state.index++;
    this.call_out(walk_path, 180, me, state);
}

function find_path(from, target) {
    if (!WORLD.ROOMS[from] || !WORLD.ROOMS[target]) return null;

    var queue = [from];
    var visited = {};
    var limit = 0;
    visited[from] = { prev: null, dir: null };

    while (queue.length && limit++ < 5000) {
        var path = queue.shift();
        if (path == target) break;

        var room = WORLD.ROOMS[path];
        if (!room || !room.exits) continue;

        for (var dir in room.exits) {
            var next = room.exits[dir];
            if (!next || visited[next] || !WORLD.ROOMS[next]) continue;
            visited[next] = { prev: path, dir: dir };
            if (next == target) {
                queue.length = 0;
                break;
            }
            queue.push(next);
        }
    }

    if (!visited[target]) return null;

    var result = [];
    var cur = target;
    while (visited[cur] && visited[cur].prev) {
        result.unshift({
            from: visited[cur].prev,
            to: cur,
            dir: visited[cur].dir
        });
        cur = visited[cur].prev;
    }
    return result;
}

function path_fail(me, message) {
    if (!me) return;
    me.send(JSON.stringify({
        type: "path",
        action: "stop",
        message: "<hir>" + message + "</hir>"
    }));
}
