"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const tasks = new Map();
const resumes = [];

globalThis.WORLD = {};
globalThis.USERTASK = {
    GET(id) {
        return tasks.get(id);
    }
};

const source = fs.readFileSync(path.join(root, "world/extends/auto_recovery.js"), "utf8");
vm.runInThisContext(source, { filename: "world/extends/auto_recovery.js" });

tasks.set("family_ring", {
    continue_ring(player) {
        resumes.push(["family_ring", player.id]);
        return true;
    }
});
tasks.set("yamen2", {
    continue_ring(player, mode) {
        resumes.push(["yamen2", player.id, mode]);
        return true;
    }
});

function createPlayer(id, settings) {
    return {
        id: id,
        hp: 100,
        max_hp: 100,
        mp: 100,
        max_mp: 100,
        state: null,
        is_busy: false,
        is_faint: false,
        disconnect_time: 0,
        force_skill: { id: "force-skill" },
        settings: Object.assign({
            auto_recovery: 1,
            auto_recovery_hp: 80,
            auto_recovery_mp: 60
        }, settings),
        commands: [],
        messages: [],
        query_setting(key) {
            return this.settings[key] || 0;
        },
        query_skill() {
            return 100;
        },
        in_world() {
            return true;
        },
        is_fighting() {
            return false;
        },
        do_command(command) {
            this.commands.push(command);
            this.state = { id: command };
        },
        set_state(state) {
            this.state = state;
        },
        notify(message) {
            this.messages.push(message);
        }
    };
}

function waitForTimers() {
    return new Promise(resolve => setTimeout(resolve, 10));
}

function validateSettings() {
    const command = {
        inherits() {
        }
    };
    const settingSource = fs.readFileSync(path.join(root, "world/cmd/comm/setting.js"), "utf8");
    const loadSetting = vm.compileFunction(settingSource, ["COMMAND", "WORLD"], {
        filename: "world/cmd/comm/setting.js"
    });
    loadSetting.call(command, {}, WORLD);

    const player = {
        is_player: true,
        settings: {},
        messages: [],
        set_setting(key, value) {
            this.settings[key] = value;
        },
        notify(message) {
            this.messages.push(message);
        }
    };
    command.enter(player, "auto_recovery", "1");
    command.enter(player, "auto_recovery_hp", "80");
    command.enter(player, "auto_recovery_mp", "60");
    assert.equal(player.settings.auto_recovery, 1);
    assert.equal(player.settings.auto_recovery_hp, 80);
    assert.equal(player.settings.auto_recovery_mp, 60);

    command.enter(player, "auto_recovery_hp", "0");
    command.enter(player, "auto_recovery_mp", "101");
    command.enter(player, "auto_recovery_mp", "60.5");
    command.enter(player, "auto_recovery_mp", "1e2");
    assert.equal(player.settings.auto_recovery_hp, 80);
    assert.equal(player.settings.auto_recovery_mp, 60);
    assert.equal(player.messages.filter(message => message === "无效设定值。").length, 4);
}

async function completeState(player, stateId, value) {
    if (stateId === "liaoshang") player.hp = value;
    else player.mp = value;
    assert.equal(WORLD.should_finish_auto_recovery_state(player, stateId), true);
    assert.equal(WORLD.on_auto_recovery_state_stop(player, stateId, true), true);
    player.state = null;
    await waitForTimers();
}

async function run() {
    validateSettings();

    let player = createPlayer("ready");
    WORLD.queue_auto_recovery(player, "family_ring", null, 0);
    await waitForTimers();
    assert.deepEqual(player.commands, []);
    assert.deepEqual(resumes.pop(), ["family_ring", "ready"]);

    player = createPlayer("disabled", { auto_recovery: 0 });
    player.hp = 10;
    player.mp = 10;
    WORLD.queue_auto_recovery(player, "yamen2", "rise", 0);
    await waitForTimers();
    assert.deepEqual(player.commands, []);
    assert.deepEqual(resumes.pop(), ["yamen2", "disabled", "rise"]);

    player = createPlayer("recover-both");
    player.hp = 30;
    player.mp = 20;
    WORLD.queue_auto_recovery(player, "family_ring", null, 0);
    await waitForTimers();
    assert.deepEqual(player.commands, ["liaoshang"]);
    await completeState(player, "liaoshang", 80);
    assert.deepEqual(player.commands, ["liaoshang", "dazuo"]);
    await completeState(player, "dazuo", 60);
    assert.deepEqual(resumes.pop(), ["family_ring", "recover-both"]);
    assert.equal(WORLD.is_auto_recovery_pending(player), false);

    player = createPlayer("manual-stop");
    player.hp = 20;
    WORLD.queue_auto_recovery(player, "family_ring", null, 0);
    await waitForTimers();
    assert.equal(WORLD.on_auto_recovery_state_stop(player, "liaoshang", false), true);
    player.state = null;
    await waitForTimers();
    assert.equal(WORLD.is_auto_recovery_pending(player), false);
    assert.equal(resumes.some(item => item[1] === "manual-stop"), false);

    player = createPlayer("giveup-stop");
    player.mp = 10;
    WORLD.queue_auto_recovery(player, "yamen2", "fixed", 0);
    await waitForTimers();
    assert.equal(player.state.id, "dazuo");
    WORLD.cancel_auto_recovery(player);
    assert.equal(player.state, null);
    await waitForTimers();
    assert.equal(resumes.some(item => item[1] === "giveup-stop"), false);

    player = createPlayer("offline");
    player.hp = 10;
    player.disconnect_time = Date.now();
    WORLD.queue_auto_recovery(player, "family_ring", null, 0);
    await waitForTimers();
    assert.equal(WORLD.is_auto_recovery_pending(player), false);
    assert.equal(resumes.some(item => item[1] === "offline"), false);

    player = createPlayer("stalled");
    player.hp = 10;
    WORLD.queue_auto_recovery(player, "family_ring", null, 0);
    await waitForTimers();
    assert.equal(WORLD.should_finish_auto_recovery_state(player, "liaoshang"), false);
    assert.equal(WORLD.should_finish_auto_recovery_state(player, "liaoshang"), false);
    assert.equal(WORLD.should_finish_auto_recovery_state(player, "liaoshang"), true);
    assert.equal(WORLD.on_auto_recovery_state_stop(player, "liaoshang", true), true);
    player.state = null;
    await waitForTimers();
    assert.equal(WORLD.is_auto_recovery_pending(player), false);
    assert.equal(resumes.some(item => item[1] === "stalled"), false);

    const familySource = fs.readFileSync(path.join(root, "world/task/family_ring.js"), "utf8");
    const yamenSource = fs.readFileSync(path.join(root, "world/task/ym_task2.js"), "utf8");
    const healSource = fs.readFileSync(path.join(root, "world/cmd/action/liaoshang.js"), "utf8");
    const meditateSource = fs.readFileSync(path.join(root, "world/cmd/action/dazuo.js"), "utf8");
    assert.match(familySource, /queue_auto_recovery\(killer, "family_ring"/);
    assert.match(yamenSource, /queue_auto_recovery\(player, "yamen2"/);
    assert.match(healSource, /should_finish_auto_recovery_state\(me, "liaoshang"\)/);
    assert.match(meditateSource, /should_finish_auto_recovery_state\(me, "dazuo"\)/);

    console.log("自动恢复校验通过：设置门控、疗伤、打坐、续接、中止、掉线与无进展保护均正常。");
}

run().catch(error => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
});
