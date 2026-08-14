"use strict";

const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const child = spawn(process.execPath, [path.join(root, "main.js"), "100"], {
    cwd: root,
    env: {
        ...process.env,
        WSMUD_VALIDATE_RESOURCES: "1",
        WSMUD_VALIDATE_THRESHOLDS: "1"
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
    const match = output.match(/FB_THRESHOLDS_JSON:(\{.*\})/);
    if (!match) {
        console.error(output.trim());
        console.error("未收到副本硬门槛审计结果");
        process.exitCode = 1;
        return;
    }
    let report;
    try {
        report = JSON.parse(match[1]);
    } catch (error) {
        console.error("副本硬门槛审计结果不是合法 JSON: " + error.message);
        process.exitCode = 1;
        return;
    }
    const isComplete = report.isolated
        && report.piaomiaofeng && report.piaomiaofeng.cases === 10
        && report.jingnian && report.jingnian.cases === 12
        && report.xiakedao && report.xiakedao.cases === 3
        && report.yinyanggu && report.yinyanggu.cases === 6
        && report.zhanshendian && report.zhanshendian.mp === 4
        && report.zhanshendian.skillLevels === 9
        && report.zhanshendian.quality === 3
        && report.zhanshendian.skillCount === 3
        && report.zhanshendian.fullRoute;
    if (!isComplete) {
        console.error("副本硬门槛审计覆盖不完整: " + JSON.stringify(report));
        process.exitCode = 1;
        return;
    }
    console.log("副本硬门槛审计通过：精力、属性、武学等级/品质/数量及路线资格边界完整。");
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
    if (!settled && output.includes("FB_THRESHOLDS_JSON:")) requestShutdown();
});
child.stderr.on("data", chunk => { output += chunk.toString(); });
child.on("error", error => {
    output += "\n" + error.stack;
    finish();
});
child.on("close", finish);
