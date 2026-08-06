this.inherits(NPC);
this.set({
    name: "门派弟子",
    desc: "门派弟子",
    title: "",
    gender: 1,
    age: 25,
    per: 18,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,
    no_refresh: true,
    is_drop: false
});
this.init_from = function (fam, level) {
    level = parseInt(level || 0);
    if (level < 0) level = 0;
    if (level > 5) level = 5;

    this.family = fam;
    this.master = false;
    this.no_refresh = true;
    this.is_drop = false;
    this.status = null;
    this.temp = null;
    this.items = null;
    this.equipment = null;
    this.skills = null;
    this.clear_prop();

    var titleIndex = [4, 3, 2, 2, 1, 0][level];
    if (fam.titles && fam.titles.length) {
        if (titleIndex >= fam.titles.length) titleIndex = fam.titles.length - 1;
        this.title = fam.query_title(titleIndex) || fam.name + "弟子";
    } else {
        this.title = fam.name + "弟子";
    }
    this.family_level = titleIndex;
    this.gender = (fam === FAMILIES.EMEI || fam === FAMILIES.YIHUA) ? 2 : 1;
    this.age = 20 + level * 8 + this.random(10);
    this.per = 18 + level * 2;
    this.name = fam.create_name ? fam.create_name(this) : UTIL.random_name(this.gender);
    this.desc = (this.gender == 2 ? "她" : "他") + "是" + fam.name + "派出的战场弟子，正奉命守卫本门。";

    var attrs = [24, 26, 28, 30, 32, 36][level];
    this.str = attrs;
    this.con = attrs;
    this.dex = attrs;
    this.int = attrs;
    this.level = level >= 5 ? 3 : (level >= 3 ? 2 : 1);

    var hps = [120000, 180000, 260000, 360000, 520000, 950000];
    var mps = [80000, 120000, 180000, 260000, 360000, 820000];
    var props = [1200, 1900, 3000, 4300, 6000, 8800];
    var fyProps = [600, 1000, 1700, 2600, 3800, 6200];
    this.prop = {
        gj: props[level],
        mz: props[level],
        ds: props[level],
        zj: props[level],
        fy: fyProps[level]
    };

    var skillMin = [300, 500, 800, 1000, 1500, 5000][level];
    var source = level >= 5 && fam.boss_skills2 ? fam.boss_skills2 :
        (level >= 3 && fam.boss_skills ? fam.boss_skills : fam.npc_skills);
    source = source || fam.npc_skills || [];
    var skills = build_battle_skills(source, skillMin);
    var weapon = query_battle_weapon(skills);
    if (weapon) {
        this.set_objects(["eq/lv0/cloth", 1, 1], [weapon, 1, 1]);
    } else {
        this.set_objects(["eq/lv0/cloth", 1, 1]);
    }
    this.skill_map.apply(this, skills);

    this.max_hp = this.hp = hps[level];
    this.max_mp = this.mp = mps[level];
    this.pfm_rate = level >= 4 ? 1 : (level >= 2 ? 2 : 3);
    this.battle_score = [1, 2, 3, 5, 8, 30][level];
    this.is_battle_boss = level >= 5;
    this.on_died = on_battle_npc_died;

    this.init();
    this.recount();
    this.hp = this.max_hp;
    this.mp = this.max_mp;
}

function resolve_skill(id) {
    if (SKILL.get(id)) return id;
    var fallback = id.replace(/\d+$/, "");
    if (fallback !== id && SKILL.get(fallback)) return fallback;
    return null;
}

function build_battle_skills(source, minLevel) {
    var skills = [];
    var used = {};
    function add_skill(id, lv, enables) {
        id = resolve_skill(id);
        if (!id || used[id]) return;
        used[id] = true;
        skills.push([id, Math.max(parseInt(lv || 1), minLevel), enables]);
    }
    function ensure_base(base) {
        if (!base || used[base] || !SKILL.get(base)) return;
        add_skill(base, minLevel);
    }

    for (var i = 0; i < source.length; i++) {
        var item = source[i];
        if (!item) continue;
        var id = resolve_skill(item[0]);
        if (!id) continue;
        var enables = query_valid_enables(id, item[2]);
        if (enables) {
            var bases = typeof enables == "string" ? [enables] : enables;
            for (var j = 0; j < bases.length; j++) {
                ensure_base(bases[j]);
            }
        }
        add_skill(id, item[1], enables);
    }
    ensure_base("force");
    ensure_base("dodge");
    ensure_base("parry");
    return skills;
}

function query_valid_enables(id, enables) {
    if (!enables) return null;
    var skill = SKILL.get(id);
    if (!skill || !skill.can_enables) return null;
    var bases = typeof enables == "string" ? [enables] : enables;
    var valid = [];
    for (var i = 0; i < bases.length; i++) {
        if (skill.can_enables.indexOf(bases[i]) >= 0) {
            valid.push(bases[i]);
        }
    }
    if (!valid.length) return null;
    return typeof enables == "string" ? valid[0] : valid;
}

function query_battle_weapon(skills) {
    var has = {};
    for (var i = 0; i < skills.length; i++) {
        var item = skills[i];
        has[item[0]] = true;
        var enables = item[2];
        if (enables) {
            if (typeof enables == "string") has[enables] = true;
            else {
                for (var j = 0; j < enables.length; j++) {
                    has[enables[j]] = true;
                }
            }
        }
    }
    if (has.blade) return "eq/lv0/dao";
    if (has.sword) return "eq/lv0/jian";
    if (has.staff) return "eq/lv0/tiezhang";
    if (has.club) return "eq/lv0/tiegun";
    if (has.whip) return "eq/lv0/whip";
    return null;
}

function on_battle_npc_died(killer) {
    var fam = this.family;
    if (fam && fam.remove_npcs) fam.remove_npcs(this);
    if (killer && killer.family && killer.family !== fam && killer.family.add_score) {
        killer.family.add_score(killer, this.battle_score || 1);
    }
}
