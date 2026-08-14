"use strict";

// Reports NPC raw combat baselines and validates that every new AREA has a
// declared difficulty/party mode. Use validate-fb-effective.js for the
// skill-derived properties after the complete resource load.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const areaDir = path.join(root, "world", "area", "fb1");
const npcDir = path.join(root, "world", "npc", "fb");
const expected = ["taohuadao", "baituo", "xingxiu", "binghuo", "yihuagong", "yanziwu", "heimuya", "piaomiaofeng", "guangmingding", "tianlongsi", "xuedaomen", "gumu", "huashanlunjian", "xiakedao", "jingnian", "cihang", "yinyanggu", "zhanshendian"];
function read(file) { return fs.readFileSync(file, "utf8"); }
function files(dir) {
    if (!fs.existsSync(dir)) return [];
    const result = [];
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) result.push(...files(full));
        else if (name.endsWith(".js")) result.push(full);
    }
    return result;
}
const errors = [];
const rows = [];
for (let index = 0; index < expected.length; index++) {
    const id = expected[index];
    const areaFile = path.join(areaDir, `fb${index + 21}.js`);
    if (!fs.existsSync(areaFile)) { errors.push(`${id}: 缺少 AREA 文件`); continue; }
    const source = read(areaFile);
    const isDiff = /is_diffi\s*:\s*true/.test(source);
    const isMulti = /is_multi\s*:\s*true/.test(source);
    if (!/fb_routes\s*:/.test(source)) errors.push(`${id}: 缺少路线声明`);
    if (isDiff && !/"1"\s*:/.test(source)) errors.push(`${id}: 困难模式未声明`);
    if (!/is_diffi\s*:\s*(?:true|false)/.test(source)) errors.push(`${id}: 未明确声明困难模式`);
    if (!/is_multi\s*:\s*(?:true|false)/.test(source)) errors.push(`${id}: 未明确声明组队模式`);
    const dir = path.join(npcDir, id);
    let count = 0;
    if (fs.existsSync(dir)) {
        for (const name of fs.readdirSync(dir)) {
            if (!name.endsWith(".js")) continue;
            const npc = read(path.join(dir, name));
            const prop = npc.match(/prop\s*:\s*\{([^}]+)\}/);
            if (prop) {
                const values = {};
                for (const match of prop[1].matchAll(/(gj|mz|ds|fy)\s*:\s*([0-9]+)/g)) values[match[1]] = Number(match[2]);
                rows.push({ id, npc: name.replace(/\.js$/, ""), ...values });
            }
            count++;
        }
    }
    if (!count) errors.push(`${id}: 没有 NPC 资源`);
}
const dynamicFiles = files(path.join(root, "world", "map", "fb"))
    .concat(files(path.join(root, "world", "npc", "fb")))
    .filter(file => {
        const relative = path.relative(root, file);
        return expected.some(id => relative.includes(`/fb/${id}/`) || relative.includes(`/fb/${id}.`));
    });
const dynamicCloneFiles = dynamicFiles.filter(file => /NPC\.CLONE\s*\(/.test(read(file)));
for (const file of dynamicCloneFiles) {
    const source = read(file);
    if (!/apply_fb_spawn_difficulty/.test(source)) {
        errors.push(`${path.relative(root, file)}: 动态 NPC 生成未调用 apply_fb_spawn_difficulty`);
    }
}
console.log(`副本 NPC 原始基线 ${rows.length} 条，覆盖 ${new Set(rows.map(row => row.id)).size}/${expected.length} 个 AREA。`);
console.log(`动态 NPC 生成点 ${dynamicCloneFiles.length} 个，均声明副本难度缩放。`);
for (const row of rows) console.log(`${row.id}\t${row.npc}\tgj=${row.gj ?? "-"}\tmz=${row.mz ?? "-"}\tds=${row.ds ?? "-"}\tfy=${row.fy ?? "-"}`);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log("副本难度清单结构审计通过；有效技能属性请运行 validate-fb-effective.js 复核。");
