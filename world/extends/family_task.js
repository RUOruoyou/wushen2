const FAMILY_TASK = {
    DAILY_LIMIT: 20,
    DAILY_RINGS: 2,
    RING_SIZE: 10,
    DIFFICULTY_BASE: 0.8,
    DIFFICULTY_STEP: 0.01,
    TASK_TIMEOUT: 10 * 60 * 1000,
    PAGE_SHOP_PRICE: 500,
    PAGE_WEEKLY_LIMIT: 10,
    PAGE_SPECIAL_COUNT: 1,
    PAGE_SPECIAL_JACKPOT_COUNT: 5,
    PAGE_SPECIAL_JACKPOT_ODDS: 1000,
    EQUIPMENT_SHOP_PRICES: [150, 250, 450, 750, 1200, 1800, 2800],
    EQUIPMENT_SHOP_GRADES: [1, 1, 2, 2, 3, 3, 4],
    EQUIPMENT_GRADE_SCALE: [0.45, 0.7, 1, 1.35, 1.8, 2.35, 3],
    EQUIPMENT_HOLES: [0, 0, 1, 1, 2, 2, 3],
    RESET_SHIFT_MS: 3 * 3600000,
    MAX_GRADE_STREAK_BONUS: 55,
    GRADE_STREAK_CURVE: 80,
    BASE_EXPS: [5000, 7000, 9000, 12000, 16000, 20000],
    PARTS: {
        head: { name: "头部", unit: "顶", eqType: EQUIP_TYPE.HEAD },
        cloth: { name: "衣服", unit: "件", eqType: EQUIP_TYPE.CLOTH },
        shoes: { name: "鞋", unit: "双", eqType: EQUIP_TYPE.SHOES },
        wrist: { name: "护腕", unit: "副", eqType: EQUIP_TYPE.WRIST },
        waist: { name: "腰带", unit: "条", eqType: EQUIP_TYPE.WAIST },
        jewels: { name: "饰品", unit: "件", eqType: EQUIP_TYPE.JEWELS }
    },
    PART_ORDER: ["head", "cloth", "shoes", "wrist", "waist", "jewels"],
    FAMILIES: {
        EMEI: {
            name: "峨眉派",
            suit: "金顶清音",
            itemNames: ["金顶云冠", "临济法衣", "踏莲履", "清音护腕", "玉女束带", "峨眉玉佩"],
            props: [
                { fy: 22, int: 5, max_mp: 120 },
                { fy: 42, con: 5, max_hp: 260 },
                { fy: 18, dex: 4, ds: 16 },
                { fy: 15, zj: 14, max_mp: 100 },
                { fy: 18, con: 4, max_hp: 180 },
                { int: 6, max_mp: 180, zj: 10 }
            ],
            sets: {
                2: { recover_per: 5, max_mp: 300 },
                4: { diff_sh_per: 3, expend_mp_per: 3 },
                6: { hp_per: 5, diff_downside_per: 8 }
            }
        },
        GAIBANG: {
            name: "丐帮",
            suit: "君山伏虎",
            itemNames: ["打狗巾", "百结衣", "逍遥履", "伏虎护腕", "酒仙腰带", "君山令"],
            props: [
                { fy: 20, str: 5, mz: 12 },
                { fy: 36, max_hp: 340, con: 4 },
                { fy: 16, dex: 4, ds: 14 },
                { fy: 14, gj: 20, mz: 10 },
                { fy: 16, str: 5, max_hp: 180 },
                { gj: 16, mz: 16, max_hp: 160 }
            ],
            sets: {
                2: { gj: 20, mz: 15 },
                4: { add_sh_per: 2, hp_per: 3 },
                6: { bj_per: 4, add_bjsh_per: 10 }
            }
        },
        HUASHAN: {
            name: "华山派",
            suit: "紫霞朝阳",
            itemNames: ["朝阳冠", "紫霞袍", "苍松履", "剑宗护腕", "思过腰带", "玉女峰佩"],
            props: [
                { fy: 18, int: 5, mz: 16 },
                { fy: 34, max_hp: 240, int: 5 },
                { fy: 15, dex: 5, ds: 16 },
                { fy: 12, gj: 22, mz: 12 },
                { fy: 15, max_mp: 220, int: 4 },
                { gj: 18, mz: 18, dex: 4 }
            ],
            sets: {
                2: { mz: 20, bj_per: 2 },
                4: { add_sh_per: 3, diff_fy_per: 3 },
                6: { add_bjsh_per: 15, gjsd: 100 }
            }
        },
        MINGJIAO: {
            name: "明教",
            suit: "光明圣火",
            itemNames: ["圣火冠", "光明圣袍", "青蝠靴", "五行护腕", "乾坤腰带", "圣火令"],
            props: [
                { fy: 22, con: 5, zj: 12 },
                { fy: 38, max_hp: 320, max_mp: 120 },
                { fy: 16, dex: 5, ds: 18 },
                { fy: 15, gj: 18, zj: 14 },
                { fy: 18, con: 5, max_mp: 180 },
                { max_hp: 220, max_mp: 180, zj: 12 }
            ],
            sets: {
                2: { max_hp: 300, zj: 15 },
                4: { recover_per: 6, diff_downside_per: 8 },
                6: { diff_sh_per: 4, add_sh_per: 2 }
            }
        },
        QUANZHEN: {
            name: "全真教",
            suit: "先天北斗",
            itemNames: ["重阳冠", "全真道袍", "金雁履", "三花护腕", "北斗腰带", "先天玉符"],
            props: [
                { fy: 22, int: 5, max_mp: 140 },
                { fy: 38, con: 5, max_mp: 180 },
                { fy: 17, dex: 4, ds: 15 },
                { fy: 16, zj: 18, max_mp: 80 },
                { fy: 18, con: 4, max_hp: 190 },
                { int: 5, max_mp: 220, zj: 14 }
            ],
            sets: {
                2: { max_mp: 350, zj: 15 },
                4: { expend_mp_per: 5, recover_per: 4 },
                6: { diff_sh_per: 3, fy_per: 4 }
            }
        },
        RIYUE: {
            name: "日月神教",
            suit: "黑木日月",
            itemNames: ["日月冠", "黑木玄袍", "幻魔靴", "星海护腕", "葵影腰带", "日月令"],
            props: [
                { fy: 18, dex: 6, mz: 14 },
                { fy: 32, max_hp: 250, max_mp: 180 },
                { fy: 14, dex: 6, ds: 20 },
                { fy: 12, gj: 24, mz: 12 },
                { fy: 14, dex: 5, max_mp: 190 },
                { gj: 20, dex: 5, max_mp: 160 }
            ],
            sets: {
                2: { gj: 20, dex: 5 },
                4: { gjsd: 150, expend_mp_per: 4 },
                6: { add_sh_per: 4, diff_fy_per: 4 }
            }
        },
        SHAOLIN: {
            name: "少林派",
            suit: "达摩金刚",
            itemNames: ["罗汉冠", "达摩袈裟", "一苇履", "金刚护腕", "戒律腰带", "菩提佛珠"],
            props: [
                { fy: 28, con: 6, max_hp: 150 },
                { fy: 50, max_hp: 420, con: 5 },
                { fy: 22, con: 4, ds: 12 },
                { fy: 20, str: 5, zj: 18 },
                { fy: 22, con: 6, max_hp: 220 },
                { max_hp: 260, max_mp: 140, zj: 16 }
            ],
            sets: {
                2: { max_hp: 500, fy: 25 },
                4: { diff_sh_per: 4, zj: 20 },
                6: { hp_per: 6, diff_bj: 8 }
            }
        },
        SHASHOU: {
            name: "杀手楼",
            suit: "无影追魂",
            itemNames: ["无影面巾", "夜行衣", "踏雪靴", "飞星护腕", "藏锋腰带", "追魂令"],
            props: [
                { fy: 16, dex: 6, mz: 18 },
                { fy: 30, dex: 5, max_hp: 220 },
                { fy: 12, dex: 7, ds: 20 },
                { fy: 10, gj: 25, mz: 16 },
                { fy: 12, dex: 5, max_mp: 150 },
                { gj: 22, mz: 20, dex: 4 }
            ],
            sets: {
                2: { mz: 25, bj_per: 3 },
                4: { gjsd: 180, add_bjsh_per: 12 },
                6: { add_sh_per: 4, diff_fy_per: 5 }
            }
        },
        WUDANG: {
            name: "武当派",
            suit: "真武太极",
            itemNames: ["真武冠", "太极道袍", "梯云履", "玄虚护腕", "阴阳腰带", "真武令"],
            props: [
                { fy: 24, int: 5, zj: 16 },
                { fy: 44, max_hp: 280, max_mp: 160 },
                { fy: 18, dex: 5, ds: 18 },
                { fy: 17, zj: 20, max_mp: 90 },
                { fy: 19, con: 4, max_mp: 210 },
                { int: 5, max_mp: 220, zj: 16 }
            ],
            sets: {
                2: { zj: 25, max_mp: 250 },
                4: { diff_sh_per: 3, expend_mp_per: 4 },
                6: { ds_per: 4, fy_per: 4 }
            }
        },
        XIAOYAO: {
            name: "逍遥派",
            suit: "北冥凌波",
            itemNames: ["逍遥冠", "北冥法衣", "凌波履", "天山护腕", "无相腰带", "玲珑棋佩"],
            props: [
                { fy: 18, int: 6, ds: 14 },
                { fy: 32, max_mp: 260, int: 5 },
                { fy: 13, dex: 7, ds: 22 },
                { fy: 12, gj: 18, ds: 16 },
                { fy: 14, dex: 5, max_mp: 220 },
                { int: 6, dex: 5, max_mp: 180 }
            ],
            sets: {
                2: { ds: 25, dex: 5 },
                4: { gjsd: 120, expend_mp_per: 4 },
                6: { ds_per: 5, diff_busy_per: 8 }
            }
        },
        XUEDAO: {
            name: "血刀门",
            suit: "血海修罗",
            itemNames: ["血海头巾", "血刀战衣", "雪原战靴", "修罗护腕", "血河腰带", "血刀令"],
            props: [
                { fy: 18, str: 6, gj: 12 },
                { fy: 34, max_hp: 360, str: 5 },
                { fy: 15, dex: 5, ds: 14 },
                { fy: 12, gj: 26, str: 4 },
                { fy: 15, str: 5, max_hp: 220 },
                { gj: 24, max_hp: 220, bj_per: 2 }
            ],
            sets: {
                2: { gj: 25, max_hp: 300 },
                4: { add_sh_per: 3, bj_per: 3 },
                6: { hp_per: 5, add_bjsh_per: 15 }
            }
        },
        YIHUA: {
            name: "移花宫",
            suit: "明玉移花",
            itemNames: ["冰玉冠", "明玉宫装", "移花履", "玄玉护腕", "绣玉腰带", "移花玉佩"],
            props: [
                { fy: 22, dex: 5, zj: 14 },
                { fy: 40, max_hp: 260, max_mp: 180 },
                { fy: 16, dex: 6, ds: 20 },
                { fy: 15, zj: 18, ds: 12 },
                { fy: 17, dex: 5, max_mp: 200 },
                { int: 5, ds: 16, zj: 16 }
            ],
            sets: {
                2: { ds: 20, zj: 20 },
                4: { diff_sh_per: 3, diff_busy_per: 6 },
                6: { expend_mp_per: 5, diff_downside_per: 10 }
            }
        }
    }
};

