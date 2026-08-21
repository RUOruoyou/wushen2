#!/usr/bin/env node
"use strict";

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const url = process.argv[2] || "http://127.0.0.1:3333/";
const faviconUrl = new URL("/favicon.ico", url).href;
const chromium = "/usr/bin/chromium-browser";
const port = 9600 + Math.floor(Math.random() * 300);
const profile = "/tmp/wsmud-custom-ui-" + Date.now();
const screenshots = {
    desktop: "/tmp/wsmud-custom-equipment-768.png",
    mobile: "/tmp/wsmud-custom-equipment-390.png"
};
const browser = spawn(chromium, [
    "--headless=new",
    "--remote-debugging-port=" + port,
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--user-data-dir=" + profile,
    "about:blank"
], { stdio: ["ignore", "ignore", "pipe"] });

let socket;
let nextId = 0;
const pending = new Map();
const pageErrors = [];

function cleanup() {
    if (socket) socket.close();
    try { browser.kill("SIGTERM"); } catch (error) { }
    try { rmSync(profile, { recursive: true, force: true }); } catch (error) { }
}

process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));

async function getJson(path) {
    const response = await fetch("http://127.0.0.1:" + port + path);
    return response.json();
}

async function connect() {
    let targets = [];
    for (let attempt = 0; attempt < 60; attempt++) {
        try {
            targets = await getJson("/json/list");
            if (targets.length) break;
        } catch (error) { }
        await delay(200);
    }
    const page = targets.find(target => target.type === "page");
    if (!page) throw new Error("Chromium 调试页面未就绪");
    socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.onopen = resolve;
        socket.onerror = () => reject(new Error("Chromium 调试连接失败"));
    });
    socket.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const request = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) request.reject(new Error(JSON.stringify(message.error)));
            else request.resolve(message.result);
            return;
        }
        if (message.method === "Runtime.exceptionThrown") {
            pageErrors.push(message.params.exceptionDetails.text || "页面脚本异常");
        }
        if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
            const entry = message.params.entry;
            if (entry.source === "network" && entry.url === faviconUrl) return;
            pageErrors.push(entry.text + (entry.url ? " [" + entry.url + "]" : ""));
        }
    };
}

function send(method, params = {}) {
    return new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
    });
}

async function evaluate(expression) {
    const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true
    });
    if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
}

async function waitFor(description, expression, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (await evaluate(expression).catch(() => false)) return;
        await delay(200);
    }
    throw new Error("等待超时：" + description);
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const state = {
    type: "dialog",
    dialog: "customEquipment",
    phase: "state",
    itemId: "validate_equipment",
    itemName: "<hio>★★★★★★校验长剑</hio>",
    plainName: "校验长剑",
    part: "weapon",
    partName: "武器",
    washCount: 25,
    maxWashCount: 150,
    levelLimit: 3,
    fixed: { key: "gj", name: "攻击", value: 145 },
    categories: [
        category("basic", "基础属性", 4, [
            affix("mz", "命中", 120, 2, 3),
            affix("ds", "躲闪", 120, 2, 3),
            affix("zj", "招架", 120, 2, 3),
            affix("max_hp", "气血", 1000, 1, 3)
        ], [option("fy", "防御", 120)]),
        category("acquired", "后天属性", 4, [
            affix("str", "臂力", 32, 2, 3),
            affix("con", "根骨", 32, 2, 3)
        ], [option("dex", "身法", 30)]),
        category("advanced", "高级属性", 3, [affix("gj_per", "攻击", 2, 2, 3)], [option("hp_per", "气血", 1)]),
        category("rare", "稀有属性", 2, [affix("add_sh_per", "最终伤害", 1, 1, 3)], [option("releasetime_per", "绝招释放时间", 1)]),
        category("special", "特殊属性", 1, [affix("releasetime", "绝招释放时间", 100, 1, 3)], [option("busy", "忙乱时间", 100)])
    ],
    ability: {
        unlocked: true,
        skillId: "huashanjianfa",
        name: "华山剑法",
        base: "sword",
        options: [
            { id: "huashanjianfa", name: "华山剑法", base: "sword", part: "weapon" },
            { id: "qixingjian", name: "七星剑法", base: "sword", part: "weapon" }
        ]
    },
    resources: { yuanjing: 98, rename: 3, money: 2500000 },
    stateVersion: 8,
    locked: false,
    socketed: false,
    equipped: true
};

function option(key, name, value) {
    return { key, name, value, material: { path: "st/p#" + key, count: 8, name: name + "晶石" } };
}

