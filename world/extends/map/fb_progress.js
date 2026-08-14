// 副本路线状态只写入副本首房间，随实例销毁，不污染角色存档。
AREA.prototype.query_fb_route = function (diff, routeId) {
    const routes = this.fb_routes || {};
    const mode = routes[diff] || routes[String(diff)] || routes.normal;
    if (!mode) return null;
    if (routeId && mode[routeId]) return mode[routeId];
    return mode.default || mode;
}

ROOM.prototype.add_fb_click_choices = function (command, choices, handler) {
    if (!command || !Array.isArray(choices) || typeof handler !== "function") return;
    for (const choice of choices) {
        if (!choice || !choice.id || !choice.name) continue;
        const value = choice.value === undefined ? choice.id : choice.value;
        this.add_action(command + "_" + choice.id, choice.name, function (me) {
            return handler.call(this, me, value);
        });
    }
}

if (!ROOM.FB_DESTROY_COMBAT_CLEANUP && ROOM.prototype.destroy) {
    ROOM.FB_DESTROY_COMBAT_CLEANUP = true;
    const previousRoomDestroy = ROOM.prototype.destroy;
    ROOM.prototype.destroy = function () {
        if (this.parent && this.parent.is_copy && this.items) {
            for (const item of this.items.slice()) {
                if (item && item.fight_type && typeof item.end_fight === "function") item.end_fight();
            }
        }
        return previousRoomDestroy.call(this);
    };
}

// 保留旧副本的房间 score，同时让新副本的实例进度进入现有 cr 结算链。
CHARACTER.prototype.query_fbscore = function () {
    if (!this.environment || !this.environment.query_fb_first) return 0;
    const first = this.environment.query_fb_first(this.query_teamid());
    if (!first) return 0;
    if (first.temp && first.temp.fb_progress) return first.temp.fb_progress.score || 0;
    return first.score || 0;
}

ROOM.prototype.query_fb_state = function (me) {
    if (!this.parent || !this.parent.is_copy) return null;
    const actorId = me && me.query_teamid ? me.query_teamid() : null;
    const first = this.query_fb_first(actorId || this.owner);
    if (!first) return null;
    if (!first.temp) first.temp = {};
    if (!first.temp.fb_progress) {
        first.temp.fb_progress = { score: 0, milestones: {}, route: null, failed: false, reason: "" };
    }
    return first.temp.fb_progress;
}

ROOM.prototype.apply_fb_spawn_difficulty = function (me, item) {
    if (!item || item.is_player || item.master || item.fbDifficultyType) return item;
    const type = this.query_temp(me, "diff", 0) || 0;
    if (type <= 0) return item;
    item.fbDifficultyType = type;
    const hpRate = type === 2 ? 2 : 1.5;
    const propRate = type === 2 ? 1.35 : 1.2;
    if (item.max_hp > 0) {
        item.max_hp = Math.ceil(item.max_hp * hpRate);
        item.hp = item.max_hp;
    }
    if (item.max_mp > 0) {
        item.max_mp = Math.ceil(item.max_mp * propRate);
        item.mp = item.max_mp;
    }
    for (const name of ["str", "con", "dex", "int"]) {
        if (item[name] > 0) item[name] = Math.ceil(item[name] * propRate);
    }
    if (item.prop) {
        for (const name of ["gj", "fy", "mz", "ds", "zj"]) {
            if (item.prop[name] > 0) item.prop[name] = Math.ceil(item.prop[name] * propRate);
        }
    }
    return item;
}

ROOM.prototype.grant_fb_milestone = function (me, key, value) {
    const state = this.query_fb_state(me);
    if (!state || state.failed || !key) return false;
    if (state.milestones[key]) return false;
    let declaredAmount = null;
    const areaRoutes = this.parent && this.parent.fb_routes;
    if (areaRoutes) {
        const diff = this.query_temp(me, "diff", 0) || 0;
        const declared = this.parent.query_fb_route
            ? this.parent.query_fb_route(diff, state.route)
            : null;
        const milestones = declared && (declared.milestones || declared);
        if (milestones && !Object.prototype.hasOwnProperty.call(milestones, key)) {
            console.error("副本里程碑未声明: %s/%s", this.parent.id, key);
            return false;
        }
        if (milestones) declaredAmount = Number(milestones[key]);
    }
    const amount = Number(value) || 0;
    if (amount < 0) return false;
    if (declaredAmount !== null && amount !== declaredAmount) {
        console.error("副本里程碑分值不一致: %s/%s 声明%s 实际%s", this.parent.id, key, declaredAmount, amount);
        return false;
    }
    state.milestones[key] = 1;
    state.score += amount;
    if (state.score > 100) {
        state.score = 100;
        console.error("副本完成度超过100: %s/%s", this.parent.id, key);
    }
    return true;
}

ROOM.prototype.set_fb_route = function (me, routeId) {
    const state = this.query_fb_state(me);
    if (!state || state.failed || !routeId) return false;
    if (state.route && state.route !== routeId) return false;
    state.route = routeId;
    return true;
}

ROOM.prototype.fail_fb_route = function (me, reason) {
    const state = this.query_fb_state(me);
    if (!state || state.failed) return false;
    state.failed = true;
    state.reason = reason || "路线条件未满足";
    if (me && me.notify) me.notify("副本路线失败：" + state.reason + "。请离开副本后重新开始。");
    return true;
}

AREA.prototype.validate_fb_routes = function () {
    const routes = this.fb_routes || {};
    const errors = [];
    const inspect = (route, label) => {
        if (!route) return;
        const milestones = route.milestones || route;
        const keys = Object.keys(milestones);
        const seen = new Set();
        let total = 0;
        for (const key of keys) {
            if (seen.has(key)) errors.push(this.id + ":" + label + " 重复里程碑 " + key);
            seen.add(key);
            const amount = Number(milestones[key]);
            if (!Number.isFinite(amount) || amount < 0) errors.push(this.id + ":" + label + " 无效分值 " + key);
            total += amount || 0;
        }
        if (total !== 100) errors.push(this.id + ":" + label + " 分值合计 " + total + "，应为100");
    };
    for (const diff of Object.keys(routes)) {
        const mode = routes[diff];
        if (mode && mode.default) inspect(mode.default, diff + ".default");
        else if (mode && typeof mode === "object") {
            for (const routeId of Object.keys(mode)) inspect(mode[routeId], diff + "." + routeId);
        }
    }
    return errors;
}

AREA.validate_fb_routes = function () {
    const errors = [];
    for (const area of AREA.FBS || []) {
        if (area && area.validate_fb_routes) errors.push(...area.validate_fb_routes());
    }
    return errors;
}
