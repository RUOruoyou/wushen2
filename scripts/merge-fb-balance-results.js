"use strict";

const fs = require("fs");
const path = require("path");
const {
    parseJsonLines,
    summarizeBalanceResults,
    validateBalanceResults
} = require("./fb-balance-results");

const args = process.argv.slice(2);
const outputIndex = args.indexOf("--output");
if (outputIndex < 0 || !args[outputIndex + 1]) {
    console.error("用法: node scripts/merge-fb-balance-results.js --output <结果.jsonl> <批次1.jsonl> [批次2.jsonl ...]");
    process.exitCode = 1;
} else {
    const outputFile = path.resolve(args[outputIndex + 1]);
    const inputFiles = args
        .filter((value, index) => index !== outputIndex && index !== outputIndex + 1)
        .map(value => path.resolve(value))
        .filter(file => file !== outputFile);
    if (!inputFiles.length) {
        console.error("至少需要一个批次 JSONL 文件");
        process.exitCode = 1;
    } else {
        merge(outputFile, inputFiles);
    }
}

function readRecords(file) {
    const parsed = parseJsonLines(fs.readFileSync(file, "utf8"), file);
    if (parsed.errors.length) throw new Error(parsed.errors.join("\n"));
    return parsed.records.map(entry => entry.value);
}

function merge(outputFile, inputFiles) {
    try {
        const records = fs.existsSync(outputFile) ? readRecords(outputFile) : [];
        for (const file of inputFiles) records.push(...readRecords(file));
        const validation = validateBalanceResults(records);
        if (validation.errors.length) throw new Error(validation.errors.join("\n"));
        const summary = summarizeBalanceResults(validation);
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        const tempFile = outputFile + ".tmp-" + process.pid;
        fs.writeFileSync(tempFile, records.map(record => JSON.stringify(record)).join("\n") + "\n");
        fs.renameSync(tempFile, outputFile);
        console.log("FB_BALANCE_MERGE_JSON:" + JSON.stringify({
            outputFile,
            mergedFiles: inputFiles.length,
            filledCells: summary.filledCells,
            pendingCells: summary.pendingCells,
            completedRuns: summary.completedRuns,
            pendingActualRuns: summary.pendingActualRuns
        }));
        console.log("副本实战批次 JSONL 校验并合并完成。");
    } catch (error) {
        console.error(error.stack || error);
        process.exitCode = 1;
    }
}
