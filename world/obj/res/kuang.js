this.inherits(OBJ);
this.set({
    unit: "块",
    name: "铁矿石",
    desc: "一块从家族矿场开采出的铁矿石。",
    value: 200,
    transable: true
});
this.otype = 3;
this.on_create = function (path, par) {
    var lv = par ? parseInt(par.substr(1)) : 0;
    if (!(lv >= 0 && lv < 7)) return;
    this.name = ["铁矿石", "赤铜矿", "寒铁矿", "玄金矿", "星纹矿", "陨铁矿", "天外陨晶"][lv];
    this.grade = Math.min(6, Math.floor(lv / 1));
    this.value = [200, 1000, 5000, 10000, 50000, 100000, 680000][this.grade];
};
