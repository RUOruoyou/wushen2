const ADMIN_TEST_ACCOUNTS = {
    ruoyou: true
};

WORLD.ADMIN_TEST_MULTIPLIERS = {
    mining: 100,
    dazuo: 100,
    study: 100,
    lianxi: 100
};

WORLD.ADMIN_TEST_LEVEL = 6;

WORLD.is_test_admin_account = function (target) {
    if (!target) return false;
    let name = "";
    if (typeof target === "string") {
        name = target;
    } else {
        name = target.account_name || target.user_name || target.username || "";
    }
    return !!ADMIN_TEST_ACCOUNTS[String(name).toLowerCase()];
}

WORLD.is_admin = function (me) {
    return !!me && (
        me.user_level > 0 ||
        WORLD.is_test_admin_account(me) ||
        (me.query_temp && (me.query_temp("admin") || me.query_temp("wiz")))
    );
}

WORLD.admin_test_multiplier = function (me, type) {
    if (!WORLD.is_admin(me)) return 1;
    return WORLD.ADMIN_TEST_MULTIPLIERS[type] || 1;
}

WORLD.apply_admin_test_multiplier = function (me, type, value) {
    const multiplier = WORLD.admin_test_multiplier(me, type);
    if (multiplier === 1) return value;
    return parseInt(value * multiplier);
}
