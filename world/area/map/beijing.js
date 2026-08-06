this.inherits(AREA);
this.set({
    id: "beijing",
    name: "北京皇城",
    room_path: "bj/hg/"
});
this.map = [
    { n: "奉天城门", id: "bj/hg/nanmen", p: [0, 1], exits: ["n"] },
    { n: "宫外小路", id: "bj/hg/xiaolu", p: [0, 0], exits: ["s", "e"] },
    { n: "假山", id: "bj/hg/jiashan", p: [1, 0], exits: ["w"] }
];
