"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const config = require("./fb-balance-profiles");

const DEFAULT_ROOT = path.resolve(__dirname, "..");

function loadArea(file) {
    const area = {
        inherits() {},
        set(values) { Object.assign(this, values); }
    };
    const source = fs.readFileSync(file, "utf8");
    vm.runInNewContext("(function(){" + source + "}).call(area)", { area, AREA: function () {} }, { filename: file });
    return area;
}

function normalizeRoutes(area, mode) {
    const source = area.fb_routes && area.fb_routes[mode === "hard" ? "1" : "normal"];
    if (!source) return [];
    if (source.default) return ["default"];
    return Object.keys(source);
}

function resolveProfile(areaId, mode, route) {
    const modeConfig = config.profiles[areaId] && config.profiles[areaId][mode];
    if (!modeConfig) return null;
    if (modeConfig.routes) return modeConfig.routes[route] || null;
    return route === "default" ? modeConfig : null;
}

function scaleStats(stats, rate) {
    return Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, Math.round(value * rate)]));
}

function deriveGroupProfile(profileData) {
    const lower = {
        ...profileData.lower,
        gj: Math.round(profileData.lower.gj * 0.75),
        mz: Math.round(profileData.lower.mz * 1.2)
    };
    const upper = {
        ...profileData.upper,
        gj: Math.round(profileData.upper.gj * 0.9),
        mz: Math.round(profileData.upper.mz * 1.35)
    };
    return {
        lower,
        upper,
        requirements: { ...profileData.requirements, partySize: 2 }
    };
}

function cellKey(cell) {
    return [cell.area, cell.mode, cell.route, cell.tier, cell.archetype].join("/");
}

function routeKey(cell) {
    return [cell.area, cell.mode, cell.route].join("/");
}

function validateProfile(profileData, label, errors) {
    if (!profileData || !profileData.lower || !profileData.upper) {
        errors.push(label + " 缺少推荐下限或上限");
        return false;
    }
    const fields = new Set([...Object.keys(profileData.lower), ...Object.keys(profileData.upper)]);
    if (!fields.has("gj") || !fields.has("mz")) errors.push(label + " 缺少攻击或命中");
    for (const field of fields) {
        const lower = Number(profileData.lower[field]);
        const upper = Number(profileData.upper[field]);
        if (!(lower > 0) || !(upper > 0) || upper < lower) errors.push(label + " 属性区间无效: " + field);
    }
    return true;
}

function addCases(cases, errors, area, mode, route, profileData, isDerivedGroup) {
    const label = area.id + "/" + mode + "/" + route;
    if (!validateProfile(profileData, label, errors)) return;
    const tierStats = {
        under: scaleStats(profileData.lower, 0.85),
        lower: { ...profileData.lower },
        upper: { ...profileData.upper }
    };
    for (const tier of config.tiers) {
        for (const archetype of config.archetypes) {
            const item = {
                area: area.id,
                mode,
                route,
                tier,
                archetype,
                stats: tierStats[tier],
                requirements: { ...profileData.requirements },
                metrics: config.metrics.slice(),
                plannedRuns: config.runsPerCell,
                isDerivedGroup
            };
            item.key = cellKey(item);
            cases.push(item);
        }
    }
}

function buildBalanceMatrix(root = DEFAULT_ROOT) {
    const errors = [];
    const cases = [];
    const areas = [];
    for (let fileNumber = 21; fileNumber <= 38; fileNumber++) {
        const area = loadArea(path.join(root, "world", "area", "fb1", "fb" + fileNumber + ".js"));
        areas.push(area);
        for (const mode of ["normal", "hard"]) {
            const routes = normalizeRoutes(area, mode);
            if (mode === "hard" && area.is_diffi && !routes.length) {
                errors.push(area.id + " 声明困难模式但没有困难路线");
            }
            for (const route of routes) {
                const profileData = resolveProfile(area.id, mode, route);
                if (!profileData) {
                    errors.push(area.id + "/" + mode + "/" + route + " 缺少平衡档案");
                    continue;
                }
                addCases(cases, errors, area, mode, route, profileData, false);
            }
        }
        if (area.is_multi) {
            for (const route of normalizeRoutes(area, "normal")) {
                const profileData = resolveProfile(area.id, "normal", route);
                if (profileData) addCases(cases, errors, area, "group", route, deriveGroupProfile(profileData), true);
            }
        }
    }

    const routeCases = new Set(cases.map(routeKey)).size;
    const expectedCells = routeCases * config.tiers.length * config.archetypes.length;
    const plannedRuns = cases.reduce((sum, item) => sum + item.plannedRuns, 0);
    if (areas.length !== 18) errors.push("AREA 覆盖数量不是 18");
    if (cases.length !== expectedCells) errors.push("三档三流派用例展开数量异常");
    if (config.runsPerCell < 20) errors.push("每格计划运行次数少于 20");
    if (config.metrics.length !== 7) errors.push("实战指标字段覆盖不完整");

    return {
        areas,
        cases,
        caseMap: new Map(cases.map(item => [item.key, item])),
        errors,
        summary: {
            areas: areas.length,
            routeCases,
            tiers: config.tiers.length,
            archetypes: config.archetypes.length,
            cells: cases.length,
            runsPerCell: config.runsPerCell,
            plannedRuns,
            metrics: config.metrics.slice()
        }
    };
}

module.exports = {
    buildBalanceMatrix,
    cellKey,
    routeKey
};
