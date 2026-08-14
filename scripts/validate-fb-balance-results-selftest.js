"use strict";

const assert = require("assert");
const {
    parseJsonLines,
    summarizeBalanceResults,
    validateBalanceResults
} = require("./fb-balance-results");
const { buildBalanceMatrix } = require("./fb-balance-matrix");

const matrix = buildBalanceMatrix();
assert.deepStrictEqual(matrix.errors, []);

function makeRecord(plannedCase, runIndex) {
    const started = Date.parse("2026-08-08T00:00:00.000Z") + runIndex * 10000;
    const routeDurationMs = 8000;
    return {
        schemaVersion: 1,
        sampleId: plannedCase.area + "-" + plannedCase.mode + "-" + plannedCase.route + "-"
            + plannedCase.tier + "-" + plannedCase.archetype + "-" + runIndex,
        cell: {
            area: plannedCase.area,
            mode: plannedCase.mode,
            route: plannedCase.route,
            tier: plannedCase.tier,
            archetype: plannedCase.archetype
        },
        runIndex,
        startedAt: new Date(started).toISOString(),
        endedAt: new Date(started + routeDurationMs).toISOString(),
        provenance: {
            kind: "actual",
            transport: "websocket",
            environment: "isolated",
            clock: "wall",
            timerScale: 1,
            isCombatLogicModified: false,
            instrumentation: "fixture-v1",
            sourceFingerprint: "a".repeat(64)
        },
        loadout: {
            id: plannedCase.archetype + "-fixture-v1",
            fingerprint: "b".repeat(64),
            requirementsSatisfied: true,
            stats: { ...plannedCase.stats },
            requirements: { ...plannedCase.requirements }
        },
        metrics: {
            completed: true,
            bossDurationMs: 4000,
            routeDurationMs,
            deathPoint: null,
            consumables: {},
            revives: 0,
            attacks: 10,
            misses: 2,
            missRate: 0.2,
            damageTaken: 100,
            healing: 40,
            minHp: 900,
            failureReason: null
        }
    };
}

const records = [];
for (let runIndex = 1; runIndex <= 20; runIndex++) records.push(makeRecord(matrix.cases[0], runIndex));
for (let runIndex = 1; runIndex <= 19; runIndex++) records.push(makeRecord(matrix.cases[1], runIndex));
const parsed = parseJsonLines(records.map(record => JSON.stringify(record)).join("\n"), "selftest.jsonl");
assert.deepStrictEqual(parsed.errors, []);
const validation = validateBalanceResults(parsed.records, matrix);
assert.deepStrictEqual(validation.errors, []);
const summary = summarizeBalanceResults(validation);
assert.strictEqual(summary.completedRuns, 39);
assert.strictEqual(summary.pendingActualRuns, 8241);
assert.strictEqual(summary.filledCells, 1);
assert.strictEqual(summary.pendingCells, 413);
assert.strictEqual(summary.cellResults[0].status, "complete");
assert.strictEqual(summary.cellResults[1].status, "pending");
assert.deepStrictEqual(summary.cellResults[1].missingRunIndexes, [20]);
assert.strictEqual(summary.cellResults[0].averageDamageTaken, 100);
assert.strictEqual(summary.cellResults[0].averageHealing, 40);
assert.strictEqual(summary.cellResults[0].averageMinHp, 900);

const duplicate = validateBalanceResults([records[0], { ...records[0] }], matrix);
assert(duplicate.errors.some(error => error.includes("sampleId") && error.includes("重复")));
assert(duplicate.errors.some(error => error.includes("样本格/runIndex") && error.includes("重复")));

const invalidCell = makeRecord(matrix.cases[0], 1);
invalidCell.sampleId = "invalid-cell-1";
invalidCell.cell.area = "not-an-area";
const invalid = validateBalanceResults([invalidCell], matrix);
assert(invalid.errors.some(error => error.includes("不属于 414 个合法样本格")));

const mixedFingerprint = makeRecord(matrix.cases[0], 2);
mixedFingerprint.sampleId = "mixed-fingerprint-2";
mixedFingerprint.loadout.fingerprint = "c".repeat(64);
const mixed = validateBalanceResults([records[0], mixedFingerprint], matrix);
assert(mixed.errors.some(error => error.includes("源码或配装指纹不一致")));

const malformed = parseJsonLines("{not-json}\n", "malformed.jsonl");
assert.strictEqual(malformed.errors.length, 1);

console.log("FB_BALANCE_RESULTS_SELFTEST_JSON:" + JSON.stringify({
    acceptedRuns: summary.completedRuns,
    filledCells: summary.filledCells,
    pendingCells: summary.pendingCells,
    duplicateRejected: true,
    invalidCellRejected: true,
    mixedFingerprintRejected: true,
    malformedJsonRejected: true
}));
console.log("副本实战结果 JSONL 校验与汇总自测通过。");