function affix(key, name, value, level, levelLimit) {
    return {
        key,
        name,
        value,
        level,
        levelLimit,
        canUpgrade: level < levelLimit,
        nextCost: level + 1,
        material: { path: "st/p#" + key, count: 9, name: name + "晶石" },
        legacy: false,
        replacements: [option(key + "_replacement", "替换候选属性", 1)]
    };
}

function category(id, name, limit, affixes, available) {
    return { id, name, used: affixes.length, limit, remaining: limit - affixes.length, affixes, available };
}

async function setViewport(width, height, mobile) {
    await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile
    });
    await evaluate("window.scrollTo(0, 0); Dialog.customEquipment.render(); true");
    await delay(100);
}

async function inspectLayout(width, height) {
    return evaluate(`(() => {
        const dialog = document.querySelector(".dialog.dialog-custom-equipment");
        const root = document.querySelector(".custom-equipment");
        if (!dialog || !root) return { missing: true };
        const rect = dialog.getBoundingClientRect();
        const selectors = [".custom-equipment", ".custom-head", ".custom-meta", ".custom-res", ".custom-affixes", ".custom-group", ".custom-affix-row", ".custom-affixes-head", ".custom-rename-row"];
        const overflow = [];
        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach((element, index) => {
                if (element.scrollWidth > element.clientWidth + 1) overflow.push(selector + ":" + index);
            });
        }
        const buttons = Array.from(root.querySelectorAll("button")).map(button => {
            const box = button.getBoundingClientRect();
            return {
                text: button.textContent.trim(),
                width: box.width,
                height: box.height,
                clipped: button.scrollWidth > button.clientWidth + 1 || button.scrollHeight > button.clientHeight + 1
            };
        });
        return {
            missing: false,
            viewport: { width: ${width}, height: ${height} },
            dialog: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
            inViewport: rect.left >= -1 && rect.top >= -1 && rect.right <= ${width} + 1 && rect.bottom <= ${height} + 1,
            overflow,
            clippedButtons: buttons.filter(button => button.clipped),
            buttonCount: buttons.length,
            textLength: root.textContent.trim().length
        };
    })()`);
}

async function screenshot(file) {
    const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
    const image = Buffer.from(result.data, "base64");
    assert.ok(image.length > 10000, "截图内容为空或异常");
    writeFileSync(file, image);
}

async function inspectBottomControls() {
    return evaluate(`(() => {
        const content = document.querySelector(".custom-scroll");
        const input = document.querySelector(".custom-rename-input");
        const button = document.querySelector(".custom-rename");
        if (!content || !input || !button) return { missing: true };
        const contentRect = content.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const visible = rect => rect.top >= contentRect.top - 1 && rect.bottom <= contentRect.bottom + 1;
        return {
            missing: false,
            scrollable: content.scrollHeight > content.clientHeight,
            atBottom: content.scrollTop + content.clientHeight >= content.scrollHeight - 1,
            inputVisible: visible(inputRect),
            buttonVisible: visible(buttonRect)
        };
    })()`);
}

