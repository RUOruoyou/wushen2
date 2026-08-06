this.inherits(NPC);
this.set({
    name: "程药发",
    desc: "他就是程药发，扬州现任知府。",
    title: "扬州知府",
    gender: 1,
    age: 45,
    per: 22,
    mp: 1500,
    max_mp: 1500,
    hp: 1500,
    max_hp: 1500,
});

this.set_objects(["eq/lv0/cloth",1,1]);
this.add_action("ask1", "追捕", function (me) {
    USERTASK.RUN("yamen2", me);
});

this.add_action("ask2", "放弃任务", function (me) {
    USERTASK.GET("yamen2").giveup(me, true, true);
});

this.add_action("ask3", "继续追捕", function (me) {
    USERTASK.GET("yamen2").auto(me);
});

// this.add_action("ask3", "快速追捕", function (me) {
   
//     USERTASK.GET("yamen").quickly_start(me);
// });
