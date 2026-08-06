this.inherits(NPC);
this.set({
    name: "逃犯",
    desc: "他是衙门正在追捕的逃犯",
    title: "<red>衙门逃犯</red>",
    gender: 1,
    age: 25,
    per: 18,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,
    no_refresh: true,
    no_fight: true

});

this.init_from = function (player, grade = 0, level = 0, opts = {}) {
    const ratio = Math.min(Math.max(opts.ratio || 1, 0.8), 1.5);
    const playerHp = Math.max(player.max_hp || 0, player.hp || 0, 1200);
    const playerMp = Math.max(player.max_mp || 0, player.mp || 0, 400);
    const skillLevel = Math.max(50,
        player.query_skill ? player.query_skill("force", 0) : 0,
        player.query_skill ? player.query_skill("unarmed", 0) : 0,
        player.query_skill ? player.query_skill("dodge", 0) : 0,
        player.query_skill ? player.query_skill("parry", 0) : 0);

    this.clear_prop();
    this.skills = null;
    this.con = Math.max(20, parseInt((player.con || 20) * ratio));
    this.dex = Math.max(20, parseInt((player.dex || 20) * ratio));
    this.int = Math.max(20, parseInt((player.int || 20) * ratio));
    this.str = Math.max(20, parseInt((player.str || 20) * ratio));
    this.gender = this.random(2) + 1;

    this.desc = (this.gender == 2 ? "她" : "他") + "是" + player.name + "正在追捕的逃犯";

    this.name = UTIL.random_name(this.gender);
    this.title = opts.mode === "rise" ? "<hiy>递增追捕逃犯</hiy>" : "<hic>衙门逃犯</hic>";

    this.skill_map(["force", parseInt(skillLevel * ratio)],
        ["unarmed", parseInt(skillLevel * ratio)],
        ["dodge", parseInt(skillLevel * ratio)],
        ["parry", parseInt(skillLevel * ratio)]);

    this.hp = this.max_hp = Math.max(1200, parseInt(playerHp * ratio));
    this.pfm_rate = 1;
    this.mp = this.max_mp = Math.max(400, parseInt(playerMp * ratio));
    this.init();
    this.recount();
    this.gj = Math.max(this.gj, parseInt((player.gj || this.gj || 50) * ratio));
    this.fy = Math.max(this.fy, parseInt((player.fy || this.fy || 10) * ratio));
    this.mz = Math.max(this.mz, parseInt((player.mz || this.mz || 10) * ratio));
    this.ds = Math.max(this.ds, parseInt((player.ds || this.ds || 10) * ratio));
    this.zj = Math.max(this.zj, parseInt((player.zj || this.zj || 10) * ratio));
    this.bj = Math.max(this.bj, parseInt((player.bj || this.bj || 1) * ratio));

}
