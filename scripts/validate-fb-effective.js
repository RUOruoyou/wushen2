"use strict";

const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const child = spawn(process.execPath, [path.join(root, "main.js"), "100"], {
    cwd: root,
    env: {
        ...process.env,
        WSMUD_VALIDATE_RESOURCES: "1",
        WSMUD_VALIDATE_EFFECTIVE: "1"
    },
    stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
let settled = false;
let shutdownTimer = null;
const finish = (code, signal) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    if (shutdownTimer) clearTimeout(shutdownTimer);
    const match = output.match(/FB_EFFECTIVE_JSON:(\{.*\})/);
    if (!match) {
        console.error(output.trim());
        console.error("未收到副本 NPC 有效属性审计结果");
        process.exitCode = 1;
        return;
    }
    let report;
    try {
        report = JSON.parse(match[1]);
    } catch (error) {
        console.error("有效属性审计结果不是合法 JSON: " + error.message);
        process.exitCode = 1;
        return;
    }
    if (!report.count || report.failures.length) {
        console.error("副本 NPC 有效属性审计失败: " + (report.failures || []).join(","));
        process.exitCode = 1;
        return;
    }
    const areas = Object.keys(report.areas || {});
    if (areas.length !== 18) {
        console.error("副本 NPC 有效属性审计覆盖 AREA 数量异常: " + areas.length);
        process.exitCode = 1;
        return;
    }
    console.log("副本 NPC 有效属性审计通过：" + report.count + " 条 NPC，覆盖 " + areas.length + " 个 AREA。");
    for (const area of areas.sort()) {
        const rows = report.areas[area];
        const values = key => rows.map(row => row.effective[key]);
        const range = key => {
            const list = values(key);
            return Math.min(...list) + "-" + Math.max(...list);
        };
        console.log(area + "\tgj=" + range("gj") + "\tmz=" + range("mz")
            + "\tds=" + range("ds") + "\tfy=" + range("fy")
            + "\thp=" + range("max_hp") + "\t内=" + range("max_mp"));
    }
};
const timer = setTimeout(() => {
    child.kill("SIGKILL");
    finish(null, "SIGKILL");
}, 45000);

const requestShutdown = () => {
    if (shutdownTimer) return;
    child.kill("SIGINT");
    shutdownTimer = setTimeout(() => child.kill("SIGKILL"), 2000);
};

child.stdout.on("data", chunk => {
    output += chunk.toString();
    if (!settled && output.includes("FB_EFFECTIVE_JSON:")) requestShutdown();
});
child.stderr.on("data", chunk => { output += chunk.toString(); });
child.on("error", error => {
    output += "\n" + error.stack;
    finish(null, null);
});
child.on("close", finish);