try {
    await connect();
    await Promise.all([send("Page.enable"), send("Runtime.enable"), send("Log.enable")]);
    await send("Page.navigate", { url });
    await waitFor("前端初始化", "typeof globalThis.$ !== 'undefined' && typeof globalThis.Dialog !== 'undefined' && document.readyState === 'complete'", 30000);
    await evaluate(`(() => {
        $(".login-content, .signinfo").hide();
        $(".container").show();
        $("#login_panel, #slist_panel, #role_panel").hide();
        globalThis.__customCommands = [];
        globalThis.SendCommand = command => globalThis.__customCommands.push(command);
        Dialog.show("customEquipment", ${JSON.stringify(state)});
        return true;
    })()`);
    await waitFor("重铸弹窗", "!!document.querySelector('.custom-equipment')");

    await evaluate("document.querySelector('.custom-upgrade').click(); true");
    const upgradeCommand = await evaluate("globalThis.__customCommands.pop()");
    assert.equal(upgradeCommand, "zizhi preview validate_equipment upgrade mz");
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify({
        type: "dialog",
        dialog: "customEquipment",
        phase: "preview",
        itemId: "validate_equipment",
        operation: "upgrade",
        operationName: "升级词条",
        summary: "命中提升至 3 级，数值变为 +168",
        costs: [{ path: "st/p#mz", count: 3, name: "命中晶石", unit: "块" }],
        refunds: [],
        money: 0,
        token: "0123456789abcdef0123456789abcdef",
        expiresIn: 60000
    })}); true`);
    assert.equal(await evaluate("!!document.querySelector('.custom-preview-dialog')"), true);
    const confirmState = await evaluate(`(() => {
        const button = document.querySelector(".custom-equipment .custom-confirm");
        return {
            exists: !!button,
            disabled: button ? button.disabled : null,
            pending: Dialog.customEquipment.pending,
            token: Dialog.customEquipment.previewData && Dialog.customEquipment.previewData.token
        };
    })()`);
    assert.deepEqual(confirmState, {
        exists: true,
        disabled: false,
        pending: false,
        token: "0123456789abcdef0123456789abcdef"
    });
    await evaluate("$('.custom-equipment .custom-confirm').trigger('click'); true");
    const confirmResult = await evaluate(`({
        command: globalThis.__customCommands.pop(),
        pending: Dialog.customEquipment.pending,
        token: Dialog.customEquipment.previewData && Dialog.customEquipment.previewData.token
    })`);
    const commitCommand = confirmResult.command;
    if (!commitCommand) throw new Error("确认按钮未发送命令：" + JSON.stringify(confirmResult));
    assert.equal(commitCommand, "zizhi commit 0123456789abcdef0123456789abcdef");
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify(state)}); true`);

    await evaluate("document.querySelector('.custom-open-add').click(); true");
    assert.equal(await evaluate("!!document.querySelector('.custom-picker-mask')"), true);
    await evaluate("document.querySelector('.custom-picker-item:not(.disabled)').click(); true");
    assert.equal(await evaluate("globalThis.__customCommands.pop()"), "zizhi preview validate_equipment add dex");
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify(state)}); true`);

    await evaluate("document.querySelector('.custom-open-ability').click(); true");
    assert.equal(await evaluate("!!document.querySelector('.custom-picker-mask')"), true);
    await evaluate("document.querySelector('.custom-picker-item').click(); true");
    assert.equal(await evaluate("globalThis.__customCommands.pop()"), "zizhi preview validate_equipment ability huashanjianfa");
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify(state)}); true`);

    await evaluate("document.querySelector('.custom-wash').click(); true");
    assert.equal(await evaluate("globalThis.__customCommands.pop()"), "zizhi wash validate_equipment");
    assert.equal(await evaluate("!!document.querySelector('.custom-preview-dialog')"), false);
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify({
        type: "dialog",
        dialog: "customEquipment",
        phase: "error",
        message: "材料不足，还需要<hio>命中晶石</hio>×3。"
    })}); true`);
    assert.equal(await evaluate("document.querySelector('.custom-error') ? document.querySelector('.custom-error').textContent : null"),
        "材料不足，还需要命中晶石×3。");
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify(state)}); true`);

    await setViewport(768, 900, false);
    const desktop = await inspectLayout(768, 900);
    assert.equal(desktop.missing, false);
    assert.ok(desktop.inViewport, JSON.stringify(desktop));
    assert.deepEqual(desktop.overflow, [], JSON.stringify(desktop));
    assert.deepEqual(desktop.clippedButtons, [], JSON.stringify(desktop));
    assert.ok(desktop.buttonCount >= 10 && desktop.textLength > 100);
    await screenshot(screenshots.desktop);

    await setViewport(390, 844, true);
    const mobile = await inspectLayout(390, 844);
    assert.equal(mobile.missing, false);
    assert.ok(mobile.inViewport, JSON.stringify(mobile));
    assert.deepEqual(mobile.overflow, [], JSON.stringify(mobile));
    assert.deepEqual(mobile.clippedButtons, [], JSON.stringify(mobile));
    assert.ok(mobile.buttonCount >= 10 && mobile.textLength > 100);
    await screenshot(screenshots.mobile);
    await evaluate(`Dialog.show("customEquipment", ${JSON.stringify(Object.assign({}, state, { focus: "rename" }))}); true`);
    await delay(100);
    assert.deepEqual(await inspectBottomControls(), {
        missing: false,
        scrollable: true,
        atBottom: true,
        inputVisible: true,
        buttonVisible: true
    });

    assert.deepEqual(pageErrors, []);
    console.log("自制装备 3.4 前端校验通过：命令、确认态、390px/768px 布局和控制台均正常。");
    console.log(JSON.stringify({ desktop, mobile, screenshots }));
} catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
} finally {
    cleanup();
}
