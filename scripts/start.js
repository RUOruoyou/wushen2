const { spawn } = require("child_process");

const children = [
    spawn(process.execPath, ["web.js"], { stdio: "inherit" }),
    spawn(process.execPath, ["main.js"], { stdio: "inherit" })
];

let stopping = false;

function stopAll(signal = "SIGTERM") {
    if (stopping) return;
    stopping = true;
    for (const child of children) {
        if (!child.killed) child.kill(signal);
    }
}

for (const child of children) {
    child.on("exit", (code, signal) => {
        if (!stopping && code !== 0) {
            stopAll();
            process.exitCode = code || 1;
        }
        if (signal && !stopping) {
            stopAll(signal);
        }
    });
}

process.on("SIGINT", () => stopAll("SIGINT"));
process.on("SIGTERM", () => stopAll("SIGTERM"));
