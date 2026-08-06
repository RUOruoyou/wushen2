this.inherits(NPC);
this.set({
    name: "师门试炼目标",
    desc: "此人是门派后勤指定的试炼目标。",
    title: "<red>师门试炼</red>",
    gender: 1,
    age: 30,
    per: 18,
    mp: 400,
    max_mp: 400,
    hp: 1200,
    max_hp: 1200,
    no_refresh: true,
    no_fight: true
});

this.init_from = function (player, opts) {
    opts = opts || {};
    const ratio = Math.max(0.01, Number(opts.ratio) || 1);
    const safeRatio = Math.min(ratio, 1000000);
    const playerHp = Math.max(Number(player.max_hp) || 0, Number(player.hp) || 0, 1200);
    const playerMp = Math.max(Number(player.max_mp) || 0, Number(player.mp) || 0, 400);
    const skillLevel = Math.max(50,
        player.query_skill ? player.query_skill("force", 0) : 0,
        player.query_skill ? player.query_skill("unarmed", 0) : 0,
        player.query_skill ? player.query_skill("dodge", 0) : 0,
        player.query_skill ? player.query_skill("parry", 0) : 0);

    this.clear_prop();
    this.skills = null;
    this.con = scaleStat(player.con || 20, safeRatio, 20);
    this.dex = scaleStat(player.dex || 20, safeRatio, 20);
    this.int = scaleStat(player.int || 20, safeRatio, 20);
    this.str = scaleStat(player.str || 20, safeRatio, 20);
    this.gender = this.random(2) + 1;
    this.name = UTIL.random_name(this.gender);
    this.desc = (this.gender === 2 ? "她" : "他") + "是" + player.name + "本次师门任务的试炼目标。";
    this.title = "<hiy>" + (opts.familyName || "师门") + "试炼目标</hiy>";

    this.skill_map(
        ["force", scaleStat(skillLevel, safeRatio, 50)],
        ["unarmed", scaleStat(skillLevel, safeRatio, 50)],
        ["dodge", scaleStat(skillLevel, safeRatio, 50)],
        ["parry", scaleStat(skillLevel, safeRatio, 50)]
    );

    this.hp = this.max_hp = scaleStat(playerHp, safeRatio, 1200);
    this.mp = this.max_mp = scaleStat(playerMp, safeRatio, 400);
    this.pfm_rate = 1;
    this.init();
    this.recount();
    this.gj = Math.max(this.gj, scaleStat(player.gj || this.gj || 50, safeRatio, 50));
    this.fy = Math.max(this.fy, scaleStat(player.fy || this.fy || 10, safeRatio, 10));
    this.mz = Math.max(this.mz, scaleStat(player.mz || this.mz || 10, safeRatio, 10));
    this.ds = Math.max(this.ds, scaleStat(player.ds || this.ds || 10, safeRatio, 10));
    this.zj = Math.max(this.zj, scaleStat(player.zj || this.zj || 10, safeRatio, 10));
    this.bj = Math.max(this.bj, scaleStat(player.bj || this.bj || 1, safeRatio, 1));
};

function scaleStat(value, ratio, minimum) {
    const result = Math.round(Math.max(0, Number(value) || 0) * ratio);
    const baseMinimum = Math.max(0, Number(minimum) || 0);
    const scaledMinimum = ratio < 1 ? Math.round(baseMinimum * ratio) : baseMinimum;
    return Math.max(scaledMinimum, Math.min(result, Number.MAX_SAFE_INTEGER));
}
