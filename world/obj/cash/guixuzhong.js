this.inherits(OBJ);
this.set({
    unit: "枚",
    name: "归墟种",
    desc: "一枚蕴含归墟气息的奇异种子，可开启通往断剑冢的秘境裂隙。",
    value: 0,
    grade: 3
});
this.transable = false;
this.on_use = function (me) {
    me.notify("归墟种只能在江湖-秘境中开启断剑冢，使用不会消耗门票。");
    return false;
};
