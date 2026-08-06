this.inherits(COMMAND);
this.command = "autopfm";
this.allow_fight = true;
this.allow_busy = true;
this.allow_state = true;
this.allow_faint = true;
this.allow_die = true;

this.enter = function (me, arg) {
    var parts = arg ? arg.trim().split(/\s+/) : [];
    var action = parts[0] || "show";
    var changed = false;
    var group = this.query_group(me);
    var config = this.query_config(me, group);
    var entries = this.query_entries(me);

    if (action === "master") {
        if (parts[1] !== "0" && parts[1] !== "1") return;
        config.enabled = parts[1] === "1";
        changed = true;
    } else if (action === "enable") {
        if (parts[2] !== "0" && parts[2] !== "1") return;
        var entry = this.find_entry(entries, parts[1]);
        if (entry && entry.autoAllowed) {
            if (parts[2] === "1") delete config.disabled[entry.id];
            else config.disabled[entry.id] = 1;
            changed = true;
        }
    } else if (action === "move") {
        changed = this.move_entry(config, entries, parts[1], parts[2]);
    } else if (action !== "show") {
        return;
    }

    this.sync_order(config, entries);
    if (changed) {
        me.save("auto-pfm-config");
    }
    this.send_config(me, entries, group, config);
}

this.ensure_configs = function (me) {
    if (!Array.isArray(me.auto_pfm_groups)) {
        me.auto_pfm_groups = [];
    }
    for (var i = 0; i < 3; i++) {
        var config = me.auto_pfm_groups[i];
        if (!config || typeof config !== "object" || Array.isArray(config)) {
            config = {};
            me.auto_pfm_groups[i] = config;
        }
        config.enabled = config.enabled === true || config.enabled === 1;
        if (!Array.isArray(config.order)) config.order = [];
        if (!config.disabled || typeof config.disabled !== "object" || Array.isArray(config.disabled)) {
            config.disabled = {};
        }
    }

    if (!me.auto_pfm_migrated) {
        me.auto_pfm_migrated = true;
        var legacy = me.query_setting("auto_pfm") || me.query_setting("auto_pfm2");
        if (legacy && typeof legacy === "string") {
            var current = this.query_group(me);
            var currentConfig = me.auto_pfm_groups[current];
            if (!currentConfig.order.length) {
                currentConfig.order = legacy.split(",").filter(function (id) {
                    return /^\w+\.\w+$/.test(id);
                });
                currentConfig.enabled = currentConfig.order.length > 0;
                if (currentConfig.enabled && me.save) me.save("auto-pfm-migrate");
            }
        }
    }
    return me.auto_pfm_groups;
}

this.query_group = function (me) {
    var skgroup = WORLD.COMMANDS.skgroup;
    var group = skgroup && skgroup.cur_eqs ? skgroup.cur_eqs(me) : 0;
    return group >= 0 && group < 3 ? group : 0;
}

this.query_config = function (me, group) {
    return this.ensure_configs(me)[group];
}

this.is_enabled = function (me) {
    return this.query_config(me, this.query_group(me)).enabled;
}

