"use strict";

const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const child = spawn(process.execPath, [path.join(root, "main.js"), "100"], {
    cwd: root,
    env: {
        ...process.env,
        WSMUD_VALIDATE_RESOURCES: "1",
        WSMUD_VALIDATE_SWEEP_STATS: "1"
    },
    stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
let settled = false;
let shutdownTimer = null;
const finish = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    if (shutdownTimer) clearTimeout(shutdownTimer);
    const match = output.match(/FB_SWEEP_STATS_JSON:(\{.*\})/);
    if (!match) {
        console.error(output.trim());
        console.error("未收到扫荡统计审计结果");
        process.exitCode = 1;
        return;
    }
    let report;
    try {
        report = JSON.parse(match[1]);
    } catch (error) {
        console.error("扫荡统计结果不是合法 JSON: " + error.message);
        process.exitCode = 1;
        return;
    }
    if (report.normal.runs !== 1000 || report.hard.runs !== 1000
        || report.normal.special !== 0 || report.hard.special < 20
        || report.hard.special > 300 || report.isolated !== true) {
        console.error("扫荡统计边界异常: " + JSON.stringify(report));
        process.exitCode = 1;
        return;
    }
    console.log("普通/困难扫荡统计审计通过：各1000次，模式专属掉落隔离。");
};
const timer = setTimeout(() => {
    child.kill("SIGKILL");
    finish();
}, 60000);

const requestShutdown = () => {
    if (shutdownTimer) return;
    child.kill("SIGINT");
    shutdownTimer = setTimeout(() => child.kill("SIGKILL"), 2000);
};

child.stdout.on("data", chunk => {
    output += chunk.toString();
    if (!settled && output.includes("FB_SWEEP_STATS_JSON:")) requestShutdown();
});
child.stderr.on("data", chunk => { output += chunk.toString(); });
child.on("error", error => {
    output += "\n" + error.stack;
    finish();
});
child.on("close", finish);
