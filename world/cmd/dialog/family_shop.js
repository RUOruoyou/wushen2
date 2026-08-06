this.inherits(COMMAND);
this.command = "family_shop";
this.allow_busy = true;
this.allow_state = true;
this.regex = /^(?:open|refresh)?$/;

const CONFIG = WORLD.FAMILY_TASK;
const KEY_WEEK = "family_shop_week";
const KEY_PAGES = "family_shop_pages";
const ITEM_PREFIX = "family_";

this.enter = function (player) {
    const shop = WORLD.COMMANDS.shop;
    if (!shop) return player.notify("商城暂未开放。");
    return shop.enter(player, "merit");
};

this.queryItems = function (player) {
    if (!player.family || !CONFIG.isSupportedFamily(player.family)) return [];

    ensureWeek(player);
    const familyId = player.family.id;
    const grade = CONFIG.queryShopGrade(player);
    const price = CONFIG.queryShopPrice(grade);
    const pageObj = OBJ.CREATE("book/up");
    const pageBought = CONFIG.clampInt(player.query_temp(KEY_PAGES, 0), 0, CONFIG.PAGE_WEEKLY_LIMIT);
    const items = [[
        ITEM_PREFIX + "page",
        pageObj.color_name,
        pageObj.desc + "\n本周已兑换" + pageBought + "/" + CONFIG.PAGE_WEEKLY_LIMIT
            + "，每次兑换1份。",
        CONFIG.PAGE_SHOP_PRICE,
        pageObj.grade,
        1
    ]];

    for (const partId of CONFIG.PART_ORDER) {
        const path = CONFIG.queryEquipmentPath(familyId, partId, grade);
        const obj = OBJ.CREATE(path);
        items.push([
            ITEM_PREFIX + partId,
            obj.color_name,
            obj.get_desc(player),
            price,
            obj.grade,
            1
        ]);
    }
    return items;
};

this.buy = function (player, itemId, count) {
    if (!player.family || !CONFIG.isSupportedFamily(player.family)) {
        return player.notify("你当前没有可以兑换功绩商品的正式门派。");
    }

    ensureWeek(player);
    itemId = String(itemId || "");
    if (itemId.indexOf(ITEM_PREFIX) === 0) itemId = itemId.slice(ITEM_PREFIX.length);
    count = CONFIG.clampInt(count || 1, 1, 1);

    let path;
    let price;
    let isPage = false;
    if (itemId === "page") {
        const bought = CONFIG.clampInt(player.query_temp(KEY_PAGES, 0), 0, CONFIG.PAGE_WEEKLY_LIMIT);
        if (bought >= CONFIG.PAGE_WEEKLY_LIMIT) {
            player.notify("武学进阶残页已经达到本周兑换上限。");
            return refreshShop(player);
        }
        path = "book/up";
        price = CONFIG.PAGE_SHOP_PRICE;
        isPage = true;
    } else if (CONFIG.PART_ORDER.indexOf(itemId) >= 0) {
        const grade = CONFIG.queryShopGrade(player);
        path = CONFIG.queryEquipmentPath(player.family.id, itemId, grade);
        price = CONFIG.queryShopPrice(grade);
    } else {
        return player.notify("功绩商城没有这个商品。");
    }

    let obj;
    try {
        obj = OBJ.CREATE(path, count);
    } catch (error) {
        console.error("创建门派功绩商品失败", player.id, path, error.message);
        return player.notify("商品暂时无法创建，请稍后再试。");
    }
    if (!obj || !player.can_add_obj(obj, count)) {
        return player.notify("你的背包空间不足，无法兑换这个商品。");
    }

    const merit = Math.max(0, parseInt(player.query_temp("gongji", 0) || 0));
    if (merit < price) {
        return player.notify("你的师门功绩不足，还需要" + (price - merit) + "点。");
    }

    player.family.add_gongji(player, -price);
    const added = player.add_obj(obj, count, true);
    if (!added) {
        player.family.add_gongji(player, price);
        return player.notify("商品发放失败，扣除的师门功绩已经退还。");
    }
    if (isPage) player.set_temp(KEY_PAGES, player.query_temp(KEY_PAGES, 0) + 1);
    player.notify("<hiy>你消耗" + price + "点师门功绩，兑换了" + added.unit_name(count) + "。</hiy>");
    if (player.save) player.save("商城功绩兑换");
    return refreshShop(player);
};

function ensureWeek(player) {
    const week = CONFIG.queryWeekKey();
    if (player.query_temp(KEY_WEEK) === week) return;
    player.set_temp(KEY_WEEK, week);
    player.set_temp(KEY_PAGES, 0);
}

function refreshShop(player) {
    const shop = WORLD.COMMANDS.shop;
    if (!shop || !shop.show) return player.notify("商城暂时无法刷新，请重新打开。");
    return shop.show(player, 2);
}
