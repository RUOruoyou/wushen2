"use strict";

const { buildBalanceMatrix, cellKey } = require("./fb-balance-matrix");

const SCHEMA_VERSION = 1;
const HEX_64 = /^[a-f0-9]{64}$/;
const ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const RESOURCE_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:/#-]{0,255}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function isObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

function parseJsonLines(text, source = "<memory>") {
    const records = [];
    const errors = [];
    const lines = String(text).split(/\r?\n/);
    for (let index = 0; index < lines.length; index++) {
        const raw = lines[index].trim();
        if (!raw) continue;
        try {
            records.push({ value: JSON.parse(raw), source, line: index + 1 });
        } catch (error) {
            errors.push(source + ":" + (index + 1) + " JSON 解析失败: " + error.message);
        }
    }
    return { records, errors };
}

function recordLabel(entry, index) {
    if (entry && entry.source) return entry.source + ":" + entry.line;
    return "record[" + index + "]";
}

function normalizeEntries(records) {
    return records.map((entry, index) => {
        if (entry && Object.prototype.hasOwnProperty.call(entry, "value")) return entry;
        return { value: entry, source: "record", line: index + 1 };
    });
}

function validateTimestamp(value, label, field, errors) {
    if (typeof value !== "string" || !ISO_PATTERN.test(value) || !Number.isFinite(Date.parse(value))) {
        errors.push(label + " " + field + " 必须是规范 UTC ISO 时间");
        return null;
    }
    return Date.parse(value);
}

function validateNonNegativeInteger(value, label, field, errors) {
    if (!Number.isSafeInteger(value) || value < 0) {
        errors.push(label + " " + field + " 必须是非负整数");
        return false;
    }
    return true;
}

function validateStats(actual, expected, label, errors) {
    if (!isObject(actual)) {
        errors.push(label + " loadout.stats 必须是对象");
        return;
    }
    for (const [field, value] of Object.entries(expected)) {
        if (actual[field] !== value) {
            errors.push(label + " loadout.stats." + field + " 应为 " + value + "，实际为 " + actual[field]);
        }
    }
    for (const [field, value] of Object.entries(actual)) {
        if (!Number.isFinite(value) || value < 0) {
            errors.push(label + " loadout.stats." + field + " 必须是非负有限数值");
        }
    }
}

function validateRequirements(actual, expected, label, errors) {
    if (!isObject(actual)) {
        errors.push(label + " loadout.requirements 必须是对象");
        return;
    }
    for (const [field, value] of Object.entries(expected)) {
        if (actual[field] !== value) {
            errors.push(label + " loadout.requirements." + field + " 应为 " + value + "，实际为 " + actual[field]);
        }
    }
}

function validateConsumables(consumables, label, errors) {
    if (!isObject(consumables)) {
        errors.push(label + " metrics.consumables 必须是对象");
        return;
    }
    for (const [itemId, count] of Object.entries(consumables)) {
        if (!RESOURCE_PATTERN.test(itemId)) errors.push(label + " 消耗品 ID 无效: " + itemId);
        validateNonNegativeInteger(count, label, "metrics.consumables." + itemId, errors);
    }
}

