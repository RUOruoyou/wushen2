this.inherits(COMMAND);
this.command = "fenjie";
this.allow_fight = false;
this.regex = /^(\w+)(?:\s(\w+))?$/;
this.previews = new Map();

this.enter = function (player, objid, token) {
    const management = WORLD.ITEM_MANAGEMENT;
    if (!management) return player.notify("分解功能暂时不可用。");
    const obj = player.find_obj(objid);
    if (!obj) return player.notify("你要分解什么装备？");
    this.cleanPreviews();

    if (!token) return this.preview(player, obj, management);
    const preview = this.previews.get(token);
    if (!preview || preview.playerId !== player.id || preview.itemId !== obj.id || preview.expiresAt <= Date.now()) {
        this.previews.delete(token);
        return player.notify("分解确认已经失效，请重新查看产物。");
    }
    if (management.itemFingerprint(obj, "disassemble", player) !== preview.fingerprint) {
        this.previews.delete(token);
        return player.notify("装备状态已经变化，请重新确认分解产物。");
    }
    const context = management.resolveOwner(player, { type: "player" }, { requireReady: true });
    if (!context.ok) return player.notify(context.message);
    const result = management.executeDisassemble(context, obj, { bulk: false });
    this.previews.delete(token);
    if (!result.ok) return player.notify(result.message);
    player.send("你将" + obj.color_name + "分解，获得了" + describeOutputs(result.outputs) + "。");
};

this.preview = function (player, obj, management) {
    const allowed = management.checkDisassemble(player, obj, { bulk: false });
    if (!allowed.allowed) return player.notify(allowed.message);
    const token = management.crypto.randomBytes(16).toString("hex");
    this.previews.set(token, {
        playerId: player.id,
        itemId: obj.id,
        fingerprint: management.itemFingerprint(obj, "disassemble", player),
        expiresAt: Date.now() + 60000
    });
    const risk = obj.grade >= 5 ? "<hir>此操作不可撤销。</hir>" : "";
    player.notify("是否确认分解" + obj.color_name + "？" + risk + "预计获得：" + describeOutputs(allowed.outputs) + "。");
    player.send_commands("fenjie " + obj.id + " " + token, "确认分解");
};

this.cleanPreviews = function () {
    const now = Date.now();
    for (const [token, preview] of this.previews) {
        if (preview.expiresAt <= now) this.previews.delete(token);
    }
};

function describeOutputs(outputs) {
    if (!outputs || !outputs.length) return "无产物";
    return outputs.map(function (output) {
        return output.name + "×" + output.count;
    }).join("、");
}
