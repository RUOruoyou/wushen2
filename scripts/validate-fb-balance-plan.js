"use strict";

const { buildBalanceMatrix } = require("./fb-balance-matrix");

const matrix = buildBalanceMatrix();
const { errors, summary } = matrix;

if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    console.log("FB_BALANCE_PLAN_JSON:" + JSON.stringify({
        ...summary,
        actualResultsIncluded: false
    }));
    console.log("副本三档三流派平衡验收矩阵完整；本脚本不读取实战结果，请使用 validate-fb-balance-results.js 汇总 JSONL。");
}