function validateRecord(record, matrix, label, errors) {
    if (!isObject(record)) {
        errors.push(label + " 必须是 JSON 对象");
        return null;
    }
    if (record.schemaVersion !== SCHEMA_VERSION) {
        errors.push(label + " schemaVersion 必须是 " + SCHEMA_VERSION);
    }
    if (typeof record.sampleId !== "string" || !ID_PATTERN.test(record.sampleId)) {
        errors.push(label + " sampleId 格式无效");
    }
    if (!isObject(record.cell)) {
        errors.push(label + " cell 必须是对象");
        return null;
    }
    const key = cellKey(record.cell);
    const plannedCase = matrix.caseMap.get(key);
    if (!plannedCase) {
        errors.push(label + " 不属于 414 个合法样本格: " + key);
        return null;
    }
    if (!Number.isSafeInteger(record.runIndex) || record.runIndex < 1 || record.runIndex > plannedCase.plannedRuns) {
        errors.push(label + " runIndex 必须在 1-" + plannedCase.plannedRuns + " 之间");
    }

    const provenance = record.provenance;
    if (!isObject(provenance)) {
        errors.push(label + " provenance 必须是对象");
    } else {
        if (provenance.kind !== "actual") errors.push(label + " provenance.kind 必须是 actual");
        if (provenance.transport !== "websocket") errors.push(label + " provenance.transport 必须是 websocket");
        if (!["isolated", "staging", "production"].includes(provenance.environment)) {
            errors.push(label + " provenance.environment 无效");
        }
        if (provenance.clock !== "wall") errors.push(label + " provenance.clock 必须是 wall");
        if (provenance.timerScale !== 1) errors.push(label + " provenance.timerScale 必须是 1");
        if (provenance.isCombatLogicModified !== false) {
            errors.push(label + " provenance.isCombatLogicModified 必须是 false");
        }
        if (typeof provenance.instrumentation !== "string" || !ID_PATTERN.test(provenance.instrumentation)) {
            errors.push(label + " provenance.instrumentation 格式无效");
        }
        if (typeof provenance.sourceFingerprint !== "string" || !HEX_64.test(provenance.sourceFingerprint)) {
            errors.push(label + " provenance.sourceFingerprint 必须是 64 位小写 SHA-256");
        }
    }

    const loadout = record.loadout;
    if (!isObject(loadout)) {
        errors.push(label + " loadout 必须是对象");
    } else {
        if (typeof loadout.id !== "string" || !ID_PATTERN.test(loadout.id)) errors.push(label + " loadout.id 格式无效");
        if (typeof loadout.fingerprint !== "string" || !HEX_64.test(loadout.fingerprint)) {
            errors.push(label + " loadout.fingerprint 必须是 64 位小写 SHA-256");
        }
        if (loadout.requirementsSatisfied !== true) errors.push(label + " loadout.requirementsSatisfied 必须是 true");
        validateStats(loadout.stats, plannedCase.stats, label, errors);
        validateRequirements(loadout.requirements, plannedCase.requirements, label, errors);
    }

    const metrics = record.metrics;
    if (!isObject(metrics)) {
        errors.push(label + " metrics 必须是对象");
        return { key, plannedCase };
    }
    if (typeof metrics.completed !== "boolean") errors.push(label + " metrics.completed 必须是布尔值");
    validateNonNegativeInteger(metrics.routeDurationMs, label, "metrics.routeDurationMs", errors);
    if (metrics.bossDurationMs !== null) {
        validateNonNegativeInteger(metrics.bossDurationMs, label, "metrics.bossDurationMs", errors);
        if (Number.isSafeInteger(metrics.routeDurationMs) && metrics.bossDurationMs > metrics.routeDurationMs) {
            errors.push(label + " Boss 时长不能超过路线总时长");
        }
    } else if (metrics.completed === true) {
        errors.push(label + " 已通关样本必须记录 metrics.bossDurationMs");
    }
    if (metrics.deathPoint !== null && (typeof metrics.deathPoint !== "string" || !metrics.deathPoint.trim())) {
        errors.push(label + " metrics.deathPoint 必须是 null 或非空字符串");
    }
    validateConsumables(metrics.consumables, label, errors);
    validateNonNegativeInteger(metrics.revives, label, "metrics.revives", errors);
    const attacksValid = validateNonNegativeInteger(metrics.attacks, label, "metrics.attacks", errors);
    const missesValid = validateNonNegativeInteger(metrics.misses, label, "metrics.misses", errors);
    if (attacksValid && missesValid && metrics.misses > metrics.attacks) {
        errors.push(label + " metrics.misses 不能大于 metrics.attacks");
    }
    if (metrics.completed === true && metrics.attacks === 0) errors.push(label + " 已通关样本攻击次数不能为 0");
    if (!Number.isFinite(metrics.missRate) || metrics.missRate < 0 || metrics.missRate > 1) {
        errors.push(label + " metrics.missRate 必须在 0-1 之间");
    } else if (attacksValid && missesValid) {
        const expectedRate = metrics.attacks ? metrics.misses / metrics.attacks : 0;
        if (Math.abs(metrics.missRate - expectedRate) > 1e-9) {
            errors.push(label + " metrics.missRate 与 attacks/misses 不一致");
        }
    }
    if (metrics.completed === false && (typeof metrics.failureReason !== "string" || !metrics.failureReason.trim())) {
        errors.push(label + " 未通关样本必须记录 metrics.failureReason");
    }
    if (metrics.completed === true && metrics.failureReason != null) {
        errors.push(label + " 已通关样本 metrics.failureReason 必须为空");
    }
    if (metrics.revives > 0 && metrics.deathPoint === null) {
        errors.push(label + " 有复活次数时必须记录 metrics.deathPoint");
    }
    for (const field of ["damageTaken", "healing", "minHp"]) {
        if (Object.prototype.hasOwnProperty.call(metrics, field)) {
            validateNonNegativeInteger(metrics[field], label, "metrics." + field, errors);
        }
    }
    if (Number.isFinite(metrics.minHp) && loadout && loadout.stats
        && Number.isFinite(loadout.stats.maxHp) && metrics.minHp > loadout.stats.maxHp) {
        errors.push(label + " metrics.minHp 不能超过 loadout.stats.maxHp");
    }

    const startedAt = validateTimestamp(record.startedAt, label, "startedAt", errors);
    const endedAt = validateTimestamp(record.endedAt, label, "endedAt", errors);
    if (startedAt !== null && endedAt !== null) {
        if (endedAt < startedAt) errors.push(label + " endedAt 不能早于 startedAt");
        if (Number.isSafeInteger(metrics.routeDurationMs)
            && Math.abs((endedAt - startedAt) - metrics.routeDurationMs) > 2000) {
            errors.push(label + " routeDurationMs 与墙钟起止时间相差超过 2000ms");
        }
    }
    return { key, plannedCase };
}