FAMILY_TASK.clampInt = function (value, min, max) {
    value = parseInt(value || 0);
    if (!Number.isFinite(value) || value < min) return min;
    if (value > max) return max;
    return value;
};

FAMILY_TASK.isSupportedFamily = function (family) {
    const familyId = typeof family === "string" ? family : family && family.id;
    return !!this.FAMILIES[familyId];
};

FAMILY_TASK.queryFamily = function (familyId) {
    return this.FAMILIES[String(familyId || "").toUpperCase()] || null;
};

FAMILY_TASK.queryPart = function (partId) {
    return this.PARTS[String(partId || "").toLowerCase()] || null;
};

FAMILY_TASK.queryEquipmentPath = function (familyId, partId, grade) {
    familyId = String(familyId || "").toUpperCase();
    partId = String(partId || "").toLowerCase();
    grade = this.clampInt(grade, 0, 6);
    if (!this.queryFamily(familyId) || !this.queryPart(partId)) return null;
    return "eq/family#" + familyId + "_" + partId + "_" + grade;
};

FAMILY_TASK.parseEquipmentSpec = function (spec) {
    const match = String(spec || "").match(/^([A-Z]+)_([a-z]+)_([0-6])$/);
    if (!match || !this.queryFamily(match[1]) || !this.queryPart(match[2])) return null;
    return { familyId: match[1], partId: match[2], grade: parseInt(match[3]) };
};

