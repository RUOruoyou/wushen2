this.inherits(EQUIPMENT);
this.set({
    name: "门派套装",
    desc: "这是一件门派功绩装备。",
    unit: "件",
    grade: 0,
    eq_type: EQUIP_TYPE.CLOTH,
    value: 100,
    hole_count: 0,
    no_alloc: true,
    prop: { fy: 1 }
});

this.on_create = function (path, par) {
    this.spec = par ? par.substr(1) : null;
    this.on_reload();
};

this.on_reload = function () {
    const config = WORLD.FAMILY_TASK;
    if (!config) return;
    const spec = config.parseEquipmentSpec(this.spec || this.query_temp("spec"));
    if (!spec) return;
    const data = config.queryEquipmentData(spec.familyId, spec.partId, spec.grade);
    if (!data) return;

    this.spec = spec.familyId + "_" + spec.partId + "_" + spec.grade;
    this.family_id = spec.familyId;
    this.part_id = spec.partId;
    this.grade = data.grade;
    this.eq_type = data.eqType;
    this.unit = data.unit;
    this.name = data.name;
    this.desc = data.familyName + "“" + data.suitName + "”六件套中的"
        + data.partName + "，由师门功绩任务和后勤商店产出。";
    this.group_name = "family_task_" + spec.familyId;
    this.hole_count = data.holeCount;
    this.prop = Object.assign({}, data.prop);
    this.original_prop = Object.assign({}, data.prop);
    this.value = this.VALUES[data.grade];
    const color = this.query_grade_color();
    this.color_name = "<" + color + ">" + this.name + "</" + color + ">";
    this.json = null;
};

this.group_prop = function (count) {
    const config = WORLD.FAMILY_TASK;
    const family = config && config.queryFamily(this.family_id);
    return family && family.sets ? family.sets[count] : null;
};