function validateBalanceResults(records, matrix = buildBalanceMatrix()) {
    const entries = normalizeEntries(records);
    const errors = matrix.errors.slice();
    const accepted = [];
    const sampleIds = new Map();
    const runKeys = new Map();
    const cellFingerprints = new Map();
    for (let index = 0; index < entries.length; index++) {
        const entry = entries[index];
        const label = recordLabel(entry, index);
        const errorCount = errors.length;
        const resolved = validateRecord(entry.value, matrix, label, errors);
        const record = entry.value;
        if (record && typeof record.sampleId === "string") {
            if (sampleIds.has(record.sampleId)) {
                errors.push(label + " sampleId 与 " + sampleIds.get(record.sampleId) + " 重复: " + record.sampleId);
            } else {
                sampleIds.set(record.sampleId, label);
            }
        }
        if (resolved && Number.isSafeInteger(record.runIndex)) {
            const runKey = resolved.key + "#" + record.runIndex;
            if (runKeys.has(runKey)) {
                errors.push(label + " 样本格/runIndex 与 " + runKeys.get(runKey) + " 重复: " + runKey);
            } else {
                runKeys.set(runKey, label);
            }
        }
        if (resolved && record.provenance && record.loadout) {
            const fingerprints = record.provenance.sourceFingerprint + "/" + record.loadout.fingerprint;
            if (cellFingerprints.has(resolved.key) && cellFingerprints.get(resolved.key).value !== fingerprints) {
                errors.push(label + " 与 " + cellFingerprints.get(resolved.key).label
                    + " 的源码或配装指纹不一致: " + resolved.key);
            } else if (!cellFingerprints.has(resolved.key)) {
                cellFingerprints.set(resolved.key, { value: fingerprints, label });
            }
        }
        if (errors.length === errorCount) accepted.push({ ...entry, key: resolved.key, plannedCase: resolved.plannedCase });
    }
    return { errors, accepted, matrix };
}

function average(values) {
    if (!values.length) return null;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function summarizeBalanceResults(validation) {
    const { matrix, accepted } = validation;
    const byCell = new Map(matrix.cases.map(item => [item.key, []]));
    for (const entry of accepted) byCell.get(entry.key).push(entry.value);
    const cells = [];
    let filledCells = 0;
    for (const plannedCase of matrix.cases) {
        const records = byCell.get(plannedCase.key).sort((a, b) => a.runIndex - b.runIndex);
        const completedCount = records.filter(item => item.metrics.completed).length;
        const consumables = {};
        let attacks = 0;
        let misses = 0;
        let revives = 0;
        for (const record of records) {
            attacks += record.metrics.attacks;
            misses += record.metrics.misses;
            revives += record.metrics.revives;
            for (const [itemId, count] of Object.entries(record.metrics.consumables)) {
                consumables[itemId] = (consumables[itemId] || 0) + count;
            }
        }
        const isFilled = records.length === plannedCase.plannedRuns;
        if (isFilled) filledCells++;
        cells.push({
            key: plannedCase.key,
            status: isFilled ? "complete" : "pending",
            recordedRuns: records.length,
            pendingRuns: plannedCase.plannedRuns - records.length,
            missingRunIndexes: Array.from({ length: plannedCase.plannedRuns }, (_, index) => index + 1)
                .filter(runIndex => !records.some(record => record.runIndex === runIndex)),
            completedCount,
            completionRate: records.length ? completedCount / records.length : null,
            averageBossDurationMs: average(records.map(item => item.metrics.bossDurationMs).filter(Number.isFinite)),
            averageRouteDurationMs: average(records.map(item => item.metrics.routeDurationMs)),
            averageDamageTaken: average(records.map(item => item.metrics.damageTaken).filter(Number.isFinite)),
            averageHealing: average(records.map(item => item.metrics.healing).filter(Number.isFinite)),
            averageMinHp: average(records.map(item => item.metrics.minHp).filter(Number.isFinite)),
            deathPoints: records.map(item => item.metrics.deathPoint).filter(Boolean),
            consumables,
            revives,
            attacks,
            misses,
            missRate: attacks ? misses / attacks : 0
        });
    }
    return {
        schemaVersion: SCHEMA_VERSION,
        cells: matrix.summary.cells,
        filledCells,
        pendingCells: matrix.summary.cells - filledCells,
        plannedRuns: matrix.summary.plannedRuns,
        completedRuns: accepted.length,
        pendingActualRuns: matrix.summary.plannedRuns - accepted.length,
        cellResults: cells
    };
}

module.exports = {
    SCHEMA_VERSION,
    parseJsonLines,
    summarizeBalanceResults,
    validateBalanceResults
};