FAMILY_TASK.queryEquipmentData = function (familyId, partId, grade) {
    const family = this.queryFamily(familyId);
    const part = this.queryPart(partId);
    const partIndex = this.PART_ORDER.indexOf(partId);
    if (!family || !part || partIndex < 0) return null;
    grade = this.clampInt(grade, 0, 6);
    const scale = this.EQUIPMENT_GRADE_SCALE[grade];
    const baseProp = family.props[partIndex] || {};
    const prop = {};
    for (const key in baseProp) {
        const value = Number(baseProp[key]) || 0;
        prop[key] = Math.max(1, Math.round(value * scale));
    }
    return {
        familyId: familyId,
        familyName: family.name,
        suitName: family.suit,
        partId: partId,
        partName: part.name,
        name: family.itemNames[partIndex],
        unit: part.unit,
        eqType: part.eqType,
        grade: grade,
        prop: prop,
        holeCount: this.EQUIPMENT_HOLES[grade],
        sets: family.sets
    };
};

FAMILY_TASK.queryShopGrade = function (player) {
    const level = this.clampInt(player && player.level, 0, 6);
    return this.EQUIPMENT_SHOP_GRADES[level];
};

FAMILY_TASK.queryShopPrice = function (grade) {
    return this.EQUIPMENT_SHOP_PRICES[this.clampInt(grade, 0, 6)];
};

