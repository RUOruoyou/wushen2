this.inherits(NPC);
this.set({
    name: "花铁干",
    desc: "他一身正派装束，神色却惊疑不定，长枪横在身前。",
    title: "落花流水",
    gender: 1,
    age: 48,
    per: 16,
    mp: 5400,
    max_mp: 8800,
    hp: 21500,
    max_hp: 21500,
    pfm_rate: 1,
    score: 26,
    prop: { gj: 700, mz: 580, ds: 540, fy: 590 }
});
this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/tiegun", 1, 1]);
this.skill_map(
    ["dodge", 540],
    ["parry", 600],
    ["force", 540],
    ["club", 610],
    ["zhongpingqiang", 610, ["club", "parry"]]);
this.set_drop({
    obj: "money/silver",
    min: 8,
    max: 18
}, {
    obj: "sp/lcj/baozang_suipian",
    min: 1,
    max: 2,
    odds: 2600
});
