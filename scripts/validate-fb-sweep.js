"use strict";

const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const child = spawn(process.execPath, [path.join(root, "main.js"), "100"], {
    cwd: root,
    env: {
        ...process.env,
        WSMUD_VALIDATE_RESOURCES: "1",
        WSMUD_VALIDATE_EFFECTIVE: "1",
        WSMUD_VALIDATE_SWEEP: "1"
    },
    stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
let settled = false;
let shutdownTimer = null;
const timer = setTimeout(() => child.kill("SIGKILL"), 45000);
const finish = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    if (shutdownTimer) clearTimeout(shutdownTimer);
    const match = output.match(/FB_SWEEP_JSON:(\{.*\})/);
    if (!match) {
        console.error(output.trim());
        console.error("未收到副本扫荡调用链审计结果");
        process.exitCode = 1;
        return;
    }
    let report;
    try {
        report = JSON.parse(match[1]);
    } catch (error) {
        console.error("扫荡审计结果不是合法 JSON: " + error.message);
        process.exitCode = 1;
        return;
    }
    if (report.runs !== 29 || report.multi < 1) {
        console.error("扫荡审计覆盖数量异常: " + JSON.stringify(report));
        process.exitCode = 1;
        return;
    }
    console.log("副本扫荡调用链审计通过：" + report.runs + " 次实际单人扫荡，覆盖 " + report.multi + " 个组队边界。");
};
const requestShutdown = () => {
    if (shutdownTimer) return;
    child.kill("SIGINT");
    shutdownTimer = setTimeout(() => child.kill("SIGKILL"), 2000);
};
child.stdout.on("data", chunk => {
    output += chunk.toString();
    if (!settled && output.includes("FB_SWEEP_JSON:")) requestShutdown();
});
child.stderr.on("data", chunk => { output += chunk.toString(); });
child.on("error", error => { output += "\n" + error.stack; finish(); });
child.on("close", finish);
