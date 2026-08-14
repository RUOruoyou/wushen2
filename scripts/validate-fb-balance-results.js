"use strict";

const fs = require("fs");
const path = require("path");
const {
    parseJsonLines,
    summarizeBalanceResults,
    validateBalanceResults
} = require("./fb-balance-results");

const args = process.argv.slice(2);
const shouldPrintDetails = args.includes("--details");
const files = args.filter(arg => arg !== "--details");
const parsedRecords = [];
const parseErrors = [];

for (const input of files) {
    const file = path.resolve(input);
    try {
        const parsed = parseJsonLines(fs.readFileSync(file, "utf8"), file);
        parsedRecords.push(...parsed.records);
        parseErrors.push(...parsed.errors);
    } catch (error) {
        parseErrors.push(file + " 读取失败: " + error.message);
    }
}

const validation = validateBalanceResults(parsedRecords);
const errors = parseErrors.concat(validation.errors);
if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    const summary = summarizeBalanceResults(validation);
    const output = shouldPrintDetails ? summary : {
        schemaVersion: summary.schemaVersion,
        cells: summary.cells,
        filledCells: summary.filledCells,
        pendingCells: summary.pendingCells,
        plannedRuns: summary.plannedRuns,
        completedRuns: summary.completedRuns,
        pendingActualRuns: summary.pendingActualRuns
    };
    console.log("FB_BALANCE_RESULTS_JSON:" + JSON.stringify(output));
    if (!files.length) {
        console.log("未提供 JSONL 文件；414 个样本格均保持 pending。");
    } else {
        console.log("副本实战 JSONL 格式、样本格归属、重复项和指标一致性校验通过。");
    }
}
