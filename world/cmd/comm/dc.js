
this.inherits(COMMAND);
this.command = "dc";
this.regex = /(\w+)\s+(\w+)\s*(.+)?/;
this.enter = function (player, arg, cmd, par) {
    if (!arg || !cmd) return;
    var target = player.find_obj(arg, player.environment);
    if (!target) return player.send("没有这个人。");
    if (target.master != player.id) return player.send("你没办法这么做。");
    if (!ALLOW_DC[cmd]) return player.send("这个操作不能交给侍从执行。");
    try {
        target.set_listener(player, player);
        target.do_command(cmd, par);
    } finally {
        target.set_listener(player, null);
    }
}
const ALLOW_DC = {
    study: true,
    store: true,
    dazuo: true,
    liaoshang: true,
    learn: true,
    xue: true,
    enable: true,
    equip: true,
    unequip: true,
    lianxi: true,
    fangqi: true,
    give: true,
    caiyao: true,
    diaoyu: true,
    cai: true,
    diao: true,
    wa: true,
    wk: true,
    stopstate: true,
    state: true,
    eq: true,
    uneq: true,
    checkobj: true,
    drop: true,
    lingwu: true,
    use: true,
    lianyao: true,
    sell: true,
    lingwu2: true,
    lingwu3: true,
    fenjie: true,
    lockobj: true,
    combine: true,
    open: true,
    packitem: true
};
