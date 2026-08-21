this.inherits(COMMAND);
this.command = "duanzao";
this.allow_fight = false;

const WEAPON_NAMES = {
    sword: "剑",
    blade: "刀",
    club: "棍",
    staff: "杖",
    whip: "鞭",
    none: "拳套"
};
const PART_NAMES = {
    cloth: "衣服",
    shoes: "鞋",
    head: "头部",
    cape: "披风",
    ring: "戒指",
    necklace: "项链",
    jewels: "饰品",
    wrist: "护腕",
    waist: "腰带",
    throwing: "暗器"
};

this.PROPS = {};
for (const key in WORLD.CUSTOM_EQUIPMENT.legacyProps) {
    this.PROPS[key] = { value: WORLD.CUSTOM_EQUIPMENT.legacyProps[key] };
}

this.DEFAULT_PROPS = [];
for (const key in WORLD.CUSTOM_EQUIPMENT.parts) {
    const part = WORLD.CUSTOM_EQUIPMENT.parts[key];
    this.DEFAULT_PROPS[part.eqType] = part.fixedProp;
}

this.sum_needs = function (prop, level) {
    return WORLD.CUSTOM_EQUIPMENT.sumNeeds(level);
};

this.prop_value = function (prop, level) {
    const item = this.PROPS[prop];
    if (!item) return 0;
    return item.value * (parseInt(level) || 1);
};

this.default_template = function (obj) {
    return WORLD.CUSTOM_EQUIPMENT.rebuild(obj);
};

this.enter = function (me, arg) {
    const service = WORLD.CUSTOM_EQUIPMENT;
    if (!service || !me.environment) return me.notify("自制装备功能暂时不可用。");
    if (!service.isEnabled()) return me.notify("自制装备制作入口正在维护，请稍后再试。");
    const rawArg = String(arg || "").trim();
    if (!rawArg || rawArg.toLowerCase() === "ok" || rawArg.toLowerCase() === "open") {
        return showCraftOptions(me, service);
    }

    const parts = rawArg.split(/\s+/);
    const target = parts[0].toLowerCase();
    const directName = parts.slice(1).join(" ").trim();

    let partKey = target;
    let variant = target;
    if (WEAPON_NAMES[target]) partKey = "weapon";
    if (!WEAPON_NAMES[target] && !PART_NAMES[target]) return me.notify("这里不能制作这种装备。");
    if (!service.canCraft(me, partKey)) return me.notify("只有在对应的制作地点才能打造这件装备。");

    const yuanjing = me.find_obj_bypath("st/yuanjing");
    if (!yuanjing || yuanjing.count < 10) return me.notify("制作一件自制装备需要 10 个<hio>元晶</hio>。");

    if (directName) {
        return this.finishCraft(partKey, variant, me, directName);
    }

    const partName = partKey === "weapon" ? WEAPON_NAMES[variant] : PART_NAMES[partKey];
    me.notify("请为这件自制" + partName + "取名。（使用任意频道说出 2-5 个汉字）");
    me.wait_input = this.finishCraft.bind(this, partKey, variant);
    me.send_commands("cancle", "取消制作");
};

this.finishCraft = function (partKey, variant, me, input) {
    if (input === "cancle") {
        me.wait_input = null;
        return me.notify("你取消了本次制作。");
    }
    const words = String(input || "").trim().split(/\s+/);
    const name = words[words.length - 1];
    if (!/^[\u4E00-\u9FA5]{2,5}$/.test(name)) return me.send("装备名称需要是 2-5 个汉字。");
    if (!UTIL.check_word(name)) return me.send("这个名称不能使用。");

    const service = WORLD.CUSTOM_EQUIPMENT;
    if (!service.isEnabled()) {
        me.wait_input = null;
        return me.notify("自制装备制作入口正在维护，本次没有扣除任何材料。");
    }
    if (!service.canCraft(me, partKey)) {
        me.wait_input = null;
        return me.notify("你已经离开制作地点，本次制作取消。");
    }
    const yuanjing = me.find_obj_bypath("st/yuanjing");
    if (!yuanjing || yuanjing.count < 10) {
        me.wait_input = null;
        return me.notify("制作材料不足，本次没有扣除任何材料。");
    }
    const obj = service.createItem(partKey, variant, name);
    if (!obj) {
        me.wait_input = null;
        return me.notify("装备制作失败，本次没有扣除任何材料。");
    }
    if (me.can_add_obj && !me.can_add_obj(obj)) {
        me.wait_input = null;
        return me.notify("你的背包已满，无法放入新装备。");
    }

    me.wait_input = null;
    const removed = me.remove_obj(yuanjing, 10);
    if (!removed) return me.notify("材料状态发生变化，本次制作取消。");
    const added = me.add_obj(obj);
    if (!added) {
        me.add_obj("st/yuanjing", 10);
        return me.notify("装备制作失败，10 个元晶已经返还。");
    }
    me.notify("<hig>制作完成，你获得了" + obj.unit_name() + "。</hig>");
};

function showCraftOptions(me, service) {
    const roomPath = me.environment.path;
    const parts = service.partsForRoom(roomPath);
    if (!parts.length) return me.notify("这里没有可以制作自制装备的师傅。");
    me.notify("制作一件自制装备需要 10 个<hio>元晶</hio>，请选择要制作的部位。");
    const commands = [];
    if (parts.includes("weapon")) {
        for (const variant in WEAPON_NAMES) commands.push("duanzao " + variant, WEAPON_NAMES[variant]);
    }
    for (const part of parts) {
        if (part === "weapon") continue;
        commands.push("duanzao " + part, PART_NAMES[part]);
    }
    me.send_commands.apply(me, commands);
}
