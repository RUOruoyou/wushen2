const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadTask(relativePath, extras) {
    const context = Object.assign({
        console,
        TASK: function () {},
        inherits() {}
    }, extras || {});
    const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
    vm.runInNewContext(source, context, { filename: relativePath });
    return context;
}

function validateShanhaiSchedule() {
    const task = loadTask("world/task/shanhai_event.js");
    for (let i = 0; i < 500; i++) {
        const schedule = task.create_schedule(new Date(2026, 7, 10, 0, 0, 1));
        const total = schedule.batches.reduce((sum, batch) => sum + batch.count, 0);
        if (schedule.version !== 2) throw new Error("山海日程版本未更新");
        if (total !== schedule.total) throw new Error("山海日程总数不一致");
        if (schedule.total < 10 || schedule.total > 60) throw new Error("山海异兽总数越界");
        if (schedule.batches.length < 10 || schedule.batches.length > 12) throw new Error("山海批次数量越界");
        for (let j = 0; j < schedule.batches.length; j++) {
            const batch = schedule.batches[j];
            if (batch.count < 1 || batch.count > 5) throw new Error("单批异兽数量越界");
            const hour = new Date(batch.at).getHours();
            if (hour < 8 || hour > 23) throw new Error("山海批次超出活跃时段");
            if (j > 0) {
                const gap = batch.at - schedule.batches[j - 1].at;
                if (gap < 60000 || gap > 2 * 60 * 60 * 1000) throw new Error("山海批次间隔异常: " + gap);
            }
        }
    }

    const savedSchedule = {
        version: 1,
        date: "2026-08-10",
        total: 10,
        batches: [{ id: "legacy", at: new Date(2026, 7, 10, 12).getTime(), count: 1, status: "pending" }]
    };
    let didWrite = false;
    const reuseTask = loadTask("world/task/shanhai_event.js", {
        WORLD: {
            DATA: {
                query_temp: () => savedSchedule,
                set_temp: () => { didWrite = true; },
                save: async () => {}
            }
        }
    });
    reuseTask.ensure_schedule(new Date(2026, 7, 10, 9).getTime());
    if (reuseTask.schedule !== savedSchedule || didWrite) throw new Error("当天旧山海日程被重复生成");
}

function validateWorldBosses() {
    const cloned = [];
    const task = loadTask("world/task/boss_task.js", {
        console: { log() {} },
        WORLD: { DATA: { query_temp: () => 29 }, USERS: [] },
        ROOM: {
            RANDOM() {
                return {
                    long_name: "测试区域",
                    item_changed() {}
                };
            }
        },
        EVENTS: { add() {} },
        NPC: {
            CLONE(resourcePath) {
                cloned.push(resourcePath);
                return {
                    skills: {},
                    init() {},
                    recount() {}
                };
            }
        }
    });
    task.random = (num) => Math.max(0, Math.floor(num) - 1);
    for (let playerLevel = 1; playerLevel <= 5; playerLevel++) {
        const boss = task.create_boss(playerLevel);
        if (!boss || !Number.isFinite(boss.boss_index)) throw new Error("世界Boss创建失败: " + playerLevel);
    }
    if (cloned.length !== 5) throw new Error("世界Boss克隆数量不正确");

    let attempts = 0;
    task.stop = () => {};
    task.check_time = () => {};
    task.check_users = () => [[{ send() {} }], [{ send() {} }]];
    task.create_event = () => ({});
    task.create_boss = () => (++attempts === 1 ? null : {
        name: "测试Boss",
        level: 2
    });
    task.boss = [];
    task.run();
    if (attempts !== 2 || task.boss.length !== 1) throw new Error("单档Boss失败仍中断后续刷新");
}

validateShanhaiSchedule();
validateWorldBosses();
console.log("山海异兽排期与世界Boss刷新验证通过。");
