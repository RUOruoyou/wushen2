this.inherits(AREA);
this.set({
  id: "ao",
  name: "鳌拜府",
  desc: "满洲第一勇士鳌拜的府邸",
  score: 100,
  is_show: true,
  first: "bj/ao/damen",
  is_copy: true,
  expend: 10,
  exp: 5000,
  pot: 4000,
  is_multi: false,
  room_path: "bj/ao/",
  ss_title: "大内总管"
});
this.map = [
  { n: "大门", id: "bj/ao/damen", p: [2, 0], exits: ["w"] },
  { n: "大院", id: "bj/ao/dayuan", p: [1, 0], exits: ["w", "n"] },
  { n: "厨房", id: "bj/ao/chufang", p: [1, -1] },
  { n: "后院", id: "bj/ao/houyuan", p: [0, 0], exits: ["w", "n", "s1d"] },
  { n: "书房", id: "bj/ao/shufang", p: [0, -1], exits: ["n1d"] },
  { n: "暗室", id: "bj/ao/anshi", p: [0, -2] },
  { n: "卧房", id: "bj/ao/woshi", p: [-1, 0], exits: ["n1d"] },
  { n: "暗道", id: "bj/ao/andao", p: [-1, -1] },
  { n: "牢房", id: "bj/ao/laofang", p: [0, 1] }
];
this.drops = [
  "eq/lv2/ao_jia", "eq/lv2/ao_bishou", "book/bc#hunyuanyiqi", "book/bc#feiyanzoubi", "book/bc#fuhuquan",
  "book/bc#juemengun", "sp/bj/laofangkey", "sp/bj/jing"
];

this.quick_drops = [
  {
    obj: "money/silver",
    min: 10,
    max: 15
  }, {
    obj: ["eq/lv0/cloth", "eq/lv0/mugun", "eq/lv0/jian"],
    odds: 8000
  }, {
    obj: ["book/bc#hunyuanyiqi", "book/bc#feiyanzoubi", "book/bc#fuhuquan", "book/bc#juemengun"],
    odds: 5000
  }, {
    obj: ["eq/lv2/ao_jia", "eq/lv2/ao_bishou"],
    odds: 1000
  }, {
    obj: "sp/npc#aobai",
    odds: 30
  }, {
    obj: "sp/fb/tiao",
    odds: 1000
  }, {
    obj: "st/xuanjing",
    min: 1,
    max: 3
  }
];

