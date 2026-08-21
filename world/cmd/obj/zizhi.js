this.inherits(COMMAND);
this.command = "zizhi";
this.allow_fight = false;

this.enter = function (player, arg) {
    const service = WORLD.CUSTOM_EQUIPMENT;
    if (!service) return player.notify("自制装备功能暂时不可用。");
    const values = String(arg || "").trim().split(/\s+/).filter(Boolean);
    const action = values.shift();
    if (action === "open") {
        return service.open(player, values[0], values[1]);
    }
    if (action === "wash") {
        return service.washDirect(player, values[0]);
    }
    if (action === "preview") {
        const itemId = values.shift();
        const operation = values.shift();
        return service.preview(player, itemId, operation, values);
    }
    if (action === "commit") {
        return service.commit(player, values[0]);
    }
    return player.notify("请选择一件自制装备进行操作。");
};
