this.inherits(ROOM);
this.name = "观前";
this.desc = "松风观前立着两名青城弟子，手中长棍交错，守住上山小径。";
this.exits = { "south": "fb/qingcheng/shanlu", "north": "fb/qingcheng/baguatai" };
this.set_npc(["fb/qingcheng/dizi", 2]);
this.on_leave = function (me, dir) {
    if (dir == "north" && this.find_obj_bypath("fb/qingcheng/dizi")) {
        me.notify("青城弟子摆开棍阵，挡住上山小径。");
        return false;
    }
}
