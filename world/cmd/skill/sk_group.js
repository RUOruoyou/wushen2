
this.inherits(COMMAND);
this.command = "skgroup";
this.allow_fight = false;
this.enter = function (me, par) {
    this.ensure_groups(me);
    let index = parseInt(par);
    if (!(index >= 0 && index < 3)) return;
    let cur_index = this.cur_eqs(me);
    if (cur_index < 0) return me.send('装备错误。');
    let eqs = me.sk_groups[index];
    if (!eqs) return me.send('当前正在装备该技能组。');
    me.sk_groups[index] = null;
    this.save_eqgroup(me, cur_index);
    const enable_command = WORLD.COMMANDS.enable.enter;
    const skills = me.skills || {};
    for (let i = 0; i < SK_TYPES.length; i++) {
        let sk_type = SK_TYPES[i];
        let skill = skills[sk_type];
        if (!skill) continue;
        let enable_skill = eqs[i];
        if (!enable_skill && !skill.enable_skill) continue;
        if (enable_skill && skill.enable_skill === enable_skill) continue;
        enable_command(me, sk_type, enable_skill, true);
    }

    me.send(`{type:"dialog",dialog:"skills",sk_group:${index}}`);
    me.init_skill();
    me.recount();
    me.notify_hp();
    const autoCommand = WORLD.COMMANDS.autopfm;
    if (autoCommand) autoCommand.send_config(me);

}

this.enable_one = function (me, base, skill) {

}


const SK_TYPES = [
    "force", "unarmed", "dodge", "parry", "sword",
    "blade", "throwing", "staff", "club", "whip"
];
this.cur_eqs = function (me) {
    this.ensure_groups(me);
    for (let i = 0; i < me.sk_groups.length; i++) {
        if (!me.sk_groups[i])
            return i;
    }
    return -1;
}
this.ensure_groups = function (me) {
    if (!Array.isArray(me.sk_groups)) me.sk_groups = [];
    while (me.sk_groups.length < 3) me.sk_groups.push([]);
    let current = -1;
    for (let i = 0; i < 3; i++) {
        if (me.sk_groups[i] === null || me.sk_groups[i] === 0) {
            if (current < 0) {
                me.sk_groups[i] = null;
                current = i;
            } else {
                me.sk_groups[i] = [];
            }
        } else if (!Array.isArray(me.sk_groups[i])) {
            me.sk_groups[i] = [];
        }
    }
    if (current < 0) me.sk_groups[0] = null;
}
this.save_eqgroup = function (me, index) {
    let eqs = [];
    let skills = me.skills || {};
    for (let sk of SK_TYPES) {
        let skill = skills[sk];
        if (skill && skill.enable_skill) {
            eqs.push(skill.enable_skill);
        } else {
            eqs.push("");
        }
    }
    me.sk_groups[index] = eqs;
}
