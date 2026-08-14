this.inherits(ROOM); this.name = "孤星台"; this.desc = "第三波守卫留下的孤星落向四方之一。"; this.exits = { south: "fb/zhanshendian/guard3" }; this.query_guxing = function (me) { let dir = this.query_temp(me, "fb/zhanshendian/guxing", ""); if (!dir) { dir = ["east", "south", "west", "north"][me.random(4)]; this.set_temp(me, "fb/zhanshendian/guxing", dir); } return dir; }; this.add_action("observe", "查看孤星", function (me) { const names = { east: "东", south: "南", west: "西", north: "北" }; const direction = this.query_guxing(me); me.notify("孤星坠向" + names[direction] + "方。"); });
this.jump_guxing = function (me, par) { const expected = this.query_guxing(me); if (String(par || "").trim() !== expected) return me.notify("方向错误，孤星台将你挡了回来。"); const diff = this.query_temp(me, "diff", 0) || 0; this.grant_fb_milestone(me, "孤星", diff === 1 ? 5 : 10); const targetPath = diff === 1 ? "fb/zhanshendian/shendian" : "fb/zhanshendian/mufeng"; const base = ROOM.Get(targetPath); const target = base && base.copy_rooms && base.copy_rooms[this.owner]; if (target) me.moveto(target, me.name + "跃入孤星。", me.name + "从星光中落下。"); };
this.add_action("jump", "跃入孤星", function (me, par) { if (par) return this.jump_guxing(me, par); return me.notify("请查看孤星落向后，点击对应方向。"); });
this.add_fb_click_choices("jump", [
    { id: "north", name: "跃向北方" },
    { id: "east", name: "跃向东方" },
    { id: "south", name: "跃向南方" },
    { id: "west", name: "跃向西方" }
], this.jump_guxing);
