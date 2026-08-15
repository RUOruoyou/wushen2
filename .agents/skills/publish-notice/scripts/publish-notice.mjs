#!/usr/bin/env node
// wsmud2 玩家公告发布脚本：无头浏览器登录管理账号 → 游戏内 notice 命令发布 → 验证落库
// 用法:
//   node publish-notice.mjs --user <账号> --pwd <密码> --file <notice.json>
//                          [--url http://localhost:8088/] [--server 本地测试1]
//                          [--data <data/100/data.js 路径>]
// 密码也可经环境变量 WSMUD_NOTICE_PWD 传入。账号密码不落盘。
// notice.json: { "title": "...", "summary": "...", "content": "...", "category": "update" }
import { spawn } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---------- 参数 ----------
const args = process.argv.slice(2);
function getArg(name, def) {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] ? args[i + 1] : def;
}
function fail(msg) {
    console.error('失败: ' + msg);
    cleanup();
    process.exit(1);
}
const USER = getArg('--user', process.env.WSMUD_NOTICE_USER);
const PWD = getArg('--pwd', process.env.WSMUD_NOTICE_PWD);
const FILE = getArg('--file');
const URL = getArg('--url', 'http://localhost:8088/');
const SERVER_NAME = getArg('--server', '本地测试1');
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const DATA_FILE = getArg('--data', join(REPO, 'data', '100', 'data.js'));

// ---------- 公告校验（与服务端 world/extends/admin_content.js 规则一致） ----------
let notice;
try {
    notice = JSON.parse(readFileSync(FILE, 'utf8'));
} catch (e) {
    fail('notice.json 读取/解析失败: ' + e.message);
}
if (!notice.title || !notice.content) fail('公告必须包含 title 与 content');
if (String(notice.title).length > 80) fail('标题不能超过80字');
if (notice.summary && String(notice.summary).length > 200) fail('摘要不能超过200字');
if (String(notice.content).length > 20000) fail('正文不能超过20000字');
const CATEGORIES = ['update', 'activity', 'maintenance', 'system'];
const category = CATEGORIES.includes(notice.category) ? notice.category : 'update';

// ---------- chromium / CDP ----------
const CHROME = '/usr/bin/chromium-browser';
const PORT = 9500 + Math.floor(Math.random() * 400);
const PROFILE = `/tmp/wsmud-notice-${Date.now()}`;
const proc = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`, '--no-sandbox',
    '--disable-gpu', `--user-data-dir=${PROFILE}`, '--hide-scrollbars', 'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

function cleanup() {
    try { proc.kill('SIGTERM'); } catch { }
    try { rmSync(PROFILE, { recursive: true, force: true }); } catch { }
}
process.on('exit', cleanup);
process.on('uncaughtException', (e) => fail(e.message));

async function getJson(path) {
    const res = await fetch(`http://127.0.0.1:${PORT}${path}`);
    return res.json();
}
let targets = [];
for (let i = 0; i < 50; i++) {
    try { targets = await getJson('/json/list'); if (targets.length) break; } catch { }
    await new Promise(r => setTimeout(r, 200));
}
if (!targets.length) fail('chromium devtools 未就绪');
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('devtools websocket 连接失败')); });

