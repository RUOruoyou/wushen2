"use strict";

const path = require("path");

const ROOT = path.resolve(__dirname, "..");

runValidation();

function runValidation() {
    process.env.WSMUD_VALIDATE_RESOURCES = "1";
    process.argv[2] = "100";
    const originalExit = process.exit;
    process.exit = () => {};
    require(path.join(ROOT, "main.js"));

    let attempts = 0;
    const timer = setInterval(() => {
        attempts++;
        if (!globalThis.WORLD || !globalThis.NPC || !globalThis.SKILL
            || !WORLD.SKILLS || !SKILL.get("lingxibu")) {
            if (attempts < 400) return;
            clearInterval(timer);
            process.exit = originalExit;
            finishValidation({ failures: ["资源加载超时"], rows: [] }, originalExit);
            return;
        }
        clearInterval(timer);
        let report;
        try {
            report = validateTower();
        } catch (error) {
            report = { failures: [error.stack || error.message], rows: [] };
        }
        process.exit = originalExit;
        finishValidation(report, originalExit);
    }, 25);
}

function finishValidation(report, exit) {
    const lines = [];
    if (report.failures.length) {
        lines.push("武道塔难度校验失败：" + report.failures.join("；"));
    } else {
        lines.push("武道塔难度校验通过：1-99层技能配置有效，40-99层属性下限和十层边界成长正常。");
        lines.push("关键层有效属性：" + JSON.stringify(report.rows));
    }
    process.stdout.write(lines.join("\n") + "\n", () => exit(report.failures.length ? 1 : 0));
}

function validateTower() {
    const failures = [];
    const rows = [];
    const keyLevels = new Set([39, 40, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90, 99]);
    let previous = null;
    for (let level = 1; level <= 99; level++) {
        const npc = NPC.CLONE("pub/wudao");
        const tier = Math.floor(level / 10);
        validateSkillTier(npc.skills_def[tier], level, failures);
        npc.init_from({}, level);
        validateStats(npc, level, failures);
        if (level >= 40) {
            validateCombatFloor(npc, level, failures);
            npc.recount();
            validateCombatFloor(npc, level, failures);
        }
        if (previous && level % 10 === 0) {
            for (const prop of ["gj", "mz", "ds", "zj", "fy"]) {
                if (npc[prop] < previous[prop]) {
                    failures.push(level + "层" + prop + "低于" + (level - 1) + "层");
                }
            }
        }
        if (keyLevels.has(level)) {
            rows.push({ level, gj: npc.gj, mz: npc.mz, ds: npc.ds, zj: npc.zj, fy: npc.fy });
        }
        previous = npc;
    }
    return { failures: [...new Set(failures)], rows };
}

function validateSkillTier(skillTier, level, failures) {
    if (!Array.isArray(skillTier)) {
        failures.push(level + "层缺少技能档位");
        return;
    }
    for (const item of skillTier) {
        const skill = SKILL.get(item[0]);
        if (!skill) {
            failures.push(level + "层技能不存在：" + item[0]);
            continue;
        }
        const enables = typeof item[2] === "string" ? [item[2]] : item[2];
        if (!enables) continue;
        for (const base of enables) {
            if (!Array.isArray(skill.can_enables) || !skill.can_enables.includes(base)) {
                failures.push(level + "层" + item[0] + "不能激活为" + base);
            }
        }
    }
}

function validateStats(npc, level, failures) {
    for (const prop of ["gj", "mz", "ds", "zj", "fy", "max_hp", "max_mp", "gjsd"]) {
        if (!Number.isFinite(npc[prop]) || npc[prop] < 0) failures.push(level + "层" + prop + "无效");
    }
}

function validateCombatFloor(npc, level, failures) {
    const combatFloor = npc.combat_floors[Math.floor(level / 10)];
    if (!combatFloor) {
        failures.push(level + "层缺少战斗属性下限");
        return;
    }
    for (const prop of ["gj", "mz", "ds", "zj", "fy"]) {
        if (npc[prop] < combatFloor[prop]) failures.push(level + "层" + prop + "未达到下限");
    }
}