this.query_entries = function (me) {
    var entries = [];
    if (!me.skills) return entries;

    var bases = ["", "force", "unarmed", "dodge", "parry", "bite", "throwing"];
    var weapon = me.query_weapon_type();
    if (weapon !== WEAPON_TYPE.NONE) bases[0] = weapon;
    if (me.is_player && !me.throwing_name()) bases[6] = "";

    for (var i = 0; i < bases.length; i++) {
        var base = bases[i];
        if (!base) continue;
        var baseSkill = me.skills[base];
        if (!baseSkill) continue;

        var spSkill = SKILL.get(baseSkill.enable_skill || base);
        var ownedSkill = spSkill && me.skills[spSkill.id];
        if (!ownedSkill || ownedSkill.disable) continue;
        var level = baseSkill.enable_skill
            ? me.query_skill(baseSkill.enable_skill, 0)
            : me.query_skill(base, 0);
        if (spSkill && spSkill.pfm) {
            for (var pid in spSkill.pfm) {
                var pfm = spSkill.pfm[pid];
                if (pfm.enable_skill && pfm.enable_skill !== base) continue;
                if (pfm.check && !pfm.check(me, level, base)) continue;
                this.push_entry(entries, me, base, pid, pfm, level, false);
            }
        }

        var daoSkill = SKILL.get(base);
        if (daoSkill && daoSkill.query_dao_performs) {
            var daoPfms = daoSkill.query_dao_performs(me);
            for (var daoIndex = 0; daoIndex < daoPfms.length; daoIndex++) {
                var daoPfm = daoPfms[daoIndex];
                if (daoPfm.check && !daoPfm.check(me, level, base)) continue;
                this.push_entry(entries, me, base, daoPfm.pid, daoPfm,
                    me.query_skill(base, 0), false);
            }
        }

        if (baseSkill.enable_skill) {
            var refPfm = me.query_ref_skill(me.skills[baseSkill.enable_skill]);
            if (refPfm && refPfm.enable_skill === base) {
                this.push_entry(entries, me, base, "ref", refPfm, parseInt(level / 2), true);
            }
        }
    }
    return entries;
}

this.push_entry = function (entries, me, base, pid, pfm, level, isRef) {
    var id = base + "." + pid;
    if (this.find_entry(entries, id)) return;
    entries.push({
        id: id,
        name: pfm.query_name(me, base),
        base: base,
        pid: pid,
        mp: pfm.query_mp(me, level),
        releaseTime: pfm.query_releasetime(me, level),
        cooldown: pfm.query_distime(me, level, isRef),
        autoAllowed: pfm.auto_allowed !== false && !pfm.no_auto
    });
}

this.find_entry = function (entries, id) {
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].id === id) return entries[i];
    }
}

this.sync_order = function (config, entries) {
    var available = {};
    var ordered = [];
    for (var i = 0; i < entries.length; i++) available[entries[i].id] = true;
    for (var j = 0; j < config.order.length; j++) {
        var id = config.order[j];
        if (available[id] && ordered.indexOf(id) < 0) ordered.push(id);
    }
    for (var k = 0; k < entries.length; k++) {
        if (ordered.indexOf(entries[k].id) < 0) ordered.push(entries[k].id);
    }
    config.order = ordered;
    return ordered;
}

this.query_ordered_entries = function (me) {
    var group = this.query_group(me);
    var config = this.query_config(me, group);
    var entries = this.query_entries(me);
    this.sync_order(config, entries);
    var byId = {};
    for (var i = 0; i < entries.length; i++) byId[entries[i].id] = entries[i];
    var ordered = [];
    for (var j = 0; j < config.order.length; j++) {
        var entry = byId[config.order[j]];
        if (entry) {
            entry.enabled = !config.disabled[entry.id] && entry.autoAllowed;
            ordered.push(entry);
        }
    }
    return ordered;
}

this.move_entry = function (config, entries, id, direction) {
    if (direction !== "up" && direction !== "down") return false;
    this.sync_order(config, entries);
    var index = config.order.indexOf(id);
    if (index < 0) return false;
    var target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= config.order.length) return false;
    var value = config.order[target];
    config.order[target] = config.order[index];
    config.order[index] = value;
    return true;
}

this.send_config = function (me, entries, group, config) {
    entries = entries || this.query_entries(me);
    group = group === undefined ? this.query_group(me) : group;
    config = config || this.query_config(me, group);
    this.sync_order(config, entries);

    var byId = {};
    for (var i = 0; i < entries.length; i++) byId[entries[i].id] = entries[i];
    var items = [];
    for (var j = 0; j < config.order.length; j++) {
        var item = byId[config.order[j]];
        if (!item) continue;
        item.enabled = !config.disabled[item.id] && item.autoAllowed;
        items.push(item);
    }
    me.send(JSON.stringify({
        type: "dialog",
        dialog: "skills",
        autoPfm: {
            group: group,
            enabled: config.enabled,
            items: items
        }
    }));
}