let nextId = 0;
const pending = new Map();
ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id); pending.delete(msg.id);
        msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result);
    }
};
function send(method, params = {}) {
    return new Promise((res, rej) => { const id = ++nextId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (r.exceptionDetails) throw new Error('evaluate 失败: ' + (r.exceptionDetails.exception?.description || JSON.stringify(r.exceptionDetails).slice(0, 200)));
    return r.result.value;
}
async function waitFor(desc, expr, timeout = 15000) {
    const start = Date.now();
    let lastErr = null;
    while (Date.now() - start < timeout) {
        try { if (await evaluate(expr)) return true; } catch (e) { lastErr = e; }
        await new Promise(r => setTimeout(r, 400));
    }
    fail(`等待超时: ${desc}${lastErr ? '; ' + lastErr.message.slice(0, 150) : ''}`);
}

try {
    await send('Page.enable');

    // 导航（偶发加载失败自动重试）
    let loaded = false;
    for (let attempt = 1; attempt <= 3 && !loaded; attempt++) {
        await send('Page.navigate', { url: URL });
        await new Promise(r => setTimeout(r, 2500));
        loaded = await evaluate(`typeof globalThis.$ !== "undefined" && document.readyState === "complete"`).catch(() => false);
        console.log(`导航尝试 ${attempt}: ${loaded ? '页面就绪' : '未就绪，重试'}`);
    }
    if (!loaded) fail('页面多次加载失败');
    await waitFor('登录面板', `$("#login_panel").css("display") !== "none"`, 30000);

    // 登录
    await evaluate(`$("#login_name").val(${JSON.stringify(USER)}); $("#login_pwd").val(${JSON.stringify(PWD)}); $('[command="LoginIn"]').click(); "ok"`);
    await waitFor('服务器面板', `$("#slist_panel").css("display") !== "none"`, 20000);

    // 记录发布前公告总数（落库文件为准）
    let countBefore = null;
    try {
        const data = readFileSync(DATA_FILE, 'utf8');
        countBefore = (data.match(/"?id"?:\s*"notice_/g) || []).length;
    } catch { countBefore = '未知(读不到数据文件)'; }

    // 选服务器（优先指定名称，缺省取第一项）
    await evaluate(`(() => {
        const items = $(".server-list li");
        let target = items.filter((i, e) => $(e).text().indexOf(${JSON.stringify(SERVER_NAME)}) >= 0);
        if (!target.length) target = items.first();
        target.click(); items.removeClass("select"); target.addClass("select");
        $('[command="SelectServer"]').click(); return "ok";
    })()`);
    await waitFor('角色面板', `$("#role_panel").css("display") !== "none"`, 30000);
    const roleCount = await evaluate(`$(".role-list .role-item").length`);
    if (!roleCount) fail('该账号在此服务器没有角色');
    await evaluate(`(() => {
        const r = $(".role-list .role-item").first();
        r.click(); $(".role-list .role-item").removeClass("select"); r.addClass("select");
        $('[command="SelectRole"]').click(); return "ok";
    })()`);
    await waitFor('进入游戏', `$(".container").css("display") !== "none" && !!Process.player`, 30000);
    console.log('已进入游戏，角色:', await evaluate(`Process.player`));

    // 发布公告（notice 命令，等级5管理员）
    const payload = JSON.stringify({ title: notice.title, summary: notice.summary || '', content: notice.content, category });
    await evaluate(`SendCommand("notice " + ${JSON.stringify(payload)}); "ok"`);
    await waitFor('公告发布响应', `(($(".content-message").text() || "").indexOf("公告已发布并保存。") >= 0)
        || (($(".content-message").text() || "").indexOf("公告发布失败") >= 0)
        || (($(".content-message").text() || "").indexOf("权限") >= 0)`, 15000);
    const respText = (await evaluate(`(($(".content-message").text() || "").match(/(公告已发布并保存。|公告发布失败[^\\n]*|[^\\n]*权限[^\\n]*)/) || [])[0] || ''`)).trim();
    if (respText.indexOf('公告已发布并保存') < 0) fail('游戏端返回: ' + respText);
    console.log('游戏响应:', respText);

    // 落库核验（WORLD.DATA.save() 在响应前已完成，容错重试几秒）
    let noticeId = null, titleCount = 0;
    for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 1000));
        try {
            const data = readFileSync(DATA_FILE, 'utf8');
            titleCount = data.split(String(notice.title)).length - 1;
            const m = data.match(new RegExp('"?id"?:\\s*"(notice_[a-f0-9]+)"[\\s\\S]{0,300}?title":\\s*"' + String(notice.title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"'));
            if (m) noticeId = m[1];
            if (titleCount > 0) break;
        } catch { }
    }
    const totalAfter = (() => {
        try { return (readFileSync(DATA_FILE, 'utf8').match(/"?id"?:\s*"notice_/g) || []).length; } catch { return '未知'; }
    })();

    console.log(JSON.stringify({
        ok: true, response: respText, noticeId, titleCount, countBefore, totalAfter,
        title: notice.title, category
    }));
    if (!titleCount) console.error('警告: 数据文件中未找到该标题，请人工核验');
    if (titleCount > 1) console.error('警告: 该标题出现 ' + titleCount + ' 次，疑似重复公告');
} catch (e) {
    fail(e.message);
} finally {
    cleanup();
    ws && ws.close();
    setTimeout(() => process.exit(0), 200);
}
