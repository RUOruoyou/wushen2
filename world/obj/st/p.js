this.inherits(OBJ);
this.set({
    name: "属性晶石",
    desc: "一块封存装备属性的晶石，可以作为锻造材料。",
    unit: "块",
    value: 1000000,
    combined: true,
    transable: true,
    grade: 5
});
this.otype = 2;
this.on_create = function (path, par) {
    let prop = par ? par.substr(1) : "gj";
    this.path = path + "#" + prop;
    this.prop_key = prop;
    let name = PROPERTIES[prop] || prop;
    this.name = name + "晶石";
    this.desc = "一块封存" + name + "属性的晶石，可以作为锻造材料。";
}
