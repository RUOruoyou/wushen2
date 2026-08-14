"use strict";

const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const child = spawn(process.execPath, [path.join(root, "main.js"), "100"], {
    cwd: root,
    env: {
        ...process.env,
        WSMUD_VALIDATE_RESOURCES: "1",
        WSMUD_VALIDATE_EQUIPMENT: "1"
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
    const match = output.match(/FB_EQUIPMENT_JSON:(\{.*\})/);
    if (!match) {
        console.error(output.trim());
        console.error("未收到副本装备穿卸审计结果");
        process.exitCode = 1;
        return;
    }
    let report;
    try {
        report = JSON.parse(match[1]);
    } catch (error) {
        console.error("副本装备审计结果不是合法 JSON: " + error.message);
        process.exitCode = 1;
        return;
    }
    if (report.count !== 48 || !Array.isArray(report.types) || report.types.length < 4) {
        console.error("副本装备审计覆盖异常: " + JSON.stringify(report));
        process.exitCode = 1;
        return;
    }
    console.log("副本装备穿戴/卸下审计通过：" + report.count + " 件，覆盖 " + report.types.length + " 个装备部位。");
};
const timer = setTimeout(() => {
    child.kill("SIGKILL");
    finish();
}, 45000);

const requestShutdown = () => {
    if (shutdownTimer) return;
    child.kill("SIGINT");
    shutdownTimer = setTimeout(() => child.kill("SIGKILL"), 2000);
};

child.stdout.on("data", chunk => {
    output += chunk.toString();
    if (!settled && output.includes("FB_EQUIPMENT_JSON:")) requestShutdown();
});
child.stderr.on("data", chunk => { output += chunk.toString(); });
child.on("error", error => {
    output += "\n" + error.stack;
    finish();
});
child.on("close", finish);
