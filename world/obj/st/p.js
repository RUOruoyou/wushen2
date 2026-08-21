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
    // _per 属性与基础属性中文名相同，追加%区分，避免两种晶石同名却不能堆叠
    if (prop.slice(-4) === "_per") name += "%";
    this.name = name + "晶石";
    this.desc = "一块封存" + name + "属性的晶石，可以作为锻造材料。";
}
