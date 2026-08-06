this.inherits(OBJ);
this.set({
    name: "山海历练经验",
    desc: "参与山海异兽讨伐后获得的历练经验。",
    unit: "点",
    value: 0,
    grade: 1
});

this.on_receive = function (me) {
    if (!(this.count > 0)) return false;
    me.add_exp(this.count, 0);
};
