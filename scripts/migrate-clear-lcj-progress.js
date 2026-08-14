"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const Database = require("better-sqlite3");
const JSON5 = require("json5");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const databaseArg = args.indexOf("--database");
const serverArg = args.indexOf("--server");
const databasePath = path.resolve(root, databaseArg >= 0 ? args[databaseArg + 1] : "data/database.db");
const serverId = parseInt(serverArg >= 0 ? args[serverArg + 1] : "100");

if (!Number.isInteger(serverId) || serverId <= 0) throw new Error("服务器 ID 无效");
if (!fs.existsSync(databasePath)) throw new Error("数据库不存在：" + databasePath);

function loadAreaExtension() {
    function Area() {}
    Area.FBS = [];
    const source = fs.readFileSync(path.join(root, "world", "extends", "map", "area.js"), "utf8");
    const context = { AREA: Area, WORLD: {}, UTIL: {}, console: { error() {} } };
    vm.runInNewContext(source, context, { filename: "world/extends/map/area.js" });
    Area.FBS = Array.from({ length: 38 }, (_, displayIndex) => {
        const area = new Area();
        area.id = displayIndex === 37 ? "lcj" : "fb" + displayIndex;
        area.fb_index = displayIndex;
        area.record_index = displayIndex === 37 ? 16 : (displayIndex >= 19 ? displayIndex + 1 : displayIndex);
        return area;
    });
    return Area;
}

function migrateData(Area, source) {
    const data = JSON5.parse(source);
    if (!data || typeof data !== "object" || !data.temp || typeof data.temp !== "object") {
        throw new Error("角色存档缺少 temp 数据");
    }
    const temp = data.temp;
    const before = {
        unlock: parseInt(temp.fb) || 0,
        completion: [0, 1, 2].reduce((sum, diff) => sum + (parseInt(temp["fbc_" + diff + "_16"]) || 0), 0),
        sweep: parseInt(temp.fb_sao16) || 0
    };
    const character = {
        query_temp(key, fallback) { return temp[key] === undefined ? fallback : temp[key]; },
        set_temp(key, value) { temp[key] = value; },
        remove_temp(key) { delete temp[key]; }
    };
    Area.ensure_record_indexes(character);
    const after = {
        unlock: parseInt(temp.fb) || 0,
        completion: [0, 1, 2].reduce((sum, diff) => sum + (parseInt(temp["fbc_" + diff + "_16"]) || 0), 0),
        sweep: parseInt(temp.fb_sao16) || 0
    };
    if (after.completion !== 0 || after.sweep !== 0) throw new Error("连城诀状态未清除");
    return { serialized: JSON5.stringify(data), before: before, after: after };
}

const db = new Database(databasePath, { readonly: !apply, fileMustExist: true });
try {
    const rows = db.prepare("SELECT id, data FROM players WHERE sid=? ORDER BY id").all(serverId);
    const Area = loadAreaExtension();
    const migrated = rows.map((row) => ({ id: row.id, result: migrateData(Area, row.data) }));
    const summary = {
        database: databasePath,
        serverId: serverId,
        mode: apply ? "apply" : "dry-run",
        roles: migrated.length,
        rolesWithLcjCompletion: migrated.filter((row) => row.result.before.completion > 0).length,
        rolesWithLcjSweep: migrated.filter((row) => row.result.before.sweep > 0).length,
        rolesWithUnlockCorrection: migrated.filter((row) => row.result.before.unlock !== row.result.after.unlock).length,
        unlockChanges: migrated.reduce((counts, row) => {
            const key = row.result.before.unlock + "->" + row.result.after.unlock;
            counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {})
    };

    if (apply) {
        const update = db.prepare("UPDATE players SET data=? WHERE sid=? AND id=?");
        const transaction = db.transaction(() => {
            for (const row of migrated) {
                const result = update.run(row.result.serialized, serverId, row.id);
                if (result.changes !== 1) throw new Error("角色存档更新失败");
            }
        });
        transaction();
        const integrity = db.pragma("integrity_check", { simple: true });
        if (integrity !== "ok") throw new Error("数据库完整性检查失败：" + integrity);
        summary.integrity = integrity;
    }

    console.log(JSON.stringify(summary, null, 2));
} finally {
    db.close();
}
