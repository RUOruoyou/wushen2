this.inherits(ROOM);
this.name = "石窟";
this.desc = "石窟阴冷潮湿，壁上满是剑痕掌印，温家另一位长老守在窟口。";
this.exits = { "south": "fb/wenfu/pianting", "north": "fb/wenfu/mishi" };
this.set_npc("fb/wenfu/wenlaosi");
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/wenfu/wenlaosi")) {
        me.notify("温家长老挥棍拦住石窟深处。");
        return false;
    }
    if (dir == "north" && !me.query_temp("fb/wenfu/box")) {
        me.notify("石窟岔路繁复，你还没找到金蛇秘匣中的暗记。");
        return false;
    }
}