FAMILY_TASK.queryDifficultyRatio = function (streak) {
    streak = Number(streak) || 0;
    if (!Number.isFinite(streak) || streak < 0) streak = 0;
    streak = Math.min(streak, Number.MAX_SAFE_INTEGER);
    return Math.min(Number.MAX_SAFE_INTEGER,
        this.DIFFICULTY_BASE + streak * this.DIFFICULTY_STEP);
};

FAMILY_TASK.rollSpecialReward = function () {
    // 残页改为每个特殊奖励节点保底发放，类型判定只剩功绩和装备
    const roll = Math.random() * 100;
    if (roll < 75) return "merit";
    return "equipment";
};

FAMILY_TASK.rollEquipmentGrade = function (player, ringIndex, streak) {
    const realm = this.clampInt(player && player.level, 0, 6);
    const ringBonus = ringIndex >= 2 ? 12 : 0;
    streak = Math.max(0, Number(streak) || 0);
    const streakBonus = this.MAX_GRADE_STREAK_BONUS
        * (1 - Math.exp(-streak / this.GRADE_STREAK_CURVE));
    const score = Math.random() * 100 + realm * 7 + ringBonus + streakBonus;
    if (score < 55) return 0;
    if (score < 95) return 1;
    if (score < 125) return 2;
    if (score < 150) return 3;
    if (score < 175) return 4;
    if (score < 200) return 5;
    return 6;
};

FAMILY_TASK.rollPageCount = function () {
    // 特殊奖励节点保底1份，低概率翻到5份
    const roll = Math.random() * 10000;
    return roll < this.PAGE_SPECIAL_JACKPOT_ODDS ? this.PAGE_SPECIAL_JACKPOT_COUNT : this.PAGE_SPECIAL_COUNT;
};

FAMILY_TASK.queryMeritReward = function (player, ringIndex, streak) {
    const realm = this.clampInt(player && player.level, 0, 6);
    return 150 + realm * 50 + Math.max(1, ringIndex) * 100
        + Math.min(200, Math.max(0, parseInt(streak || 0))) * 10;
};

FAMILY_TASK.queryBaseReward = function (player) {
    const smLevel = this.clampInt(player && player.query_temp("sm_level", 0), 0, 5);
    const realm = this.clampInt(player && player.level, 0, 6);
    const exp = Math.round(this.BASE_EXPS[smLevel] * (1 + realm * 0.1));
    return { exp: exp, pot: exp, merit: 5 + smLevel * 5 };
};

FAMILY_TASK.queryDayKey = function (time) {
    return new Date((time || Date.now()) + this.RESET_SHIFT_MS).toISOString().slice(0, 10);
};

FAMILY_TASK.queryWeekKey = function (time) {
    const date = new Date((time || Date.now()) + this.RESET_SHIFT_MS);
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return date.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
};

WORLD.FAMILY_TASK = FAMILY_TASK;
